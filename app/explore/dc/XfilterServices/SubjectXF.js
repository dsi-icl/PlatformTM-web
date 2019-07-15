/**
 * Created by iemam on 17/10/2014.
 */

'use strict'
function SubjectXF(subjectDataService,$q){

    var subjChars;
    var dimensions = [], groups = [];
    var cfdata;
    var all;
    // var dataToPlot;
    var XFserviceName = 'SubjCf';

    var subjCfService = {};
    var cfReady;
    var subjectColumnName = "subjectId";
    var subjectDim;

    // subjCfService.init = function () {
    //     dimensions = [];
    //     groups = [];
    //     cfdata = null;
    //     all = null;
    //     cfReady = false;
    // };

    subjCfService.initXF = function (assayXfObj) {

        var ready = true;
        return $q.when(ready,function () {
            dimensions = [];
            groups = [];
            cfdata = null;
            all = null;
            cfReady = false;
            createXF(assayXfObj.data,assayXfObj.keys);
        })
    }

    subjCfService.formatData = function(data, requestedObsvs){

        var dateTimeFormat = d3.timeFormat('%Y-%m-%dT%H:%M');
        var dateFormat = d3.timeParse('%Y-%m-%d');

        if(requestedObsvs)
            data.forEach(function(d) {
                requestedObsvs.forEach(function(o){
                    if(o.dataType === "dateTime"){
                        var date = dateFormat(d[o.name]);
                        if(date === null){
                            date = dateFormat(d[o.name]);
                        }
                        d[o.name] = date;
                    }else if(o.dataType === "string"){
                        if(d[o.name] === null) d[o.name] = ""
                    }else {
                        if(d[o.name] !== null) d[o.name] = +d[o.name];
                    }
                })
            });
        //console.log(data)
    };

    subjCfService.refreshCf = function(projectId,requestedObsvs){
        var deferred = $q.defer();

        this.getData(projectId, requestedObsvs).then(function(dataObj){
            var data = dataObj.data;
            var keys = dataObj.keys;
            subjCfService.formatData(data, requestedObsvs);
            createXF(data,keys);
            deferred.resolve(keys)

        });
        return deferred.promise
    };

    var createXF = function (data,keys) {
        cfdata = crossfilter(data);
        all = cfdata.groupAll();

        subjectDim = cfdata.dimension(function(d) {return d[subjectColumnName]});
        // console.log("=============Creating Subject XF============")
        keys.forEach(function(sc){
            var dim = cfdata.dimension(function (d) {
                return d[sc];
            });
            dimensions[sc] = dim
            var grp = dim.group();
            var reducer = reductio()
                .filter(function(d) { return  d[sc] !== "" })
                .count(true)
            reducer(grp);
            groups[sc] = grp;
        });
        cfReady = true;
    }

    subjCfService.getData = function(projectId,requestedObsvs){
        var deferred = $q.defer();

        subjectDataService.getSubjData(projectId,requestedObsvs)
            .then(function(response){
                console.log('inside getDAta',response)
                // dataToPlot = response.data;
                subjChars = response.keys; //These are the list of HEADERS in the CF data
                deferred.resolve(response)
            });

        return deferred.promise
    };

    subjCfService.cfReady = function(){
        return cfReady;
    };

    subjCfService.getDimension = function(key){

        return dimensions[key];
    };

    subjCfService.getGroup = function(key){
        return groups[key];
    };

    subjCfService.hasDimension = function(dim){
        return dim in dimensions;
    };

    /**
     * Count Widget Methods
     *
     */
    subjCfService.getCountData = function(){
        return cfdata
    };

    subjCfService.getCountGroup = function(){
        return all
    };
    /********************************************
     **/

    subjCfService.getCountValue = function(){
        if(cfReady)
            return all.value();
        else return null
    };

    subjCfService.getTableDimension = function(){
        return subjectDim
    };

    subjCfService.getTableGroup = function(){
        return function(d) {return "booo"}
        //return function(d) {return d[subjectColumnName]}
    };

    subjCfService.getTableHeaders = function(){
        var columns = [subjectColumnName];
        columns = columns.concat(subjChars)
        return columns;
    };

    subjCfService.getSubjectHeader = function(){
        return subjectColumnName
    }

    subjCfService.getSubjectKey = function () {
        return subjectColumnName;
    };


    /**
     * XFlinker methods
     */
    subjCfService.filterBySubjects = function(filteredSubjectIds){
        if(subjectDim){
            subjectDim.filterFunction(function(d) { return filteredSubjectIds.indexOf(d) > -1;})
            dc.redrawAll("subject");
        }
    };

    subjCfService.getCurrentSubjectIds = function(){
        //TODO: CHECK IF ANY DIMENSIONS ARE FILTERED FIRST
        return ($.map(subjectDim.top(Infinity), function(d) {return d.subjectId }))
    };

    subjCfService.resetSubjectFilter = function(){
        if(subjectDim) subjectDim.filter(null);
        dc.redrawAll("subject");
    };

    subjCfService.removeFilters = function(obs){
        console.log('inside remove filter',obs, dimensions[obs])
        dimensions[obs].filterAll();
        dc.redrawAll("subject");
        dc.renderAll("subject");
    }

    subjCfService.getXFname = function(){
        return XFserviceName;
    }

    subjCfService.resetAll = function(){
        subjectDim.filter(null);
        for (var key in dimensions){
            dimensions[key].filter(null);
        };
        dc.redrawAll("subject");
    };



    return subjCfService
}

angular.module('biospeak.dcPlots')
    .factory('SubjectXF',['subjectDataService','$q', SubjectXF]);