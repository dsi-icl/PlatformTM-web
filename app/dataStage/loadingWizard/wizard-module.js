/**
 * Created by iemam on 02/10/2015.
 */




function config($stateProvider){
    $stateProvider
        .state('datastage.wizard',{
            url: "/wizard/:fileId",
            templateUrl: "dataStage/loadingWizard/loadingWizard.html",
            controller: "wizardController",
            //params:{selFiles: null},
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

        .state('datastage.wizard.step_one', {
            url: '/chooseActivity',
            templateUrl: 'dataStage/loadingWizard/stepOne.html',
            controller: 'stepOneController',
            resolve:{
                loadController:['$ocLazyLoad','loadService',function($ocLazyLoad,loadService){
                    console.log("step one router...loading controller, service:",loadService);
                    return $ocLazyLoad.load(
                        'dataStage/loadingWizard/stepOne-controller.js'
                    );
                }]
            }
        })
        .state('datastage.wizard.step_two', {
            url: '/mapping/:activityId/:datasetId/:fileId',
            controller: 'stepTwoController',
            templateUrl: 'dataStage/loadingWizard/stepTwo.html',
            /*params: {
                file: null
            },*/
            resolve:{
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        /*'lib/plugins/angular-dragdrop/angular-dragdrop.min.js',*/
                        'dataStage/loadingWizard/stepTwo-controller.js'
                    ]);
                }]
            }
        })
        .state('datastage.wizard.step_three', {
            url: '/preview/:activityId/:datasetId/:fileId',
            templateUrl: 'dataStage/loadingWizard/stepThree.html',
            /*params: {
                map: null
            },*/
            controller: 'stepThreeController',
            resolve: {
                loadPlugin: ['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['lib/plugins/dataTables/js/jquery.dataTables.min.js',
                                'lib/plugins/dataTables/css/dataTables.bootstrap.min.css']
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
        .state('datastage.wizard.step_four', {
            url: '/step_four/:activityId/:datasetId/:fileId',
            templateUrl: 'dataStage/loadingWizard/stepFour.html',
            controller: 'stepFourController',
            resolve:{
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'dataStage/loadingWizard/stepFour-controller.js'
                    ]);
                }]
            }
        })
        .state('datastage.wizard.step_five', {
            url: '/step_five/:activityId/:datasetId/:fileId',
            templateUrl: 'dataStage/loadingWizard/stepFive.html',
            controller: 'stepFiveController',
            resolve:{
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'dataStage/loadingWizard/stepFive-controller.js'
                    ]);
                }]
            }
        })
        .state('datastage.wizard.step_two.help', {
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

/*function stepTwoController($scope){

    //importService.getSomething
    $scope.fileMatched = false;
    console.log($scope);
}*/





angular
    .module('bioSpeak.import', ['bioSpeak.layout','oc.lazyLoad','ngDragDrop'])
    .config(config)
    /*.constant('ngAPISettings', {
        apiServiceBaseUri: 'http://rachmaninoff.local:8080/'
        //apiServiceBaseUri: 'http://ehs.biospeak.solutions/sandbox/'
    });*/
    //.controller('stepTwoController',['$scope',stepTwoController]);
