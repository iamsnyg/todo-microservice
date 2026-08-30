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

	            echo "Building production and migration Docker images..."
	            echo "Image tag: ${IMAGE_TAG}"

	            # Auth production
	            docker build \
	              --target production \
	              -t ${ECR_REGISTRY}/todo-auth-service:${IMAGE_TAG} \
	              ./auth-service
	
	            # Auth migration
	            docker build \
	              --target migration \
	              -t ${ECR_REGISTRY}/todo-auth-service-migration:${IMAGE_TAG} \
	              ./auth-service

	            # Todo production
	            docker build \
	              --target production \
	              -t ${ECR_REGISTRY}/todo-service:${IMAGE_TAG} \
	              ./todo-service
	
	            # Todo migration
	            docker build \
	              --target migration \
	              -t ${ECR_REGISTRY}/todo-service-migration:${IMAGE_TAG} \
	              ./todo-service

	            # Notification production
	            docker build \
	              --target production \
	              -t ${ECR_REGISTRY}/todo-notification-service:${IMAGE_TAG} \
	              ./notification-service

	            # Notification migration
	            docker build \
	              --target migration \
	              -t ${ECR_REGISTRY}/todo-notification-service-migration:${IMAGE_TAG} \
	              ./notification-service

	            # Gateway production
	            docker build \
	              -t ${ECR_REGISTRY}/todo-gateway:${IMAGE_TAG} \
	              ./gateway

  	            # Frontend production
	            docker build \
	              -t ${ECR_REGISTRY}/todo-frontend:${IMAGE_TAG} \
	              --build-arg NEXT_PUBLIC_API_URL=/api \
	              ./frontend

 	           echo "All production and migration images built successfully."
	        '''
	    }
	}

        stage("Docker Images") {
            steps {
                sh '''
                    set -e

                    echo "===== Auth Service ====="
                    docker images ${ECR_REGISTRY}/todo-auth-service:${IMAGE_TAG}

                    echo "===== Auth Migration ====="
                    docker images ${ECR_REGISTRY}/todo-auth-service-migration:${IMAGE_TAG}

                    echo "===== Todo Service ====="
                    docker images ${ECR_REGISTRY}/todo-service:${IMAGE_TAG}

                    echo "===== Todo Migration ====="
                    docker images ${ECR_REGISTRY}/todo-service-migration:${IMAGE_TAG}

                    echo "===== Notification Service ====="
                    docker images ${ECR_REGISTRY}/todo-notification-service:${IMAGE_TAG}

                    echo "===== Notification Migration ====="
                    docker images ${ECR_REGISTRY}/todo-notification-service-migration:${IMAGE_TAG}

                    echo "===== Gateway ====="
                    docker images ${ECR_REGISTRY}/todo-gateway:${IMAGE_TAG}

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

                    echo "===== Auth Service ====="
                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-auth-service:${IMAGE_TAG}

                    echo "===== Auth Migration ====="
                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-auth-service-migration:${IMAGE_TAG}

                    echo "===== Todo Service ====="
                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-service:${IMAGE_TAG}

                    echo "===== Todo Migration ====="
                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-service-migration:${IMAGE_TAG}

                    echo "===== Notification Service ====="
                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-notification-service:${IMAGE_TAG}

                    echo "===== Notification Migration ====="
                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-notification-service-migration:${IMAGE_TAG}

                    echo "===== Gateway ====="
                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-gateway:${IMAGE_TAG}

                    echo "===== Frontend ====="
                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-frontend:${IMAGE_TAG}

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

                    echo "Pushing production and migration images to ECR..."
                    echo "Image tag: ${IMAGE_TAG}"

                    docker push \
                      ${ECR_REGISTRY}/todo-auth-service:${IMAGE_TAG}

                    docker push \
                      ${ECR_REGISTRY}/todo-auth-service-migration:${IMAGE_TAG}

                    docker push \
                      ${ECR_REGISTRY}/todo-service:${IMAGE_TAG}

                    docker push \
                      ${ECR_REGISTRY}/todo-service-migration:${IMAGE_TAG}

                    docker push \
                      ${ECR_REGISTRY}/todo-notification-service:${IMAGE_TAG}

                    docker push \
                      ${ECR_REGISTRY}/todo-notification-service-migration:${IMAGE_TAG}

                    docker push \
                      ${ECR_REGISTRY}/todo-gateway:${IMAGE_TAG}

                    docker push \
                      ${ECR_REGISTRY}/todo-frontend:${IMAGE_TAG}

                    echo "All production and migration images pushed successfully."
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
