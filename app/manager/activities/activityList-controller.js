/**
 * Created by iemam on 27/05/2016.
 */

'use strict'
function ActivityListCtrl($scope, $state, $stateParams, ActivityResource) {


    var vm = this;
    vm.studyId = $stateParams.studyId

    //console.log("List Controller requested")
    //console.log($stateParams);
    //Retrieves list of study activities
    ActivityResource.getActivitiesForStudy({studyId:$stateParams.studyId},function(response){
        //model.activities = response;
        vm.activities = response.activities;
    });

    vm.goToActivity = function(activity,edit){
        if(activity.isAssay)
            $state.go('manager.assay',{ assayId: activity.id, edit:edit})
        else
            $state.go('manager.activity',{ activityId: activity.id, edit:edit})
    }

    vm.removeActivity = function(activity){
        ActivityResource.delete();
    }
}

angular.module('bioSpeak.config')
    .controller('ActivityListCtrl',['$scope', '$state','$stateParams','ActivityResource',ActivityListCtrl])
