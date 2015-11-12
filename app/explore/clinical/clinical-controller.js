/**
 * Created by iemam on 06/05/2015.
 */
angular.module('biospeak.clinical',['eTRIKSdata.dcPlots'])

    .controller('ClinicalCtrl', ['$rootScope','$scope','$stateParams','clinicalDataService','ClinicalCf','DCchartingService','$timeout',
        function($rootScope,$scope,$stateParams,clinicalDataService,ClinicalCf,DCchartingService,$timeout) {

            $scope.chartGroup = "clinical";
            $scope.projectId = $stateParams.studyId;//"P-BVS";

            $rootScope.currentProject={'id':$stateParams.studyId};
            console.log($rootScope.currentProject)


            $scope.chartContainerId = "clinical-plots";

            $scope.DCchartService = "DCchartingService";
            $scope.xfilterService = "ClinicalCf";
            $scope.show = 'plots';

            //TEMP
            $scope.cf = ClinicalCf;
            $scope.chartservice = DCchartingService;
            //////////////////////


            $timeout(function() {
                console.log("calling clinical tree")
                clinicalDataService.getClinicalDataTree($scope.projectId)
                    .then(function(data){
                        $scope.clinicalData = data.treeData;
                        //console.log(data)
                        //$scope.getObsForAll();

                    })
            },3000)
            /*$scope.filterByStudy = function(){
             ClinicalCf.filterClinicalData('CRC305C','study');
             }*/

            $scope.showVisits = function(){

            }
            $scope.getObsIdsForMeddra = function(medraterm){
                var jsonQobj=jsonQ($scope.clinicalData);

                //var allterm = jsonQobj.find('terms').filter({
                //    "code": "10063188"
                //}).find('name')

                //var allterms = jsonQobj.find('terms',function(){
                //    return this[0].code == '10025197'
                //}).sibling('terms').find('name').unique()


                var allterms = jsonQobj.find('code',function(){
                    return this == medraterm; //'10025198'
                }).sibling('terms').find('id').unique()


                //    .
                //var allterm = jsonQobj.find('terms'   , function () {
                //    return this.code = 10063188;
                //}).find('name');

                //var allterms = jsonQobj.find('domains',function () {
                //    return this[0].domain == 'AE';
                //}).find('variable')
                //    .filter({
                //        "code": "10063188"
                //    })
                //     .find('name')

                //.find('terms'   , function () {
                //  return this[0].code = "10063188";
                //})
                // .find('name')
                //console.log(allterms);
                return allterms
            }

            $scope.getChartingOpts = function(){
                var chartingOpts = {}
                chartingOpts.container = $scope.chartContainerId
                //chartingOpts.chartingServiceName = $scope.chartService
                chartingOpts.chartGroup = $scope.chartGroup
                chartingOpts.DCchartService = "DCchartingService";
                chartingOpts.xfilterService = "ClinicalCf";
                chartingOpts.projectId = $stateParams.studyId;//"P-BVS";
                return chartingOpts;
            }
        }])