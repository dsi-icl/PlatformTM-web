/**
 * Created by iemam on 06/05/2015.
 */
angular.module('biospeak.clinical',['eTRIKSdata.dcPlots'])

    .controller('ClinicalCtrl', ['$scope','clinicalDataService','ClinicalCf',function($scope,clinicalDataService,ClinicalCf) {

        clinicalDataService.getClinicalDataTree(1)
            .then(function(data){
                $scope.clinicalData = data.treeData;
                //console.log(data)
            })

        $scope.cf = ClinicalCf;
        $scope.chartContainerId = "clinical-plots";

        $scope.getChartingOpts = function(){
            var chartingOpts = {}
            chartingOpts.container = $scope.chartContainerId
            chartingOpts.chartingServiceName = "ClinicalCf"

            return chartingOpts;
        }

        //ClinicalCf.setup($scope)

//        ClinicalCf.getData().then(function(data){
//            console.log(data)
//        })

        $scope.chartService = "ClinicalCf";


    }])