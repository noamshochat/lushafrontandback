node {
   	properties([[$class: 'JiraProjectProperty'], buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '30', numToKeepStr: '100')), [$class: 'RebuildSettings', autoRebuild: false, rebuildDisabled: false], parameters([string(defaultValue: '', description: 'Mandatory', name: 'CHANGE_LOG_DESCRIPTION', trim: false)]), [$class: 'JobLocalConfiguration', changeReasonComment: '']])
   	wrap([$class: 'BuildUser']) {
        USER = "${BUILD_USER}"
        USER_ID = "${BUILD_USER_ID}"
        println "USER: ${USER}"
        //Removing user id domain name if exists 
        if(USER_ID.contains("@")){
            (USER_ID, value) = USER_ID.split("@")
        }
        USER_EMAIL = "${BUILD_USER_EMAIL}"
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
        dockerCredentials = "10cb75a2-5369-4a88-99f3-ddd4dc23c3b1"
        dockerRegistry = "noamsh"
    }
    agent { label "master" }
    stages{
        stage('BUILD_FRONT') {
            environment {
                applicationName = "lushafrontend"
                version = "0.0.${BUILD_ID}"
            }
            myRepo = checkout([$class: 'GitSCM', 
            branches: [[name: params.COMMIT]], 
            doGenerateSubmoduleConfigurations: false, 
            extensions: [], 
            submoduleCfg: [], 
            userRemoteConfigs: [[
            credentialsId: githubCredentials, 
            url: "https://github.com/noamshochat/${githubRepositoryName}.git"]]])

            def gitCommit = myRepo.GIT_COMMIT
            def gitBranch = myRepo.GIT_BRANCH

            withCredentials([usernamePassword(
                credentialsId: dockerCredentials, 
                passwordVariable: 'DOCKER_PASS', 
                usernameVariable: 'DOCKER_USER')]) {
                    sh """
                        docker login -u ${DOCKER_USER} -p ${DOCKER_PASS} ${dockerRegistry}
                        docker build -t ${dockerRegistry}/:\$version -f ${WORKSPACE}/${applicationName}/Dockerfile .
                        docker push ${dockerRegistry}/${applicationName}:\$version
                    """
                    }
        }
    }
}