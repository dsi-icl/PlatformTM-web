/**
 * Created by iemam on 15/09/2015.
 */
'use strict';

function wizardService($http, $q,ngAppConfig,localStorageService){

    var serviceBase = ngAppConfig.apiServiceBaseUri;
    var wizardServiceFactory = {};

    var tableHeaders;
    var DTdata;


    var _checkValidTemplate = function(datasetId,fileId){
        var deferred = $q.defer();

        $http.get(serviceBase + 'datasets/'+datasetId+'/validate/'+fileId)
            .success(function (response) {
                console.log("Inside http get success",response)

                deferred.resolve(response);
            })

            .error(function (err, status) {
                /*_logOut();*/
                deferred.reject(err);
            });

        return deferred.promise;
    }

    var _getFile = function(fileId){
        var deferred = $q.defer();

        $http.get(serviceBase + 'files/'+fileId)
            .success(function (response) {
                //console.log("Inside http get success",response)

                deferred.resolve(response);
            })

            .error(function (err, status) {
                /*_logOut();*/
                deferred.reject(err);
            });

        return deferred.promise;
    }

    var _getActivities = function(projectId){
        var deferred = $q.defer();

        $http.get(serviceBase + 'projects/'+projectId+'/activities/')
            .success(function (response) {
                console.log("Inside http get success",response)

                deferred.resolve(response);
            })

            .error(function (err, status) {
                /*_logOut();*/
                deferred.reject(err);
            });

        return deferred.promise;
    };

    var _getTemplateMap = function(datasetId){
        var deferred = $q.defer();
        $http.get(serviceBase + 'datasets/'+datasetId+'/templateMap/')
            .success(function (response) {
                console.log("Inside http get success",response)
                deferred.resolve(response);
            })

            .error(function (err, status) {
                /*_logOut();*/
                deferred.reject(err);
            });

        return deferred.promise;
    };

    var _getDataTablePreview = function(datasetId, fileId){
        //console.log(datasetId,standardfileId);
        var deferred = $q.defer();
        $http.get(serviceBase + 'files/'+fileId+'/preview/')
            .success(function (response) {
                var dtColumns = [];
                response.columns.forEach(function(col){
                    var dtColumn = {}
                    dtColumn.data = col.columnName.toLowerCase();
                    dtColumn.title = col.columnName;
                    dtColumns.push(dtColumn);
                });

                tableHeaders = dtColumns;
                DTdata = response.rows
                deferred.resolve(tableHeaders);
            })
            .error(function (err, code) {
                deferred.reject(err);
                console.log(err, code);
            });
        return deferred.promise;
    };

    var _mapFileToTemplate = function(datasetId,fileId,map){
        var deferred = $q.defer();
        $http.post(serviceBase + 'datasets/'+datasetId+'/mapToTemplate/file/'+fileId,map)
            //$http.get('../data/dt.json')
            .success(function (response) {
                //tableHeaders = response.header
                //DTdata = response.data
                //console.log("Inside http get success",tableHeaders)
                deferred.resolve(response);
            })
            .error(function (err, code) {
                deferred.reject(err);
                console.log(err, code);
            });
        return deferred.promise;
    };

    var _getDataTableData = function(){
        var deferred = $q.defer();
        //console.log(DTdata)
        deferred.resolve(DTdata);
        return deferred.promise;
    };

    var _saveMap = function(map,datasetId){
        //TODO:Add projectId and possibly userId to this localstorage
        localStorageService.set(datasetId+'_map', { map: map, datasetId: datasetId});
    };

    var _getMap = function(datasetId){
        var storedMap =  localStorageService.get(datasetId+'_map');
        console.log(storedMap)
        if(storedMap) return storedMap.map
        else return null
    };

    var _updateDatasetFile = function(dataset){
        var deferred = $q.defer();
        $http.post(serviceBase + 'datasets/'+dataset.id+'/update/',dataset)
            .success(function (response) {
                console.log("Inside http get success",response)
                deferred.resolve(response);
            })
        return deferred.promise;
    };

    var _loadDataset = function(datasetId, fileId){
        var deferred = $q.defer();
        $http.get(serviceBase + 'datasets/'+datasetId+'/saveDataFile/file/'+fileId)
            .success(function (response) {
                console.log("LOAD DATASET Inside http get success",response)
                deferred.resolve(response);
            })
        return deferred.promise;
    };

    var _extractObs = function(datasetId, fileId){
        var deferred = $q.defer();
        $http.get(serviceBase + 'datasets/'+datasetId+'/loadData/file/'+fileId)
            .success(function (response) {
                console.log("EXTRACT OBSERVATIONS Inside http get success",response)
                deferred.resolve(response);
            })
        return deferred.promise;
    };

    wizardServiceFactory.checkValidTemplate = _checkValidTemplate;
    wizardServiceFactory.getActivities = _getActivities;
    wizardServiceFactory.getTemplateMap = _getTemplateMap;
    wizardServiceFactory.mapFileToTemplate = _mapFileToTemplate;
    wizardServiceFactory.getDataTablePreview = _getDataTablePreview;
    wizardServiceFactory.getDataTableData = _getDataTableData;
    wizardServiceFactory.saveMap = _saveMap;
    wizardServiceFactory.getMap = _getMap;
    wizardServiceFactory.loadDataset = _loadDataset;
    wizardServiceFactory.extractObs = _extractObs;
    wizardServiceFactory.updateDatasetFile = _updateDatasetFile;
    wizardServiceFactory.getFile = _getFile;


    return wizardServiceFactory;
}

angular
    .module('bioSpeak.import')
    .factory('wizardService',['$http', '$q','ngAppConfig','localStorageService', wizardService]);

