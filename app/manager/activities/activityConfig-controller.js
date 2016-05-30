/**
 * Created by iemam on 17/05/2016.
 */

'use strict'
function ActivityConfigCtrl($scope, $state, $stateParams, ActivityResource, DatasetResource, AssayConfigService,$timeout) {
    var vm = this;
    vm.studyId = $stateParams.studyId
}

angular.module('bioSpeak.config')
    .controller('ActivityConfigCtrl',['$scope', '$state','$stateParams','ActivityResource','DatasetResource','$timeout',ActivityConfigCtrl])
