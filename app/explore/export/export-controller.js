/**
 * Created by superkillball on 19/11/2015.
 */

angular.module('eTRIKSdata.explorer')

    .controller('DatacartCtrl', ['$scope','$stateParams','exportService', 'exportDataService', '$timeout',
        function($scope,$stateParams,exportService, exportDataService, $timeout) {
            //scope.add filters from exportService
            $scope.cart = exportService.getCart();

            $scope.isDataAdded = function(filter){
                return $scope.cart[filter] !=  undefined;
            }

            $scope.download = function(){

                var data = {}
                data['subjectCriteria'] = null
                data['clinicalCriteria'] = null
                data['sampleCriteria'] = null

                if($scope.cart['subject'] != undefined && $scope.cart['subject'] != null){
                    data['subjectCriteria'] = {}
                    data['subjectCriteria']['exactfilters'] = []
                    data['subjectCriteria']['rangefilters'] = []
                    data['subjectCriteria']['projection'] = []
                    for(property in  $scope.cart['subject']){
                        if($scope.cart['subject'][property][0].length == 2){
                            if(property[0] > property[1]){
                                data['subjectCriteria']['rangefilters'].push({"field":property, "range":{"upperbound":$scope.cart['subject'][property][0][0].toString(),"lowerbound":$scope.cart['subject'][property][0][1].toString()}})
                            } else {
                                data['subjectCriteria']['rangefilters'].push({"field":property, "range":{"upperbound":$scope.cart['subject'][property][0][1].toString(),"lowerbound":$scope.cart['subject'][property][0][0].toString()}})
                            }
                        } else {
                            data['subjectCriteria']['exactfilters'].push({"field":property, "values":$scope.cart['subject'][property]})
                        }
                    }
                }

                if($scope.cart['clinical'] != undefined && $scope.cart['clinical'] != null){
                    data['clinicalCriteria'] = {}
                    data['clinicalCriteria']['exactfilters'] = []
                    data['clinicalCriteria']['rangefilters'] = []
                    data['clinicalCriteria']['projection'] = []
                    for(property in  $scope.cart['clinical']){
                        if($scope.cart['clinical'][property][0].length == 2){
                            if(property[0] > property[1]){
                                data['clinicalCriteria']['rangefilters'].push({"field":property, "range":{"upperbound":$scope.cart['clinical'][property][0][0].toString(),"lowerbound":$scope.cart['clinical'][property][0][1].toString()}})
                            } else {
                                data['clinicalCriteria']['rangefilters'].push({"field":property, "range":{"upperbound":$scope.cart['clinical'][property][0][1].toString(),"lowerbound":$scope.cart['clinical'][property][0][0].toString()}})
                            }
                        } else {
                            data['clinicalCriteria']['exactfilters'].push({"field":property, "values":$scope.cart['clinical'][property]})
                        }
                    }
                }


                return exportDataService.getDownloads(data, $scope.cart['projectId']);

            }


        }])