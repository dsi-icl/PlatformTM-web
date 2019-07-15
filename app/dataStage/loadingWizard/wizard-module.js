/**
 * Created by iemam on 02/10/2015.
 */

function config($stateProvider){
    $stateProvider
        .state('loader',{
            abstract:true,
            url:'/project/{projectId}/load',
            templateUrl:'layout/noNavContent.html',
            controller: "loaderController as vm",
            resolve: {
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'dataStage/loadingWizard/loader-controller.js'
                    ]);
                }]
            }
        })
        .state('loader.wizard',{
            url: "/wizard/:fileId",
            templateUrl: "dataStage/loadingWizard/loadingWizard.html",
            controller: "wizardController as wzCtrl",
            resolve: {
                loadService:['$ocLazyLoad',function($ocLazyLoad){
                    console.log("parent router...loading service");
                    return $ocLazyLoad.load('dataStage/loadingWizard/loadingWizard-service.js');
                }],
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'dataStage/loadingWizard/loadingWizard-controller.js'
                    ]);
                }],
                loadPlugin: ['$ocLazyLoad',function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'lib/plugins/steps/jquery.steps.css','lib/plugins/iCheck/custom.css','lib/plugins/iCheck/icheck.min.js'
                    ]);
                }]
            }
        })

        .state('loader.wizard.step_one', {
            url: '/chooseActivity',
            templateUrl: 'dataStage/loadingWizard/stepOne.html',
            controller: 'stepOneController as step1Ctrl',
            resolve:{
                loadController:['$ocLazyLoad','loadService',function($ocLazyLoad,loadService){
                    console.log("step one router...loading controller, service:",loadService);
                    return $ocLazyLoad.load(
                        'dataStage/loadingWizard/stepOne-controller.js'
                    );
                }]
            }
        })
        .state('loader.wizard.step_two', {
            url: '/mapping/:activityId/:datasetId/:fileId',
            controller: 'stepTwoController as step2Ctrl',
            templateUrl: 'dataStage/loadingWizard/stepTwo.html',
            resolve:{
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'dataStage/loadingWizard/stepTwo-controller.js'
                    ]);
                }]
            }
        })
        .state('loader.wizard.step_three', {
            url: '/preview/:activityId/:datasetId/:fileId',
            templateUrl: 'dataStage/loadingWizard/stepThree.html',
            controller: 'stepThreeController as step3Ctrl',
            resolve: {
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
                }],
                loadController: ['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'dataStage/loadingWizard/stepThree-controller.js'
                    ]);
                }]
            }
        })
        .state('loader.wizard.step_four', {
            url: '/validate/:activityId/:datasetId/:fileId',
            templateUrl: 'dataStage/loadingWizard/stepFour.html',
            controller: 'stepFourController as step4Ctrl',
            resolve:{
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'dataStage/loadingWizard/stepFour-controller.js'
                    ]);
                }]
            }
        })
        .state('loader.wizard.step_five', {
            url: '/load/:activityId/:datasetId/:fileId',
            templateUrl: 'dataStage/loadingWizard/stepFive.html',
            controller: 'stepFiveController as step5Ctrl',
            resolve:{
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'dataStage/loadingWizard/stepFive-controller.js'
                    ]);
                }]
            }
        })
        .state('loader.wizard.step_two.help', {
            url: 'help/',
            templateUrl: 'dataStage/loadingWizard/help.html',
            controller: 'helpController',
            resolve:{
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'dataStage/loadingWizard/help-controller.js'
                    ]);
                }]
            }
        })

}


angular
    .module('bioSpeak.import', ['bioSpeak.layout','oc.lazyLoad','ngDragDrop'])
    .config(config);