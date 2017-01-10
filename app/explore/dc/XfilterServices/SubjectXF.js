/**
 * Created by iemam on 17/10/2014.
 */

'use strict'
function SubjectXF(subjectDataService,$q){


    var subjChars;
    var dimensions = [], groups = [];
    var cfdata;
    var all;
    var dataToPlot;
    var XFserviceName = 'SubjCf'

    var subjCfService = {}
    var cfReady;
    var subjectColumnName = "subjectId";
    var subjectDim;

    subjCfService.formatData = function(data, requestedObsvs){

        //console.log('data AFTER passing to format data',data)

        var dateFormat = d3.time.format('%Y-%m-%dT%H:%M').parse


        data.forEach(function(d) {
            //console.log(d)
            requestedObsvs.forEach(function(o){
                //console.log(o.name); console.log(o.dataType)
                if(o.dataType == "dateTime"){
                    //console.log(d)
                    d[o.name] = dateFormat(d[o.name]);
                    //console.log('2',d[o.name])
                }else if(o.dataType == "string"){
                    if(d[o.name] == null) d[o.name] = ""
                }else {
                    //console.log(o.id,' is numeric')
                    if(d[o.name] != null) d[o.name] = +d[o.name];
                }




            })
        });
        //console.log(data)
    }

    subjCfService.refreshCf = function(projectId,requestedObsvs){
        var deferred = $q.defer();

        this.getData(projectId, requestedObsvs).then(function(data){
            //use property dataType to coerce string to numerals

            //console.log('inside inititialize')
            //console.log('dataToPlot',dataToPlot)
            //console.log('data',data)


            // data.forEach(function(d) {
            //     //d.dtg   = dtgFormat.parse(d.origintime.substr(0,19));
            //     //d.lat   = +d.latitude;
            //     d['age']  = +d['age'];
            //     //d.Race   = d.Race;
            //     //d.depth = d3.round(+d.depth,0);
            // });

            //console.log('data before passing to format data',data)
            //console.log(dataToPlot)

            subjCfService.formatData(data, requestedObsvs);

            cfdata = crossfilter(data);
            all = cfdata.groupAll();
            //console.log('inside initialize',subjChars)

            subjectDim = cfdata.dimension(function(d) {return d[subjectColumnName]})
            dimensions[subjectColumnName] = subjectDim

            console.log("=============Creating Subject XF============")

            subjChars.forEach(function(sc){
                console.log("creating dimension for ",sc);
                var dim = cfdata.dimension(function (d) {
                    return d[sc];
                });
                dimensions[sc] = dim
                //var grp = dim.group().reduceCount();
                var grp = dim.group();
                var reducer = reductio()
                    .filter(function(d) { return  d[sc] != "" })
                    .count(true)
                reducer(grp);
                groups[sc] = grp;
            })
            cfReady = true
            deferred.resolve(subjChars)
        })
        return deferred.promise
    }

    subjCfService.getData = function(projectId,requestedObsvs){
        var deferred = $q.defer();

        subjectDataService.getSubjData(projectId,requestedObsvs)
            .then(function(response){
                //console.log('inside getDAta',response)
                dataToPlot = response.data;
                subjChars = response.header; //These are the list of HEADERS in the CF data
                //No need to maintain on the client?!
                deferred.resolve(dataToPlot)

            })

        return deferred.promise
    }

    subjCfService.getDimension = function(key){

        return dimensions[key];
    }

    subjCfService.getGroup = function(key){
//            console.log(key)
        return groups[key];
    }

    subjCfService.getCountData = function(){
        return cfdata
    }

    subjCfService.getCountGroup = function(){
        return all
    }

    subjCfService.getTableDimension = function(){
        return subjectDim
    }

    subjCfService.getTableGroup = function(){
        return function(d) {return "booo"}
        //return function(d) {return d[subjectColumnName]}
    }

    subjCfService.getTableHeaders = function(){
        var columns = [subjectColumnName];
        columns = columns.concat(subjChars)

        return columns;
    }

    subjCfService.getSubjectHeader = function(){
        return subjectColumnName
    }

    subjCfService.filterBySubjects = function(filteredSubjectIds){
        subjectDim.filterFunction(function(d) { return filteredSubjectIds.indexOf(d) > -1;})
        dc.renderAll("subject");
    }

    subjCfService.getCurrentSubjectIds = function(){
        return ($.map(subjectDim.top(Infinity), function(d) {return d.subjectId }))
    }

    subjCfService.cfReady = function(){
        return cfReady;
    }

    subjCfService.removeFilters = function(obs){
        console.log('inside remove filter',obs, dimensions[obs])
        dimensions[obs].filterAll();
        dc.redrawAll("subject");
        dc.renderAll("subject");
    }

    subjCfService.resetSubjectFilter = function(){
        console.log('resetting subject xfilter')
        subjectDim.filter(null);
        dc.redrawAll("subject");
    }

    subjCfService.getXFname = function(){
        return XFserviceName;
    }

    subjCfService.setActiveFilters = function(obs,filter){

    }

    return subjCfService
}

angular.module('biospeak.dcPlots')
    .factory('SubjectXF',['subjectDataService','$q', SubjectXF]);