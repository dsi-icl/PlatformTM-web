/**
 * Created by iemam on 08/07/2014.
 */
angular.module('biospeak.explorer',[
        'eTRIKSdata.dcPlots',
        'eTRIKSdata.exporter'])

    .config(function($stateProvider){

        $stateProvider
            // .state('explore', {
            //     abstract : true,
            //     url: "",
            //     templateUrl:"layout/content.html",
            //     controller: "logOutController"
            // })
            .state('explore', {
                url: "/{projectId}/explore/",
                views:{
                    '':{
                        templateUrl: 'explore/explore.html',
                        resolve: {
                            
                            loadPlugin: function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    {
                                        files: ['lib/plugins/slick/css/slick.css','lib/plugins/slick/css/slick-theme.css','lib/plugins/slick/js/slick.min.js']
                                    },
                                    {
                                        name: 'slick',
                                        files: ['lib/plugins/slick/js/angular-slick.min.js']
                                    },
                                    {
                                        files: ['lib/plugins/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css']
                                    },
                                    {
                                        files: ['lib/plugins/moment/js/moment.min.js']
                                    },
                                    {
                                        name: 'datePicker',
                                        files: ['lib/plugins/angular-datepicker/css/angular-datepicker.css','lib/plugins/angular-datepicker/js/angular-datepicker.js']
                                    },
                                ]);
                            },
                            loadDependencies: ['$ocLazyLoad',function($ocLazyLoad){
                                return $ocLazyLoad.load(
                                    {
                                        serie: true,
                                        files: ['explore/crossFilter-service.js',
                                            'explore/dc/dc-service.js','explore/dc/dc-directives.js'
                                        ]
                                    }
                                )
                            }],
                            loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/explorer-controller.js');
                            }],

                        loadDependency: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    serie:true,
                                    files: ['lib/plugins/iCheck/custom.css', 'lib/plugins/iCheck/icheck.min.js']
                                }
                            ]);
                        }
                        },
                        controller:'ExplorerCtrl as vm'
                    },
                    'subjects@explore':{
                        templateUrl: 'explore/subjects/explorer_subjects.html',
                        controller: 'SubjectsCtrl',
                        resolve: {
                            loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/subjects/subjects-service.js');
                            }],
                            loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/subjects/subjects-controller.js');
                            }]
                        }
                    },
                    'assessments@explore':{
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
                    'assays@explore':{
                        templateUrl: 'explore/assays/explorer_assays.html',
                        controller: 'AssayCtrl',
                        resolve: {
                            loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/assays/assays-service.js');
                            }],
                            loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/assays/assays-controller.js');
                            }]
                        }
                    },
                    /*'datacart@explore':{
                        templateUrl: 'explore/export/right_sidebar.html',
                        controller: 'DatacartCtrl'
                    },*/
                    'datacart@explore':{
                        templateUrl: 'explore/datacart/cart.html',
                        controller: 'cartCtrl as vm',
                        resolve: {
                            loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('explore/datacart/cart-service.js');
                            }],
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
                    }/*,
                    'design@explore':{
                        templateUrl: 'explore/partials/study_design.html'
                    }*/
                }

            })
            .state('datacart', {
                abstract : true,
                url: "",
                templateUrl:"layout/content.html",
                controller: "logOutController"
            })
            .state('datacart.checkout',{
                url: "/{projectId}/checkout/{cartId}",
                templateUrl: 'explore/checkout/checkout.html',
                controller: 'checkoutCtrl as vm',
                resolve: {
                    loadServices: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['explore/datacart/cart-service.js','explore/checkout/checkout-service.js']);
                    }],
                    loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('explore/checkout/checkout-controller.js');
                    }],
                    loadPlugins: ['$ocLazyLoad',function ($ocLazyLoad){
                        return $ocLazyLoad.load({
                            serie:true,
                            files: [
                                'lib/plugins/steps/jquery.steps.css',
                                //'lib/plugins/iCheck/custom.css',
                                //'lib/plugins/iCheck/icheck.min.js',

                                //'lib/plugins/ionRangeSlider/css/ion.rangeSlider.css',
                                //'lib/plugins/ionRangeSlider/css/ion.rangeSlider.skinSimple.css',
                                //'lib/plugins/ionRangeSlider/js/ion.rangeSlider.min.js',
                                //'layout/directives/ionRangeSlider.js',
                                //'lib/plugins/ui-select/js/select.min.js',
                                //'lib/plugins/ui-select/css/select.css',
                                //'lib/plugins/angular-dragdrop/angular-dragdrop.min.js'
                                'lib/plugins/dataTables/js/jquery.dataTables.min.js',
                                'lib/plugins/dataTables/css/dataTables.bootstrap.min.css',
                                'lib/plugins/dataTables/js/angular-datatables.js',
                                'lib/plugins/dataTables/js/angular-datatables.bootstrap.min.js',
                                'lib/plugins/dataTables/js/angular-datatables.buttons.min.js',
                                'lib/plugins/dataTables/css/angular-datatables.min.css'

                            ]
                        })
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
            })

    })

    /*.constant('ngAuthSettings', {
        //apiServiceBaseUri: 'http://rachmaninoff.local:8080/'
        apiServiceBaseUri: 'http://ehs.biospeak.solutions/sandbox/'
    })*/