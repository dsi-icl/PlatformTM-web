function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('datasets', {
            abstract: true,
            //url: "/{projectId}",
            templateUrl: "layout/content.html"
        })
        .state('datasets.list', {
            url: "/datasets",
            templateUrl: "datasets/dataset-list.html",
            controller: "DatasetCtrl as vm",
            resolve: {
                loadDependency: ['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            serie: true,
                            files: [
                                'datasets/dataset-service.js','datasets/dataset-controller.js'
                            ]
                        }
                    )
                }]/*,
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie:true,
                            files: ['lib/plugins/iCheck/custom.css','lib/plugins/ngSweetAlert/css/sweetalert.css',
                                'lib/plugins/iCheck/icheck.min.js',
                                'lib/plugins/angular-xeditable/js/xeditable.min.js',
                                'lib/plugins/angular-xeditable/css/xeditable.css',
                                'lib/plugins/ngSweetAlert/js/sweetalert.min.js',
                                'lib/plugins/ngSweetAlert/js/ngSweetAlert.min.js']
                        }
                    ]);
                }*/
            }
        })
}

angular
    .module('bioSpeak.datasets', [])
    .config(config)