'use strict'
    function uploadController($scope,$state, $stateParams, FileUploader, $uibModalInstance, ngAppConfig, userSession){

        var serviceBase = ngAppConfig.apiServiceBaseUri;
        var projectId = $stateParams.projectId;


        var uploader = $scope.uploader = new FileUploader({
            url: serviceBase+'files/projects/'+projectId+'/upload/'+$stateParams.dirId
        });
        // var authData = localStorageService.get('authorizationTFAData');
        // if (authData) {
        //     uploader.headers["Authorization"] = "Bearer " + authData.token;
        // }
        var token = userSession.getAccessToken();
        if (token) {
            uploader.headers.Authorization = 'Bearer ' + token;
        }

        $scope.ok = function () {

            $uibModalInstance.close();
            $state.go('project.drive.files',{dirId:$stateParams.dirId});
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $state.go('project.drive.files',{dirId:$stateParams.dirId});
        };

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });





        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        // console.info('uploader', uploader);
    }

    angular.module('bioSpeak.DataStager')
        .controller('uploadController',['$scope','$state','$stateParams','FileUploader','$uibModalInstance','ngAppConfig','userSession',uploadController])


