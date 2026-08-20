pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "docker.io"
        DOCKER_NAMESPACE = "iamsnyg"
    }

    stages {

        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Verify Project") {
            steps {
                powershell '''
                    Write-Host "Checking project structure..."

                    if (!(Test-Path "auth-service")) {
                        throw "auth-service directory not found"
                    }

                    if (!(Test-Path "todo-service")) {
                        throw "todo-service directory not found"
                    }

                    if (!(Test-Path "notification-service")) {
                        throw "notification-service directory not found"
                    }

                    if (!(Test-Path "gateway")) {
                        throw "gateway directory not found"
                    }

                    if (!(Test-Path "frontend")) {
                        throw "frontend directory not found"
                    }

                    Write-Host "Project structure OK."
                '''
            }
        }

        stage("Build Docker Images") {
            steps {
                powershell '''
                    docker build -t ${env.DOCKER_NAMESPACE}/todo-auth-service:${env.BUILD_NUMBER} ./auth-service
                    docker build -t ${env.DOCKER_NAMESPACE}/todo-service:${env.BUILD_NUMBER} ./todo-service
                    docker build -t ${env.DOCKER_NAMESPACE}/todo-notification-service:${env.BUILD_NUMBER} ./notification-service
                    docker build -t ${env.DOCKER_NAMESPACE}/todo-gateway:${env.BUILD_NUMBER} ./gateway
                    docker build -t ${env.DOCKER_NAMESPACE}/todo-frontend:${env.BUILD_NUMBER} --build-arg NEXT_PUBLIC_API_URL=/api ./frontend
                '''
            }
        }

        stage("Docker Images") {
            steps {
                powershell '''
                    docker images ${env.DOCKER_NAMESPACE}/todo-auth-service
                    docker images ${env.DOCKER_NAMESPACE}/todo-service
                    docker images ${env.DOCKER_NAMESPACE}/todo-notification-service
                    docker images ${env.DOCKER_NAMESPACE}/todo-gateway
                    docker images ${env.DOCKER_NAMESPACE}/todo-frontend
                '''
            }
        }
    }

    post {
        success {
            echo "Docker build pipeline completed successfully."
        }

        failure {
            echo "Pipeline failed. Check the failed stage and logs."
        }

        always {
            echo "Pipeline finished."
        }
    }
}