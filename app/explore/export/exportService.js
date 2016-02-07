/**
 * Created by superkillball on 16/11/2015.
 */

angular.module('eTRIKSdata.explorer')

    .factory('exportService',['$q', function($q){
        var subjectFilters = {};
        var clinicalFilters = {};
        var cart = {};

        var exportService = {}

        exportService.subjectFiters = subjectFilters;
        exportService.clinicalFiters = clinicalFilters;

        exportService.deleteFilter = function(){

        }

        exportService.updateSubjectFilter = function(obs,filter){
            if(filter.length > 0){
                if(filter[0].length == 2){
                    filter[0][0] = Math.round(filter[0][0])
                    filter[0][1] = Math.round(filter[0][1])
                }
                subjectFilters[angular.uppercase(obs)] = filter
            } else {
                delete subjectFilters[angular.uppercase(obs)]
            }
        }

        exportService.updateClinicalFilter = function(obs,filter){
            if(filter.length > 0) {
                if(filter[0].length == 2){
                    filter[0][0] = Math.round(filter[0][0])
                    filter[0][1] = Math.round(filter[0][1])
                }
                clinicalFilters[angular.uppercase(obs)] = filter
            }else {
                delete clinicalFilters[angular.uppercase(obs)]
            }
        }

        exportService.getSubjectFilter = function(){
            return subjectFilters
        }

        exportService.getClinicalFilter = function(){
            return clinicalFilters
        }

        exportService.addToCart = function(type, count, projectId, callback){

            cart['projectId'] = projectId;
            if(type == "subject"){
                cart[type] = subjectFilters
                cart['subjectCount'] = count
            }

            if(type == "clinical"){
                cart[type] = clinicalFilters
                cart['clinicalCount'] = count
            }


            callback()
        }

        exportService.getCart = function(){
            return cart
        }

        return exportService;
    }])

    .factory('exportDataService',['$http','$q','ngAppConfig', function($http,$q,ngAppConfig) {
        var serviceBase = ngAppConfig.apiServiceBaseUri;

        return {
            getDownloads: function(observations, projectId) {
                console.log(angular.toJson(observations))
                return $http({
                    url:serviceBase+'api/export/' + projectId,
                    method:'POST',
                    data: angular.toJson(observations)
                })
                    .then(
                        function (response) {

                            var blob = new Blob([angular.toJson(response.data)], {type: "text/csv"});
                            var objectUrl = URL.createObjectURL(blob);
                            window.open(objectUrl);
                            return response.data
                        },
                        function (httpError) {
                            // translate the error
                            throw httpError.status + " : " +
                            httpError.data;
                        });
            }
        }
    }])

