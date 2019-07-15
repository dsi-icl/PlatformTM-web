/**
 * Created by iemam on 08/07/2014.
 */
angular.module('biospeak.explorer',[])
    .config(function($stateProvider){
        $stateProvider
            .state('project.explorer', {
                url: "/explore/{queryId}",
                views:{
                    '':{
                        templateUrl: 'explore/explore.html',
                        resolve: {
                            loadPlugins: function ($ocLazyLoad) {
                                return $ocLazyLoad.load([

                                    {
                                        files: ['lib/plugins/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css','explore/clinical/css/clinicalDataTree.css']
                                    }

                                ]);
                            },
                            loadDependencies: ['$ocLazyLoad',function($ocLazyLoad){
                                return $ocLazyLoad.load(
                                    {
                                        serie: true,
                                        files: ['explore/dc/dc-module.js','explore/dc/XfilterServices/AssayXF.js','explore/dc/XfilterServices/SubjectXF.js','lib/plugins/iCheck/custom.css', 'lib/plugins/iCheck/icheck.min.js',
                                            'explore/dc/XfilterServices/ClinicalXF.js', 'explore/dc/XfilterServices/XFlinker.js', 'explore/dc/dc-service.js','explore/dc/dc-directives.js'
                                        ]
                                    }
                                )
                            }],
                            loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/explorer-controller.js');
                            }],
                            loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/explorer-service.js');
                            }]
                        },
                        controller:'ExplorerCtrl as expVM'
                    },
                    'subjects@project.explorer':{
                        templateUrl: 'explore/subjects/explorer_subjects.html',
                        controller: 'SubjectsCtrl as vm',
                        resolve: {
                            loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/subjects/subjects-service.js');
                            }],
                            loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/subjects/subjects-controller.js');
                            }]
                        }
                    },
                    'assessments@project.explorer':{
                        templateUrl: 'explore/clinical/explorer_clinical.html',
                        controller: 'ClinicalCtrl',
                        resolve: {
                            loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/clinical/clinical-service.js');
                            }],
                            loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/clinical/clinical-controller.js');
                            }],
                            loadDirectives: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/clinical/clinicalDataTree-directive.js');
                            }]
                        }
                    },
                    'assays@project.explorer':{
                        templateUrl: 'explore/assays/assays.html',
                        controller: 'AssayCtrl as vm',
                        resolve: {
                            loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/assays/assays-service.js');
                            }],
                            loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/assays/assays-controller.js');
                            }]
                        }
                    },
                    'datacart@project.explorer':{
                        templateUrl: 'explore/datacart/cart.html',
                        controller: 'cartCtrl as vm',
                        params: { queryId: null },
                        resolve: {
                            loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/datacart/cart-controller.js');
                            }],
                            loadAngularXEditable: ['$ocLazyLoad', '$injector', function ($ocLazyLoad, $injector) {
                                return $ocLazyLoad.load({
                                    files:['lib/plugins/angular-xeditable/js/xeditable.min.js']
                                }).then(function () {
                                    var editableThemes = $injector.get('editableThemes');
                                    editableThemes.bs3.inputClass = 'input-sm';
                                    editableThemes.bs3.buttonsClass = 'btn-sm';
                                    var editableOptions = $injector.get('editableOptions');
                                    editableOptions.theme = 'bs3';
                                });
                            }]
                        }
                    }
                }
            })
            .state('project.datacart',{
                url: "/checkout/{cartId}",
                templateUrl: 'explore/checkout/checkout.html',
                controller: 'checkoutCtrl as vm',
                resolve: {
                    loadServices: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['explore/checkout/checkout-service.js']);
                    }],
                    loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('explore/checkout/checkout-controller.js');
                    }]
                }
            })
    });