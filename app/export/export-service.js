/**
 * Created by iemam on 15/09/2015.
 */
'use strict';

function exportService($http, $q,ngAppConfig,$resource,localStorageService){

    var exportFactory = {}
    var serviceBase = ngAppConfig.apiServiceBaseUri;
    console.log(serviceBase);

    var tableHeaders;
    var DTdata;

    var _myDatasetResource =  $resource(serviceBase+'mydatasets/:datasetId',{},{
        update:{
            method: 'PUT',
            params: {datasetId: '@id'}
        }/*,
         getMyDatasetsForProject:{
             method: 'GET',
             url : serviceBase+'api/mydatasets/projects/:projectId',
             isArray : true,
             params:{projectId:'@projectId'}

         }*/
    });

    var _saveDataset = function(dataset){
        return $http({
            url: serviceBase + 'datasets/'+dataset.id,
            method: 'PUT',
            data: angular.toJson(dataset)
        }).then(
            function (response) {
                return response.status === 202;
            }
        );
    };

    var _getUserDatasets = function(){
        return $http({
            url: serviceBase + 'datasets/user/',
            method: 'GET'
        }).then(
            function(response){
                return{
                    datasets:(response.data)
                }
            }
        )
    };

    var _getProjectUserDatasets = function(projectId){
        return $http({
            url: serviceBase + 'mydatasets/projects/'+projectId+'/',
            method: 'GET'
        }).then(
            function(response){
                return{
                    datasets:(response.data)
                }
            }
        )
    }

    var _fetchDataset = function(datasetId,projectId){
        var deferred = $q.defer();
        //localStorageService.clearAll();
        var userDataset = localStorageService.get('Dataset_'+datasetId)
        console.log('USERDATASET',userDataset);
        if(!userDataset)
        {
            if(datasetId == 0){
                console.log("new dataset")
                userDataset= new _myDatasetResource();
                userDataset.fields = [];
                userDataset.filters = [];
                userDataset.id=0;
                userDataset.projectId = projectId
                userDataset.type = "Clinical Data";
                userDataset.isNew = true;
                userDataset.ownerId = "temp";
                _updateLocalDS(userDataset).then(function(){
                    deferred.resolve(userDataset)
                })
            }else{
                _myDatasetResource.get({datasetId:datasetId},function(response) {
                    userDataset = response;
                    userDataset.isNew = false;
                    userDataset.dsRetrieved = true
                    console.log("Retrieved User Dataset",userDataset);
                    _updateLocalDS(userDataset).then(function(){
                        deferred.resolve(userDataset)
                    })

                })
            }
        }else{

            deferred.resolve(userDataset.dataset);
        }
        return deferred.promise;
    };

    var _getDataFields = function(projectId){
        return $http({
            url: serviceBase + 'apps/exportwizard/projects/'+projectId+'/datafields/',
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

    var _getFieldFilter = function(projectId,field){
        return $http({
            url: serviceBase + 'apps/exportwizard/projects/'+projectId+'/datafields/valueset',
            method: 'POST',
            data: angular.toJson(field)
        }).then(
            function (response) {
                return {
                    field: (response.data)

                }
            }
        );
    }

    var _previewData = function(projectId, datasetId){
        var deferred = $q.defer();
        var userDataset = localStorageService.get('Dataset_'+datasetId)
        console.log('USERDATASET',userDataset);
            if(!userDataset)
                return deferred.promise
        var dataset = userDataset.dataset;


        $http.post(serviceBase + 'apps/exportwizard/projects/'+projectId+'/preview/',dataset)
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
            url:serviceBase + 'projects/'+projectId+'/export/tree/',
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
            url:serviceBase+'export/sample',
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
    
    var _updateLocalDS = function(DS){
        var deferred = $q.defer();
        localStorageService.set("Dataset_"+DS.id, {
            user: DS.ownerId,
            dataset: DS
        });
        deferred.resolve();
        console.log("...saving ",'Dataset_',DS);
        return deferred.promise;
    }

    var _removeLocalDS = function(DS){
        localStorageService.remove("Dataset_"+DS.id);
    }

    /*    var _saveCriteria = function(user,criteria){
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
     }*/
    /*    var _saveUserDataset = function(DS){
     return $http({
     url: serviceBase + 'api/mydatasets',
     method: 'POST',
     data: angular.toJson(DS)
     }).then(
     function (response) {
     return {
     ds: (response.data)
     }
     },
     function (httpError) {
     // translate the error
     throw httpError.status + " : " +
     httpError.data;
     });
     }

     var _updateUserDataset = function(DS){
     return $http({
     url: serviceBase + 'api/mydatasets',
     method: 'PUT',
     params: {datasetId: '@id'},
     data: angular.toJson(DS)
     }).then(
     function (response) {
     return {
     ds: (response.data)
     }
     },
     function (httpError) {
     // translate the error
     throw httpError.status + " : " +
     httpError.data;
     });
     }*/


    exportFactory.getProjectUserDatasets = _getProjectUserDatasets;
    exportFactory.getDataFields = _getDataFields;

    exportFactory.getFieldFilter = _getFieldFilter;

    exportFactory.previewData = _previewData;
    exportFactory.getDataTableData = _getDataTableData;

    exportFactory.getTreeData = _getTreeData;
    exportFactory.sendTreeData = _sendTreeData;
    
    exportFactory.updateLocalDS = _updateLocalDS;

    exportFactory.getMyDatasetResource = _myDatasetResource;
    exportFactory.removeLocalDS = _removeLocalDS;

    exportFactory.saveDataset = _saveDataset;
    exportFactory.getUserDatasets = _getUserDatasets;

    //exportFactory.saveFields = _saveFields;
    //exportFactory.getUserDataset = _getUserDataset;
    //exportFactory.saveUserDataset = _saveUserDataset;
    //exportFactory.updateUserDataset = _updateUserDataset;
    // exportFactory.clearCriteria = _clearCriteria;
    /* exportFactory.saveCriteria = _saveCriteria;
     exportFactory.getCriteria = _getCriteria;*/



    exportFactory.fetchDataset= _fetchDataset;


    return exportFactory
}

angular
    .module('bioSpeak.export')
    .factory('exportService',['$http', '$q','ngAppConfig','$resource','localStorageService', exportService])



