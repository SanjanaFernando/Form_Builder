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
                bat 'npm ci'
            }
        }

        stage('Generate Prisma Client') {
            steps {
                bat 'node_modules\\.bin\\prisma generate'
            }
        }
        
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                bat 'npm test'
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    try {
                        // Build frontend image
                        bat "docker build -t form-builder-frontend:%BUILD_NUMBER% -f Dockerfile.frontend ."
                        
                        // Build backend image
                        bat "docker build -t form-builder-backend:%BUILD_NUMBER% -f Dockerfile.backend ."
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
                        bat """
                            docker tag form-builder-frontend:%BUILD_NUMBER% %DOCKER_REGISTRY%:%FRONTEND_PORT%/form-builder-frontend:%BUILD_NUMBER%
                            docker tag form-builder-backend:%BUILD_NUMBER% %DOCKER_REGISTRY%:%BACKEND_PORT%/form-builder-backend:%BUILD_NUMBER%
                        """
                        
                        // Push images
                        bat """
                            docker push %DOCKER_REGISTRY%:%FRONTEND_PORT%/form-builder-frontend:%BUILD_NUMBER%
                            docker push %DOCKER_REGISTRY%:%BACKEND_PORT%/form-builder-backend:%BUILD_NUMBER%
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
                        bat 'docker-compose up -d'
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