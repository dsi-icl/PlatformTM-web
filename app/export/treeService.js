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

    treeService.getData = function(observations, projectId){

        return data
        //return $http({
        //    url:serviceBase+'api/projects/'+projectId+'/subjects/characteristics',
        //    method:'GET'
        //}).then(
        //    function (response){
        //        return
        //        {
        //            SCs: (response.data)
        //        }
        //    }
        //)
    }

    //provision for re-arranged tree
    treeService.sendData = function(observations, projectId){
        return $http({
            url:serviceBase+'api/studies/'+projectId+'/data/subjects/characteristics',
            method:'POST',
            data: angular.toJson(characs)
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



