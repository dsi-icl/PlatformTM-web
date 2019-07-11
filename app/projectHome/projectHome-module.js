function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        // .state('projects',{
        //     url: "/projects",
        //     templateUrl: "home/content.html",
        //     controller: "ProjectsCtrl as projectsVM",
        // })
        .state('project', {
            abstract: true,
            url: "/projects/{projectId}",
            templateUrl: "projectHome/projectContent.html",
            controller: "ProjectHomeCtrl as projVM",
            resolve: {
                loadDependency: ['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            serie: true,
                            files: [
                                'explore/clinical/css/clinicalDataTree.css','projectHome/project-service.js','projectHome/project-controller.js'
                            ]
                        }
                    )
                }]
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
                }]
            }
        })
        .state('project.403', {
            url: "/restrictedaccess",
            templateUrl: "projectHome/403.html"//,
            //controller: "ProjectSummaryCtrl as vm",
            // resolve: {
            //     loadDependency: ['$ocLazyLoad',function($ocLazyLoad){
            //         return $ocLazyLoad.load(
            //             {
            //                 serie: true,
            //                 files: [
            //                     'projectHome/projectSummary-controller.js'
            //                 ]
            //             }
            //         )
            //     }]
            // }
        })
}

angular
    .module('bioSpeak.projectHome', [])
    .config(config)