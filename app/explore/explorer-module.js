/**
 * Created by iemam on 08/07/2014.
 */
angular.module('biospeak.explorer',[
        'eTRIKSdata.dcPlots',
        'eTRIKSdata.exporter'])

    .config(function($stateProvider){

        $stateProvider
            /*.state('explore', {
                abstract : true,
                url: "",
                //templateUrl:"layout/content.html",
                controller: "logOutController"
            })*/
            .state('explore', {
                url: "/{studyId}/explore/",
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
                                    }
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
                                console.log("loading controller");
                                return $ocLazyLoad.load('explore/explorer-controller.js');
                            }]
                        },
                        controller:'ExplorerCtrl as vm'
                    },
                    'subjects@explore':{
                        templateUrl: 'explore/subjects/explorer_subjects.html',
                        controller: 'SubjectsCtrl',
                        resolve: {
                            loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                                console.log("loading service");
                                return $ocLazyLoad.load('explore/subjects/subjects-service.js');
                            }],
                            loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                                console.log("loading controller");
                                return $ocLazyLoad.load('explore/subjects/subjects-controller.js');
                            }]
                        }
                    },
                    'assessments@explore':{
                        templateUrl: 'explore/clinical/explorer_clinical.html',
                        controller: 'ClinicalCtrl',
                        resolve: {
                            loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                                console.log("loading service");
                                return $ocLazyLoad.load('explore/clinical/clinical-service.js');
                            }],
                            loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                                console.log("loading controller");
                                return $ocLazyLoad.load('explore/clinical/clinical-controller.js');
                            }],
                            loadDirectives: ['$ocLazyLoad', function ($ocLazyLoad) {
                                console.log("loading directives");
                                return $ocLazyLoad.load('explore/clinical/clinicalDataTree-directive.js');
                            }]
                        }
                    },
                    'assays@explore':{
                        templateUrl: 'explore/assays/explorer_assays.html',
                        controller: 'AssayCtrl',
                        resolve: {
                            loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                                console.log("loading service");
                                return $ocLazyLoad.load('explore/assays/assays-service.js');
                            }],
                            loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                                console.log("loading controller");
                                return $ocLazyLoad.load('explore/assays/assays-controller.js');
                            }]
                        }
                    },
                    /*'datacart@explore':{
                        templateUrl: 'explore/export/right_sidebar.html',
                        controller: 'DatacartCtrl'
                    },*/
                    'filters@explore':{
                        templateUrl: 'explore/filters/filters.html',
                        controller: 'filtersCtrl as vm'
                    }/*,
                    'design@explore':{
                        templateUrl: 'explore/partials/study_design.html'
                    }*/
                }

            })

    })

    /*.constant('ngAuthSettings', {
        //apiServiceBaseUri: 'http://rachmaninoff.local:8080/'
        apiServiceBaseUri: 'http://ehs.biospeak.solutions/sandbox/'
    })*/