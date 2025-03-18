# Step 1: Build ứng dụng
FROM maven:3.9.6-amazoncorretto-17 AS build
LABEL authors="Dell.MM"
WORKDIR /app

# Copy source code và build
COPY pom.xml .
COPY src/ /app/src/
RUN mvn clean package -DskipTests

# Step 2: Package image
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Lắng nghe cổng từ Render (không ép 8080 hoặc 8000)
CMD ["sh", "-c", "java -jar app.jar --server.port=${PORT} --server.address=0.0.0.0"]


