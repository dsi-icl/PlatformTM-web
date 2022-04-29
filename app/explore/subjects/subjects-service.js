/**
 * Created by iemam on 19/02/2015.
 */

'use strict'
function subjectDataService($http,$q, localStorageService,ngAppConfig){
        var serviceBase = ngAppConfig.apiServiceBaseUri;

        return {
            getSubjData: function(projectId,characs) {
                if(!characs)
                    characs='';

                return $http({
                    url:serviceBase+'apps/explore/projects/'+projectId+'/subjects/search',
                    method:'POST',
                    data: angular.toJson(characs)
                }).then(
                    function (response) {
                        return response.data.xfdata
                    },
                    function (httpError) {
                        // translate the error
                        throw httpError.status + " : " +
                            httpError.data;
                    });
            },

            getSubjCharacteristics: function(projectId){
                return $http({
                    url: serviceBase + 'apps/explore/projects/' + projectId + '/subjcharacteristics/browse',
                    method: 'GET'
                }).then(
                    function (response) {
                        localStorageService.set('ptm.explorer.'+projectId+'.subjectChars',(response.data));
                        return response.data
                    },
                    function (httpError) {
                        // translate the error
                        throw httpError.status + " : " +
                        httpError.data;
                    }
                );
            },

            initSubjData: function (projectId) {
                 var initData = localStorageService.get('ptm.explorer.'+projectId+'.subjects');
                // //if initData.timestamp < $scope.$parent.expVM.project.lastupdated
                // //then refresh from server
                // console.log(initData)
                // if(initData){
                //     return $q.when(true,function(){
                //         return initData
                //     })
                // }
                // else
                    return $http({
                        url: serviceBase + 'apps/explore/projects/' + projectId + '/subjectsInit',
                        method: 'GET'
                    }).then(
                        function (response) {
                            localStorageService.set('ptm.explorer.'+projectId+'.subjects',(response.data));
                            return response.data
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
    .factory('subjectDataService',['$http','$q','localStorageService','ngAppConfig', subjectDataService])

