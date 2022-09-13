function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('project.datasets', {
            abstract: true,
            //url: "/{projectId}",
            templateUrl: "admin/project/adminContent.html",
            resolve: {
                loadDependency: ['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            serie: true,
                            files: [
                                'datasets/dataset-service.js', 'projectHome/project-service.js'
                            ]
                        }
                    )
                }]
            }
        })
        .state('project.datasets.list', {
            url: "/datasets",
            templateUrl: "datasets/dataset-list.html",
            controller: "DatasetListCtrl as vm",
            resolve: {
                loadDependency: ['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            serie: true,
                            files: [
                                'datasets/datasetList-controller.js'
                            ]
                        }
                    )
                }]
            }

        })
        .state('project.datasets.dataset',{
            url:"/datasets/{datasetId}",
            templateUrl: "datasets/dataset.html",
            controller:"DatasetCtrl as vm2",
            resolve: {
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'datasets/dataset-controller.js'
                    ]);
                }],
                loadPlugin: ['$ocLazyLoad',function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'lib/plugins/steps/jquery.steps.css','lib/plugins/iCheck/custom.css','lib/plugins/iCheck/icheck.min.js'
                    ]);
                }]
            }
        })
        .state('project.datasets.file',{
            url:"/datasets/{datasetId}/files/{fileId}",
            templateUrl: "datasets/file.html",
            controller:"datasetFileController as vm",
            resolve: {
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'datasets/file-controller.js'
                    ]);
                }],
                loadService:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load('dataStage/loadingWizard/loadingWizard-service.js');
                }],
                loadPlugin: ['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['lib/plugins/dataTables/js/jquery.dataTables.min.js',
                                'lib/plugins/dataTables/css/datatables.bootstrap.min.css']
                        }/*,
                         {
                         serie: true,
                         files: ['lib/plugins/dataTables/js/dataTables.bootstrap.js']
                         }*/,
                        {
                            name: 'datatables',
                            serie: true,
                            files: ['lib/plugins/dataTables/js/angular-datatables.min.js',
                                'lib/plugins/dataTables/js/angular-datatables.bootstrap.min.js',
                                'lib/plugins/dataTables/js/angular-datatables.buttons.min.js',
                                'lib/plugins/dataTables/css/angular-datatables.min.css']
                        }
                    ]);
                }]
            }
        })
}

angular
    .module('bioSpeak.datasets', [])
    .config(config)