package com.example.taskrunner.service;

import com.example.taskrunner.model.Task;
import com.example.taskrunner.model.TaskExecution;
import com.example.taskrunner.repo.TaskRepository;
import com.example.taskrunner.util.CommandValidator;
import io.fabric8.kubernetes.api.model.Pod;
import io.fabric8.kubernetes.api.model.PodBuilder;
import io.fabric8.kubernetes.client.DefaultKubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClient;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    private final TaskRepository repo;

    // how long to wait for the pod to complete (ms)
    private static final long POD_RUN_TIMEOUT_MS = 120_000L;

    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }

    public List<Task> getAll() { return repo.findAll(); }

    public Optional<Task> getById(String id) { return repo.findById(id); }

    public Task save(Task t) { return repo.save(t); }

    public void delete(String id) { repo.deleteById(id); }

    public List<Task> findByName(String q) { return repo.findByNameContainingIgnoreCase(q); }

    /**
     * Create a Kubernetes Pod that runs the task command, wait for completion, collect logs,
     * delete the pod and persist a TaskExecution into MongoDB.
     */
    public TaskExecution runCommandForTask(String taskId) throws Exception {
        Task task = repo.findById(taskId).orElseThrow(() -> new IllegalArgumentException("Task not found"));
        if (!CommandValidator.isSafe(task.getCommand())) {
            throw new IllegalArgumentException("Unsafe command");
        }

        TaskExecution exec = new TaskExecution();
        exec.setStartTime(new Date());

        String podName = "task-run-" + taskId + "-" + System.currentTimeMillis();
        String namespace = System.getenv().getOrDefault("K8S_NAMESPACE", "default");
        String command = task.getCommand();

        try (KubernetesClient client = new DefaultKubernetesClient()) {
            Pod pod = new PodBuilder()
                    .withNewMetadata()
                    .withName(podName)
                    .addToLabels("app", "task-runner-exec")
                    .addToLabels("taskId", task.getId())
                    .endMetadata()
                    .withNewSpec()
                    .withRestartPolicy("Never")
                    .addNewContainer()
                    .withName("runner")
                    .withImage("alpine:3.18")
                    .withCommand("sh", "-c", command)
                    .endContainer()
                    .endSpec()
                    .build();

            client.pods().inNamespace(namespace).create(pod);

            Instant start = Instant.now();
            String podPhase = "Unknown";
            boolean finished = false;

            while (Duration.between(start, Instant.now()).toMillis() < POD_RUN_TIMEOUT_MS) {
                Pod p = client.pods().inNamespace(namespace).withName(podName).get();
                if (p == null) {
                    Thread.sleep(300);
                    continue;
                }
                if (p.getStatus() != null && p.getStatus().getPhase() != null) {
                    podPhase = p.getStatus().getPhase();
                    if ("Succeeded".equalsIgnoreCase(podPhase) || "Failed".equalsIgnoreCase(podPhase)) {
                        finished = true;
                        break;
                    }
                }
                Thread.sleep(400);
            }

            String logs;
            try {
                logs = client.pods().inNamespace(namespace).withName(podName).getLog();
            } catch (Exception e) {
                logs = "Failed to get logs: " + e.getMessage();
            }

            exec.setEndTime(new Date());
            exec.setOutput("PodPhase: " + podPhase + "\nLogs:\n" + logs);

            // cleanup pod
            try {
                client.pods().inNamespace(namespace).withName(podName).delete();
            } catch (Exception ignored) {}

            // persist
            task.getTaskExecutions().add(exec);
            repo.save(task);
            return exec;
        } catch (Exception e) {
            exec.setEndTime(new Date());
            exec.setOutput("Execution failed: " + e.getMessage());
            task.getTaskExecutions().add(exec);
            repo.save(task);
            throw e;
        }
    }
}
