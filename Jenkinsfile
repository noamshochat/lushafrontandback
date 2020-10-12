node {
   	properties([[$class: 'JiraProjectProperty']])
   	wrap([$class: 'BuildUser']) {
        USER = "${BUILD_USER}"
        USER_ID = "${BUILD_USER_ID}"
        println "USER: ${USER}"
        //Removing user id domain name if exists 
        if(USER_ID.contains("@")){
            (USER_ID, value) = USER_ID.split("@")
        }
        //USER_EMAIL = "${BUILD_USER_EMAIL}"
    }
}
def myRepo
pipeline {
	parameters {
        string(name:'COMMIT', defaultValue:'main', description:'branch, tag, commitId')
    }
	options{
        skipDefaultCheckout true
    }
    environment{
        githubRepositoryName = "lushafrontandback"
        dockerCredentials = "47673957-460b-426c-b3bd-6a815601c6bf"
        dockerRegistry = "noamsh"
    }
    agent { label "master" }
    stages{
        stage('Pull SCM'){
            steps{
                script{
                    myRepo = checkout([$class: 'GitSCM', 
                    branches: [[name: params.COMMIT]], 
                    doGenerateSubmoduleConfigurations: false, 
                    extensions: [], 
                    submoduleCfg: [], 
                    userRemoteConfigs: [[
                    url: "https://github.com/noamshochat/${githubRepositoryName}.git"]]])

                    def gitCommit = myRepo.GIT_COMMIT
                    def gitBranch = myRepo.GIT_BRANCH

                    sh """
                        rm /etc/apt/sources.list.d/*
                        apt-get install apt-transport-https ca-certificates gnupg-agent software-properties-common -y
                        curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
                        apt-key fingerprint 0EBFCD88
                        add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian \$(lsb_release -cs) stable"
                        apt-get update
                        apt-get install docker-ce docker-ce-cli containerd.io    
                    """
                }
            }
        }
        stage('BUILDS'){
            parallel{
                stage('BUILD_FRONT') {
                    environment {
                        applicationName = "lushafrontend"
                        version = "0.0.${BUILD_ID}"
                    }
                    steps{
                        script{
                            withCredentials([usernamePassword(
                                credentialsId: dockerCredentials, 
                                passwordVariable: 'DOCKER_PASS', 
                                usernameVariable: 'DOCKER_USER')]) {
                                    sh """
                                        docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}
                                        docker build -t ${dockerRegistry}/${applicationName}:\$version -f ${WORKSPACE}/${applicationName}/Dockerfile .
                                        docker push ${dockerRegistry}/${applicationName}:\$version
                                    """
                                }
                        }
                    }
                }
                stage('BUILD_BACK') {
                    environment {
                        applicationName = "lushabackend"
                        version = "0.0.${BUILD_ID}"
                    }
                    steps{
                        script{
                            withCredentials([usernamePassword(
                                credentialsId: dockerCredentials, 
                                passwordVariable: 'DOCKER_PASS', 
                                usernameVariable: 'DOCKER_USER')]) {
                                    sh """
                                        pwd
                                        ls -l
                                        docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}
                                        docker build -t ${dockerRegistry}/${applicationName}:\$version -f ${WORKSPACE}/${applicationName}/Dockerfile .
                                        docker push ${dockerRegistry}/${applicationName}:\$version
                                    """
                                }
                        }
                    }
                }

            }
        }
        stage('DEPLOY')
        {
            steps{
                script{
                    sh """
                        mkdir -p app
                        wget -O app/kubectl https://storage.googleapis.com/kubernetes-release/release/v1.19.0/bin/linux/amd64/kubectl
                        wget -O app/helm.tar.gz https://get.helm.sh/helm-v3.2.0-linux-amd64.tar.gz
                        tar zxvf app/helm.tar.gz
                        chmod +x app/kubectl
                        app/kubectl config current-context
                        app/helm upgrade --install --namespace default lusha ./charts/ 
                    """
                }
            }
        }
    }
}