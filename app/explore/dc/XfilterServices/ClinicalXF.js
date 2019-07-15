/**
 * Created by iemam on 17/10/2014.
 */

'use strict'
function ClinicalXF(clinicalDataService,$q){

    var subjectDim = {},
        subjectColumnName = "subjectId",
        visitColumnName = "visit";

    var subjectDimension;

    var XFserviceName = 'ClinicalCf'
    var IsSubjectFiltered = false;

    var dimensions = [],
        groups = [],
        timeGroups = [],
        timeDimension;

    var xfilter;// = {} //"findings":xf, "events":xf

    var findingsXfilter,
        eventsXfilter,
        findingsColumns,
        eventsColumns,
        keys;

    var activeFilters = [];


    var dataToPlot = {};
    var tableDimensions = {}, tableHeaders = {};


    var cfReady=false;
    var cfservice = {};

    cfservice.formatData = function(data, requestedObsvs){
        // format our data
        var dateTimeFormat = d3.timeFormat('%Y-%m-%dT%H:%M').parse;
        var dateFormat = d3.timeFormat('%Y-%m-%d').parse;

        data.forEach(function(d) {

            requestedObsvs.forEach(function(o){
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
                    // console.log(d[o.name])
                    // if()
                    // if(d[o.name] !== null) d[o.name] = d[o.name].map(function(el){ return +el;});
                    // if(d[o.name] === "" || d[o.name] === null) d[o.name]=0;
                    //if(d[o.name] !== null) d[o.name] = +d[o.name]
                    //.map(function(el){ return +el;});
                    if(d[o.name]!=null && d[o.name]!=="" && o.isFinding)
                     d[o.name] = d[o.name].map(function(el){ return +el;});
                }
            })
        });
    };

    cfservice.generateXf = function(data,columns,isFindings){

        //TODO: return if data is null
        xfilter = crossfilter(data)

        columns.forEach(function(obs){
            if(obs===visitColumnName)
                return;

            /**
             * Creating histogram count groups
             */
            //var dim = xfilter.dimension(function (d) {return d[obs]});
             var dim = xfilter.dimension(function (d) {return d[obs] ? d[obs] : 0;},true);
            dimensions[obs] = dim
            var grp = dim.group();

            if(grp.all()[0] && grp.all()[0].key === "")
                grp.all()[0].key = "(Blanks)";


            var reducer = reductio()
                .filter(function(d) { return  d[obs] !==  "x"})
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
                //cfservice.formatData(data.findingsTbl, requestedObsvs);
                //cfservice.formatData(data.eventsTbl, requestedObsvs);
                cfservice.formatData(data.data, requestedObsvs);

                /**
                 * Get table headers
                 */
                // findingsColumns = data.findingsTblHeader;
                // eventsColumns = data.eventsTblHeader;
                // tableHeaders['findings'] = findingsColumns;
                // tableHeaders['events'] = eventsColumns;
                keys = data.keys

                /**
                 * Generate Xfilter(s)
                 */
                //findingsXfilter = cfservice.generateXf(data.findingsTbl,findingsColumns,true);
                //eventsXfilter = cfservice.generateXf(data.eventsTbl,eventsColumns,false);
                xfilter = cfservice.generateXf(data.data,keys);


                //tableDimensions['findings'] = findingsXfilter.dimension(function(d) {return d[subjectColumnName]});
                //tableDimensions['events'] = eventsXfilter.dimension(function(d) {return d[subjectColumnName]});

                ////number of subject Observations
                //allSubjObservationsGrp= cfData.groupAll()

                //TODO: merge subject count for both events and findings xfilters
                //subjectDim['findings'] = findingsXfilter.dimension(function(d) {return d[subjectColumnName]});
                //subjectDim['events'] = eventsXfilter.dimension(function(d) {return d[subjectColumnName]});
                subjectDimension = xfilter.dimension(function(d) {return d[subjectColumnName]});

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
        return subjectDimension.group()
        //return subjectDim['findings'].group()
    };

    cfservice.getCountGroup = function() {
        return subjectDimension.groupAll()
        //return subjectDim['findings'].groupAll()
    };

    cfservice.hasDimension = function(dim){
        return dim in dimensions;
    };

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
        if(subjectDimension != null){
            subjectDimension.filterFunction(function(d) { return filteredSubjectIds.indexOf(d) > -1;})
            dc.redrawAll("clinical");
        }

    };

    cfservice.getCurrentSubjectIds = function(){
        if(!cfReady)
            return;
        return ($.map(subjectDimension.top(Infinity), function(d) {return d.subjectId }))
    }

    cfservice.resetSubjectFilter = function(){
        if(subjectDimension) subjectDimension.filter(null);
        dc.redrawAll("clinical");
    }

    cfservice.resetAll = function(){
        for (var key in dimensions){
            dimensions[key].filter(null);
        };

        if(subjectDimension) subjectDimension.filter(null);
        IsSubjectFiltered = false;

        dc.redrawAll("clinical");
    };

    cfservice.init = function () {
        dimensions = [];
        groups = [];
        //subjectDim['findings']=null;
        //subjectDim['events'] = null;
        subjectDimension = null;
        cfReady = false;
        keys=null;
        //findingsColumns = null;
        //eventsColumns = null;
    };


    return cfservice
}

angular.module('biospeak.dcPlots')
    .factory('ClinicalXF',['clinicalDataService','$q', ClinicalXF]);