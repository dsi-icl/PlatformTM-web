/**
 * Created by iemam on 03/07/2014.
 */
angular.module('eTRIKSdata.studyDesign',["xeditable","ui.bootstrap"])

    .config(function($stateProvider, $urlRouterProvider){

   /* $urlRouterProvider.otherwise('/manager');*/

        $stateProvider
            .state('manager',{
                url:'/manager',
                views:{
                    '':{
                        templateUrl:"manager/createStudy.html"
                    },
                    'study-plan@manager':{
                        templateUrl:"manager/study-plan/study-plan.html"
                    },
                    'activities@manager':{
                        url:'/activities',
                        templateUrl: "manager/activities/activities.html",
                        controller:['$scope','$state',function($scope,$state){

                        }]
                    }
                }
            })

            .state('manager.activities',{

                abstract:true,
                url:"/activities"/*,
                template: '<ui-view/>'*/
            })

            .state('manager.activities.detail',{
                url:"/detail",
                views:{
                    'activities.detail@manager':{
                        url:'',
                        templateUrl:'manager/activities/activities-detail.html',
                        controller:['$scope','$state',function($scope,$state){

                        }]
                    }
                }
            })

            .state('manager.activities.detail.variable',{
                url:'/variable/:variableId',
                templateUrl:'manager/activities/activities-detail-variable.html',
                controller:['$scope','$state',function($scope,$state){

                }]
            })

    })

    .run(function(editableOptions) {

        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

    });
