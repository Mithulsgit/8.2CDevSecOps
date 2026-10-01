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
                withEnv(["PATH+SONAR=${scannerHome}/bin"]) {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=8.2CDevSecOps \
                          -Dsonar.projectName=8.2CDevSecOps \
                          -Dsonar.sources=. \
                          -Dsonar.exclusions=node_modules/**,public/js/bundle.js
                    '''
                }
            }
        }
    }
}