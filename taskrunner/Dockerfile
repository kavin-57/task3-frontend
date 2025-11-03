# Stage 1: Build the app
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the app
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Install curl for health checks (useful in Kubernetes)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Remove the hardcoded MongoDB URI - use environment variables only
EXPOSE 8080

# Use shell form to allow environment variable expansion
ENTRYPOINT ["java", "-jar", "app.jar"]