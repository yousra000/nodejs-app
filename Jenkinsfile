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

        stage('Login to Amazon ECR') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws_access_key', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws_secret_access_key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {

                    sh '''
                    export AWS_DEFAULT_REGION=${AWS_REGION}

                    aws sts get-caller-identity

                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login \
                    --username AWS \
                    --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
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
                withCredentials([
                    string(credentialsId: 'aws_access_key', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws_secret_access_key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {

                    sh '''
                    docker push \
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}
                    '''
                }
            }
        }
        stage('Update GitOps Repo') {

            steps {

                withCredentials([
                    string(credentialsId: 'github_token', variable: 'GITHUB_TOKEN')
                ]) {

                    sh '''

                    rm -rf gitops-manifests

                    git clone https://${GITHUB_TOKEN}@github.com/yousra000/gitops-manifests.git

                    cd gitops-manifests


                    sed -i "s#gitops-demo:[0-9]*#gitops-demo:${IMAGE_TAG}#" app/deployment.yaml


                    git config user.email "yousraramadangad1@gmail.com"
                    git config user.name "yousra000"


                    git add app/deployment.yaml


                    git commit -m "Update image tag to ${IMAGE_TAG}" || echo "No changes to commit"


                    git push origin main

                    '''

                }

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