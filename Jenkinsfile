pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = credentials('docker-registry-credentials')
        NODE_VERSION = '18'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    // Build frontend image
                    docker.build("form-builder-frontend:${env.BUILD_NUMBER}", "-f Dockerfile.frontend .")
                    
                    // Build backend image
                    docker.build("form-builder-backend:${env.BUILD_NUMBER}", "-f Dockerfile.backend .")
                }
            }
        }
        
        stage('Push Docker Images') {
            steps {
                script {
                    // Push frontend image
                    docker.withRegistry('http://localhost:3000', 'docker-registry-credentials') {
                        docker.image("form-builder-frontend:${env.BUILD_NUMBER}").push()
                    }
                    
                    // Push backend image
                    docker.withRegistry('http://localhost:3001', 'docker-registry-credentials') {
                        docker.image("form-builder-backend:${env.BUILD_NUMBER}").push()
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
} 