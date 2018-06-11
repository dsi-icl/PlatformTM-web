/**
 * Created by iemam on 07/03/2017.
 */
'use strict'
function explorerService($http,ngAppConfig,$q) {
    var explorerServiceFactory = {};

    var serviceBase = ngAppConfig.apiServiceBaseUri;

    var currentCart = {};

    var oriCurrentCart;

    var _toggle = true;
    var ready = false;

    var _getCartQuery = function(projectId,cartId){
        return $http({
            url:serviceBase+'queries/'+cartId,
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
        return $http({
            url:serviceBase+'queries/new/'+projectId,
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

        if(item.isSubjectCharacteristics || item.isDesignElement)
            currentCart.subjCharRequests.push(item);
        if(item.isClinicalObservations)
            currentCart.obsRequests.push(item);
        if(item.isSampleCharacteristic){
            currentCart.assayPanelRequests[module].isRequested = true;
            currentCart.assayPanelRequests[module].sampleQuery.push(item);
         // console.debug(currentCart.assayPanelRequests[module])
        }
    };

    var _getCartSize = function () {
        var count = 0;
        count+= currentCart.subjCharRequests.length;
        count+= currentCart.obsRequests.length;
        for (var assayId in currentCart.assayPanelRequests){
            if(currentCart.assayPanelRequests[assayId].isRequested)
                count++;
        }
        return count;
    }

    var _removeFromCart = function(item, module){
        // console.log(item,module,currentCart.assayPanelRequests[module])
        var items = [];
        if(item.isSubjectCharacteristics || item.isDesignElement)
            items = currentCart.subjCharRequests;

        if(item.isClinicalObservations)
            items = currentCart.obsRequests;
        if(item.isSampleCharacteristic)
            items = currentCart.assayPanelRequests[module].sampleQuery;

        var pos;
        for(var i=0; i< items.length;i++) {
            if(item.id === items[i].id){
                pos = i;
                break;
            }
        }
        // console.log('removing ', item, 'from data cart')
        items.splice(pos,1);

        if(items.length ===0 && item.isSampleCharacteristic)
            currentCart.assayPanelRequests[module].isRequested = false;

    };

    var _addAssayPanel = function(panel){
        currentCart.assayPanelRequests[panel.assayId].isRequested = true;
    };

    var _applyFilter = function(id,filters,isRange,module){
         console.debug("UPDATING CART WITH FILTER ",id,filters,isRange,module);
        var found = false;
        var filteredObs;

        var deferred = $q.defer();

        if(module === 'clinical'){
            // console.log(currentCart.obsRequests)
            for(var i=0; i< currentCart.obsRequests.length;i++) {
                if (id === currentCart.obsRequests[i].name) {
                    filteredObs = currentCart.obsRequests[i];
                    found = true;
                    break;
                }
            }
        }


        if(module === 'subject'){
            for(i=0; i< currentCart.subjCharRequests.length;i++) {
                if(id === currentCart.subjCharRequests[i].name){
                    filteredObs = currentCart.subjCharRequests[i];
                    found = true;
                    break;
                }
            }
        }

        if(!found){
            for(var i=0; i< currentCart.assayPanelRequests[module].sampleQuery.length;i++) {
                if (id === currentCart.assayPanelRequests[module].sampleQuery[i].name) {
                    filteredObs = currentCart.assayPanelRequests[module].sampleQuery[i];
                    found = true;
                    break;
                }
            }
        }

        if(!found) deferred.reject();

        //REMOVE FILTER
        if(filters.length === 0){
            console.debug("removing filter");
            filteredObs.filterRangeFrom = 0;
            filteredObs.filterRangeTo = 0;
            filteredObs.filterExactValues = null;
            filteredObs.filterText = dc.printers.filters(filters)
            filteredObs.isFiltered = false;
            deferred.resolve(currentCart)
        }else{
            console.debug('adding filter');
            filteredObs.isFiltered = true;
            filteredObs.filterText = dc.printers.filters(filters);
            if(isRange){
                filteredObs.filterRangeFrom = filters[0][0];
                filteredObs.filterRangeTo = filters[0][1];
            }
            else
                filteredObs.filterExactValues = filters;
            deferred.resolve(currentCart)
        }
        return deferred.promise;
    };

    var _clearCart = function () {
        currentCart.subjCharRequests.forEach(function (req){
            _resetObsQuery(req)
        });
        currentCart.obsRequests.forEach(function (req){
            _resetObsQuery(req);
        });
        currentCart.subjCharRequests = [];
        currentCart.obsRequests = [];
        for (var assayId in currentCart.assayPanelRequests){
            currentCart.assayPanelRequests[assayId].isRequested = false;
            currentCart.assayPanelRequests[assayId].sampleQuery.forEach(function(req){
                _resetObsQuery(req)
            });
            currentCart.assayPanelRequests[assayId].sampleQuery=[];
        }
    };

    var _resetObsQuery = function(obsQ){
        obsQ.isActive = false;

        obsQ.filterRangeFrom = 0;
        obsQ.filterRangeTo = 0;
        obsQ.filterExactValues = null;
        obsQ.filterText = dc.printers.filters([]);
        obsQ.isFiltered = false;
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
            url:serviceBase+'queries',
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
    explorerServiceFactory.getCartSize = _getCartSize;


    explorerServiceFactory.cartIsReady = _cartIsReady;
    return explorerServiceFactory;
}

angular.module('biospeak.explorer')
    .factory('explorerService',['$http','ngAppConfig','$q', explorerService]);
