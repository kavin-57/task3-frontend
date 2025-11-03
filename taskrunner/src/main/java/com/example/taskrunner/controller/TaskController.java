package com.example.taskrunner.controller;

import com.example.taskrunner.model.Task;
import com.example.taskrunner.model.TaskExecution;
import com.example.taskrunner.service.TaskService;
import com.example.taskrunner.util.CommandValidator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tasks")
@Validated
public class TaskController {
    private final TaskService service;

    public TaskController(TaskService service) { this.service = service; }

    /**
     * GET /api/tasks
     * optional param id -> returns single task or 404
     */
    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(value = "id", required = false) String id) {
        if (id == null) return ResponseEntity.ok(service.getAll());

        return service.getById(id)
                .<ResponseEntity<?>>map(task -> ResponseEntity.ok(task))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found"));
    }

    /**
     * PUT /api/tasks
     * creates or updates task. body: Task JSON
     */
    @PutMapping
    public ResponseEntity<?> putTask(@RequestBody @Valid Task task) {
        if (!CommandValidator.isSafe(task.getCommand())) {
            return ResponseEntity.badRequest().body("Unsafe command");
        }
        Task saved = service.save(task);
        return ResponseEntity.ok(saved);
    }

    /**
     * DELETE /api/tasks/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (service.getById(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found");
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/tasks/search?q=...
     */
    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam("q") String q) {
        List<Task> res = service.findByName(q);
        if (res.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No tasks found");
        return ResponseEntity.ok(res);
    }

    /**
     * PUT /api/tasks/{id}/run
     * executes command, stores TaskExecution and returns it.
     */
    @PutMapping("/{id}/run")
    public ResponseEntity<?> run(@PathVariable String id) {
        try {
            TaskExecution exec = service.runCommandForTask(id);
            return ResponseEntity.ok(exec);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Execution failed: " + e.getMessage());
        }
    }
}