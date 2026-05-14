# Weather DevOps Project

## Overview

This project is a weather web application built using Spring Boot and a modern frontend (HTML, CSS, JavaScript). The application fetches real-time weather data and displays it through a user-friendly interface.

The project demonstrates a complete DevOps workflow, including build automation, containerization, and CI/CD pipeline implementation.

---

## Features

* Search weather by city name
* Get weather using current location
* Displays temperature, condition, min/max values
* Dynamic UI updates based on weather conditions
* Responsive and modern user interface

---

## Tech Stack

### Backend

* Spring Boot
* Java 17

### Frontend

* HTML
* CSS
* JavaScript

### DevOps Tools

* Maven (build automation)
* Docker (containerization)
* GitHub Actions (CI/CD pipeline)

---

## How It Works

1. The frontend sends a request to the backend endpoint:
   /weather?lat=...&lon=...

2. The Spring Boot backend processes the request and calls the external weather API.

3. The backend returns the weather data as JSON.

4. The frontend updates the UI dynamically using the received data.

---

## Build and Run Locally

### Prerequisites

* Java 17
* Maven
* Docker

### Steps

1. Clone the repository:
   git clone https://github.com/Anuragkumar17/weather-devops-pipeline.git

2. Navigate to the project directory:
   cd weatherapp

3. Build the project:
   mvn clean package

4. Run the application:
   mvn spring-boot:run

5. Open in browser:
   http://localhost:8080

---

## Docker Setup

### Build Docker Image

docker build -t weather-app .

### Run Container

docker run -p 8080:8080 weather-app

### Access Application

http://localhost:8080

---

## CI/CD Pipeline

This project uses GitHub Actions to automate the build and deployment process.

### Pipeline Workflow

1. Code is pushed to the main branch
2. GitHub Actions is triggered
3. Maven builds the application
4. Docker image is created
5. Image is pushed to Docker Hub

---

## GitHub Actions Workflow File

.github/workflows/main.yml

This file defines the CI/CD pipeline that automates build and deployment.

---

## Docker Hub

The Docker image is automatically pushed to Docker Hub after a successful pipeline run.

To pull and run the image:

docker pull your-username/weather-app
docker run -p 8080:8080 your-username/weather-app

---

## Key DevOps Concepts Demonstrated

* Continuous Integration (CI)
* Continuous Deployment (CD)
* Containerization
* Build automation
* Environment consistency
* Automated workflows

---

## Future Improvements

* Add database integration
* Deploy application to cloud platform
* Add authentication system
* Improve error handling and logging

---

## Author

Anurag Kumar

---

## Conclusion

This project demonstrates how a static frontend application can be transformed into a fully functional DevOps-enabled system using modern tools like Maven, Docker, and GitHub Actions. It highlights automation, scalability, and portability in software development.
