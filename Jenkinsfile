pipeline {
    agent any

    tools {
        nodejs 'NodeJS22'
    }

    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '529088275092'
        ECR_REPOSITORY = 'gitops-demo'
        IMAGE_NAME = 'gitops-demo'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build \
                  -t ${IMAGE_NAME}:${IMAGE_TAG} .
                '''
            }
        }

        stage('Configure AWS Credentials') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws_access_key', variable: 'AWS_ACCESS_KEY'),
                    string(credentialsId: 'aws_secret_access_key', variable: 'AWS_SECRET_KEY')
                ]) {

                    sh '''
                    aws configure set aws_access_key $AWS_ACCESS_KEY
                    aws configure set aws_secret_access_key $AWS_SECRET_KEY
                    aws configure set default.region ${AWS_REGION}
                    '''
                }
            }
        }

        stage('Login to Amazon ECR') {
    steps {
                withCredentials([
                    string(credentialsId: 'aws_access_key', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws_secret_access_key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
            sh '''
            export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
            export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
            export AWS_DEFAULT_REGION=us-east-1

            aws ecr get-login-password --region us-east-1 | \
            docker login \
            --username AWS \
            --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
            '''
        }
    }
}

        stage('Tag Docker Image') {
            steps {
                sh '''
                docker tag ${IMAGE_NAME}:${IMAGE_TAG} \
                ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                docker push \
                ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}
                '''
            }
        }

    }

    post {

        success {
            echo "========================================"
            echo "CI Pipeline completed successfully!"
            echo "Image pushed to Amazon ECR."
            echo "Image Tag: ${IMAGE_TAG}"
            echo "========================================"
        }

        failure {
            echo "========================================"
            echo "CI Pipeline Failed!"
            echo "========================================"
        }

    }
}