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

            .state('manager.activities.new',{
                url:"/new",
                views:{
                    'activities.detail@manager':{
                        templateUrl:'manager/activities/activities-detail.html',
                        controller: 'NewActivityCtrl'
                    }
                }
            })
            /*
            .state('manager.activities.new.dataset',{
                url:"/dataset/new",
                views:{
                    'dataset.detail':{
                        templateUrl: 'manager/activities/dataset-templates.html',
                        controller: 'DatasetTemplatesCtrl'
                    }
                }
            })

            .state('manager.activities.new.dataset.details',{
                url:"/details",
                views:{
                    'dataset.detail@manager.study-activities.new':{
                        templateUrl:'manager/activities/dataset-detail.html'
                    }
                }
            })

            .state('manager.activities.new.dataset.details.variables',{
                url:"/variables",
                views:{
                    '':{
                        templateUrl:'manager/activities/variable-detail.html'
                    }
                }
            })*/

            .state('manager.activities.detail',{
                url:'/{activityId:[0-9]}',
                views:{
                    'activities.detail@manager':{
                        url:'',
                        templateUrl:'manager/activities/activities-detail.html',
                        controller: 'ActivityViewCtrl'
                    }
                }
            })

            .state('manager.activities.detail.dataset',{
                url:'/dataset/{datasetId:[0-9]}',
                views:{
                     'dataset.detail@manager.activities.detail':{
                        templateUrl:'manager/activities/dataset-detail.html',
                         controller: 'DatasetController'
                     }
                }
            })

            .state('manager.activities.detail.newdataset',{
                url:'/dataset/selectTemplate',
                views:{
                    'dataset.detail':{
                        templateUrl: 'manager/activities/dataset-templates.html',
                        controller: 'DatasetTemplatesCtrl'
                    }
                }
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
