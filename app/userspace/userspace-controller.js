'use strict';
function UserspaceCtrl($scope,$state,$stateParams,$interval,userspaceService) {
    var vm = this;
    vm.projectId = $stateParams.projectId;


    userspaceService.getUserDatasets().then(function(datasets){
        vm.datasets = datasets;
        vm.loaded = true;
    });

    vm.requestFile = function(file){
        file.fileStatus = 1;
        vm.checkFileStatus(file);
        userspaceService.requestFile(file.id).then(function(response){

            console.log('file requested for download')
            console.log(response)
        });
    };

    vm.getFile = function(file){
        userspaceService.getFile(file.id).then(function (response) {
            file.href = response.url;
            file.filename = response.filename;//dataset.name+".csv";
            console.log(response)
        });

    }


    var fileChecker;
    vm.checkFileStatus = function (file) {
        if ( angular.isDefined(fileChecker) ) return;
        fileChecker = $interval(function() {
            userspaceService.checkFileStatus(file.id)
                    .then(function(result) {
                        file.fileStatus = result;
                        if(file.fileStatus === 2)
                        {
                            $scope.stopCheck();
                            vm.getFile(file);
                            toaster.pop({type:'info', body:'dataset'+ds.name+' is ready for download', timeout:8000});
                        }
                    })
            }, 5000);
    };

    $scope.stopCheck = function() {
        if (angular.isDefined(fileChecker)) {
            $interval.cancel(fileChecker);
            fileChecker = undefined;
        }
    };

    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $scope.stopCheck();
    });

}

angular.module('bioSpeak.userspace')
    .controller('UserspaceCtrl',['$scope','$state','$stateParams','$interval','userspaceService',UserspaceCtrl]);