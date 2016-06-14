/**
 * Created by iemam on 02/10/2015.
 */




function config($stateProvider){
    $stateProvider
        .state('datastage.wizard',{
            url: "/wizard",
            templateUrl: "dataStage/wizard/wizard.html",
            controller: "wizardController",
            params:{selFiles: null},
            resolve: {
                loadService:['$ocLazyLoad',function($ocLazyLoad){
                    console.log("parent router...loading service");
                    return $ocLazyLoad.load('dataStage/wizard/wizard-service.js');
                }],
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'dataStage/wizard/wizard-controller.js'
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
            url: '/step_one',
            templateUrl: 'dataStage/wizard/stepOne.html',
            controller: 'stepOneController',
            resolve:{
                loadController:['$ocLazyLoad','loadService',function($ocLazyLoad,loadService){
                    console.log("step one router...loading controller, service:",loadService);
                    return $ocLazyLoad.load(
                        'dataStage/wizard/stepOne-controller.js'
                    );
                }]
            }
        })
        .state('datastage.wizard.step_two', {
            url: '/step_two/:activityId/:datasetId/:fileId',
            controller: 'stepTwoController',
            templateUrl: 'dataStage/wizard/stepTwo.html',
            /*params: {
                file: null
            },*/
            resolve:{
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        /*'lib/plugins/angular-dragdrop/angular-dragdrop.min.js',*/
                        'dataStage/wizard/stepTwo-controller.js'
                    ]);
                }]
            }
        })
        .state('datastage.wizard.step_three', {
            url: '/step_three/:activityId/:datasetId/:standardFileId',
            templateUrl: 'dataStage/wizard/stepThree.html',
            /*params: {
                map: null
            },*/
            controller: 'stepThreeController',
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
                loadController: ['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'dataStage/wizard/stepThree-controller.js'
                    ]);
                }]
            }
        })
        .state('datastage.wizard.step_four', {
            url: '/step_four/:activityId/:datasetId/:standardFileId',
            templateUrl: 'dataStage/wizard/stepFour.html',
            controller: 'stepFourController',
            resolve:{
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'dataStage/wizard/stepFour-controller.js'
                    ]);
                }]
            }
        })
        .state('datastage.wizard.step_five', {
            url: '/step_five/:activityId/:datasetId/:standardFileId',
            templateUrl: 'dataStage/wizard/stepFive.html',
            controller: 'stepFiveController',
            resolve:{
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'dataStage/wizard/stepFive-controller.js'
                    ]);
                }]
            }
        })
        .state('datastage.wizard.step_two.help', {
            url: 'help/',
            templateUrl: 'dataStage/wizard/help.html',
            controller: 'helpController',
            resolve:{
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'dataStage/wizard/help-controller.js'
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
