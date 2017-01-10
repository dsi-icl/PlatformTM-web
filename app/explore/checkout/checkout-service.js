/**
 * Created by iemam on 14/12/2016.
 */
'use strict'

function checkoutService($http,ngAppConfig){
    var serviceBase = ngAppConfig.apiServiceBaseUri;
    var checkoutServiceFactory = {};


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
            console.log(response)
            var tableHeaders = response.header
            var DTdata = response.data
            return DTdata
        })
    }


    checkoutServiceFactory.getSavedCart = _getSavedCart;
    checkoutServiceFactory.createCheckoutDatasets = _createCheckoutDatasets;
    checkoutServiceFactory.getDatasetPreview = _getDatasetPreview;
    return checkoutServiceFactory
}

angular.module('biospeak.explorer')
    .factory('checkoutService',['$http','ngAppConfig', checkoutService])