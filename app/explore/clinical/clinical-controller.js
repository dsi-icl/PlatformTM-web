/**
 * Created by iemam on 06/05/2015.
 */
angular.module('biospeak.clinical',['eTRIKSdata.dcPlots'])

    .controller('ClinicalCtrl', ['$rootScope','$scope','$stateParams','clinicalDataService','ClinicalCf','DCchartingService',
        'filtersService', 'toaster','$timeout','$modal',
        function($rootScope,$scope,$stateParams,clinicalDataService,ClinicalCf,DCchartingService,filtersService, toaster,$timeout,$modal) {

            $scope.vm = {};
            $scope.vm.show = 'plots';


            //TEMP
            $scope.cf = ClinicalCf;
            $scope.chartservice = DCchartingService;
            //////////////////////


            $scope.addToCart = function(type) {

                var count = ClinicalCf.getCountGroup().value()

                exportService.addToCart(type, count, $scope.projectId, function () {
                    toaster.pop({
                        type: 'success',
                        title: 'Data Saved',
                        body: '',
                        showCloseButton: true,
                        timeout: 1000
                    })
                })

                //console.log(exportService.getCart());
            };

            $scope.chartingOpts = {
                projectId : $stateParams.studyId,
                chartContainerId : "clinical-plots",
                chartGroup : "clinical",
                DCchartService : "DCchartingService",
                xfilterService : "ClinicalCf",
                filtersService: "filtersService"
            };

            $scope.open2 = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'explore/clinical/modal_example2.html',
                    controller: ModalInstanceCtrl,
                    windowClass: "animated fadeIn"
                });
            };

            function ModalInstanceCtrl ($scope, $modalInstance) {

                $scope.ok = function () {
                    $modalInstance.close();
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };


                $scope.states = [
                    'Alabama',
                    'Alaska',
                    'Arizona',
                    'Arkansas',
                    'California',
                    'Colorado',
                    'Connecticut',
                    'Delaware',
                    'Florida',
                    'Georgia',
                    'Hawaii',
                    'Idaho',
                    'Illinois',
                    'Indiana',
                    'Iowa',
                    'Kansas',
                    'Kentucky',
                    'Louisiana',
                    'Maine',
                    'Maryland',
                    'Massachusetts',
                    'Michigan',
                    'Minnesota',
                    'Mississippi',
                    'Missouri',
                    'Montana',
                    'Nebraska',
                    'Nevada',
                    'New Hampshire',
                    'New Jersey',
                    'New Mexico',
                    'New York',
                    'North Carolina',
                    'North Dakota',
                    'Ohio',
                    'Oklahoma',
                    'Oregon',
                    'Pennsylvania',
                    'Rhode Island',
                    'South Carolina',
                    'South Dakota',
                    'Tennessee',
                    'Texas',
                    'Utah',
                    'Vermont',
                    'Virginia',
                    'Washington',
                    'West Virginia',
                    'Wisconsin',
                    'Wyoming'
                ];
                
            };

            $timeout(function() {
                console.log("calling clinical tree")
                clinicalDataService.getClinicalDataTree($scope.chartingOpts.projectId)
                    .then(function(data){
                        console.log("back")
                        $scope.clinicalObservations = data.treeData;
                        //console.log($scope.clinicalObservations)
                        //$scope.getObsForAll();

                    })
            },3000)

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


        }])



