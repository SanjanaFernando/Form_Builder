pipeline {
    agent {
        node {
            label 'master'
        }
    }
    
    environment {
        NODE_VERSION = '18'
        DOCKER_REGISTRY = 'localhost'
        FRONTEND_PORT = '3000'
        BACKEND_PORT = '3001'
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
                    try {
                        // Build frontend image
                        sh "docker build -t form-builder-frontend:${env.BUILD_NUMBER} -f Dockerfile.frontend ."
                        
                        // Build backend image
                        sh "docker build -t form-builder-backend:${env.BUILD_NUMBER} -f Dockerfile.backend ."
                    } catch (Exception e) {
                        echo "Error building Docker images: ${e.message}"
                        throw e
                    }
                }
            }
        }
        
        stage('Push Docker Images') {
            steps {
                script {
                    try {
                        // Tag images
                        sh """
                            docker tag form-builder-frontend:${env.BUILD_NUMBER} ${DOCKER_REGISTRY}:${FRONTEND_PORT}/form-builder-frontend:${env.BUILD_NUMBER}
                            docker tag form-builder-backend:${env.BUILD_NUMBER} ${DOCKER_REGISTRY}:${BACKEND_PORT}/form-builder-backend:${env.BUILD_NUMBER}
                        """
                        
                        // Push images
                        sh """
                            docker push ${DOCKER_REGISTRY}:${FRONTEND_PORT}/form-builder-frontend:${env.BUILD_NUMBER}
                            docker push ${DOCKER_REGISTRY}:${BACKEND_PORT}/form-builder-backend:${env.BUILD_NUMBER}
                        """
                    } catch (Exception e) {
                        echo "Error pushing Docker images: ${e.message}"
                        throw e
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    try {
                        sh 'docker-compose up -d'
                    } catch (Exception e) {
                        echo "Error deploying application: ${e.message}"
                        throw e
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo "Pipeline execution completed"
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
} 