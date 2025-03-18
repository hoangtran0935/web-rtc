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

# Expose cổng 8080 để container có thể kết nối
EXPOSE 8080

# Lắng nghe trên PORT Render cấp (sử dụng ENTRYPOINT để truyền biến môi trường)
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080} --server.address=0.0.0.0"]
