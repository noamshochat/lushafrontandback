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
}