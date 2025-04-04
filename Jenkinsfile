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
        NPM_CACHE_DIR = "${WORKSPACE}\\npm-cache"
        NPM_GLOBAL_DIR = "${WORKSPACE}\\npm-global"
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = credentials('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
        CLERK_SECRET_KEY = credentials('CLERK_SECRET_KEY')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup NPM') {
            steps {
                script {
                    try {
                        bat '''
                            @echo off
                            echo Setting up NPM environment...
                            
                            echo Creating directories...
                            if not exist "%NPM_CACHE_DIR%" mkdir "%NPM_CACHE_DIR%"
                            if not exist "%NPM_GLOBAL_DIR%" mkdir "%NPM_GLOBAL_DIR%"
                            
                            echo Setting NPM configuration...
                            call npm config set cache "%NPM_CACHE_DIR%" --global
                            call npm config set prefix "%NPM_GLOBAL_DIR%" --global
                            
                            echo Verifying NPM configuration...
                            call npm config list
                            
                            echo NPM setup complete
                        '''
                    } catch (Exception e) {
                        echo "Error setting up NPM: ${e.message}"
                        throw e
                    }
                }
            }
        }
        
        stage('Start PostgreSQL') {
            steps {
                script {
                    try {
                        bat '''
                            @echo off
                            docker ps -a -q --filter "name=postgres-test" > temp.txt
                            set /p CONTAINER_ID=<temp.txt
                            del temp.txt
                            
                            if defined CONTAINER_ID (
                                echo Found existing container, removing it...
                                docker stop postgres-test
                                docker rm postgres-test
                            ) else (
                                echo No existing container found
                            )
                            
                            echo Starting new PostgreSQL container...
                            docker run -d --name postgres-test ^
                            -e POSTGRES_USER=postgres ^
                            -e POSTGRES_PASSWORD=20010511 ^
                            -e POSTGRES_DB=FormBuild_test ^
                            -p %POSTGRES_PORT%:5432 ^
                            postgres:16-alpine
                            
                            echo Waiting for container to start...
                            timeout /t 15 /nobreak > nul
                            
                            echo Checking container status...
                            docker ps --filter "name=postgres-test" --format "{{.Status}}" | findstr "Up"
                            if errorlevel 1 (
                                echo PostgreSQL container failed to start properly
                                exit 1
                            ) else (
                                echo PostgreSQL container started successfully
                            )
                        '''
                    } catch (Exception e) {
                        echo "Error in PostgreSQL setup: ${e.message}"
                        throw e
                    }
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat '''
                    @echo off
                    echo Installing project dependencies...
                    call npm ci --cache "%NPM_CACHE_DIR%"
                    
                    echo Installing Prisma...
                    call npm install prisma --save-dev --cache "%NPM_CACHE_DIR%"
                    call npm install @prisma/client --cache "%NPM_CACHE_DIR%"
                    
                    echo Verifying installations...
                    call npm list prisma
                    call npm list @prisma/client
                '''
            }
        }

        stage('Generate Prisma Client') {
            steps {
                script {
                    try {
                        bat '''
                            @echo off
                            echo Setting up database connection...
                            set DATABASE_URL=postgresql://postgres:20010511@localhost:%POSTGRES_PORT%/FormBuild_test
                            
                            echo Generating Prisma client...
                            call node_modules\\.bin\\prisma generate
                            
                            if errorlevel 1 (
                                echo Failed to generate Prisma client
                                exit 1
                            )
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
                            @echo off
                            echo Running database migrations...
                            set DATABASE_URL=postgresql://postgres:20010511@localhost:%POSTGRES_PORT%/FormBuild_test
                            call node_modules\\.bin\\prisma migrate deploy
                            
                            if errorlevel 1 (
                                echo Failed to run migrations
                                exit 1
                            )
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
                script {
                    try {
                        bat '''
                            @echo off
                            echo Setting up environment variables...
                            set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=%NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY%
                            set CLERK_SECRET_KEY=%CLERK_SECRET_KEY%
                            
                            echo Building application...
                            call npm run build
                            
                            if errorlevel 1 (
                                echo Build failed
                                exit 1
                            )
                        '''
                    } catch (Exception e) {
                        echo "Error during build: ${e.message}"
                        throw e
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                script {
                    try {
                        bat '''
                            @echo off
                            echo Running tests...
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
                        bat '''
                            @echo off
                            echo Building frontend image...
                            docker build -t form-builder-frontend:%BUILD_NUMBER% -f Dockerfile.frontend .
                            
                            echo Building backend image...
                            docker build -t form-builder-backend:%BUILD_NUMBER% -f Dockerfile.backend .
                        '''
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
                        bat '''
                            @echo off
                            echo Tagging images...
                            docker tag form-builder-frontend:%BUILD_NUMBER% %DOCKER_REGISTRY%:%FRONTEND_PORT%/form-builder-frontend:%BUILD_NUMBER%
                            docker tag form-builder-backend:%BUILD_NUMBER% %DOCKER_REGISTRY%:%BACKEND_PORT%/form-builder-backend:%BUILD_NUMBER%
                            
                            echo Pushing images...
                            docker push %DOCKER_REGISTRY%:%FRONTEND_PORT%/form-builder-frontend:%BUILD_NUMBER%
                            docker push %DOCKER_REGISTRY%:%BACKEND_PORT%/form-builder-backend:%BUILD_NUMBER%
                        '''
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
                        bat '''
                            @echo off
                            echo Deploying application...
                            docker-compose up -d
                        '''
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
                        @echo off
                        echo Cleaning up...
                        
                        echo Cleaning up PostgreSQL container...
                        docker ps -a -q --filter "name=postgres-test" > temp.txt
                        set /p CONTAINER_ID=<temp.txt
                        del temp.txt
                        
                        if defined CONTAINER_ID (
                            echo Stopping and removing container...
                            docker stop postgres-test
                            docker rm postgres-test
                        ) else (
                            echo No container to clean up
                        )
                        
                        echo Cleaning up NPM directories...
                        if exist "%NPM_CACHE_DIR%" rmdir /s /q "%NPM_CACHE_DIR%"
                        if exist "%NPM_GLOBAL_DIR%" rmdir /s /q "%NPM_GLOBAL_DIR%"
                    '''
                } catch (Exception e) {
                    echo "Error in cleanup: ${e.message}"
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
