/**
 * Created by iemam on 10/09/2015.
 */


function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('datastage', {
            abstract: true,
            url: "/{studyId}",
            templateUrl: "layout/content.html"
        })
        .state('datastage.files', {
            url: "/datastage/files/{dir:[a-zA-Z /]*}",
            templateUrl: "datastage/fileManager/fileManager.html",
            controller: "fileController as vm",
            resolve: {
                loadDirective: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'dataStage/fileManager/file-directive.js'
                    ]);
                }],
                loadDependency: ['$ocLazyLoad',function($ocLazyLoad){
                   return $ocLazyLoad.load(
                       {
                           serie: true,
                           files: ['dataStage/fileManager/fileManager-service.js',
                               'dataStage/fileManager/fileManager-controller.js'
                           ]
                       }
                   )
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['lib/plugins/iCheck/custom.css', 'lib/plugins/iCheck/icheck.min.js']
                        }
                    ]);
                }
            }
        })

        //.state('datastage.files.list', {
        //    url: "/{dir}",
        //    templateUrl: "dataStage/fileManager/fileList.html",
        //    controller : "fileListController as fileListCtrl",
        //    resolve: {
        //        loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
        //            return $ocLazyLoad.load([
        //                'dataStage/fileManager/fileList-controller.js'
        //            ]);
        //        }]
        //    }
        //})

        .state('datastage.files.view', {
            url: "/view/{fileId}",
            templateUrl: "dataStage/fileManager/fileViewer.html",
            controller : "fileViewController",
            resolve: {
                loadPlugin: ['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['lib/plugins/dataTables/js/jquery.dataTables.js',
                                'lib/plugins/dataTables/css/dataTables.bootstrap.css',
                                'lib/plugins/dataTables/css/dataTables.tableTools.css']
                        },
                        {
                            serie: true,
                            files: ['lib/plugins/dataTables/js/dataTables.bootstrap.js',
                                'lib/plugins/dataTables/js/dataTables.tableTools.js']
                        },
                        {
                            name: 'datatables',
                            serie: true,
                            files: ['lib/plugins/dataTables/js/angular-datatables.min.js',
                                'lib/plugins/dataTables/js/angular-datatables.tabletools.js']
                        }
                    ]);
                }],
                loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'dataStage/fileManager/fileViewer-controller.js'
                    ]);
                }]
            }
        })

        .state("datastage.upload", {
            url: "/upload/{dir}",
            onEnter: ['$stateParams', '$state', '$modal', 'fileService',function($stateParams, $state, $modal, fileService) {
                $modal.open({
                    templateUrl: "dataStage/upload/upload.html",
                    resolve: {
                        loadController:['$ocLazyLoad',function($ocLazyLoad){
                            return $ocLazyLoad.load([
                                'dataStage/upload/upload-controller.js'
                            ]);
                        }]
                    },
                    controller: 'uploadController'
                }).result.finally(function($stateParams) {
                        fileService.getFiles()
                            .then(function(data){
                                //vm.files = data.files;
                                //console.log(data)
                                //$scope.vm = vm;
                            $state.go('datastage.files',{studyId:$stateParams.studyId, dir:$stateParams.dir})
                            })
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                        $state.go('^');
                    });

            }]
        });

        /*.state('datastage.wizard',{
         url: "/wizard",
         templateUrl: "/import_wizard.html",
         controller: "/wizard/importController"//,
         /!*resolve: {
         loadPlugin: function ($ocLazyLoad) {
         return $ocLazyLoad.load([
         {
         files: ['lib/plugins/iCheck/custom.css','lib/plugins/iCheck/icheck.min.js']
         }
         ]);
         }
         }*!/
         })

         .state('datastage.wizard.step_one', {
         url: '/step_one',
         templateUrl: '/step_one.html'/!*,
         data: { pageTitle: 'Wizard form' }*!/
         })
         .state('wizard.step_two', {
         url: '/step_two',
         templateUrl: '/step_two.html'/!*,
         data: { pageTitle: 'Wizard form' }*!/
         })
         .state('wizard.step_three', {
         url: '/step_three',
         templateUrl: '/step_three.html'/!*,
         data: { pageTitle: 'Wizard form' }*!/
         })*/




}

angular
    .module('bioSpeak.DataStager', ['ngResource','angularFileUpload'])
    .config(config)
