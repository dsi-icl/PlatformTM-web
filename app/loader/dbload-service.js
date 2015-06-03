/**
 * Created by iemam on 01/06/2015.
 */
angular.module('eTRIKSdata.loader')
    .factory('loadDataService',['$http','$q', function($http,$q) {

        return {
            loadFileToDB: function (filename) {
                console.log(observations)

                return $http({
                    url: 'http://rachmaninoff.local:8080/api/dataParser?dataSource=NOSQL&' +
                         'fileName='+filename+'&page=*&mapping=*',
                    method: 'GET'
                })
                    .then(
                    function (response) {
                        return {
                            observations: (response.data)
                        }
                    },
                    function (httpError) {
                        // translate the error
                        throw httpError.status + " : " +
                        httpError.data;
                    });
            }
        }
    }]);