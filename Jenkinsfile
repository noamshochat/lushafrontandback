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
	if(!(params.CHANGE_LOG_DESCRIPTION?.trim())){
		error "parameter CHANGE_LOG_DESCRIPTION cannot be null, empty or whitespace"
	}
}

def myRepo
pipeline {
	parameters {
        string(name:'COMMIT', defaultValue:'main', description:'branch, tag, commitId')
        extendedChoice(
            type: 'PT_MULTI_SELECT', // for checkboxes switch to - 'PT_CHECKBOX'
            name: 'RUN_STAGES',
            description: '',
            defaultValue: 'BUILD',
			value: 'BUILD,INT',
            multiSelectDelimiter: ',',
            visibleItemCount: 10
        )
    }
	options{
        skipDefaultCheckout true
    }
	environment {
		jslave = "worker-${UUID.randomUUID().toString()}"
		teamName = "noam"
		emailReceipentList = "noamshochat@gmail.com"
		githubRepositoryName = "lushafrontandback"
		devSlaveImage = "devetorodockerregistry.azurecr.io/dotnetcore:2.0.3"  //docker images that contains all needed tools to build and push dockerized apps
		version = "0.0.${BUILD_ID}"
		buildClusterName = "int-aks-we01"
		dockerCredentials = "b947c4d5-08b4-47ff-b87c-b57a538eefe1"
		dockerRegistry ="noamsh"
	}
    agent { label "master" }
    stages{
		stage('BUILD_FRONT'){
			environment {
                applicationName = "lushafrontend"
			}
			steps {
				script{
					podTemplate(label: jslave , cloud : buildClusterName , containers: [
					containerTemplate(name: 'slave', image: devSlaveImage, command: 'cat', ttyEnabled: true)
					],
					volumes: [
					hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
					])
					{
						node( "${jslave}" ) {
							container('slave'){
								myRepo = checkout([$class: 'GitSCM', 
								branches: [[name: params.COMMIT]], 
								doGenerateSubmoduleConfigurations: false, 
								extensions: [], 
								submoduleCfg: [], 
								userRemoteConfigs: [[							
								url: "https://github.com/noamshochat/${githubRepositoryName}.git"]]])

								def gitCommit = myRepo.GIT_COMMIT
								def gitBranch = myRepo.GIT_BRANCH

								withCredentials([usernamePassword(
									credentialsId: dockerCredentials, 
									passwordVariable: 'DOCKER_PASS', 
									usernameVariable: 'DOCKER_USER')]) {
										sh """
											docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}
										"""
										}
								sh """
									version='${version}'
									ls -l 
                                    docker build -t ${dockerRegistry}/${applicationName}:\$version -f ${WORKSPACE}/${applicationName}/Dockerfile .
                                    docker push ${dockerRegistry}/${applicationName}:\$version 
                                """
							}
						}
					}
				}
			}
		}
		stage('BUILD_BACK'){
			environment {
				applicationName = "lushabackend"
			}
			steps {
				script{
					podTemplate(label: jslave , cloud : buildClusterName , containers: [
					containerTemplate(name: 'slave', image: devSlaveImage, command: 'cat', ttyEnabled: true)
					],
					volumes: [
					hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
					])
					{
						node( "${jslave}" ) {
							container('slave'){
								myRepo = checkout([$class: 'GitSCM', 
								branches: [[name: params.COMMIT]], 
								doGenerateSubmoduleConfigurations: false, 
								extensions: [], 
								submoduleCfg: [], 
								userRemoteConfigs: [[							
								url: "https://github.com/noamshochat/${githubRepositoryName}.git"]]])

								def gitCommit = myRepo.GIT_COMMIT
								def gitBranch = myRepo.GIT_BRANCH

								withCredentials([usernamePassword(
									credentialsId: dockerCredentials, 
									passwordVariable: 'DOCKER_PASS', 
									usernameVariable: 'DOCKER_USER')]) {
										sh """
											docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}
										"""
										}
								sh """
									version='${version}'
									ls -l 
									docker build -t ${dockerRegistry}/${applicationName}:\$version -f ${WORKSPACE}/${applicationName}/Dockerfile .
									docker push ${dockerRegistry}/${applicationName}:\$version 
								"""
							}
						}
					}
				}
			}
		}
		stage('DEPLOY'){
			steps {
				script{ 
                    sh """
					    helm upgrade --install --namespace noam lusha ./charts/ 
                    """
				}
			}
		}
	}
}
		
