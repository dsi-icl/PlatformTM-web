/**
 * Created by iemam on 22/07/2014.
 */
angular.module('eTRIKSdata.studyDesign')

    //Create a controller for each state

    .controller('ActivityListController', ['$scope', 'ActivityResource', function ($scope, ActivityResource) {
        $scope.data = {};
        //Retrieves list of study activities
        ActivityResource.query(function(response){
            $scope.data.activities = response;
        });

    }])

    .controller('ActivityViewCtrl', ['$http','$scope', '$stateParams', 'ActivityResource', function ($http, $scope, $stateParams, ActivityResource) {
        $scope.data = {};
        /*ActivityResource.get({ id: $stateParams.activityId }, function(response){
            $scope.data.activity = response;
        });*/

        //temp
        $http.get('../data/activity.json').success(function(response){
            $scope.data.activity = response;
        })
    }])

    .controller('DatasetController',['$http','$scope', '$stateParams', 'TemplateResource',
        function ($http, $scope, $stateParams, TemplateResource) {
        $scope.model = {};

        /*TemplateResource.get({datasetId:$stateParams.datasetId}, function(response){
           $scope.data.dataset = response;
        });*/

        //temp
        $http.get('../data/dataset.json').success(function(response){
            $scope.model.dataset = response;
        })
    }])

    .controller('VariableController',['$scope','$stateParams', 'utils', function($scope, $stateParams, utils){
        console.log($scope.model.dataset)
        console.log($stateParams.variableId)

        $scope.model.variable = utils.findById($scope.model.dataset.variables, $stateParams.variableId)

    }])


    .controller('NewActivityCtrl', ['$scope', '$state','ActivityResource', function ($scope, $state, ActivityResource) {
        $scope.model = {}
        $scope.model.activity = new ActivityResource();

        $scope.addActivity = function(){
            $scope.model.activity.$save(function(){
                $state.go('manager')
            })
        }
    }])



    .controller('DatasetTemplatesCtrl', ['$scope', '$state','TemplateResource', 'ISAconfigResource',
        function ($scope, $state, TemplateResource, ISAconfigResource) {
        $scope.templates = {}

        TemplateResource.query(function(response){
            $scope.templates.domains = response;
        });

        ISAconfigResource.query(function(response){
            $scope.templates.isaconfigs = response;
        });

        $scope.mouseOverDataset = function(domain) {
            $scope.templates.preview = domain;
        }

        $scope.selectTemplate = function(domain){

            console.log(domain.oid)
            $state.go("manager.activities.detail.dataset",{datasetId:domain.oid})

        }
    }])

    .controller('ISAconfigsCtrl', ['$scope', 'ISAconfigResource', function ($scope, ISAconfigResource) {
        $scope.model = {}

    }])

