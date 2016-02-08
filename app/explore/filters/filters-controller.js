/**
 * Created by superkillball on 19/11/2015.
 */

angular.module('eTRIKSdata.explorer')

    .controller('filtersCtrl', ['$scope','$stateParams','filtersService','XFilterLinker','$timeout',
        function($scope,$stateParams,filtersService,XFilterLinker,$timeout) {
            //scope.add filters from exportService
            //$scope.cart = exportService.getCart();

            var vm = this;
            vm.studyId = $stateParams.studyId

            vm.query = {}


            $scope.service = filtersService;

            /*filtersService.getUserSavedFilters($stateParams.studyId)
                .then(function(data) {
                    vm.savedFilters = data.filters;
                })*/

            vm.subjFilters = filtersService.getFiltersFor('subject')


            $scope.$watch('service.getFilters()',function (newval) {
                console.log("INSIDE WATCH")
                vm.subjFilters = filtersService.getFiltersFor('subject')
                vm.clinicalFilters = filtersService.getFiltersFor('clinical')
            },true)


            vm.removeFilter = function(chartGroup,obs){
                //if(chartGroup == 'subject')
                console.log('remove filter ',obs, 'from ', chartGroup)
                XFilterLinker.removeFilter(chartGroup,obs);
            }

            vm.resetAllFilters = function(){
                console.log('remove all filters ')
            }

            vm.saveFilters = function(){
                vm.query.subjFilters = vm.subjFilters;
                vm.query.clinicalFilters = vm.clinicalFilters;
                console.log(vm.query)
            }

        }])