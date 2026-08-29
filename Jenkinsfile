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
                sh '''
                    set -e

                    echo "Checking project structure..."

                    test -d auth-service
                    test -d todo-service
                    test -d notification-service
                    test -d gateway
                    test -d frontend

                    echo "Project structure OK."
                '''
            }
        }

        stage("Build Docker Images") {
            steps {
                sh '''
                    set -e

                    docker build \
                      -t ${DOCKER_NAMESPACE}/todo-auth-service:${BUILD_NUMBER} \
                      ./auth-service

                    docker build \
                      -t ${DOCKER_NAMESPACE}/todo-service:${BUILD_NUMBER} \
                      ./todo-service

                    docker build \
                      -t ${DOCKER_NAMESPACE}/todo-notification-service:${BUILD_NUMBER} \
                      ./notification-service

                    docker build \
                      -t ${DOCKER_NAMESPACE}/todo-gateway:${BUILD_NUMBER} \
                      ./gateway

                    docker build \
                      -t ${DOCKER_NAMESPACE}/todo-frontend:${BUILD_NUMBER} \
                      --build-arg NEXT_PUBLIC_API_URL=/api \
                      ./frontend
                '''
            }
        }

        stage("Docker Images") {
            steps {
                sh '''
                    set -e

                    echo "===== Auth Service ====="
                    docker images ${DOCKER_NAMESPACE}/todo-auth-service

                    echo "===== Todo Service ====="
                    docker images ${DOCKER_NAMESPACE}/todo-service

                    echo "===== Notification Service ====="
                    docker images ${DOCKER_NAMESPACE}/todo-notification-service

                    echo "===== Gateway ====="
                    docker images ${DOCKER_NAMESPACE}/todo-gateway

                    echo "===== Frontend ====="
                    docker images ${DOCKER_NAMESPACE}/todo-frontend
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
