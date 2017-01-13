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

    //added part start********************************************************
    // In the following ".then" part works on the response of the c#. it puts the response in the "data"
    var _downloadDataset = function(datasetId){
        //console.log("checkout-service part is WORKING- and the file with following ID will be deleted",fileId);
        return $http({

           // url: 'http://localhost:2483/files/remove/'+fileId,
            url:serviceBase+'checkout/datasets/'+datasetId+'/download',
            method: 'GET',
            //data: { name: dirname }
            //Do we actually need "Then" because it's a void type and the back-end doesn't return anything????!!!!!!!!
            // possible answer is that, in this case since we don not get anything returned from c# the "data" would be an empty object
        }).then(
            function (response) {
                return {
                    files: (response.data)
                }
            }
        )
    }
    //added part finish********************************************************



    checkoutServiceFactory.getSavedCart = _getSavedCart;
    checkoutServiceFactory.createCheckoutDatasets = _createCheckoutDatasets;
    checkoutServiceFactory.getDatasetPreview = _getDatasetPreview;
    checkoutServiceFactory.getDatasetsContent = _getDatasetsContent;
    return checkoutServiceFactory
}

angular.module('biospeak.explorer')
    .factory('checkoutService',['$http','$q','ngAppConfig', checkoutService])