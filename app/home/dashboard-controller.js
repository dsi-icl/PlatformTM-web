/**
 * Created by iemam on 06/04/2017.
 */
'use strict'
function dashboardController($state,projectService ) {
    var vm = this;

    var date = new Date();
    var hrs = date.getHours();
    var greet;
    if(hrs<12)
        vm.greet = 'Good Morning';
    else if (hrs >= 12 && hrs <= 17)
        vm.greet = 'Good Afternoon';
    else if (hrs >= 17 && hrs <= 24)
        vm.greet = 'Good Evening';

    vm.projects = {}

    projectService.getProjectResource.get(function(response){
        vm.projects = response;
    });
}
angular.module('biospeak.app')
    .controller('DashboardCtrl',['$state','projectService',dashboardController])