pipeline {
    agent any

    environment {
        IMAGE_NAME = 'goof-app'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Build') {
            steps {
                echo 'Building Node.js application...'

                sh 'npm ci'
                sh 'npm run build'

                echo 'Building Docker image...'

                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .'
                sh 'docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest'

                echo "Build completed: ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated tests...'

                sh 'npm test'
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Running SonarQube code quality analysis...'

                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner " +
                           "-Dsonar.projectKey=8.2CDevSecOps " +
                           "-Dsonar.projectName=8.2CDevSecOps " +
                           "-Dsonar.sources=. " +
                           "-Dsonar.exclusions=node_modules/**,public/js/bundle.js"
                    }

                    timeout(time: 5, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('Security') {
            steps {
                echo 'Running dependency security scan...'

                sh '''
                    npm audit --json > npm-audit.json || true
                '''

                sh '''
                    npm audit --audit-level=critical || true
                '''

                archiveArtifacts artifacts: 'npm-audit.json', fingerprint: true
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying ${IMAGE_NAME}:${IMAGE_TAG} to staging..."

                sh '''
                    docker rm -f goof-staging 2>/dev/null || true
                    docker rm -f goof-mongo-staging 2>/dev/null || true
                    docker rm -f goof-mysql-staging 2>/dev/null || true

                    docker network rm goof-staging-network 2>/dev/null || true

                    docker network create goof-staging-network

                    docker run -d \
                      --name goof-mongo-staging \
                      --network goof-staging-network \
                      --network-alias goof-mongo \
                      --platform linux/amd64 \
                      mongo:3

                    docker run -d \
                      --name goof-mysql-staging \
                      --network goof-staging-network \
                      --network-alias good-mysql \
                      --platform linux/amd64 \
                      -e MYSQL_ROOT_PASSWORD=root \
                      -e MYSQL_DATABASE=acme \
                      mysql:5

                    sleep 30

                    docker run -d \
                      --name goof-staging \
                      --network goof-staging-network \
                      -e DOCKER=1 \
                      -p 3002:3001 \
                      ${IMAGE_NAME}:${IMAGE_TAG}

                    sleep 15

                    echo "Checking staging container..."
                    docker ps --filter name=goof-staging

                    echo "Checking application logs..."
                    docker logs --tail 30 goof-staging || true

                    echo "Testing staging application..."
                    curl --fail http://host.docker.internal:3002
                '''
            }
        }
    }
}