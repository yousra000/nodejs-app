pipeline {


    agent any


    environment {

        IMAGE_NAME = "gitops-demo"

        IMAGE_TAG = "${BUILD_NUMBER}"

    }


    stages {


        stage('Checkout') {

            steps {

                echo "Cloning repository"

                checkout scm

            }
        }



        stage('Install Dependencies') {

            steps {

                sh '''
                npm install
                '''

            }
        }




        stage('Run Tests') {

            steps {

                sh '''
                npm test
                '''

            }
        }




        stage('Build Docker Image') {

            steps {

                sh '''

                docker build \
                -t $IMAGE_NAME:$IMAGE_TAG .

                '''

            }
        }


    }



    post {


        success {

            echo "CI Pipeline completed successfully"

        }


        failure {

            echo "CI Pipeline failed"

        }


    }

}