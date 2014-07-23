/**
 * Created by iemam on 03/07/2014.
 */
angular.module('eTRIKSdata.studyDesign',["xeditable","ui.bootstrap","ngResource"])

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
                        controller:['$scope','$state','ActivityResource',function($scope,$state,ActivityService){
                            $scope.data = {};

                            ActivityService.query(function(response){
                                $scope.data.activities = response;
                            });
                        }]
                    },
                    'activities.list@manager':{
                        templateUrl: "manager/activities/activities-list.html",
                        controller:['$scope','$state',function($scope,$state){
                        }]
                    }
                }
            })

            .state('manager.study-activities',{
                abstract:true,
                url:"/activities"/*,
                template: '<ui-view/>'*/
            })

            .state('manager.study-activities.new',{
                url:"/new",
                views:{
                    'activities.detail@manager':{
                        templateUrl:'manager/activities/activities-detail.html'
                    }
                }
            })

            .state('manager.study-activities.new.dataset',{
                url:"/newdataset",
                views:{
                    'dataset.detail':{
                        templateUrl:'manager/activities/dataset-list.html'
                    }
                }
            })
            .state('manager.study-activities.new.dataset.details',{
                url:"/details",
                views:{
                    'dataset.detail@manager.study-activities.new':{
                        templateUrl:'manager/activities/dataset-detail.html'
                    }
                }
            })
            .state('manager.study-activities.new.dataset.details.variables',{
                url:"/variables",
                views:{
                    '':{
                        templateUrl:'manager/activities/variable-detail.html'
                    }
                }
            })

            .state('manager.study-activities.detail',{
                url:'/{activityId:[0-9]}',
                views:{
                    'activities.detail@manager':{
                        url:'',
                        templateUrl:'manager/activities/activities-detail.html',
                        controller:['$scope','$state',function($scope,$state){

                        }]
                    }
                }
            })

            .state('manager.study-activities.detail.variable',{
                url:'/variable/:variableId',
                templateUrl:'manager/activities/variable-detail.html',
                controller:['$scope','$state',function($scope,$state){

                }]
            })

    })

    .run(function(editableOptions) {

        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

    });
