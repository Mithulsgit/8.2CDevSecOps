pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Build: Maven'
            }
        }

        stage('Unit and Integration Tests') {
            steps {
                echo 'Unit and Integration Tests: JUnit / Maven Surefire'
            }
        }

        stage('Code Analysis') {
            steps {
                echo 'Code Analysis: SonarQube'
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Security Scan: OWASP Dependency-Check'
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo 'Deploy to Staging: Docker'
            }
        }

        stage('Integration Tests on Staging') {
            steps {
                echo 'Integration Tests on Staging: Postman / Newman'
            }
        }

        stage('Deploy to Production') {
            steps {
                echo 'Deploy to Production: Docker'
            }
        }
    }
}