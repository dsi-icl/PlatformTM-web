/**
 * Created by iemam on 08/07/2014.
 */
angular.module('eTRIKSdata.explorer',[])

    .config(function($stateProvider){

        $stateProvider
            .state('explore', {
                url: "/explore",
                views:{
                    '':{
                        templateUrl: 'explore/explore.html'
                    },
                    'subjects@explore':{
                        templateUrl: 'explore/study_subjects.html',
                        controller: 'SubjectsCtrl'
                    },
                    'assessments@explore':{
                        templateUrl: 'explore/study_clinical.html',
                        controller: 'ClinicalCtrl'
                    },
                    'assays@explore':{
                        templateUrl: 'explore/study_assays.html',
                        controller: 'AssayCtrl'
                    },
                    'design@explore':{
                        templateUrl: 'explore/study_design.html'
                    }
                }

            })

    })