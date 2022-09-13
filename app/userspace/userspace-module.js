function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('userspace', {
            abstract: true,
            //url: "/{projectId}",
            templateUrl: "layout/content.html"
        })
        .state('userspace.datasets', {
            url: "/userspace",
            templateUrl: "userspace/dataset-list.html",
            controller: "UserspaceCtrl as vm",
            resolve: {
                loadDependency: ['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            serie: true,
                            files: [
                                'userspace/userspace-service.js','userspace/userspace-controller.js'
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
    .module('bioSpeak.userspace', [])
    .config(config)