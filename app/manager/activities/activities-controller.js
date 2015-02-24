/**
 * Created by iemam on 22/07/2014.
 */
angular.module('eTRIKSdata.studyDesign')

    //Create a controller for each state

    .controller('ActivityListController', ['$scope','$stateParams', 'ActivityResource','model', function ($scope, $stateParams, ActivityResource, model) {
        $scope.vmodel = {};
        console.log("List Controller requested")
        //Retrieves list of study activities
        ActivityResource.getActivitiesForStudy({studyId:$stateParams.studyId},function(response){
            model.activities = response;
            $scope.vmodel.activities = model.activities;
        });
    }])

    .controller('ActivityCtrl', ['$state','$scope', '$stateParams', 'ActivityResource','model', function ($state, $scope, $stateParams, ActivityResource, model) {
        $scope.vmodel = {};
        console.log("Activity Controller requested")
        console.log($stateParams.activityId);

        if($stateParams.activityId==0){
            console.log("New Activity")
            model.activity = new ActivityResource();
            model.activity.StudyID = $stateParams.studyId;//"Study1"
            model.activity.isNew = true;
            model.activityId = 0;
            $scope.vmodel.activity = model.activity;
        }

        else if($stateParams.activityId){
            ActivityResource.get({ activityId: $stateParams.activityId }, function(response){
                model.activity = response;
                model.activity.isNew = false;

                $scope.vmodel.activity = model.activity;
            });
            //temp
            /*$http.get('../data/activity.json').success(function(response){
             $scope.model.activity = response;
             })*/
        }

        $scope.saveActivity = function(){
            if(model.activity.isNew){
                $scope.vmodel.activity.$save(function(response) {
                    console.log("Activity created")
                    if(model.dataset.isNew){
                        model.dataset.activityId = response.oid
                        model.dataset.$save(function(){
                            console.log("Dataset created")
                        })
                    }
                });
            }
            else{
                console.log("Activity Edited")
                $scope.vmodel.activity.$update(function(response) {
                    console.log("Activity Updated")

                    if(model.dataset){
                        if(model.dataset.isNew){
                            model.dataset.activityId = response.id
                            model.dataset.$save(function(){
                                console.log("Dataset created")
                            })
                        }
                        else{
                            if(response.datasets != null ){
                                model.dataset.$update(function(){
                                    console.log("Dataset updated")
                                })
                            }
                        }
                    }
                });
            }
            /*$state.transitionTo($state.current, $stateParams, {
             reload: true,
             inherit: false,
             notify: true
             });*/
            //console.log($stateParams)
            $state.go('manager.activities.detail',$stateParams,{
                reload: true,
                inherit: false
                });
        }




    }])

    .controller('DatasetController',['$http','$scope', '$stateParams', '$state','DatasetResource','model',
        function ($http, $scope, $stateParams,$state, DatasetResource,model) {
            $scope.vmodel = {};
            console.log("Dataset Controller requested")
            console.log($stateParams.datasetId);
            console.log($stateParams);

            if($stateParams.datasetId==0 && $stateParams.domainId){
                console.log("new Dataset")
                DatasetResource.get({datasetId:$stateParams.domainId}, function(response){
                    model.dataset = response;
                    model.dataset.isNew = true;
                    model.dataset.studyId = $stateParams.studyId;
                    $scope.vmodel.dataset = model.dataset;
                    //$scope.model = model.dataset
                });
            }
            else{
                //temp
                /*$http.get('../data/dataset.json').success(function(response){
                 $scope.vmodel.dataset = response;
                 })*/

                DatasetResource.getDatasetForActivity({activityId:'1', datasetId:$stateParams.datasetId},function(response){
                    model.dataset = response;
                    model.dataset.isNew = false
                    $scope.vmodel.dataset = model.dataset;
                });
            }
        }])

    .controller('VariableController',['$scope','$stateParams', 'utils', function($scope, $stateParams, utils){
        $scope.vmodel.variable = utils.findByAccession($scope.vmodel.dataset.variables, $stateParams.variableId)
    }])


    .controller('DatasetTemplatesCtrl', ['$scope', '$state','DatasetResource', 'ISAconfigResource','model',
        function ($scope, $state, DatasetResource, ISAconfigResource,model) {


            $scope.templates = {}

            DatasetResource.query(function(response){
                $scope.templates.domains = response;
            });

            ISAconfigResource.query(function(response){
                $scope.templates.isaconfigs = response;
            });

            $scope.mouseOverDataset = function(domain) {
                $scope.templates.preview = domain;
            }

            $scope.selectTemplate = function(domainId){

                //console.log(domain.oid)
                //console.log($state.current.name)
                //go and send param saying this is a new dataset
                $state.go('manager.activities.detail.dataset',{datasetId:0, domainId:domainId})
                //console.log($state.current.name)

            }
        }])

    .controller('ISAconfigsCtrl', ['$scope', 'ISAconfigResource', function ($scope, ISAconfigResource) {
        $scope.model = {}

    }])

