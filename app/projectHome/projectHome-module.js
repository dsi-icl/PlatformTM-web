function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('project', {
            abstract: true,
            url: "/projects/{projectId}",
            templateUrl: "projectHome/projectContent.html",
            controller: "ProjectHomeCtrl as vm",
            resolve: {
                /*loadDirective: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'dataStage/fileManager/file-directive.js'
                    ]);
                }],*/
                loadDependency: ['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            serie: true,
                            files: [
                                'explore/clinical/css/clinicalDataTree.css','projectHome/project-service.js','projectHome/project-controller.js'
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
        .state('project.home', {
            url: "/main",
            templateUrl: "projectHome/projectMain.html",
            controller: "ProjectSummaryCtrl as vm",
            resolve: {
                /*loadDirective: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'dataStage/fileManager/file-directive.js'
                    ]);
                }],*/
                loadDependency: ['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            serie: true,
                            files: [
                                'projectHome/projectSummary-controller.js'
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
    .module('bioSpeak.projectHome', [])
    .config(config)