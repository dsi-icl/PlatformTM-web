/**
 * Created by iemam on 15/09/2015.
 */
'use strict';

function datasetService($http, $q,ngAppConfig,localStorageService){

    var exportFactory = {}
    var serviceBase = ngAppConfig.apiServiceBaseUri;
    console.log(serviceBase);

    var tableHeaders;
    var DTdata;

    var _getDataFields = function(projectId){
        return $http({
            url: serviceBase + 'api/projects/'+projectId+'/export/datafields/',
            method: 'GET'
        }).then(
            function (response) {
                return {
                    fields: (response.data)

                }
            }
        );

        return fields
    }

    var _saveCriteria = function(user,criteria){
        var deferred = $q.defer();
        localStorageService.set('criteria', {
            user: 'ibrahim',
            criteria: criteria
        });
        deferred.resolve();
        //console.log(fields);
        return deferred.promise;
    }

    var _getCriteria = function(){
        var deferred = $q.defer();
        var criteria = localStorageService.get('criteria')
        if(criteria)
            deferred.resolve(criteria.criteria);
        else deferred.resolve([])
        console.log(criteria);
        return deferred.promise;
    }

    var _clearCriteria = function(){
        //var deferred = $q.defer();
        localStorageService.remove('criteria')
        console.log(localStorageService.get('criteria'))
        //if(criteria)
        //    deferred.resolve(criteria.criteria);
        //else deferred.resolve([])
        //console.log(criteria);
        //return deferred.promise;
    }

    var _getFieldFilter = function(projectId,field){
        return $http({
            url: serviceBase + 'api/projects/'+projectId+'/export/datafields/valueset',
            method: 'POST',
            data: angular.toJson(field)
        }).then(
            function (response) {
                return {
                    filter: (response.data)

                }
            }
        );
    }

    //var _previewData = function(projectId){
    //    var criteria = localStorageService.get('criteria')
    //    if(criteria)
    //        criteria = criteria.criteria;
    //    var deferred = $q.defer();
    //
    //    return $http({
    //        url: serviceBase + 'api/projects/'+projectId+'/export/preview/',
    //        method:'POST',
    //        data:angular.toJson(criteria)
    //    }).then(function(response){
    //        console.log(response.data.header)
    //        tableHeaders = response.data.header
    //        DTdata = response.data.data
    //        return {
    //            header:(response.data.header)
    //        }
    //    })
    //}

    var _previewData = function(projectId){
        var criteria = localStorageService.get('criteria')
            if(criteria)
                criteria = criteria.criteria;

        var deferred = $q.defer();
        $http.post(serviceBase + 'api/projects/'+projectId+'/export/table/',criteria)
            .success(function (response) {
                tableHeaders = response.header
                DTdata = response.data
                //console.log("Inside http get success",tableHeaders)
                deferred.resolve(tableHeaders);
            })
            .error(function (err, code) {
                deferred.reject(err);
                console.log(err, code);
            });
        return deferred.promise;
    }

    var _getDataTableData = function(){
        var deferred = $q.defer();
        deferred.resolve(DTdata);
        return deferred.promise;
    }

    var _getTreeData = function(projectId, callback){

        var criteria = localStorageService.get('criteria')
        if(criteria)
            criteria = criteria.criteria;


        return $http({
            url:serviceBase + 'api/projects/'+projectId+'/export/tree/',
            method:'POST',
            data:angular.toJson(criteria)
        }).then(
            function (response){
                console.log(response.data)
                return callback(response.data)
            }
        )
    }

    //provision for re-arranged tree
    var _sendTreeData = function(observations, projectId, data){
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

    //exportFactory.saveFields = _saveFields;
    exportFactory.getDataFields = _getDataFields;
    exportFactory.saveCriteria = _saveCriteria;
    exportFactory.getCriteria = _getCriteria;
    exportFactory.getFieldFilter = _getFieldFilter;
    exportFactory.clearCriteria = _clearCriteria;
    exportFactory.previewData = _previewData;
    exportFactory.getDataTableData = _getDataTableData;

    exportFactory.getTreeData = _getTreeData;
    exportFactory.sendTreeData = _sendTreeData;


    return exportFactory
}

angular
    .module('bioSpeak.export')
    .factory('datasetService',['$http', '$q','ngAppConfig','localStorageService', datasetService])



