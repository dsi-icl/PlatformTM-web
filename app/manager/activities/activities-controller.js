/**
 * Created by iemam on 22/07/2014.
 */
angular.module('eTRIKSdata.studyDesign')

    //Create a controller for each state

    .controller('ActivityListCtrl', ['$scope', 'ActivityResource', function ($scope, ActivityResource) {
        $scope.data = {};

        ActivityResource.query(function(response){
            $scope.data.activities = response;
        });

    }])

    .controller('ActivityViewController', ['$scope', 'ActivityResource', function ($scope, ActivityResource) {
        $scope.data.activity = ActivityResource
    }])