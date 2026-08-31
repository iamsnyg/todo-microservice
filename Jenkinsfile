pipeline {
    agent any

    environment {
        AWS_REGION     = "ap-south-1"
        AWS_ACCOUNT_ID = "586197446523"
        ECR_REGISTRY   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

        CD_JOB_NAME = "todo-app-cd"

        // GitHub repository
        GITHUB_REPO = "iamsnyg/todo-microservice"

        // Git tag prefix
        TAG_PREFIX = "v"
    }

    stages {

        // ==========================================================
        // 1. CHECKOUT
        // ==========================================================

        stage("Checkout") {
            steps {
                checkout scm

                sh '''
                    set -e

                    echo "======================================"
                    echo "CHECKOUT"
                    echo "======================================"

                    git fetch --tags --force

                    echo "Commit:"
                    git log -1 --oneline

                    echo ""
                    echo "Commit Message:"
                    git log -1 --pretty=%B
                '''
            }
        }


        // ==========================================================
        // 2. DETECT CHANGED SERVICES
        // ==========================================================

        stage("Detect Changed Services") {
            steps {
                script {

                    /*
                     * Determine the files changed by the current commit.
                     *
                     * For a normal commit:
                     * HEAD^..HEAD
                     *
                     * For the first commit, fall back to HEAD.
                     */

                    def changedFiles = ""

                    def parentCommitStatus = sh(
                        script: "git rev-parse HEAD^ >/dev/null 2>&1",
                        returnStatus: true
                    )

                    if (parentCommitStatus == 0) {

                        changedFiles = sh(
                            script: '''
                                git diff --name-only HEAD^ HEAD
                            ''',
                            returnStdout: true
                        ).trim()

                    } else {

                        changedFiles = sh(
                            script: '''
                                git ls-tree -r --name-only HEAD
                            ''',
                            returnStdout: true
                        ).trim()
                    }


                    echo "======================================"
                    echo "CHANGED FILES"
                    echo "======================================"

                    if (changedFiles) {
                        echo changedFiles
                    } else {
                        echo "No changed files detected."
                    }

                    echo "======================================"


                    def services = []


                    // --------------------------------------------------
                    // AUTH SERVICE
                    // --------------------------------------------------

                    if (
                        changedFiles
                            .split("\\n")
                            .any { it.startsWith("auth-service/") }
                    ) {
                        services.add("auth-service")
                    }


                    // --------------------------------------------------
                    // TODO SERVICE
                    // --------------------------------------------------

                    if (
                        changedFiles
                            .split("\\n")
                            .any { it.startsWith("todo-service/") }
                    ) {
                        services.add("todo-service")
                    }


                    // --------------------------------------------------
                    // NOTIFICATION SERVICE
                    // --------------------------------------------------

                    if (
                        changedFiles
                            .split("\\n")
                            .any {
                                it.startsWith("notification-service/")
                            }
                    ) {
                        services.add("notification-service")
                    }


                    // --------------------------------------------------
                    // GATEWAY
                    // --------------------------------------------------

                    if (
                        changedFiles
                            .split("\\n")
                            .any { it.startsWith("gateway/") }
                    ) {
                        services.add("gateway")
                    }


                    // --------------------------------------------------
                    // FRONTEND
                    // --------------------------------------------------

                    if (
                        changedFiles
                            .split("\\n")
                            .any { it.startsWith("frontend/") }
                    ) {
                        services.add("frontend")
                    }


                    /*
                     * Ignore changes that are not service code.
                     *
                     * Example:
                     *
                     * README.md
                     * docs/
                     *
                     * will not trigger a Docker build.
                     */

                    if (services.isEmpty()) {

                        echo ""
                        echo "No supported service changes detected."
                        echo "CI build is not required for this commit."

                        currentBuild.result = "NOT_BUILT"

                        return
                    }


                    env.CHANGED_SERVICES = services.join(",")


                    echo ""
                    echo "======================================"
                    echo "CHANGED SERVICES"
                    echo "======================================"

                    echo env.CHANGED_SERVICES

                    echo "======================================"
                }
            }
        }


        // ==========================================================
        // 3. DETERMINE SERVICE VERSIONS
        // ==========================================================

        stage("Determine Versions") {
            when {
                expression {
                    return env.CHANGED_SERVICES?.trim()
                }
            }

            steps {
                script {

                    sh '''
                        rm -f service-versions.txt
                        touch service-versions.txt
                    '''


                    def services =
                        env.CHANGED_SERVICES.split(",")


                    def commitMessage = sh(
                        script: "git log -1 --pretty=%B",
                        returnStdout: true
                    ).trim()


                    echo "======================================"
                    echo "VERSION ANALYSIS"
                    echo "======================================"

                    echo "Commit message:"
                    echo commitMessage


                    /*
                     * Conventional Commit rules:
                     *
                     * fix:       PATCH
                     * feat:      MINOR
                     * feat!:     MAJOR
                     * BREAKING CHANGE: MAJOR
                     *
                     * Examples:
                     *
                     * fix: login bug
                     *
                     * feat: notification preference
                     *
                     * feat!: redesign authentication API
                     */


                    def bumpType = "PATCH"


                    if (
                        commitMessage =~ /(?m)^BREAKING CHANGE:/ ||
                        commitMessage =~ /(?m)^[a-zA-Z]+(\([^)]*\))?!:/
                    ) {

                        bumpType = "MAJOR"

                    } else if (
                        commitMessage =~ /(?m)^feat(\([^)]*\))?:/
                    ) {

                        bumpType = "MINOR"

                    } else {

                        bumpType = "PATCH"
                    }


                    echo "Version bump type: ${bumpType}"


                    for (service in services) {

                        /*
                         * Find latest service-specific Git tag.
                         *
                         * Example:
                         *
                         * frontend-v1.0.0
                         * frontend-v1.0.1
                         *
                         * auth-service-v1.2.0
                         */

                        def latestTag = sh(
                            script: """
                                git tag --list '${service}-v[0-9]*.[0-9]*.[0-9]*' \
                                --sort=-version:refname | head -n 1
                            """,
                            returnStdout: true
                        ).trim()


                        if (!latestTag) {
                            latestTag = "${service}-v0.0.0"
                        }


                        echo ""
                        echo "Service     : ${service}"
                        echo "Latest tag  : ${latestTag}"


                        def version =
                            latestTag.replaceFirst(
                                "^${service}-v",
                                ""
                            )


                        def parts = version.tokenize(".")


                        if (parts.size() != 3) {

                            error(
                                "Invalid semantic version for " +
                                "${service}: ${latestTag}"
                            )
                        }


                        int major = parts[0] as int
                        int minor = parts[1] as int
                        int patch = parts[2] as int


                        if (bumpType == "MAJOR") {

                            major++
                            minor = 0
                            patch = 0

                        } else if (bumpType == "MINOR") {

                            minor++
                            patch = 0

                        } else {

                            patch++
                        }


                        def newVersion =
                            "${major}.${minor}.${patch}"


                        def newTag =
                            "${service}-${TAG_PREFIX}${newVersion}"


                        echo "New version : ${newVersion}"
                        echo "New Git tag  : ${newTag}"


                        sh """
                            echo '${service}|${newVersion}|${newTag}' \
                            >> service-versions.txt
                        """
                    }


                    echo ""
                    echo "======================================"
                    echo "SERVICE VERSIONS"
                    echo "======================================"

                    sh 'cat service-versions.txt'
                }
            }
        }


        // ==========================================================
        // 4. VERIFY PROJECT
        // ==========================================================

        stage("Verify Project") {
            when {
                expression {
                    return env.CHANGED_SERVICES?.trim()
                }
            }

            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "VERIFYING PROJECT"
                    echo "======================================"


                    test -d auth-service
                    test -d todo-service
                    test -d notification-service
                    test -d gateway
                    test -d frontend


                    echo "Project structure OK."


                    echo ""
                    echo "Checking Dockerfiles..."


                    test -f auth-service/Dockerfile
                    test -f todo-service/Dockerfile
                    test -f notification-service/Dockerfile
                    test -f gateway/Dockerfile
                    test -f frontend/Dockerfile


                    echo "Dockerfiles OK."
                '''
            }
        }


        // ==========================================================
        // 5. LOGIN TO ECR
        // ==========================================================

        stage("Login to ECR") {
            when {
                expression {
                    return env.CHANGED_SERVICES?.trim()
                }
            }

            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "ECR LOGIN"
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
        // 6. BUILD ONLY CHANGED SERVICES
        // ==========================================================

        stage("Build Changed Services") {
            when {
                expression {
                    return env.CHANGED_SERVICES?.trim()
                }
            }

            steps {
                script {

                    def services =
                        env.CHANGED_SERVICES.split(",")


                    def versionLines =
                        readFile("service-versions.txt")
                            .trim()
                            .split("\\n")


                    for (service in services) {

                        def versionLine =
                            versionLines.find {
                                it.startsWith("${service}|")
                            }


                        if (!versionLine) {

                            error(
                                "Version not found for ${service}"
                            )
                        }


                        def values =
                            versionLine.split("\\|")


                        def version = values[1]


                        echo ""
                        echo "======================================"
                        echo "BUILDING ${service}"
                        echo "VERSION: ${version}"
                        echo "======================================"


                        if (service == "auth-service") {

                            sh """
                                set -e

                                docker build \
                                  --target production \
                                  -t ${ECR_REGISTRY}/todo-auth-service:${version} \
                                  ./auth-service

                                docker build \
                                  --target migration \
                                  -t ${ECR_REGISTRY}/todo-auth-service-migration:${version} \
                                  ./auth-service
                            """


                        } else if (service == "todo-service") {

                            sh """
                                set -e

                                docker build \
                                  --target production \
                                  -t ${ECR_REGISTRY}/todo-service:${version} \
                                  ./todo-service

                                docker build \
                                  --target migration \
                                  -t ${ECR_REGISTRY}/todo-service-migration:${version} \
                                  ./todo-service
                            """


                        } else if (service == "notification-service") {

                            sh """
                                set -e

                                docker build \
                                  --target production \
                                  -t ${ECR_REGISTRY}/todo-notification-service:${version} \
                                  ./notification-service

                                docker build \
                                  --target migration \
                                  -t ${ECR_REGISTRY}/todo-notification-service-migration:${version} \
                                  ./notification-service
                            """


                        } else if (service == "gateway") {

                            sh """
                                set -e

                                docker build \
                                  -t ${ECR_REGISTRY}/todo-gateway:${version} \
                                  ./gateway
                            """


                        } else if (service == "frontend") {

                            sh """
                                set -e

                                docker build \
                                  -t ${ECR_REGISTRY}/todo-frontend:${version} \
                                  ./frontend
                            """
                        }
                    }


                    echo ""
                    echo "======================================"
                    echo "ALL CHANGED SERVICE IMAGES BUILT"
                    echo "======================================"
                }
            }
        }


        // ==========================================================
        // 7. VERIFY DOCKER IMAGES
        // ==========================================================

        stage("Verify Docker Images") {
            when {
                expression {
                    return env.CHANGED_SERVICES?.trim()
                }
            }

            steps {
                script {

                    def services =
                        env.CHANGED_SERVICES.split(",")


                    def versionLines =
                        readFile("service-versions.txt")
                            .trim()
                            .split("\\n")


                    for (service in services) {

                        def versionLine =
                            versionLines.find {
                                it.startsWith("${service}|")
                            }


                        def version =
                            versionLine.split("\\|")[1]


                        echo ""
                        echo "Verifying ${service}:${version}"


                        if (service == "auth-service") {

                            sh """
                                docker image inspect \
                                  ${ECR_REGISTRY}/todo-auth-service:${version}

                                docker image inspect \
                                  ${ECR_REGISTRY}/todo-auth-service-migration:${version}
                            """


                        } else if (service == "todo-service") {

                            sh """
                                docker image inspect \
                                  ${ECR_REGISTRY}/todo-service:${version}

                                docker image inspect \
                                  ${ECR_REGISTRY}/todo-service-migration:${version}
                            """


                        } else if (service == "notification-service") {

                            sh """
                                docker image inspect \
                                  ${ECR_REGISTRY}/todo-notification-service:${version}

                                docker image inspect \
                                  ${ECR_REGISTRY}/todo-notification-service-migration:${version}
                            """


                        } else if (service == "gateway") {

                            sh """
                                docker image inspect \
                                  ${ECR_REGISTRY}/todo-gateway:${version}
                            """


                        } else if (service == "frontend") {

                            sh """
                                docker image inspect \
                                  ${ECR_REGISTRY}/todo-frontend:${version}
                            """
                        }
                    }


                    echo ""
                    echo "Docker image verification PASSED."
                }
            }
        }


        // ==========================================================
        // 8. TRIVY SECURITY SCAN
        // ==========================================================

        stage("Trivy Security Scan") {
            when {
                expression {
                    return env.CHANGED_SERVICES?.trim()
                }
            }

            steps {
                script {

                    def services =
                        env.CHANGED_SERVICES.split(",")


                    def versionLines =
                        readFile("service-versions.txt")
                            .trim()
                            .split("\\n")


                    for (service in services) {

                        def versionLine =
                            versionLines.find {
                                it.startsWith("${service}|")
                            }


                        def version =
                            versionLine.split("\\|")[1]


                        def images = []


                        if (service == "auth-service") {

                            images = [
                                "${ECR_REGISTRY}/todo-auth-service:${version}",
                                "${ECR_REGISTRY}/todo-auth-service-migration:${version}"
                            ]


                        } else if (service == "todo-service") {

                            images = [
                                "${ECR_REGISTRY}/todo-service:${version}",
                                "${ECR_REGISTRY}/todo-service-migration:${version}"
                            ]


                        } else if (service == "notification-service") {

                            images = [
                                "${ECR_REGISTRY}/todo-notification-service:${version}",
                                "${ECR_REGISTRY}/todo-notification-service-migration:${version}"
                            ]


                        } else if (service == "gateway") {

                            images = [
                                "${ECR_REGISTRY}/todo-gateway:${version}"
                            ]


                        } else if (service == "frontend") {

                            images = [
                                "${ECR_REGISTRY}/todo-frontend:${version}"
                            ]
                        }


                        for (image in images) {

                            echo ""
                            echo "Scanning: ${image}"


                            sh """
                                set -e

                                trivy image \
                                  --severity CRITICAL \
                                  --exit-code 1 \
                                  --ignore-unfixed \
                                  "${image}"
                            """
                        }
                    }


                    echo ""
                    echo "======================================"
                    echo "TRIVY SECURITY SCAN PASSED"
                    echo "======================================"
                }
            }
        }


        // ==========================================================
        // 9. PUSH ONLY CHANGED IMAGES
        // ==========================================================

        stage("Push Images to ECR") {
            when {
                expression {
                    return env.CHANGED_SERVICES?.trim()
                }
            }

            steps {
                script {

                    def services =
                        env.CHANGED_SERVICES.split(",")


                    def versionLines =
                        readFile("service-versions.txt")
                            .trim()
                            .split("\\n")


                    for (service in services) {

                        def versionLine =
                            versionLines.find {
                                it.startsWith("${service}|")
                            }


                        def version =
                            versionLine.split("\\|")[1]


                        def repositories = []


                        if (service == "auth-service") {

                            repositories = [
                                "todo-auth-service",
                                "todo-auth-service-migration"
                            ]


                        } else if (service == "todo-service") {

                            repositories = [
                                "todo-service",
                                "todo-service-migration"
                            ]


                        } else if (service == "notification-service") {

                            repositories = [
                                "todo-notification-service",
                                "todo-notification-service-migration"
                            ]


                        } else if (service == "gateway") {

                            repositories = [
                                "todo-gateway"
                            ]


                        } else if (service == "frontend") {

                            repositories = [
                                "todo-frontend"
                            ]
                        }


                        for (repository in repositories) {

                            echo ""
                            echo "Pushing ${repository}:${version}"


                            sh """
                                set -e

                                docker push \
                                  ${ECR_REGISTRY}/${repository}:${version}
                            """
                        }
                    }


                    echo ""
                    echo "======================================"
                    echo "ALL CHANGED IMAGES PUSHED"
                    echo "======================================"
                }
            }
        }


        // ==========================================================
        // 10. VERIFY ECR IMAGES
        // ==========================================================

        stage("Verify ECR Images") {
            when {
                expression {
                    return env.CHANGED_SERVICES?.trim()
                }
            }

            steps {
                script {

                    def services =
                        env.CHANGED_SERVICES.split(",")


                    def versionLines =
                        readFile("service-versions.txt")
                            .trim()
                            .split("\\n")


                    for (service in services) {

                        def versionLine =
                            versionLines.find {
                                it.startsWith("${service}|")
                            }


                        def version =
                            versionLine.split("\\|")[1]


                        def repositories = []


                        if (service == "auth-service") {

                            repositories = [
                                "todo-auth-service",
                                "todo-auth-service-migration"
                            ]


                        } else if (service == "todo-service") {

                            repositories = [
                                "todo-service",
                                "todo-service-migration"
                            ]


                        } else if (service == "notification-service") {

                            repositories = [
                                "todo-notification-service",
                                "todo-notification-service-migration"
                            ]


                        } else if (service == "gateway") {

                            repositories = [
                                "todo-gateway"
                            ]


                        } else if (service == "frontend") {

                            repositories = [
                                "todo-frontend"
                            ]
                        }


                        for (repository in repositories) {

                            echo ""
                            echo "Checking ${repository}:${version}"


                            sh """
                                set -e

                                digest=\$(aws ecr describe-images \
                                  --repository-name "${repository}" \
                                  --region "${AWS_REGION}" \
                                  --image-ids imageTag="${version}" \
                                  --query 'imageDetails[0].imageDigest' \
                                  --output text)

                                if [ -z "\$digest" ] || [ "\$digest" = "None" ]; then
                                    echo "ERROR: ${repository}:${version} not found."
                                    exit 1
                                fi

                                echo "PASS: ${repository}:${version}"
                                echo "Digest: \$digest"
                            """
                        }
                    }


                    echo ""
                    echo "======================================"
                    echo "ECR VERIFICATION PASSED"
                    echo "======================================"
                }
            }
        }


        // ==========================================================
        // 11. CREATE SERVICE GIT TAGS
        // ==========================================================

        stage("Create Git Tags") {
            when {
                expression {
                    return env.CHANGED_SERVICES?.trim()
                }
            }

            steps {

                /*
                 * Jenkins credential:
                 *
                 * Kind: Secret text
                 * ID: github-token
                 */

                withCredentials([
                    string(
                        credentialsId: 'github-cred',
                        variable: 'GITHUB_TOKEN'
                    )
                ]) {

                    script {

                        def services =
                            env.CHANGED_SERVICES.split(",")


                        def versionLines =
                            readFile("service-versions.txt")
                                .trim()
                                .split("\\n")


                        for (service in services) {

                            def versionLine =
                                versionLines.find {
                                    it.startsWith("${service}|")
                                }


                            def values =
                                versionLine.split("\\|")


                            def gitTag = values[2]


                            echo ""
                            echo "Creating Git tag: ${gitTag}"


                            /*
                             * Check whether tag already exists.
                             */

                            def tagExists = sh(
                                script: """
                                    git tag --list "${gitTag}"
                                """,
                                returnStdout: true
                            ).trim()


                            if (tagExists) {

                                error(
                                    "Git tag ${gitTag} already exists."
                                )
                            }


                            sh """
                                set -e

                                git config user.name "Jenkins CI"
                                git config user.email "jenkins-ci@localhost"

                                git tag -a "${gitTag}" \
                                  -m "Release ${service} ${gitTag}"

                                git push \
                                  https://x-access-token:\${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git \
                                  "${gitTag}"
                            """
                        }
                    }
                }
            }
        }


        // ==========================================================
        // 12. TRIGGER CD
        // ==========================================================

        stage("Trigger CD") {
            when {
                expression {
                    return env.CHANGED_SERVICES?.trim()
                }
            }

            steps {
                script {

                    echo "======================================"
                    echo "TRIGGERING CD"
                    echo "======================================"


                    def services =
                        env.CHANGED_SERVICES.split(",")


                    def versionLines =
                        readFile("service-versions.txt")
                            .trim()
                            .split("\\n")


                    for (service in services) {

                        def versionLine =
                            versionLines.find {
                                it.startsWith("${service}|")
                            }


                        def values =
                            versionLine.split("\\|")


                        def version = values[1]


                        echo ""
                        echo "Service : ${service}"
                        echo "Version : ${version}"


                        /*
                         * CD receives the exact service and version
                         * produced and verified by CI.
                         */

                        build job: "${CD_JOB_NAME}",
                            parameters: [
                                string(
                                    name: 'SERVICE_NAME',
                                    value: service
                                ),
                                string(
                                    name: 'IMAGE_TAG',
                                    value: version
                                )
                            ],
                            wait: false,
                            propagate: true
                    }


                    echo ""
                    echo "======================================"
                    echo "CD PIPELINE TRIGGERED"
                    echo "======================================"
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
            echo "Changed services:"
            echo "${env.CHANGED_SERVICES}"

            echo ""
            echo "Service versions:"

            script {
                if (fileExists("service-versions.txt")) {
                    sh 'cat service-versions.txt'
                }
            }

            echo ""
            echo "Completed:"
            echo "- Changed services detected"
            echo "- Service versions calculated"
            echo "- Only changed services built"
            echo "- Docker images verified"
            echo "- Trivy security scan passed"
            echo "- Only changed images pushed to ECR"
            echo "- ECR images verified"
            echo "- Service Git tags created"
            echo "- CD pipeline triggered"

            echo ""
            echo "======================================"
        }


        failure {

            echo ""
            echo "======================================"
            echo "CI PIPELINE FAILED"
            echo "======================================"

            echo ""
            echo "CD pipeline will NOT be triggered."

            echo ""
            echo "Check the failed Jenkins stage and console log."

            echo ""
            echo "======================================"
        }


        always {

            echo ""
            echo "CI pipeline finished."
        }
    }
}
