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
            url:serviceBase+'checkout/datasets/'+datasetId+'/preview',
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
            url: serviceBase + 'checkout/datasets/' + datasetId + '/download',
            params: {datasetId: datasetId},
            responseType: ''
        }).success(function (data, status, headers, config) {

            console.log("CSV FILE IS !!!!!:", data);

           // In the following line the "fileName" should be asigned from header.

            var filenName = 'dataset.csv';

            var file = new Blob([data], {type: 'text/csv'});
            //trick to download store a file having its URL
            var fileURL = URL.createObjectURL(file);
            var a = document.createElement('a');
            a.href = fileURL;
            a.target = '_blank';
            a.download = filenName;
            document.body.appendChild(a);
            a.click();
        }).error(function (data, status, headers, config) {
        });
    }




    checkoutServiceFactory.getSavedCart = _getSavedCart;
    checkoutServiceFactory.createCheckoutDatasets = _createCheckoutDatasets;
    checkoutServiceFactory.getDatasetPreview = _getDatasetPreview;
    checkoutServiceFactory.getDatasetsContent = _getDatasetsContent;
    checkoutServiceFactory.downloadDataset = _downloadDataset;
    return checkoutServiceFactory
}

angular.module('biospeak.explorer')
    .factory('checkoutService',['$http','$q','ngAppConfig', checkoutService])