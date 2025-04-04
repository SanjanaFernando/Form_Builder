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
        POSTGRES_PORT = '5433'
        DATABASE_URL = 'postgresql://postgres:20010511@localhost:5433/FormBuild_test'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Start PostgreSQL') {
            steps {
                script {
                    try {
                        bat '''
                            docker ps -a -q --filter "name=postgres-test" | findstr . && (
                                docker stop postgres-test
                                docker rm postgres-test
                            ) || echo "No existing container to remove"
                        '''
                        
                        bat '''
                            docker run -d --name postgres-test ^
                            -e POSTGRES_USER=postgres ^
                            -e POSTGRES_PASSWORD=20010511 ^
                            -e POSTGRES_DB=FormBuild_test ^
                            -p %POSTGRES_PORT%:5432 ^
                            postgres:16-alpine
                            
                            timeout /t 15 /nobreak >nul
                            
                            docker ps | findstr postgres-test || (
                                echo PostgreSQL container failed to start
                                exit 1
                            )
                        '''
                    } catch (Exception e) {
                        echo "Error starting PostgreSQL: ${e.message}"
                        throw e
                    }
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Generate Prisma Client') {
            steps {
                script {
                    try {
                        bat '''
                            set DATABASE_URL=postgresql://postgres:20010511@localhost:%POSTGRES_PORT%/FormBuild_test
                            npx prisma generate
                        '''
                    } catch (Exception e) {
                        echo "Error generating Prisma client: ${e.message}"
                        throw e
                    }
                }
            }
        }

        stage('Run Database Migrations') {
            steps {
                script {
                    try {
                        bat '''
                            set DATABASE_URL=postgresql://postgres:20010511@localhost:%POSTGRES_PORT%/FormBuild_test
                            npx prisma migrate deploy
                        '''
                    } catch (Exception e) {
                        echo "Error running migrations: ${e.message}"
                        throw e
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                script {
                    try {
                        bat '''
                            set DATABASE_URL=postgresql://postgres:20010511@localhost:%POSTGRES_PORT%/FormBuild_test
                            npm test
                        '''
                    } catch (Exception e) {
                        echo "Error running tests: ${e.message}"
                        throw e
                    }
                }
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
            script {
                try {
                    bat '''
                        docker stop postgres-test || echo "Failed to stop container"
                        docker rm postgres-test || echo "Failed to remove container"
                    '''
                } catch (Exception e) {
                    echo "Error cleaning up PostgreSQL container: ${e.message}"
                }
            }
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
} 