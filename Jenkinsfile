pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "586197446523"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
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

        stage("Login to ECR") {
            steps {
                sh '''
                    set -e

                    echo "Logging in to Amazon ECR..."

                    aws ecr get-login-password \
                      --region ${AWS_REGION} | \
                    docker login \
                      --username AWS \
                      --password-stdin ${ECR_REGISTRY}

                    echo "ECR login successful."
                '''
            }
        }

        stage("Build Docker Images") {
            steps {
                sh '''
                    set -e

                    echo "Building Docker images..."

                    docker build \
		      --target production \
                      -t ${ECR_REGISTRY}/todo-auth-service:${BUILD_NUMBER} \
                      ./auth-service

                    docker build \
                      --target migration \
                      -t ${ECR_REGISTRY}/todo-auth-service-migration:${BUILD_NUMBER} \
                      ./auth-service

                    docker build \
                      -t ${ECR_REGISTRY}/todo-service:${BUILD_NUMBER} \
                      ./todo-service

                    docker build \
                      -t ${ECR_REGISTRY}/todo-notification-service:${BUILD_NUMBER} \
                      ./notification-service

                    docker build \
                      -t ${ECR_REGISTRY}/todo-gateway:${BUILD_NUMBER} \
                      ./gateway

                    docker build \
                      -t ${ECR_REGISTRY}/todo-frontend:${BUILD_NUMBER} \
                      --build-arg NEXT_PUBLIC_API_URL=/api \
                      ./frontend

                    echo "All Docker images built successfully."
                '''
            }
        }

        stage("Docker Images") {
            steps {
                sh '''
                    set -e

                    echo "===== Auth Service ====="
                    docker images ${ECR_REGISTRY}/todo-auth-service

                    echo "===== Auth Migration ====="
                    docker images ${ECR_REGISTRY}/todo-auth-service-migration

                    echo "===== Todo Service ====="
                    docker images ${ECR_REGISTRY}/todo-service

                    echo "===== Notification Service ====="
                    docker images ${ECR_REGISTRY}/todo-notification-service

                    echo "===== Gateway ====="
                    docker images ${ECR_REGISTRY}/todo-gateway

                    echo "===== Frontend ====="
                    docker images ${ECR_REGISTRY}/todo-frontend
                '''
            }
        }

        stage("Trivy Security Scan") {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Starting Trivy Security Scan"
                    echo "======================================"

                    echo "===== Auth Service ====="
                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-auth-service:${BUILD_NUMBER}

                    echo "===== Auth Migration ====="
                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-auth-service-migration:${BUILD_NUMBER}

                    echo "===== Todo Service ====="
                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-service:${BUILD_NUMBER}

                    echo "===== Notification Service ====="
                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-notification-service:${BUILD_NUMBER}

                    echo "===== Gateway ====="
                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-gateway:${BUILD_NUMBER}

                    echo "===== Frontend ====="
                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-frontend:${BUILD_NUMBER}

                    echo "======================================"
                    echo "Trivy Security Scan PASSED"
                    echo "No CRITICAL fixable vulnerabilities found."
                    echo "======================================"
                '''
            }
        }

        stage("Push Images to ECR") {
            steps {
                sh '''
                    set -e

                    echo "Pushing images to Amazon ECR..."

                    docker push \
                      ${ECR_REGISTRY}/todo-auth-service:${BUILD_NUMBER}

                    docker push \
                      ${ECR_REGISTRY}/todo-auth-service-migration:${BUILD_NUMBER}

                    docker push \
                      ${ECR_REGISTRY}/todo-service:${BUILD_NUMBER}

                    docker push \
                      ${ECR_REGISTRY}/todo-notification-service:${BUILD_NUMBER}

                    docker push \
                      ${ECR_REGISTRY}/todo-gateway:${BUILD_NUMBER}

                    docker push \
                      ${ECR_REGISTRY}/todo-frontend:${BUILD_NUMBER}

                    echo "All images pushed successfully to ECR."
                '''
            }
        }

        stage("Verify ECR Images") {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Verifying ECR Images"
                    echo "Build tag: ${BUILD_NUMBER}"
                    echo "======================================"

                    repositories="
                    todo-auth-service
                    todo-auth-service-migration
                    todo-service
                    todo-notification-service
                    todo-gateway
                    todo-frontend
                    "

                    for repository in $repositories; do
                        echo ""
                        echo "Checking: $repository"

                        digest=$(aws ecr describe-images \
                          --repository-name "$repository" \
                          --region "${AWS_REGION}" \
                          --image-ids imageTag="${BUILD_NUMBER}" \
                          --query 'imageDetails[0].imageDigest' \
                          --output text)

                        if [ -z "$digest" ] || [ "$digest" = "None" ]; then
                            echo "ERROR: Image tag ${BUILD_NUMBER} not found in $repository"
                            exit 1
                        fi

                        echo "PASS: $repository:${BUILD_NUMBER}"
                        echo "Digest: $digest"
                    done

                    echo ""
                    echo "======================================"
                    echo "All ECR images verified successfully."
                    echo "======================================"
                '''
            }
        }
    }

    post {
        success {
            echo "CI pipeline completed successfully."
            echo "Docker images passed Trivy security scan and were pushed to ECR."
        }

        failure {
            echo "CI pipeline failed."
            echo "Check the failed stage and Jenkins console logs."
        }

        always {
            echo "CI pipeline finished."
        }
    }
}
