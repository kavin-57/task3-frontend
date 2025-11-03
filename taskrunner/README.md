# Task 4: CI/CD Pipeline with GitHub Actions

## Overview
Complete CI/CD pipeline for the Task Manager application using GitHub Actions.

## Pipeline Features
- ✅ **Automated builds** on push to main/develop branches
- ✅ **Maven build** for Java backend
- ✅ **Node.js build** for React frontend
- ✅ **Docker image building** for both services
- ✅ **Unit testing** for both backend and frontend
- ✅ **Security scanning** (placeholder for SAST tools)
- ✅ **Docker image publishing** to Docker Hub
- ✅ **Staging deployment** (placeholder for Kubernetes)

## Pipeline Stages

### 1. Build Backend
- Java 17 setup with Maven caching
- Compile and package Spring Boot application
- Run unit tests
- Build Docker image
- Push to Docker Hub (main branch only)

### 2. Build Frontend
- Node.js 18 setup with npm caching
- Install dependencies
- Run tests with coverage
- Build production bundle
- Build Docker image with nginx
- Push to Docker Hub (main branch only)

### 3. Security Scan
- Static Application Security Testing (SAST)
- Docker image vulnerability scanning

### 4. Deploy to Staging
- Kubernetes deployment (placeholder)
- Integration testing

## GitHub Secrets Required
- `DOCKERHUB_USERNAME`: Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token

## Usage
The pipeline automatically runs on:
- Push to `main` branch
- Push to `develop` branch  
- Pull requests to `main` branch

## Manual Trigger
```yaml
# You can also manually trigger the workflow
workflow_dispatch:
  inputs:
    environment:
      description: 'Environment to deploy to'
      required: true
      default: 'staging'


## Step 8: Update Main README.md

Add Task 4 to your main `README.md`:

```markdown
## Tasks Completed
- ✅ **Task 1**: Java REST API with MongoDB
- ✅ **Task 2**: Kubernetes Deployment with Pod Execution  
- ✅ **Task 3**: React Frontend with TypeScript and Ant Design
- ✅ **Task 4**: CI/CD Pipeline with GitHub Actions

## Quick Links
- [Task 2 Documentation](taskrunner/README.md)
- [Task 3 Documentation](task3-frontend/README.md)
- [Task 4 Documentation](task4-ci-cd/README.md)
- [CI/CD Pipeline](.github/workflows/ci-cd-pipeline.yml)
- [Screenshots](screenshots/)