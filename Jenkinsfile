pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "586197446523"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

        CD_JOB_NAME = "todo-app-cd"

        // Git tag prefix
        TAG_PREFIX = "v"
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
        // DETERMINE VERSION
        // ==========================================================

        stage("Determine Version") {
            steps {
                script {

                    sh '''
                        set -e

                        echo "======================================"
                        echo "Fetching Git Tags"
                        echo "======================================"

                        git fetch --tags --force
                    '''

                    // Get latest semantic version tag.
                    def latestTag = sh(
                        script: '''
                            git tag --list 'v[0-9]*.[0-9]*.[0-9]*' --sort=-version:refname | head -n 1
                        ''',
                        returnStdout: true
                    ).trim()

                    if (!latestTag) {
                        latestTag = "v0.0.0"
                    }

                    echo "Latest Git tag: ${latestTag}"

                    def version = latestTag.replaceFirst(/^v/, "")
                    def parts = version.tokenize(".")

                    if (parts.size() != 3) {
                        error("Invalid semantic version tag: ${latestTag}")
                    }

                    int major = parts[0] as int
                    int minor = parts[1] as int
                    int patch = parts[2] as int

                    def commitMessage = sh(
                        script: "git log -1 --pretty=%B",
                        returnStdout: true
                    ).trim()

                    echo "Latest commit message:"
                    echo commitMessage

                    /*
                     * Version rules:
                     *
                     * BREAKING CHANGE / !  -> MAJOR
                     * feat:                 -> MINOR
                     * fix:                  -> PATCH
                     *
                     * Other commits         -> PATCH
                     */

                    if (
                        commitMessage =~ /(?m)^BREAKING CHANGE:/ ||
                        commitMessage =~ /(?m)^[a-zA-Z]+(\([^)]*\))?!:/
                    ) {

                        major++
                        minor = 0
                        patch = 0

                        echo "Version bump: MAJOR"

                    } else if (commitMessage =~ /(?m)^feat(\([^)]*\))?:/) {

                        minor++
                        patch = 0

                        echo "Version bump: MINOR"

                    } else {

                        patch++

                        echo "Version bump: PATCH"
                    }

                    def newVersion = "${major}.${minor}.${patch}"
                    def newTag = "${TAG_PREFIX}${newVersion}"

                    env.IMAGE_TAG = newVersion
                    env.GIT_TAG = newTag

                    echo ""
                    echo "======================================"
                    echo "VERSION INFORMATION"
                    echo "======================================"
                    echo "Previous tag : ${latestTag}"
                    echo "New tag      : ${newTag}"
                    echo "IMAGE_TAG    : ${newVersion}"
                    echo "======================================"
                }
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
                    echo "Version: ${IMAGE_TAG}"
                    echo "======================================"


                    docker build \
                      --target production \
                      -t ${ECR_REGISTRY}/todo-auth-service:${IMAGE_TAG} \
                      ./auth-service


                    docker build \
                      --target migration \
                      -t ${ECR_REGISTRY}/todo-auth-service-migration:${IMAGE_TAG} \
                      ./auth-service


                    docker build \
                      --target production \
                      -t ${ECR_REGISTRY}/todo-service:${IMAGE_TAG} \
                      ./todo-service


                    docker build \
                      --target migration \
                      -t ${ECR_REGISTRY}/todo-service-migration:${IMAGE_TAG} \
                      ./todo-service


                    docker build \
                      --target production \
                      -t ${ECR_REGISTRY}/todo-notification-service:${IMAGE_TAG} \
                      ./notification-service


                    docker build \
                      --target migration \
                      -t ${ECR_REGISTRY}/todo-notification-service-migration:${IMAGE_TAG} \
                      ./notification-service


                    docker build \
                      -t ${ECR_REGISTRY}/todo-gateway:${IMAGE_TAG} \
                      ./gateway


                    docker build \
                      -t ${ECR_REGISTRY}/todo-frontend:${IMAGE_TAG} \
                      ./frontend


                    echo ""
                    echo "All images built successfully."
                '''
            }
        }


        // ==========================================================
        // DOCKER IMAGE VERIFICATION
        // ==========================================================

        stage("Docker Images") {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Verifying Docker Images"
                    echo "======================================"

                    docker image inspect ${ECR_REGISTRY}/todo-auth-service:${IMAGE_TAG}
                    docker image inspect ${ECR_REGISTRY}/todo-auth-service-migration:${IMAGE_TAG}

                    docker image inspect ${ECR_REGISTRY}/todo-service:${IMAGE_TAG}
                    docker image inspect ${ECR_REGISTRY}/todo-service-migration:${IMAGE_TAG}

                    docker image inspect ${ECR_REGISTRY}/todo-notification-service:${IMAGE_TAG}
                    docker image inspect ${ECR_REGISTRY}/todo-notification-service-migration:${IMAGE_TAG}

                    docker image inspect ${ECR_REGISTRY}/todo-gateway:${IMAGE_TAG}
                    docker image inspect ${ECR_REGISTRY}/todo-frontend:${IMAGE_TAG}

                    echo "All Docker images verified."
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
                    echo "======================================"


                    images="
                    ${ECR_REGISTRY}/todo-auth-service:${IMAGE_TAG}
                    ${ECR_REGISTRY}/todo-auth-service-migration:${IMAGE_TAG}
                    ${ECR_REGISTRY}/todo-service:${IMAGE_TAG}
                    ${ECR_REGISTRY}/todo-service-migration:${IMAGE_TAG}
                    ${ECR_REGISTRY}/todo-notification-service:${IMAGE_TAG}
                    ${ECR_REGISTRY}/todo-notification-service-migration:${IMAGE_TAG}
                    ${ECR_REGISTRY}/todo-gateway:${IMAGE_TAG}
                    ${ECR_REGISTRY}/todo-frontend:${IMAGE_TAG}
                    "


                    for image in $images; do

                        echo ""
                        echo "Scanning: ${image}"

                        trivy image \
                          --severity CRITICAL \
                          --exit-code 1 \
                          --ignore-unfixed \
                          "${image}"

                    done


                    echo ""
                    echo "======================================"
                    echo "Trivy Security Scan PASSED"
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
                    echo "Pushing Images to ECR"
                    echo "Version: ${IMAGE_TAG}"
                    echo "======================================"


                    images="
                    todo-auth-service
                    todo-auth-service-migration
                    todo-service
                    todo-service-migration
                    todo-notification-service
                    todo-notification-service-migration
                    todo-gateway
                    todo-frontend
                    "


                    for repository in $images; do

                        echo "Pushing ${repository}:${IMAGE_TAG}"

                        docker push \
                          ${ECR_REGISTRY}/${repository}:${IMAGE_TAG}

                    done


                    echo ""
                    echo "All images pushed successfully."
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
                    echo "Version: ${IMAGE_TAG}"
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
                        echo "Checking ${repository}:${IMAGE_TAG}"


                        digest=$(aws ecr describe-images \
                          --repository-name "$repository" \
                          --region "${AWS_REGION}" \
                          --image-ids imageTag="${IMAGE_TAG}" \
                          --query 'imageDetails[0].imageDigest' \
                          --output text)


                        if [ -z "$digest" ] || [ "$digest" = "None" ]; then

                            echo "ERROR: ${repository}:${IMAGE_TAG} not found."

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
        // CREATE AND PUSH GIT TAG
        // ==========================================================

        stage("Create Git Tag") {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-credentials',
                        usernameVariable: 'GIT_USERNAME',
                        passwordVariable: 'GIT_TOKEN'
                    )
                ]) {

                    sh '''
                        set -e

                        echo "======================================"
                        echo "Creating Git Tag"
                        echo "======================================"

                        git config user.name "Jenkins CI"
                        git config user.email "jenkins-ci@localhost"

                        git tag -a "${GIT_TAG}" \
                          -m "Release ${GIT_TAG}"

                        git push \
                          https://${GIT_USERNAME}:${GIT_TOKEN}@github.com/YOUR_USERNAME/YOUR_REPOSITORY.git \
                          "${GIT_TAG}"

                        echo ""
                        echo "Git tag ${GIT_TAG} pushed successfully."
                    '''
                }
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

                    echo "CD Job   : ${CD_JOB_NAME}"
                    echo "Version  : ${IMAGE_TAG}"
                    echo "Git Tag  : ${GIT_TAG}"


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
            echo "Version: ${IMAGE_TAG}"
            echo "Git Tag: ${GIT_TAG}"
            echo ""
            echo "All images:"
            echo "- Built"
            echo "- Verified"
            echo "- Trivy scanned"
            echo "- Pushed to ECR"
            echo "- Verified in ECR"
            echo ""
            echo "Git tag created successfully."
            echo "CD pipeline triggered."
            echo "======================================"
        }

        failure {
            echo ""
            echo "======================================"
            echo "CI PIPELINE FAILED"
            echo "======================================"
            echo ""
            echo "The CD pipeline will NOT be triggered."
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
