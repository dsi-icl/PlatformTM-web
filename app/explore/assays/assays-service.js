/**
 * Created by iemam on 19/02/2015.
 */

'use strict'
function assayDataService($http,$q, localStorageService,ngAppConfig) {
    var serviceBase = ngAppConfig.apiServiceBaseUri;

    var assays = null;
    var ready = false;
    var xfdata = null;

    return {
        reset: function () {
          ready = false;
          assays = null;
        },

        assaysRetrieved: function () {
            return assays;
        },

        getSampleData: function (projectId, assayId, reqChars) {
            if (!reqChars)
                reqChars = '';
            return $http({
                url: serviceBase + 'apps/explore/projects/' + projectId + '/assays/' + assayId + '/samples/search',
                method: 'POST',
                data: angular.toJson(reqChars)
            }).then(
                function (response) {
                    return {
                        data: response.data.data,
                        keys: response.data.keys
                    }
                },
                function (httpError) {
                    // translate the error
                    throw httpError.status + " : " +
                    httpError.data;
                }
            );
        },

        // getAssays: function (projectId) {
        //     return $http({
        //         url: serviceBase + 'apps/explore/projects/' + projectId + '/assays/browse',
        //         method: 'GET'//,
        //         //data: angular.toJson(observations)
        //     }).then(
        //         function (response) {
        //             assays = response.data;
        //             ready = true;
        //
        //             return {
        //                 assays: (response.data)
        //             }
        //         },
        //         function (httpError) {
        //             // translate the error
        //             throw httpError.status + " : " +
        //             httpError.data;
        //         }
        //     );
        //
        // },

        getAssaysInit: function (projectId) {
            var initData = localStorageService.get('ptm.explorer.'+projectId+'.assays');
            //if initData.timestamp < $scope.$parent.expVM.project.lastupdated
            //then refresh from server
            if(initData){
                assays = initData.assays;
                return $q.when(true,function(){
                    return initData
                })
            }
            else
                return $http({
                url: serviceBase + 'apps/explore/projects/' + projectId + '/assaysInit',
                method: 'GET'//,
            }).then(
                function (response) {
                    assays = response.data.assays;
                    ready = true;
                    localStorageService.set('ptm.explorer.'+projectId+'.assays',{
                        assays: (response.data.assays),
                        xfdata: response.data.xfdata
                    });
                    return {
                        assays: (response.data.assays),
                        xfdata: response.data.xfdata
                    }
                },
                function (httpError) {
                    // translate the error
                    throw httpError.status + " : " +
                    httpError.data;
                }
            );
        }
    }
}

angular.module('biospeak.explorer')
    .factory('assayDataService', ['$http', '$q','localStorageService','ngAppConfig', assayDataService])

