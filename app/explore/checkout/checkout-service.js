/**
 * Created by iemam on 14/12/2016.
 */
'use strict'

function checkoutService($http,$q,ngAppConfig){
    var serviceBase = ngAppConfig.apiServiceBaseUri;
    var checkoutServiceFactory = {};

    var DTdata = {}



    var _getSavedCart = function(projectId,cartId){
        return $http({
            url:serviceBase+'apps/explore/projects/'+projectId+'/queries/'+cartId,
            method:'GET'
        })
            .then(
                function (response) {
                    return {
                        cart: (response.data),

                    }
                },
                function (httpError) {
                    // translate the error
                    throw httpError.status + " : " +
                    httpError.data;
                });
    }

    var _createCheckoutDatasets = function(cartId){
        return $http({
            url:serviceBase+'checkout/'+cartId,
            method:'GET'
        }).then(function(response){
            console.log(response)
            return response.data

        },
        function(httpError){
            throw httpError.status + " : " +
            httpError.data;
        })
    }

    var _getDatasetPreview = function(datasetId){
        return $http({
            url:serviceBase+'apps/export/datasets/'+datasetId+'/preview',
            method:'GET'
        }).then(function(response){
            var DT = response.data;
            DTdata[datasetId] = response.data.rows;
            //console.log(DTdata)
            return DT;
        })
    };

    var _getDatasetsContent = function(datasetId){
        var deferred = $q.defer();
        //console.log(DTdata[datasetId])
        deferred.resolve(DTdata[datasetId]);
        return deferred.promise;
    }



    var _downloadDataset = function(datasetId) {
        console.log("The following dataset will be downloaded:", datasetId);
        $http({
            method: 'GET',
            url: serviceBase + 'apps/export/datasets/' + datasetId + '/download',
            params: {datasetId: datasetId},
            responseType: ''
        }).success(function (data, status, headers) {

        headers = headers();
        console.log("header is",headers)
        var fileName = headers['x-filename'];
         var file = new Blob([data], {type: headers['content-type']});
         var fileURL = URL.createObjectURL(file);
         var a = document.createElement('a');
            a.href = fileURL;
            a.target = '_blank';
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
        }).error(function (data, status, headers, config) {
        });
    }

    var _prepareDataset = function(datasetId) {
    //    console.log("The following dataset will be prepared:", datasetId);
        return  $http({
            method: 'GET',
            url: serviceBase + 'apps/export/datasets/' + datasetId + '/export'
         }).then(function(response){
            return{outcome :(response.statusText)}
                                     });
    }

    var _isFileReady= function(datasetId) {
    //    console.log("check if following dataset is ready to download:", datasetId);
        return $http({
            method: 'GET',
            url: serviceBase + 'apps/export/datasets/' + datasetId + '/IsFileReady'
        }).then(function(result){
           return{ outcome1 :(result.data)}
                     });
    }

    checkoutServiceFactory.getSavedCart = _getSavedCart;
    checkoutServiceFactory.createCheckoutDatasets = _createCheckoutDatasets;
    checkoutServiceFactory.getDatasetPreview = _getDatasetPreview;
    checkoutServiceFactory.getDatasetsContent = _getDatasetsContent;
    checkoutServiceFactory.downloadDataset = _downloadDataset;
    checkoutServiceFactory.prepareDataset = _prepareDataset;
    checkoutServiceFactory.isFileReady = _isFileReady;
    return checkoutServiceFactory
}

angular.module('biospeak.explorer')
    .factory('checkoutService',['$http','$q','ngAppConfig', checkoutService])