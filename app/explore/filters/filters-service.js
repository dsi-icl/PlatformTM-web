/**
 * Created by superkillball on 16/11/2015.
 */

'use strict'
function filtersService($rootScope, $http, $q, ngAppConfig) {
    var filtersServiceFactory = {};
    var serviceBase = ngAppConfig.apiServiceBaseUri;
    var filters = {};
    filters.subject = {};
    filters.clinical = {};
    //filters.subject = [];
    var clinicalFilters = {};



    var _updateFilters = function(chartGroup,obs,filter){
        //if(chartGroup == 'subject'){
            //filters.subject[obs] = filter;
            filters[chartGroup][obs] = filter

            console.log('UPDATING FILTERs',filter);
        if(filter.length != 0 && filter[0].length == 2 && angular.isNumber(filter[0][0])){
            console.log('filter[0]:',filter[0],' length',filter[0].length)
            filter[0][0] = Math.round(filter[0][0])
            filter[0][1] = Math.round(filter[0][1])
            console.log(filters[chartGroup][obs],filter)
        }
            //$rootScope.$apply();
            //console.log(filtersServiceFactory.getSubjFilters());
        //}
        //if(chartGroup == 'clinical'){
        //    filters.clinical[obs] = filter;
        //    //console.log('UPDATING FILTER',filters.subject.key);
        //    $rootScope.$apply();
        //    //console.log(filtersServiceFactory.getSubjFilters());
        //}

    }


    var _getFilters = function(){
        //console.log('getSubjFilters')
        return filters;
    }

    var _getFiltersFor = function(chartGroup){

        //if(chartGroup == 'subject'){
        //    console.log(chartGroup,'getFilters')
            //return filters.subject;
            return filters[chartGroup];
        //}
    }

    //var subjectFilters = {};
    //var cart = {};
    //
    //var exportService = {}
    //
    //exportService.subjectFiters = subjectFilters;
    //
    //exportService.deleteFilter = function(){
    //
    //}
    //
    //exportService.updateSubjectFilter = function(obs,filter){
    //    subjectFilters[obs] = filter
    //}
    //
    //exportService.getSubjectFilter = function(){
    //    return subjectFilters
    //}
    //
    //exportService.addToCart = function(type, callback){
    //    cart[type] = subjectFilters
    //    callback()
    //}
    //
    //exportService.getCart = function(){
    //    return cart
    //}

    filtersServiceFactory.updateFilters = _updateFilters;
    filtersServiceFactory.getFilters = _getFilters;
    filtersServiceFactory.getFiltersFor = _getFiltersFor;
    //filtersServiceFactory.filtersLength = filters.subject.length;


    return filtersServiceFactory;
}

angular.module('biospeak.explorer')
    .factory('filtersService',['$rootScope','$http','$q','ngAppConfig', filtersService])


