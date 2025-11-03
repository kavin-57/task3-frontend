Task 2: Kubernetes Deployment
Overview
Deployment of the Task Manager REST API to Kubernetes with MongoDB persistence and Kubernetes pod execution.

Quick Start
Prerequisites
Docker Desktop with Kubernetes enabled

kubectl CLI

Maven

Deploy
bash
# Build and deploy
mvn clean package
docker build -t taskrunner:latest .

kubectl apply -f k8s/mongo-pvc.yaml
kubectl apply -f k8s/mongo.yaml  
kubectl apply -f k8s/app-rbac.yaml
kubectl apply -f k8s/taskrunner.yaml
Access
bash
# Port forwarding
kubectl port-forward deployment/taskrunner 8080:8080

# Test API
curl http://localhost:8080/api/tasks
Key Features
✅ Kubernetes Deployment - App and MongoDB in separate pods

✅ Persistent Storage - MongoDB data survives pod restarts

✅ Kubernetes Pod Execution - Tasks run in temporary pods instead of locally

✅ RBAC Configuration - Secure Kubernetes API access

✅ NodePort Service - Accessible from host machine

API Endpoints
GET /api/tasks - List all tasks or single task with ?id=

PUT /api/tasks - Create/update task

DELETE /api/tasks/{id} - Delete task

GET /api/tasks/search?q=name - Search tasks

PUT /api/tasks/{id}/run - Execute in Kubernetes pod

Architecture

┌─────────────────┐    ┌──────────────────┐
│   Task Runner   │───▶│     MongoDB      │
│   (Spring Boot) │    │  (Persistent)    │
└─────────────────┘    └──────────────────┘
│
│ Creates
▼
┌─────────────────┐
│  Temp Pods      │
│  (busybox)      │
└─────────────────┘

Verification
All Task 2 requirements met with Kubernetes pod execution as the key feature.