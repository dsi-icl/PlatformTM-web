/**
 * Created by iemam on 15/09/2015.
 */
'use strict';

function treeService($http, ngAppConfig){

    var treeService = {}

    var data = [
        { id : 'ajson1', parent : '#', text : 'Simple root node', state: { opened: true} },
        { id : 'ajson2', parent : '#', text : 'Root node 2', state: { opened: true} },
        { id : 'ajson3', parent : 'ajson2', text : 'Child 1', state: { opened: true} },
        { id : 'ajson4', parent : 'ajson2', text : 'Child 2' , state: { opened: true}}
    ]

    var serviceBase = ngAppConfig.apiServiceBaseUri;

    treeService.getData = function(observations, projectId, callback){

        return $http({
            url:serviceBase+'api/export/sample',
            method:'GET'
        }).then(
            function (response){
                console.log(response.data)
                return callback(response.data)
            }
        )
    }

    //provision for re-arranged tree
    treeService.sendData = function(observations, projectId, data){
        return $http({
            url:serviceBase+'api/export/sample',
            method:'POST',
            data: angular.toJson(data)
        }).then(
            function (response) {
                return {
                    header: (response.data.header),
                    data: (response.data.data)
                }
            },
            function (httpError) {
                // translate the error
                throw httpError.status + " : " +
                httpError.data;
            });
    }

    return treeService
}

angular
    .module('eTRIKSdata.export')
    .factory('treeService',['$http', 'ngAppConfig', treeService])



