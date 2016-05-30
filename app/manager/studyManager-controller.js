/**
 * Created by iemam on 03/07/2014.
 */
angular.module('bioSpeak.config')

    .controller('StudyPlanCtrl',['$scope','$state','$stateParams','$http','ngAppConfig',
        function($scope,$state,$stateParams,$http,ngAppConfig){
            console.log(ngAppConfig.apiServiceBaseUri);

            $scope.vm = {};
            $scope.vm.projectId = $stateParams.studyId;

    if($stateParams.studyId == 'S-UBIOP-01')
    {
        $http.get('tempData/study-plan.json').success(function(data) {
            //if(data.size == 0)

            $scope.Arms = data;
        })
    }else{
        $http.get('tempData/study-plan-BVS.json').success(function(data) {
            //if(data.size == 0)
            $scope.Arms = data;
        })

    }



    /*$http.get('../data/cdisc-domains.json').success(function(data){
        //if(data.size == 0)

        $scope.cdiscClasses = data;

    })*/

    /*$http.get('../data/LB-domain.json').success(function(data){
        //if(data.size == 0)

        $scope.lbDomain = data;

    })*/

    /*$http.get('../data/isaconfigs.json').success(function(data){
        //if(data.size == 0)

        $scope.isaconfigs = data;

    })*/



}]);