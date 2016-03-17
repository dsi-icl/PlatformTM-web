/**
 * Created by iemam on 10/09/2015.
 */


function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('export', {
            abstract: true,
            url: "/{studyId}/export",
            templateUrl: "layout/content.html"
        })
        .state('export.datasets', {
            url: "/datasets",
            templateUrl: "export/dataset/dataset-list.html",
            controller: "datasetCtrl as vm"/*,
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

        .state('export.wizard',{
            url: "/datasets/{datasetId}/wizard",
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
                            'lib/plugins/ionRangeSlider/css/ion.rangeSlider.skinSimple.css',
                            'lib/plugins/ionRangeSlider/js/ion.rangeSlider.min.js',
                            'layout/directives/ionRangeSlider.js',
                            'lib/plugins/ui-select/js/select.min.js', 'lib/plugins/ui-select/css/select.css'
                        ]
                    });
                }]
            }
        })

        .state('export.wizard.fields', {
            url: '/1-fields',
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
        .state('export.wizard.filters', {
            url: '/2-filters',
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

        .state('export.wizard.preview',{
            url: '/3-preview',
            templateUrl: 'export/datasetBuilder/stepThree.html',
            controller: 'stepThreeControllerM as step3vmm',
            abstract:true
        })
        .state('export.wizard.preview.table', {
            url: '/table',
            templateUrl: 'export/datasetBuilder/stepThree-table.html',
            controller: 'stepThreeController as step3vm',
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

        .state('export.wizard.preview.tree', {
            url: '/tree',
            templateUrl: 'export/datasetBuilder/stepThree-tree.html',
            controller: 'stepThreeTreeController as step3TreeVM',
            resolve:{
                //loadPlugin: ['$ocLazyLoad',function($ocLazyLoad){
                //    return $ocLazyLoad.load([
                //        {
                //            serie: true,
                //            files: ['lib/plugins/dataTables/js/jquery.dataTables.js',
                //                'lib/plugins/jstree/js/jstree.min.js',
                //                'lib/plugins/ngJsTree/js/ngJsTree.js']
                //        }
                //    ]);
                //}],
                loadController: ['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'export/datasetBuilder/stepThreeTree-controller.js'
                    ]);
                }]
            }
        })

        .state('export.wizard.info', {
            url: '/4-info',
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
