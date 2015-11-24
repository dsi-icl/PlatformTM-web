/**
 * Created by superkillball on 16/11/2015.
 */

angular.module('eTRIKSdata.explorer')

    .factory('exportService',['$q', function($q){
        var subjectFilters = {};
        var cart = {};

        var exportService = {}

        exportService.subjectFiters = subjectFilters;

        exportService.deleteFilter = function(){

        }

        exportService.updateSubjectFilter = function(obs,filter){
            subjectFilters[obs] = filter
        }

        exportService.getSubjectFilter = function(){
            return subjectFilters
        }

        exportService.addToCart = function(type, callback){
            cart[type] = subjectFilters
            callback()
        }

        exportService.getCart = function(){
            return cart
        }

        return exportService;
    }])

