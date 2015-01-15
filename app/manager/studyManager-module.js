/**
 * Created by iemam on 03/07/2014.
 */
angular.module('eTRIKSdata.studyDesign',["xeditable","ui.bootstrap","ngResource",'eTRIKSdata.utils.service'])

    .config(function($stateProvider, $urlRouterProvider){

   /* $urlRouterProvider.otherwise('/manager');*/

        $stateProvider
            .state('manager',{
                url:'/manager',
                views:{
                    '':{
                        templateUrl:"manager/studyManager.html"
                    },
                    'study-plan@manager':{
                        templateUrl:"manager/study-plan/study-plan.html"
                    },
                    'study-activities@manager':{
                        templateUrl: "manager/activities/activities.html",
                        controller:'ActivityListController'
                    }
                }
            })

            .state('manager.activities',{
                abstract:true,
                url:"/activities",
                template: '<ui-view/>'
            })

            .state('manager.activities.detail',{
                url:'/{activityId}',
                views:{
                    'activities.detail@manager':{
                        url:'',
                        templateUrl:'manager/activities/activities-detail.html',
                        controller: 'ActivityCtrl'
                    }
                }
            })

            .state('manager.activities.detail.dataset',{
                url:'/dataset?domainId/{datasetId}',
                templateUrl:'manager/activities/dataset-detail.html',
                controller: 'DatasetController'
            })

            .state('manager.activities.detail.newdataset',{
                url:'/selectTemplate',
                templateUrl: 'manager/activities/dataset-templates.html',
                controller: 'DatasetTemplatesCtrl'
            })

            .state('manager.activities.detail.dataset.variable',{
                url:'/variable/:variableId',
                templateUrl:'manager/activities/variable-detail.html',
                controller:'VariableController'
            })

    })

    .run(function(editableOptions) {

        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

    });
