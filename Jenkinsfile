pipeline {
    agent any

    parameters {
        string(
            name: 'IMAGE_TAG',
            defaultValue: '1.0.0',
            description: 'Docker image tag to build, scan, push and deploy'
        )
    }

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "586197446523"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

        // Jenkins CD job name
        CD_JOB_NAME = "todo-app-cd"
    }

    stages {

        // ==========================================================
        // CHECKOUT
        // ==========================================================

        stage("Checkout") {
            steps {
                checkout scm
            }
        }


        // ==========================================================
        // VALIDATE IMAGE TAG
        // ==========================================================

        stage("Validate Image Tag") {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Validating Image Tag"
                    echo "======================================"

                    echo "IMAGE_TAG=${IMAGE_TAG}"

                    if ! echo "${IMAGE_TAG}" | grep -Eq '^[0-9]+\\.[0-9]+\\.[0-9]+$'; then
                        echo "ERROR: Invalid image tag: ${IMAGE_TAG}"
                        echo "Expected format: X.Y.Z"
                        echo "Examples: 1.0.0, 1.0.1, 1.1.0"
                        exit 1
                    fi

                    echo "Image tag is valid."
                '''
            }
        }


        // ==========================================================
        // VERIFY PROJECT
        // ==========================================================

        stage("Verify Project") {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Checking Project Structure"
                    echo "======================================"

                    test -d auth-service
                    test -d todo-service
                    test -d notification-service
                    test -d gateway
                    test -d frontend

                    echo "Project structure OK."
                '''
            }
        }


        // ==========================================================
        // LOGIN TO ECR
        // ==========================================================

        stage("Login to ECR") {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Logging in to Amazon ECR"
                    echo "======================================"

                    aws ecr get-login-password \
                      --region "${AWS_REGION}" | \
                    docker login \
                      --username AWS \
                      --password-stdin "${ECR_REGISTRY}"

                    echo "ECR login successful."
                '''
            }
        }


        // ==========================================================
        // BUILD IMAGES
        // ==========================================================

        stage("Build Docker Images") {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Building Docker Images"
                    echo "Image tag: ${IMAGE_TAG}"
                    echo "======================================"

                    # ==================================================
                    # AUTH SERVICE - PRODUCTION
                    # ==================================================

                    echo "Building Auth production image..."

                    docker build \
                      --target production \
                      -t ${ECR_REGISTRY}/todo-auth-service:${IMAGE_TAG} \
                      ./auth-service


                    # ==================================================
                    # AUTH SERVICE - MIGRATION
                    # ==================================================

                    echo "Building Auth migration image..."

                    docker build \
                      --target migration \
                      -t ${ECR_REGISTRY}/todo-auth-service-migration:${IMAGE_TAG} \
                      ./auth-service


                    # ==================================================
                    # TODO SERVICE - PRODUCTION
                    # ==================================================

                    echo "Building Todo production image..."

                    docker build \
                      --target production \
                      -t ${ECR_REGISTRY}/todo-service:${IMAGE_TAG} \
                      ./todo-service


                    # ==================================================
                    # TODO SERVICE - MIGRATION
                    # ==================================================

                    echo "Building Todo migration image..."

                    docker build \
                      --target migration \
                      -t ${ECR_REGISTRY}/todo-service-migration:${IMAGE_TAG} \
                      ./todo-service


                    # ==================================================
                    # NOTIFICATION SERVICE - PRODUCTION
                    # ==================================================

                    echo "Building Notification production image..."

                    docker build \
                      --target production \
                      -t ${ECR_REGISTRY}/todo-notification-service:${IMAGE_TAG} \
                      ./notification-service


                    # ==================================================
                    # NOTIFICATION SERVICE - MIGRATION
                    # ==================================================

                    echo "Building Notification migration image..."

                    docker build \
                      --target migration \
                      -t ${ECR_REGISTRY}/todo-notification-service-migration:${IMAGE_TAG} \
                      ./notification-service


                    # ==================================================
                    # GATEWAY
                    # ==================================================

                    echo "Building Gateway image..."

                    docker build \
                      -t ${ECR_REGISTRY}/todo-gateway:${IMAGE_TAG} \
                      ./gateway


                    # ==================================================
                    # FRONTEND
                    # ==================================================

                    echo "Building Frontend image..."

                    docker build \
                      -t ${ECR_REGISTRY}/todo-frontend:${IMAGE_TAG} \
                      ./frontend


                    echo ""
                    echo "======================================"
                    echo "All images built successfully."
                    echo "Tag: ${IMAGE_TAG}"
                    echo "======================================"
                '''
            }
        }


        // ==========================================================
        // SHOW DOCKER IMAGES
        // ==========================================================

        stage("Docker Images") {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Docker Images"
                    echo "Tag: ${IMAGE_TAG}"
                    echo "======================================"

                    docker images ${ECR_REGISTRY}/todo-auth-service:${IMAGE_TAG}
                    docker images ${ECR_REGISTRY}/todo-auth-service-migration:${IMAGE_TAG}

                    docker images ${ECR_REGISTRY}/todo-service:${IMAGE_TAG}
                    docker images ${ECR_REGISTRY}/todo-service-migration:${IMAGE_TAG}

                    docker images ${ECR_REGISTRY}/todo-notification-service:${IMAGE_TAG}
                    docker images ${ECR_REGISTRY}/todo-notification-service-migration:${IMAGE_TAG}

                    docker images ${ECR_REGISTRY}/todo-gateway:${IMAGE_TAG}
                    docker images ${ECR_REGISTRY}/todo-frontend:${IMAGE_TAG}
                '''
            }
        }


        // ==========================================================
        // TRIVY SECURITY SCAN
        // ==========================================================

        stage("Trivy Security Scan") {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Starting Trivy Security Scan"
                    echo "Tag: ${IMAGE_TAG}"
                    echo "======================================"


                    echo "Scanning Auth production..."

                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-auth-service:${IMAGE_TAG}


                    echo "Scanning Auth migration..."

                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-auth-service-migration:${IMAGE_TAG}


                    echo "Scanning Todo production..."

                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-service:${IMAGE_TAG}


                    echo "Scanning Todo migration..."

                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-service-migration:${IMAGE_TAG}


                    echo "Scanning Notification production..."

                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-notification-service:${IMAGE_TAG}


                    echo "Scanning Notification migration..."

                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-notification-service-migration:${IMAGE_TAG}


                    echo "Scanning Gateway..."

                    trivy image \
                      --severity CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      ${ECR_REGISTRY}/todo-gateway:${IMAGE_TAG}


                    echo "Scanning Frontend..."

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


        // ==========================================================
        // PUSH IMAGES TO ECR
        // ==========================================================

        stage("Push Images to ECR") {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Pushing Images to Amazon ECR"
                    echo "Tag: ${IMAGE_TAG}"
                    echo "======================================"


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


                    echo ""
                    echo "======================================"
                    echo "All images pushed successfully."
                    echo "======================================"
                '''
            }
        }


        // ==========================================================
        // VERIFY ECR
        // ==========================================================

        stage("Verify ECR Images") {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Verifying ECR Images"
                    echo "Tag: ${IMAGE_TAG}"
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
                        echo "Checking: ${repository}:${IMAGE_TAG}"


                        digest=$(aws ecr describe-images \
                          --repository-name "$repository" \
                          --region "${AWS_REGION}" \
                          --image-ids imageTag="${IMAGE_TAG}" \
                          --query 'imageDetails[0].imageDigest' \
                          --output text)


                        if [ -z "$digest" ] || [ "$digest" = "None" ]; then

                            echo "ERROR: Image ${repository}:${IMAGE_TAG} not found in ECR."

                            exit 1
                        fi


                        echo "PASS: ${repository}:${IMAGE_TAG}"
                        echo "Digest: ${digest}"

                    done


                    echo ""
                    echo "======================================"
                    echo "All ECR images verified successfully."
                    echo "======================================"
                '''
            }
        }


        // ==========================================================
        // TRIGGER CD
        // ==========================================================

        stage("Trigger CD") {
            steps {
                script {

                    echo "======================================"
                    echo "Triggering CD Pipeline"
                    echo "======================================"

                    echo "CD Job: ${CD_JOB_NAME}"
                    echo "IMAGE_TAG: ${IMAGE_TAG}"

                    build job: "${CD_JOB_NAME}",
                        parameters: [
                            string(
                                name: 'IMAGE_TAG',
                                value: "${IMAGE_TAG}"
                            )
                        ],
                        wait: false,
                        propagate: true

                    echo "CD pipeline triggered successfully."
                }
            }
        }
    }


    // ==============================================================
    // POST
    // ==============================================================

    post {

        success {
            echo ""
            echo "======================================"
            echo "CI PIPELINE SUCCESS"
            echo "======================================"
            echo ""
            echo "Image tag: ${IMAGE_TAG}"
            echo ""
            echo "All images:"
            echo "- Built"
            echo "- Security scanned"
            echo "- Pushed to ECR"
            echo "- Verified in ECR"
            echo ""
            echo "CD pipeline has been triggered."
            echo "======================================"
        }


        failure {
            echo ""
            echo "======================================"
            echo "CI PIPELINE FAILED"
            echo "======================================"
            echo ""
            echo "Image tag: ${IMAGE_TAG}"
            echo ""
            echo "CD pipeline will NOT be triggered."
            echo ""
            echo "Check the failed Jenkins stage."
            echo "======================================"
        }


        always {
            echo ""
            echo "CI pipeline finished."
        }
    }
}
