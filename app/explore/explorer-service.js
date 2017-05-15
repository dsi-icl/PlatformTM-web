/**
 * Created by iemam on 07/03/2017.
 */
'use strict'
function explorerService($http,$rootScope,ngAppConfig) {
    var explorerServiceFactory = {};

    var serviceBase = ngAppConfig.apiServiceBaseUri;

    var currentCart = {}

    var _toggle = true;
    var ready = false;

    var _getCartQuery = function(projectId,cartId){
        return $http({
            url:serviceBase+'apps/explore/projects/'+projectId+'/queries/'+cartId,
            method:'GET'
        })
            .then(
                function (response) {
                    currentCart = response.data;
                    ready = true;
                    return {cart: (response.data),

                    }
                },
                function (httpError) {
                    // translate the error
                    throw httpError.status + " : " +
                    httpError.data;
                });
    };

    var _getNewCartQuery = function(projectId){
        var cartId = "new";
        return $http({
            url:serviceBase+'apps/explore/projects/'+projectId+'/queries/'+cartId,
            method:'GET'
        })
            .then(
                function (response) {
                    currentCart = response.data;
                    ready = true;
                    return {cart: (response.data),
                    }
                },
                function (httpError) {
                    // translate the error
                    throw httpError.status + " : " +
                    httpError.data;
                });
    };

    var _addToCart = function(item, module){
        //console.log('Adding ',item, module)
        if(item.isSubjectCharacteristics || item.isDesignElement)
            currentCart.subjCharRequests.push(item);
        if(item.isClinicalObservations)
            currentCart.obsRequests.push(item);
        if(item.isSampleCharacteristic){
            currentCart.assayPanelRequests[module].isRequested = true;
            currentCart.assayPanelRequests[module].sampleQuery.push(item);
        }
        //_toggle = !_toggle;
    };

    var _removeFromCart = function(item, module){
        var items = []
        if(item.isSubjectCharacteristics || item.isDesignElement)
            items = currentCart.subjCharRequests

        if(item.isClinicalObservations)
            items = currentCart.obsRequests;
        if(item.isSampleCharacteristic)
            items = currentCart.assayPanelRequests[module];

        var pos;
        for(var i=0; i< items.length;i++) {
            //console.log(items.id, obs.id)
            if(item.id == items[i].id){
                pos = i;
                break;
            }
        }
        // console.log('removing ', item, 'from data cart')
        items.splice(pos,1);
    };

    var _addAssayPanel = function(panel){
        //console.log('Adding Panel', panel.assayId);
        currentCart.assayPanelRequests[panel.assayId].isRequested = true;
        //console.log(currentCart);

       // _toggle = !_toggle;
    };

    var _applyFilter = function(id,filters,isRange,module){
         console.log("UPDATING CART WITH FILTER ",id,filters,isRange,module);
        var found = false;
        var filteredObs;

        if(module == 'clinical'){
            // console.log(currentCart.obsRequests)
            for(var i=0; i< currentCart.obsRequests.length;i++) {
                if (id == currentCart.obsRequests[i].name) {
                    filteredObs = currentCart.obsRequests[i];
                    found = true
                    break;
                }
            }
        }


        if(module == 'subject'){
            for(i=0; i< currentCart.subjCharRequests.length;i++) {
                if(id == currentCart.subjCharRequests[i].name){
                    filteredObs = currentCart.subjCharRequests[i];
                    found = true
                    break;
                }
            }
        }

        if(!found){
            for(var i=0; i< currentCart.assayPanelRequests[module].sampleQuery.length;i++) {
                if (id == currentCart.assayPanelRequests[module].sampleQuery[i].name) {
                    filteredObs = currentCart.assayPanelRequests[module].sampleQuery[i];
                    found = true;
                    break;
                }
            }
        }

        if(!found) return;

        //REMOVE FILTER
        if(filters.length == 0){
            filteredObs.filterRangeFrom = 0;
            filteredObs.filterRangeTo = 0;
            filteredObs.filterExactValues = null;
            filteredObs.filterText = dc.printers.filters(filters)
            filteredObs.isFiltered = false;
           // _toggle = !_toggle
            $rootScope.$apply();
            return;
        }

        if(isRange){
            filteredObs.filterRangeFrom = filters[0][0];
            filteredObs.filterRangeTo = filters[0][1];
        }
        else
            filteredObs.filterExactValues = filters;

        filteredObs.isFiltered = true;
        filteredObs.filterText = dc.printers.filters(filters)

        //_toggle = !_toggle

        // console.log(filteredObs)
        $rootScope.$apply();
    };

    var _clearCart = function () {
        currentCart.subjCharRequests = []
        currentCart.obsRequests = []
        currentCart.assayPanelRequests = {}
    };






    var _cartIsReady = function(){
        return ready;
    };
    var _refreshed = function(){
        return _toggle
    };

    var _getCurrentCartQuery = function(){
        return currentCart;
    };
    var _getCartSubjObsReq = function(){
        return currentCart.subjCharRequests;
    };
    var _getCurrentObservations = function(){
        return currentCart.obsRequests;
    };
    var _getCurrentAssayPanels = function(){

        return currentCart.assayPanelRequests;
    };


    var _getUserQueries = function(projectId){
        return $http({
            url:serviceBase+'apps/explore/projects/'+projectId+'/queries/browse',
            method:'GET'
        })
            .then(
                function (response) {
                    //currentCart = response.data;
                    return {
                        queries: (response.data),
                    }
                },
                function (httpError) {
                    // translate the error
                    throw httpError.status + " : " +
                    httpError.data;
                });
    };

    var _saveQuery = function(query,projectId){

        return $http({
            url:serviceBase+'apps/explore/projects/'+projectId+'/saveQuery',
            method:'POST',
            data: angular.toJson(currentCart)
        })
            .then(
                function (response) {
                    return {
                        cartId: (response.data.id),
                    }
                },
                function (httpError) {
                    // translate the error
                    throw httpError.status + " : " +
                    httpError.data;
                });
    };


    var isFloat = function (n) {
        return n === +n && n !== (n | 0);
    };




    explorerServiceFactory.addToCart = _addToCart;
    explorerServiceFactory.removeFromCart = _removeFromCart;
    explorerServiceFactory.addAssayPanelToCart = _addAssayPanel;
    explorerServiceFactory.getCurrentCartQuery = _getCurrentCartQuery;
    explorerServiceFactory.getCurrentAssayPanels = _getCurrentAssayPanels;
    explorerServiceFactory.clearCart = _clearCart;
    explorerServiceFactory.clickclack = _refreshed;
    explorerServiceFactory.applyFilter = _applyFilter;
    explorerServiceFactory.getUserQueries = _getUserQueries;
    explorerServiceFactory.saveQuery = _saveQuery;
    explorerServiceFactory.getCartQuery = _getCartQuery;
    explorerServiceFactory.getNewCartQuery = _getNewCartQuery;

    explorerServiceFactory.getCartSubjObsReq = _getCartSubjObsReq;

    explorerServiceFactory.cartIsReady = _cartIsReady;
    return explorerServiceFactory;
}

angular.module('biospeak.explorer')
    .factory('explorerService',['$http','$rootScope','ngAppConfig', explorerService])
