pipeline {
    agent any

    environment {
        GOOGLE_APPLICATION_CREDENTIALS = credentials('proyecto-titulo')
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Benjamin1106/Proyeco-Portafolio.git', branch: 'main' // Reemplaza con tu repositorio
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install -g yarn'
                bat 'yarn --version' // Verificar que Yarn está instalado
                bat 'yarn install'    // Instalar dependencias
            }
        }       

        stage('Build') {
            steps {
                bat 'npm run build' // Construir la aplicación
            }
        }

        stage('Deploy to Firebase') {
            steps {
                bat 'firebase deploy' // Desplegar a Firebase
            }
        }
    }

    post {
        success {
            echo 'Despliegue exitoso en Firebase.'
        }
        failure {
            echo 'El despliegue ha fallado.'
        }
    }
}
