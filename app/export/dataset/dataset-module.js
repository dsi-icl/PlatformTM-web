/**
 * Created by iemam on 10/09/2015.
 */


function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('datasets', {
            abstract: true,
            url: "/{studyId}",
            templateUrl: "layout/content.html"
        })
        .state('datasets.test', {
            url: "/datasets/dataview",
            templateUrl: "export/dataset/dataView.html",
            controller: "datasetCtrl"/*,
             resolve: {
             loadPlugin: function ($ocLazyLoad) {
             return $ocLazyLoad.load([
             {
             insertBefore: '#loadBefore',
             files: ['lib/jstree/jstree.js', '/lib/jstree/themes/default/style.min.css']
             }
             ]);
             },
             loadDependency: ['$ocLazyLoad',function($ocLazyLoad){
             return $ocLazyLoad.load(
             {

             files: ['lib/ngJsTree/ngJsTree.js'
             ]
             }
             )
             }]
             /!*loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
             return $ocLazyLoad.load([

             ]);
             }],
             loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
             return $ocLazyLoad.load([
             'dataStage/fileManager/fileManager-controller.js'
             ]);
             }],*!/

             }*/
        })

        .state('datasets.wizard',{
            url: "/export/datasets/{datasetId}/",
            templateUrl: "export/datasetBuilder/wizard.html",
            controller: "wizardController",
            //params:{selFiles: null},
            resolve: {
                loadService:['$ocLazyLoad',function($ocLazyLoad){
                    console.log("parent router...loading service");
                    return $ocLazyLoad.load('export/datasetBuilder/wizard-service.js');
                }],
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'export/datasetBuilder/wizard-controller.js'
                    ]);
                }],
                loadPlugin: ['$ocLazyLoad',function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        serie:true,
                        files: ['lib/plugins/steps/jquery.steps.css','lib/plugins/iCheck/custom.css','lib/plugins/iCheck/icheck.min.js',
                            'lib/plugins/jstree/js/jstree.js',
                            'lib/plugins/ngJsTree/js/ngJsTree.js',
                            'lib/plugins/jstree/css/themes/default/style.css',
                            'lib/plugins/ionRangeSlider/css/ion.rangeSlider.css',
                            'lib/plugins/ionRangeSlider/css/ion.rangeSlider.skinNice.css',
                            'lib/plugins/ionRangeSlider/js/ion.rangeSlider.min.js',
                            'layout/directives/ionRangeSlider.js',
                            'lib/plugins/ui-select/js/select.min.js', 'lib/plugins/ui-select/css/select.css'
                        ]
                    });
                }]
            }
        })

        .state('datasets.wizard.step_one', {
            url: '/step_one',
            templateUrl: 'export/datasetBuilder/stepOne.html',
            controller: 'stepOneController as fldCtrl',
            resolve:{

            loadDependency: ['$ocLazyLoad',function($ocLazyLoad){
                return $ocLazyLoad.load(
                    {
                        serie:true,
                        files: [
                            'export/datasetBuilder/stepOne-controller.js']
                    }
                )
            }]/*,
                loadController:['$ocLazyLoad','loadService',function($ocLazyLoad,loadService){
                    console.log("step one router...loading controller, service:",loadService);
                    return $ocLazyLoad.load(

                    );
                }]*/
            }
        })
        .state('datasets.wizard.step_two', {
            url: '/step_two/:activityId/:datasetId/:fileId',
            controller: 'stepTwoController as step2vm',
            templateUrl: 'export/datasetBuilder/stepTwo.html',
            resolve:{
                loadPlugin:['$ocLazyLoad',function($ocLazyLoad){
                   return $ocLazyLoad.load([
                       {
                           name: 'nouislider',
                           serie: true,
                           files: [
                               'export/datasetBuilder/stepTwo-controller.js']
                       }

                   ])
                }]
            }
        })
        .state('datasets.wizard.step_three', {
            url: '/step_three/:activityId/:datasetId/:standardFileId',
            templateUrl: 'export/datasetBuilder/stepThree.html',
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
                        'export/datasetBuilder/stepThree-controller.js'
                    ]);
                }]
            }
        })
        .state('datasets.wizard.step_four', {
            url: '/step_four/:activityId/:datasetId/:standardFileId',
            templateUrl: 'export/datasetBuilder/stepFour.html',
            controller: 'stepFourController as step4vm',
            resolve:{
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'export/datasetBuilder/stepFour-controller.js'
                    ]);
                }]
            }
        })
        /*.state('datasets.wizard.step_five', {
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
        .state('datasets.wizard.step_two.help', {
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
        })*/






}

angular
    .module('bioSpeak.export',[])
    .config(config)
