/**
 * Created by iemam on 03/07/2014.
 */
angular.module('eTRIKSdata.studyDesign')

    .controller('StudyPlanCtrl', function ($scope, $http) {
    $http.get('../data/study-plan.json').success(function(data){
        //if(data.size == 0)

        $scope.Arms = data;

    });

    $http.get('../data/cdisc-domains.json').success(function(data){
        //if(data.size == 0)

        $scope.cdiscClasses = data;

    })

    $http.get('../data/LB-domain.json').success(function(data){
        //if(data.size == 0)

        $scope.lbDomain = data;

    })

    $http.get('../data/isaconfigs.json').success(function(data){
        //if(data.size == 0)

        $scope.isaconfigs = data;

    })


});