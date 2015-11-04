/**
 * Created by iemam on 21/01/2015.
 */
// create our angular app and inject ngAnimate and ui-router
// =============================================================================
angular.module('eTRIKSdata.loader', ['ngAnimate','angularFileUpload'])

// configuring our routes
// =============================================================================
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

            // route to show our basic form (/form)
            .state('loader', {
                url: '/loader',
                templateUrl: '/form.html',
                controller: 'UploadController'
            })

            // nested states
            // each of these sections will have their own view
            // url will be nested (/form/profile)
            .state('loader.uploadFiles', {
                url: '/uploadFiles',
                templateUrl: '/loader-uploadFiles.html'
            })

            // url will be /form/interests
            .state('loader.dbLoad', {
                url: '/DBload',
                templateUrl: '/loader-dbLoad.html',
                controller: 'loadToDBcontroller'
            })

            // url will be /form/payment
            .state('loader.payment', {
                url: '/payment',
                templateUrl: '/form-payment.html'
            });

        // catch all route
        // send users to the form page
        //$urlRouterProvider.otherwise('/form/profile');
    })

// our controller for the form
// =============================================================================
    .controller('UploadController',['$scope', 'FileUploader', function($scope, FileUploader) {
        var uploader = $scope.uploader = new FileUploader({
            url: 'http://rachmaninoff.local:8080/api/FileUpload'
        });

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

        console.info('uploader', uploader);


    }])

    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);