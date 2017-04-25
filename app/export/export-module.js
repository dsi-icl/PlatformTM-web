/**
 * Created by iemam on 10/09/2015.
 */


function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('export', {
            abstract: true,
            url: "/{projectId}/export",
            templateUrl: "layout/content.html",
            resolve: {
                loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    // console.log("loading service");
                    return $ocLazyLoad.load('export/export-service.js');
                }]
            }
        })
        .state('export.datasets', {
            url: "/mydatasets",
            templateUrl: "export/export-list.html",
            controller: "exportListCtrl as vm",
            resolve: {
                 loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                     // console.log("loading service");
                     return $ocLazyLoad.load('export/export-service.js');
                 }],
                 loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load(['export/exportList-controller.js'])
                 }]
             }
        })
        .state('export.datasets.preview',{
            url:"/mydatasets/{datasetId}/download",
            controller: 'previewController as prevCtrl',
            templateUrl: 'export/dataset/preview.html',
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
                        'export/dataset/preview-controller.js'
                    ]);
                }]
            }
        })

        .state('export.wizard',{
            url: "/mydatasets/{datasetId}",
            templateUrl: "export/dataset/dataset.html",
            controller: "datasetController as parentCtrl",
            //params:{selFiles: null},
            resolve: {
                // loadService:['$ocLazyLoad',function($ocLazyLoad){
                //     console.log("parent router...loading service");
                //     return $ocLazyLoad.load('export/wizard-service.js');
                // }],
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'export/dataset/dataset-controller.js'
                    ]);
                }],
                /*loadDirective:['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(['export/dataTreeDraggable.js'])
                }],*/
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
                            'lib/plugins/ui-select/js/select.min.js',
                            'lib/plugins/ui-select/css/select.css',
                            'lib/plugins/angular-dragdrop/angular-dragdrop.min.js'
                        ]
                    });
                }]
            }
        })

        .state('export.wizard.fields', {
            url: '/1-fields',
            templateUrl: 'export/dataset/fields.html',
            controller: 'stepOneController as fldCtrl',
            resolve:{
                loadDependency: ['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            serie:true,
                            files: [
                                'export/dataset/fields-controller.js']
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
            controller: 'stepTwoController as filterCtrl',
            templateUrl: 'export/dataset/filters.html',
            resolve:{
                loadPlugin:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        {
                            name: 'nouislider',
                            serie: true,
                            files: [
                                'export/dataset/filters-controller.js']
                        }

                    ])
                }]
            }
        })
        .state('export.wizard.preview', {
            url: '/3-preview',
            templateUrl: 'export/dataset/preview.html',
            controller: 'previewController as prevCtrl',
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
                        'export/dataset/preview-controller.js'
                    ]);
                }]
            }
        })

        .state('export.wizard.preview.tree', {
            url: '/tree',
            templateUrl: 'export/dataset/stepThree-tree.html',
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
                        'export/dataset/stepThreeTree-controller.js'
                    ]);
                }]
            }
        })

        .state('export.wizard.info', {
            url: '/4-info',
            templateUrl: 'export/dataset/stepFour.html',
            controller: 'stepFourController as step4vm',
            resolve:{
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'export/dataset/stepFour-controller.js'
                    ]);
                }]
            }
        })






}

angular
    .module('bioSpeak.export',[])
    .config(config)
