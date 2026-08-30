pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "586197446523"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE_TAG = "1.0.0"
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

                    echo "======================================"
                    echo "Building Docker Images"
                    echo "Image tag: ${IMAGE_TAG}"
                    echo "======================================"

                    # ==========================================
                    # AUTH SERVICE - PRODUCTION
                    # ==========================================

                    echo "Building Auth production image..."

                    docker build \
                      --target production \
                      -t ${ECR_REGISTRY}/todo-auth-service:${IMAGE_TAG} \
                      ./auth-service


                    # ==========================================
                    # AUTH SERVICE - MIGRATION
                    # ==========================================

                    echo "Building Auth migration image..."

                    docker build \
                      --target migration \
                      -t ${ECR_REGISTRY}/todo-auth-service-migration:${IMAGE_TAG} \
                      ./auth-service


                    # ==========================================
                    # TODO SERVICE - PRODUCTION
                    # ==========================================

                    echo "Building Todo production image..."

                    docker build \
                      --target production \
                      -t ${ECR_REGISTRY}/todo-service:${IMAGE_TAG} \
                      ./todo-service


                    # ==========================================
                    # TODO SERVICE - MIGRATION
                    # ==========================================

                    echo "Building Todo migration image..."

                    docker build \
                      --target migration \
                      -t ${ECR_REGISTRY}/todo-service-migration:${IMAGE_TAG} \
                      ./todo-service


                    # ==========================================
                    # NOTIFICATION SERVICE - PRODUCTION
                    # ==========================================

                    echo "Building Notification production image..."

                    docker build \
                      --target production \
                      -t ${ECR_REGISTRY}/todo-notification-service:${IMAGE_TAG} \
                      ./notification-service


                    # ==========================================
                    # NOTIFICATION SERVICE - MIGRATION
                    # ==========================================

                    echo "Building Notification migration image..."

                    docker build \
                      --target migration \
                      -t ${ECR_REGISTRY}/todo-notification-service-migration:${IMAGE_TAG} \
                      ./notification-service


                    # ==========================================
                    # GATEWAY - PRODUCTION
                    # ==========================================

                    echo "Building Gateway production image..."

                    docker build \
                      -t ${ECR_REGISTRY}/todo-gateway:${IMAGE_TAG} \
                      ./gateway


                    # ==========================================
                    # FRONTEND - PRODUCTION
                    # ==========================================

                    echo "Building Frontend production image..."

                    docker build \
                      -t ${ECR_REGISTRY}/todo-frontend:${IMAGE_TAG} \
                      --build-arg NEXT_PUBLIC_API_URL=/api \
                      ./frontend


                    echo ""
                    echo "======================================"
                    echo "All production and migration images"
                    echo "built successfully."
                    echo "======================================"
                '''
            }
        }

        stage("Docker Images") {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Docker Images"
                    echo "Image tag: ${IMAGE_TAG}"
                    echo "======================================"

                    echo ""
                    echo "===== Auth Service ====="
                    docker images ${ECR_REGISTRY}/todo-auth-service:${IMAGE_TAG}

                    echo ""
                    echo "===== Auth Migration ====="
                    docker images ${ECR_REGISTRY}/todo-auth-service-migration:${IMAGE_TAG}

                    echo ""
                    echo "===== Todo Service ====="
                    docker images ${ECR_REGISTRY}/todo-service:${IMAGE_TAG}

                    echo ""
                    echo "===== Todo Migration ====="
                    docker images ${ECR_REGISTRY}/todo-service-migration:${IMAGE_TAG}

                    echo ""
                    echo "===== Notification Service ====="
                    docker images ${ECR_REGISTRY}/todo-notification-service:${IMAGE_TAG}

                    echo ""
                    echo "===== Notification Migration ====="
                    docker images ${ECR_REGISTRY}/todo-notification-service-migration:${IMAGE_TAG}

                    echo ""
                    echo "===== Gateway ====="
                    docker images ${ECR_REGISTRY}/todo-gateway:${IMAGE_TAG}

                    echo ""
                    echo "===== Frontend ====="
                    docker images ${ECR_REGISTRY}/todo-frontend:${IMAGE_TAG}
                '''
            }
        }

        stage("Trivy Security Scan") {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Starting Trivy Security Scan"
                    echo "Image tag: ${IMAGE_TAG}"
                    echo "======================================"

                    echo ""
                    echo "===== Auth Service ====="

                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-auth-service:${IMAGE_TAG}


                    echo ""
                    echo "===== Auth Migration ====="

                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-auth-service-migration:${IMAGE_TAG}


                    echo ""
                    echo "===== Todo Service ====="

                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-service:${IMAGE_TAG}


                    echo ""
                    echo "===== Todo Migration ====="

                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-service-migration:${IMAGE_TAG}


                    echo ""
                    echo "===== Notification Service ====="

                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-notification-service:${IMAGE_TAG}


                    echo ""
                    echo "===== Notification Migration ====="

                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-notification-service-migration:${IMAGE_TAG}


                    echo ""
                    echo "===== Gateway ====="

                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-gateway:${IMAGE_TAG}


                    echo ""
                    echo "===== Frontend ====="

                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-frontend:${IMAGE_TAG}


                    echo ""
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

                    echo "======================================"
                    echo "Pushing Images to Amazon ECR"
                    echo "Image tag: ${IMAGE_TAG}"
                    echo "======================================"

                    echo ""
                    echo "Pushing Auth production..."

                    docker push \
                      ${ECR_REGISTRY}/todo-auth-service:${IMAGE_TAG}


                    echo ""
                    echo "Pushing Auth migration..."

                    docker push \
                      ${ECR_REGISTRY}/todo-auth-service-migration:${IMAGE_TAG}


                    echo ""
                    echo "Pushing Todo production..."

                    docker push \
                      ${ECR_REGISTRY}/todo-service:${IMAGE_TAG}


                    echo ""
                    echo "Pushing Todo migration..."

                    docker push \
                      ${ECR_REGISTRY}/todo-service-migration:${IMAGE_TAG}


                    echo ""
                    echo "Pushing Notification production..."

                    docker push \
                      ${ECR_REGISTRY}/todo-notification-service:${IMAGE_TAG}


                    echo ""
                    echo "Pushing Notification migration..."

                    docker push \
                      ${ECR_REGISTRY}/todo-notification-service-migration:${IMAGE_TAG}


                    echo ""
                    echo "Pushing Gateway..."

                    docker push \
                      ${ECR_REGISTRY}/todo-gateway:${IMAGE_TAG}


                    echo ""
                    echo "Pushing Frontend..."

                    docker push \
                      ${ECR_REGISTRY}/todo-frontend:${IMAGE_TAG}


                    echo ""
                    echo "======================================"
                    echo "All production and migration images"
                    echo "pushed successfully to ECR."
                    echo "======================================"
                '''
            }
        }

        stage("Verify ECR Images") {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Verifying ECR Images"
                    echo "Image tag: ${IMAGE_TAG}"
                    echo "======================================"

                    repositories="
                    todo-auth-service
                    todo-auth-service-migration
                    todo-service
                    todo-service-migration
                    todo-notification-service
                    todo-notification-service-migration
                    todo-gateway
                    todo-frontend
                    "

                    for repository in $repositories; do

                        echo ""
                        echo "Checking: $repository:${IMAGE_TAG}"

                        digest=$(aws ecr describe-images \
                          --repository-name "$repository" \
                          --region "${AWS_REGION}" \
                          --image-ids imageTag="${IMAGE_TAG}" \
                          --query 'imageDetails[0].imageDigest' \
                          --output text)

                        if [ -z "$digest" ] || [ "$digest" = "None" ]; then

                            echo "ERROR: Image tag ${IMAGE_TAG} not found in $repository"

                            exit 1
                        fi

                        echo "PASS: $repository:${IMAGE_TAG}"
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
            echo "All production and migration images passed Trivy security scanning."
            echo "All images were pushed and verified in ECR."
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
