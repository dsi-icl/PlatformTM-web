/**
 * Created by iemam on 07/03/2017.
 */
'use strict'
function explorerService($http,$rootScope,ngAppConfig) {
    var cartServiceFactory = {};

    var serviceBase = ngAppConfig.apiServiceBaseUri;

    var currentCart = {}
    currentCart.scs = [];
    currentCart.observations = [];
    currentCart.assays=[];

    var _toggle = true;

    /*var _addSubjectCharacteristic = function(sc){
     console.log(sc)
     currentCart.scs.push(sc);

     //_toggle = !_toggle;
     }
     var _addClinicalObservation = function(obs){
     console.log(obs)
     currentCart.observations.push(obs);

     _toggle = !_toggle;
     }
     var _removeSubjectCharacteristic = function(sc){
     //console.log(sc)
     var pos;
     for(var i=0; i< currentCart.scs.length;i++) {
     if(sc.id == currentCart.scs[i].id){
     pos = i;
     break;
     }
     }
     currentCart.scs.splice(pos,1);

     _toggle = !_toggle;
     }
     var _removeClinicalObservation = function(obs){
     var pos;
     for(var i=0; i< currentCart.observations.length;i++) {
     console.log(currentCart.observations[i].id, obs.id)
     if(obs.id == currentCart.observations[i].id){
     pos = i;
     break;
     }
     }
     console.log('removing ', obs, 'from data cart')
     currentCart.observations.splice(pos,1);

     _toggle = !_toggle;
     }*/

    var _addToCart = function(item){
        console.log('Adding ',item)
        if(item.isSubjectCharacteristics || item.isDesignElement)
            currentCart.scs.push(item);
        if(item.isClinicalObservations)
            currentCart.observations.push(item);
        if(item.isMolecularObservations)
            currentCart.assayPanels.push(item);

        //_toggle = !_toggle;
    };

    var _addAssayPanel = function(panel){
        console.log('Adding Panel', panel.assayId);
        currentCart.assays.push(panel);
    }

    var _removeFromCart = function(item){
        var items = []
        if(item.isSubjectCharacteristics)
            items = currentCart.scs

        if(item.isClinicalObservations)
            items = currentCart.observations

        var pos;
        for(var i=0; i< items.length;i++) {
            //console.log(items.id, obs.id)
            if(item.id == items[i].id){
                pos = i;
                break;
            }
        }
        console.log('removing ', item, 'from data cart')
        items.splice(pos,1);
    }


    var _refreshed = function(){
        return _toggle
    }

    var _getCurrentSCS = function(){
        return currentCart.scs;
    }
    var _getCurrentObservations = function(){
        return currentCart.observations;
    };
    var _getCurrentAssayPanels = function(){
        return currentCart.assayPanels;
    }

    var _getUserSavedQueries = function(){
        return null;
    }

    var _saveQuery = function(query,projectId){

        console.log(query)
        var combinedQuery = {}
        combinedQuery.obsRequests = query.cobs.concat(query.scs);
        combinedQuery.name = query.name
        combinedQuery.projectId = projectId;

        //console.log(angular.toJson(combinedQuery))

        return $http({
            url:serviceBase+'apps/explore/projects/'+projectId+'/saveQuery',
            method:'POST',
            data: angular.toJson(combinedQuery)
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
    }



    var _clearCart = function () {
        currentCart.scs = []
        currentCart.observations = []
    };

    var _applyFilter = function(id,filters,isRange){
        console.log(id,filters,isRange);

        var filteredObs;

        for(var i=0; i< currentCart.observations.length;i++) {
            if (id == currentCart.observations[i].name) {
                filteredObs = currentCart.observations[i];
                break;
            }
        }
        for(i=0; i< currentCart.scs.length;i++) {
            if(id == currentCart.scs[i].name){
                filteredObs = currentCart.scs[i];
                break;
            }
        }

        //REMOVE FILTER
        if(filters.length == 0){
            filteredObs.filterRangeFrom = 0;
            filteredObs.filterRangeTo = 0;
            filteredObs.filterExactValues = null;
            filteredObs.filters = dc.printers.filters(filters)
            filteredObs.isFiltered = false;
            _toggle = !_toggle
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
        filteredObs.filters = dc.printers.filters(filters)

        _toggle = !_toggle

        console.log(filteredObs)
        $rootScope.$apply();
    };

    var isFloat = function (n) {
        return n === +n && n !== (n | 0);
    };


    /*cartServiceFactory.addSubjChar = _addSubjectCharacteristic;
     cartServiceFactory.addClinicalObs = _addClinicalObservation;
     cartServiceFactory.removeSubjChar = _removeSubjectCharacteristic;
     cartServiceFactory.removeClinicalObs = _removeClinicalObservation;*/

    cartServiceFactory.addToCart = _addToCart;
    cartServiceFactory.removeFromCart = _removeFromCart;

    cartServiceFactory.addAssayPanelToCart = _addAssayPanel;


    cartServiceFactory.getCurrentSCS = _getCurrentSCS;
    cartServiceFactory.getCurrentObservations = _getCurrentObservations;
    cartServiceFactory.clearCurrentCart = _clearCart;
    cartServiceFactory.clickclack = _refreshed;
    cartServiceFactory.applyFilter = _applyFilter;
    cartServiceFactory.getUserSavedQueries = _getUserSavedQueries;
    cartServiceFactory.saveQuery = _saveQuery
    return cartServiceFactory;
}

angular.module('biospeak.explorer')
    .factory('explorerService',['$http','$rootScope','ngAppConfig', explorerService])
