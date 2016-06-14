/**
 * Created by iemam on 22/07/2014.
 */
angular.module('bioSpeak.config')

    //Create a controller for each state

    .controller('ActivityListController', ['$scope','$state','$stateParams', 'ActivityResource','model', function ($scope, $state, $stateParams, ActivityResource, model) {
        $scope.vmodel = {};
        //$scope.vmodel.studyId = $stateParams.studyId

        var vm = this;
        vm.studyId = $stateParams.studyId

        console.log("List Controller requested")
        console.log($stateParams);
        //Retrieves list of study activities
        ActivityResource.getActivitiesForStudy({studyId:$stateParams.studyId},function(response){
            model.activities = response;
            vm.activities = model.activities;
        });

        vm.goToActivity = function(activity,editFlag){
            if(activity.isAssay)
                $state.go('manager.assay',{ assayId: activity.id})
            else
                $state.go('manager.activity',{ activityId: activity.id})
        }
    }])

    .controller('ActivityCtrl', ['$state','$scope', '$stateParams', 'ActivityResource','DatasetResource','ISAconfigResource','model','$timeout', function
        ($state, $scope, $stateParams, ActivityResource,DatasetResource,ISAconfigResource, model,$timeout) {
        $scope.vmodel = {};

        var vm = this;
        console.log("Activity Controller requested")
        console.log($stateParams.activityId);

        vm.selectTemplate=false;

        //ISAconfigResource.query(function(response){
        //    vm.isaconfigs = response;
        //});



        if($stateParams.activityId==0){
            console.log("New Activity")
            model.activity = new ActivityResource();
            model.activity.ProjectAcc = $stateParams.studyId;//"Study1"
            model.activity.isNew = true;
            model.activity.status = "New";
            model.activity.datasets = [];
            model.activityId = 0;
            $scope.vmodel.activity = model.activity;
            vm.activity = model.activity;
            DatasetResource.query(function(response){
                vm.clinicaldomains = response;
            })

            //TEMP ***************************** TO CREATE ASSAYS
            //model.activity.isAssay = true;
            //model.activity.AssayTechnologyPlatform = "CL-ASYTP-1";
            //model.activity.AssayTechnology = "CL-ASYTT-T-1";
            //model.activity.AssayMeasurementType = "CL-ASYMT-1";
        }

        else if($stateParams.activityId){
            ActivityResource.get({ activityId: $stateParams.activityId }, function(response){
                model.activity = response;
                model.activity.isNew = false;


                //$scope.vmodel.activity = model.activity;
                vm.activity = model.activity;
                vm.varTypes = []
                vm.varTypes.push({"name":"Sample Identifier Fields"})
                vm.varTypes.push({"name":"Sample Characteristics Fields"})
                vm.varTypes.push({"name":"Assay Identifiers Fields"})
                vm.varTypes.push({"name":"Data File Fields"})
console.log(vm.varTypes)
                
                console.log(vm.activity)
                console.log(model.activity)
                $timeout(function(){
                    //console.log($('#ds_template_tbl'))
                    $('#ds_template_tbl').trigger('footable_redraw');
                }, 1000);
                DatasetResource.query(function(response){
                    vm.clinicaldomains = response;
                })

            });
            //temp
            /*$http.get('../data/activity.json').success(function(response){
             $scope.model.activity = response;
             })*/
        }


        $scope.saveActivity = function(){
            if(model.activity.isNew){
                vm.activity.$save(function(response) {
                    console.log("Activity created")
                    $state.transitionTo('manager.main', $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                    });
                });
            }
            else{
                console.log("Activity Edited")
                console.log(vm.activity)
                console.log(model.activity)
                model.activity.$update(function(response) {
                    console.log("Activity Updated")

                    $state.transitionTo('manager.main', $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });

                    //if(model.dataset){
                    //    if(model.dataset.isNew){
                    //        model.dataset.activityId = response.id
                    //        model.dataset.$save(function(){
                    //            console.log("Dataset created")
                    //            $state.transitionTo('manager', $stateParams, {
                    //                reload: true,
                    //                inherit: false,
                    //                notify: true
                    //            });
                    //        })
                    //    }
                    //    else{
                    //        if(response.datasets != null ){
                    //            model.dataset.$update(function(){
                    //                console.log("Dataset updated")
                    //                $state.transitionTo('manager', $stateParams, {
                    //                    reload: true,
                    //                    inherit: false,
                    //                    notify: true
                    //                });
                    //            })
                    //        }
                    //    }
                    //}
                });
            }

            //console.log($stateParams)
            //$state.go('manager.activities.detail',$stateParams,{
            //    reload: true,
            //    inherit: false
            //    });
        }

        vm.selectTemplate = function(domainId){
            DatasetResource.get({datasetId:domainId}, function(response) {
                model.dataset = response;
                model.dataset.isNew = true;
                model.dataset.activityId = $stateParams.activityId;
                model.dataset.projectStrAcc = $stateParams.studyId;
                model.dataset.projectId = model.activity.projectId;
                console.log(model.dataset)
                vm.activity.datasets.push(model.dataset);
                $timeout(function(){
                    //console.log($('#ds_template_tbl'))
                    $('#ds_template_tbl').trigger('footable_redraw');
                }, 4000);
                vm.selectTemplate=false;
            })
        }


        vm.mouseOverDataset = function(domain) {

            vm.clinicaldomains.preview = domain;

        }



    }])

    .controller('DatasetController',['$http','$scope', '$stateParams', '$state','$timeout','DatasetResource','model',
        function ($http, $scope, $stateParams,$state,$timeout, DatasetResource,model) {
            $scope.vmodel = {};
            console.log("Dataset Controller requested")
            console.log($stateParams.datasetId);
            console.log($stateParams);

            if($stateParams.datasetId==0 && $stateParams.domainId){
                console.log("new Dataset")
                DatasetResource.get({datasetId:$stateParams.domainId}, function(response){
                    model.dataset = response;
                    model.dataset.isNew = true;
                    model.dataset.ProjectStrAcc = $stateParams.studyId;
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
                    $timeout(function(){
                        $('.table').trigger('footable_redraw');
                    }, 100);
                });
            }
            //setTimeout(function() {$('#tblOrders').trigger('footable_redraw');}, 1000)

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

