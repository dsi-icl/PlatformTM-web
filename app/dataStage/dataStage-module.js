/**
 * Created by iemam on 10/09/2015.
 */


function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('project.drive', {
            url: "/drive/{dirId}",
            abstract:true,
            templateUrl: "dataStage/fileManager/fileManager.html",
            controller: "driveController as driveVM",
            // data: {
            //     requiresAuthentication: true,
            //     permissions: ["can-view-drive"]
            // },
            resolve: {
                loadDirective: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'dataStage/fileManager/file-directive.js'
                    ]);
                }],
                loadDependency: ['$ocLazyLoad', function ($ocLazyLoad) {
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
                            serie: true,
                            files: ['lib/plugins/iCheck/custom.css', 'lib/plugins/ngSweetAlert/css/sweetalert.css',
                                'lib/plugins/iCheck/icheck.min.js',
                                'lib/plugins/angular-xeditable/js/xeditable.min.js',
                                'lib/plugins/angular-xeditable/css/xeditable.css',
                                'lib/plugins/ngSweetAlert/js/sweetalert.min.js',
                                'lib/plugins/ngSweetAlert/js/ngSweetAlert.min.js']
                        }
                    ]);
                }
            }
        })
        .state('project.drive.files',{
            url: "",
            templateUrl: "dataStage/fileManager/content.html",
            controller: "driveContentCtrl as contentVM",
            resolve: {
                loadDependency: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                    serie: true,
                    files: ['dataStage/fileManager/content-controller.js']
                    })
                }]
            }
        })

        .state('project.drive.view', {
            url: "/view/{fileId}",
            templateUrl: "dataStage/fileManager/fileViewer.html",
            controller: "fileViewController as viewerVM",
            resolve: {
                loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['lib/plugins/dataTables/js/jquery.dataTables.js',
                                'lib/plugins/dataTables/css/datatables.bootstrap.min.css']
                        },
                        {
                            name: 'datatables',
                            serie: true,
                            files: ['lib/plugins/dataTables/js/angular-datatables.min.js',
                                'lib/plugins/dataTables/js/angular-datatables.bootstrap.min.js',
                                'lib/plugins/dataTables/js/angular-datatables.buttons.min.js',
                                'lib/plugins/dataTables/css/angular-datatables.min.css']
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

        .state("project.drive.upload", {
            url: "/upload/{dirId}",
            permissions: ["can-upload"],
            onEnter: ['$stateParams', '$state', '$uibModal', 'fileService', function ($stateParams, $state, $uibModal, fileService) {
                $uibModal.open({
                    templateUrl: "dataStage/upload/upload.html",
                    resolve: {
                        loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    files: ['lib/plugins/angular-file-upload/angular-file-upload.min.js']
                                }
                            ])
                        }],
                        loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'dataStage/upload/upload-controller.js'
                            ]);
                        }]
                    },
                    controller: 'uploadController'
                }).result.finally(function ($stateParams) {
                    fileService.getFiles()
                        .then(function (data) {
                            $state.go('project.drive', {projectId: $stateParams.projectId, dirId: $stateParams.dirId})
                        })
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                    $state.go('^');
                });

            }]
        })


        /*.state('project.drive', {
            url: "/datastage/files/{dirId}",
            views: {
                '': {
                    templateUrl: "dataStage/fileManager/fileManager.html",
                    controller: "fileController as driveVM",
                    data: {
                        requiresAuthentication: true,
                        permissions: ["can-view-drive"]
                    },
                    resolve: {
                        loadDirective: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'dataStage/fileManager/file-directive.js'
                            ]);
                        }],
                        loadDependency: ['$ocLazyLoad', function ($ocLazyLoad) {
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
                                    serie: true,
                                    files: ['lib/plugins/ngSweetAlert/css/sweetalert.css',
                                        'lib/plugins/angular-xeditable/js/xeditable.min.js',
                                        'lib/plugins/angular-xeditable/css/xeditable.css',
                                        'lib/plugins/ngSweetAlert/js/sweetalert.min.js',
                                        'lib/plugins/ngSweetAlert/js/ngSweetAlert.min.js']
                                }
                            ]);
                        }
                    }
                },
                // 'content@project.drive': {
                //     templateUrl: 'dataStage/fileManager/contentViewer.html',
                //     controller: 'driveContentCtrl as contentVM',
                //     resolve: {
                //         loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                //             return $ocLazyLoad.load('dataStage/fileManager/contentViewer-controller.js');
                //         }]/!*,
                //         loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                //             return $ocLazyLoad.load('explore/subjects/subjects-controller.js');
                //         }]*!/
                //     }
                // }

            }
        });*/
}


angular
    .module('bioSpeak.DataStager', ['ngResource'])
    .config(config)
