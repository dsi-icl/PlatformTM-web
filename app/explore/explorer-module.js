/**
 * Created by iemam on 08/07/2014.
 */
angular.module('eTRIKSdata.explorer',[
        'biospeak.subjects',
        'biospeak.clinical',
        'biospeak.assays',
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
                                        insertBefore: '#loadBefore',
                                        name: 'toaster',
                                        files: ['lib/plugins/toastr/toastr.min.js', 'lib/plugins/toastr/toastr.min.css']
                                    },
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
                            }
                        },
                        controller:'ExplorerCtrl as vm'
                    },
                    'subjects@explore':{
                        templateUrl: 'explore/subjects/study_subjects.html',
                        controller: 'SubjectsCtrl'
                    },
                    'assessments@explore':{
                        templateUrl: 'explore/clinical/study_clinical.html',
                        controller: 'ClinicalCtrl'
                    },
                    'assays@explore':{
                        templateUrl: 'explore/assays/study_assays.html',
                        controller: 'AssayCtrl'
                    },
                    /*'datacart@explore':{
                        templateUrl: 'explore/export/right_sidebar.html',
                        controller: 'DatacartCtrl'
                    },*/
                    'filters@explore':{
                        templateUrl: 'explore/filters/filters.html',
                        controller: 'filtersCtrl as vm'
                    },
                    'design@explore':{
                        templateUrl: 'explore/partials/study_design.html'
                    }
                }

            })

    })

    /*.constant('ngAuthSettings', {
        //apiServiceBaseUri: 'http://rachmaninoff.local:8080/'
        apiServiceBaseUri: 'http://ehs.biospeak.solutions/sandbox/'
    })*/