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
        DATABASE_URL = 'postgresql://postgres:20010511@localhost:5432/FormBuild_test'
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
                            docker run -d --name postgres-test -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=20010511 -e POSTGRES_DB=FormBuild_test -p 5432:5432 postgres:16-alpine
                            timeout /t 10 /nobreak
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
                            set DATABASE_URL=postgresql://postgres:20010511@localhost:5432/FormBuild_test
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
                            set DATABASE_URL=postgresql://postgres:20010511@localhost:5432/FormBuild_test
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
            script {
                try {
                    bat 'docker stop postgres-test'
                    bat 'docker rm postgres-test'
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