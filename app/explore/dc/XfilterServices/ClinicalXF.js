/**
 * Created by iemam on 17/10/2014.
 */

'use strict'
function ClinicalXF(clinicalDataService,$q){

    var subjectDim = {},
        subjectColumnName = "subjectId",
        visitColumnName = "visit";

    var XFserviceName = 'ClinicalCf'
    var IsSubjectFiltered = false;

    var dimensions = [],
        groups = [],
        timeGroups = [],
        timeDimension;

    var xfilter = {} //"findings":xf, "events":xf

    var findingsXfilter,
        eventsXfilter,
        findingsColumns,
        eventsColumns;

    var activeFilters = [];


    var dataToPlot = {};
    var tableDimensions = {}, tableHeaders = {};


    var cfReady=false;
    var cfservice = {};

    cfservice.formatData = function(data, requestedObsvs){
        // format our data
        var dateTimeFormat = d3.time.format('%Y-%m-%dT%H:%M').parse;
        var dateFormat = d3.time.format('%Y-%m-%d').parse;

        data.forEach(function(d) {

            requestedObsvs.forEach(function(o){
                // console.log(o.id); console.log(o.dataType)
                if(o.dataType === "dateTime"){
                    var date = dateTimeFormat(d[o.name]);
                    if(date === null){
                        date = dateFormat(d[o.name]);
                    }
                    d[o.name] = date;
                }
                else if(o.dataType === "string"){
                    if(d[o.name] === null) d[o.name] = ""
                }else {
                    //console.log(o.id,' is numeric')
                    if(d[o.name] !== null) d[o.name] = +d[o.name];
                }

            })
        });
    };

    cfservice.generateXf = function(data,columns,isFindings){

        function reduceAdd(key) {
            //console.log(key)
            return function(p, v){
                //console.log('p is ',p)
                //console.log('v of ',key,' is', v)

                if(v[key] === null && p === null){
                    console.log("here")
                    return null;
                }
                //p += v[key];
                //return p;
                return p + 1;
            }
        }
        function reduceRemove(key) {
            return function(p, v){
                if(v[key] === null && p === null){ return null; }
                //p -= v[key];
                //return p;
                return p - 1;
            }
        }
        function reduceInit(key) {
            return null;
        }
        //TODO: return if data is null
        xfilter = crossfilter(data)

        columns.forEach(function(obs){
            if(obs===visitColumnName)
                return;

            /**
             * Creating histogram count groups
             */
            var dim = xfilter.dimension(function (d) {return d[obs]});
            dimensions[obs] = dim
            var grp = dim.group();

            if(grp.all()[0] && grp.all()[0].key === "")
                grp.all()[0].key = "(Blanks)";


            var reducer = reductio()
                .filter(function(d) { return  d[obs] !=  "x"})
                .count(true);
            grp = reducer(grp);
            groups[obs] = grp;



            /**
             * Creating boxplot array groups for time-based observations
             * ...DOING IT FOR FINDINGS ONLY FOR NOW
             */
            /*if(isFindings){
             console.log('calculating ')
             timeDimension = xfilter.dimension(function(d) {return d[visitColumnName]; });
             var timeGroup = timeDimension.group();
             var timeDimReducer = reductio()
             .filter(function(d) { return  d[obs] != "" ; })
             .count(true)
             .dataList(true)
             .valueList(function (d) { return d[obs]; });
             timeDimReducer(timeGroup)
             timeGroups[obs] = timeGroup;
             }*/

        })

        return xfilter
    };

    cfservice.getData = function(projectId,requestedObsvs){
        var deferred = $q.defer();
        clinicalDataService.getObservations(projectId,requestedObsvs)
            .then(function(data){
                dataToPlot = data
                //columns = data.columns;
                deferred.resolve(dataToPlot)
            })
        return deferred.promise
    };

    cfservice.refreshCf = function(projectId,requestedObsvs){
        var deferred = $q.defer();

        function reduceAddSubj(p, v) {

            if( v[subjectColumnName] in p.subjects){
                p.subjects[v[subjectColumnName]]++
            }
            else {
                p.subjects[v[subjectColumnName]] = 1;
                ++p.count;
            }
            return p;
        }
        function reduceRemoveSubj(p, v) {
            p.subjects[v[subjectColumnName]]--;
            if(p.subjects[v[subjectColumnName]] === 0){
                delete p.subjects[v[subjectColumnName]];
                --p.count;
            }
            return p;
        }
        function initialSubj() {
            return {subjects: {},
                count:0
            };
        }


        function reduceToArrayAdd(key){
            return function(p,v){
                p.push(+v[key]);
                return p;
            }
        }
        function reduceToArrayRemove(key){
            return function(p,v) {
                p.splice(p.indexOf(v[key]), 1);
                return p;
            }
        }
        function reduceToArrayInit(){
            return [];
        }
        function remove_empty_bins(source_group) {
            return {
                all:function () {
                    return source_group.all().filter(function(d) {
                        return d.value != 0;
                    });
                }
            };
        }

        this.getData(projectId,requestedObsvs)
            .then(function(data){
                //console.log('inside refresh data')

                /**
                 * Format to data types
                 */
                cfservice.formatData(data.findingsTbl, requestedObsvs);
                cfservice.formatData(data.eventsTbl, requestedObsvs);

                /**
                 * Get table headers
                 */
                findingsColumns = data.findingsTblHeader;
                eventsColumns = data.eventsTblHeader;
                tableHeaders['findings'] = findingsColumns;
                tableHeaders['events'] = eventsColumns;


                /**
                 * Generate Xfilter(s)
                 */
                findingsXfilter = cfservice.generateXf(data.findingsTbl,findingsColumns,true);
                eventsXfilter = cfservice.generateXf(data.eventsTbl,eventsColumns,false);


                tableDimensions['findings'] = findingsXfilter.dimension(function(d) {return d[subjectColumnName]});
                tableDimensions['events'] = eventsXfilter.dimension(function(d) {return d[subjectColumnName]});

                ////number of subject Observations
                //allSubjObservationsGrp= cfData.groupAll()

                //TODO: merge subject count for both events and findings xfilters
                subjectDim['findings'] = findingsXfilter.dimension(function(d) {return d[subjectColumnName]});
                subjectDim['events'] = eventsXfilter.dimension(function(d) {return d[subjectColumnName]});

                /*uniqueSubjGrp = subjectDim.groupAll().reduce(reduceAddSubj, reduceRemoveSubj, initialSubj)
                 uniqueSubjGrpM = {value: function() {
                 return uniqueSubjGrp.value().count;
                 } };*/

                cfReady = true;
                deferred.resolve(cfReady)
            });

        return deferred.promise
    };

    cfservice.getDimension = function(key){
        return dimensions[key];
    };

    cfservice.getGroup = function(key){
        return groups[key];
    };

    cfservice.getTimeDimension = function(){
        return timeDimension
    };

    cfservice.getGroupByTime = function(key){
        return timeGroups[key]
    };

    cfservice.getCountData = function(){
        return subjectDim.group()
    };

    cfservice.getCountGroup = function() {
        return uniqueSubjGrpM
    };

    cfservice.hasDimension = function(dim){
        return dim in dimensions;
    };

    /*        /!********************************************
     DC TABLE FUNCTIONS
     **!/
     cfservice.getTableDimension = function(obsClass){
     return XfilterAssayMap[assayId].subjectDim
     }
     cfservice.getTableHeaders = function(obsClass){
     var columns = [subjectColumnName];
     columns = columns.concat(XfilterAssayMap[assayId].columns)
     return columns;
     }
     cfservice.getSubjectHeader = function(){
     return subjectColumnName
     }
     /!*******************************************
     *!/*/

    cfservice.getTableDimension = function(obsClass){
        return tableDimensions[obsClass]
    }

    cfservice.getTableGroup = function(){
        return function(d) {return "booo"}
        //return function(d) {return d[subjectColumnName]}
    }

    cfservice.getTableHeaders = function(module){
        return tableHeaders[module];
    }

    cfservice.getSubjectHeader = function(){
        return subjectColumnName
    }

    cfservice.syncfilters = function(){
        /*if (findingsColumns.indexOf(lastFilteredObs) > -1) {
         var findingsSubjIds = ($.map(subjectDim['findings'].top(Infinity), function(d) {return d.subjectId }));

         subjectDim['events'].filterFunction(function(d) { return findingsSubjIds.indexOf(d) > -1;})
         } else if (eventsColumns.indexOf(lastFilteredObs) > -1) {
         var eventsSubjIds = ($.map(subjectDim['events'].top(Infinity), function(d) {return d.subjectId }));
         subjectDim['findings'].filterFunction(function(d) { return eventsSubjIds.indexOf(d) > -1;})
         }*/
        //cfservice.resetSubjectFilter();

        if(isEventsXFFiltered()){
            var eventsSubjIds = ($.map(subjectDim['events'].top(Infinity), function(d) {return d.subjectId }));
            subjectDim['findings'].filterFunction(function(d) { return eventsSubjIds.indexOf(d) > -1;})
        }

        if(isFindingsXFFiltered()){
            var findingsSubjIds = ($.map(subjectDim['findings'].top(Infinity), function(d) {return d.subjectId }));
            subjectDim['events'].filterFunction(function(d) { return findingsSubjIds.indexOf(d) > -1;})
        }
    }

    cfservice.getAllSubjFindingsGrp = function(){
        return findingsXfilter.groupAll()
    }

    cfservice.getAllSubjEventsGrp = function(){
        return eventsXfilter.groupAll()
    }

    cfservice.cfReady = function(){
        return cfReady;
    }

    cfservice.removeFilters = function(obs){
        // console.log('inside remove filter ',obs, cfservice.getDimension(obs))
        cfservice.getDimension(obs).filterAll();
    }

    cfservice.getXFname = function(){
        return XFserviceName;
    }


    cfservice.filterBySubjects = function(filteredSubjectIds){

        if(!angular.isUndefined(tableDimensions['findings'])){
            subjectDim['findings'].filterFunction(function(d) { return filteredSubjectIds.indexOf(d) > -1;})
            subjectDim['events'].filterFunction(function(d) { return filteredSubjectIds.indexOf(d) > -1;})
            IsSubjectFiltered = true;
        }
        dc.redrawAll("clinical");
    };

    cfservice.getCurrentSubjectIds = function(){
        if(!cfReady)
            return;
        var findingsSubjIds = ($.map(subjectDim['findings'].top(Infinity), function(d) {return d.subjectId }));
        var eventsSubjIds = ($.map(subjectDim['events'].top(Infinity), function(d) {return d.subjectId }));

        var filteredSubjectIds = [];

        if(findingsSubjIds.length !== 0 && eventsSubjIds.length !==0){
            filteredSubjectIds = findingsSubjIds
            filteredSubjectIds = filteredSubjectIds.filter(function(n){
                return eventsSubjIds.indexOf(n) !== -1
            });
            //console.log(filteredSubjectIds);
        }else{
            findingsSubjIds.forEach(function (id) {
                if (filteredSubjectIds.indexOf(id) === -1)
                    filteredSubjectIds.push(id);
            });
            eventsSubjIds.forEach(function (id) {
                if (filteredSubjectIds.indexOf(id) === -1)
                    filteredSubjectIds.push(id);
            });
        }

        return filteredSubjectIds;
    }

    cfservice.resetSubjectFilter = function(){

        if(subjectDim['findings']) subjectDim['findings'].filter(null);
        if(subjectDim['events']) subjectDim['events'].filter(null);
        dc.redrawAll("clinical");
    }

    cfservice.resetAll = function(){
        for (var key in dimensions){
            dimensions[key].filter(null);
        };

        if(subjectDim['findings'])subjectDim['findings'].filter(null);
        if(subjectDim['events'])subjectDim['events'].filter(null);
        IsSubjectFiltered = false;

        dc.redrawAll("clinical");
    };

    cfservice.init = function () {
        dimensions = [];
        groups = [];
        subjectDim['findings']=null;
        subjectDim['events'] = null;
        cfReady = false;
    };

    cfservice.addToActiveFilters = function (filter) {
        activeFilters.push(filter);
    };
    cfservice.XFisFiltered = function () {
        return activeFilters.length > 0;
    };
    cfservice.removeFilter = function (filter) {

    };

    return cfservice
}

angular.module('biospeak.dcPlots')
    .factory('ClinicalXF',['clinicalDataService','$q', ClinicalXF]);