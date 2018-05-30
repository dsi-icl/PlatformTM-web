/**
 * Created by iemam on 17/10/2014.
 */
'use strict';

function AssayXF(assayDataService,$q){

    var cfservice = {};

    var subjectColumnName = "subjectId";
    var XFserviceName = 'AssayCf';
    var XfilterAssayMap = {};
    var SubjectAssayMap = {};


    cfservice.initializeXf = function(assayId){
        //console.log("initializing xf for ",assayId)
        XfilterAssayMap[assayId] = {};
        XfilterAssayMap[assayId].xfReady = false;
    };

    cfservice.formatData = function(data, requestedObsvs){
        var dateFormat = d3.timeFormat('%Y-%m-%dT%H:%M').parse
        if(requestedObsvs)
            data.forEach(function(d) {
                //console.log(d)
                requestedObsvs.forEach(function(o){
                    //console.log(o.name); console.log(o.dataType)
                    if(o.dataType === "dateTime"){
                        //console.log(d)
                        d[o.name] = dateFormat(d[o.name]);
                        //console.log('2',d[o.name])
                    }else if(o.dataType === "string" || o.dataType ==='ordinal'){
                        if(d[o.name] == null) d[o.name] = ""
                    }else {
                        //console.log(o.id,' is numeric')
                        if(d[o.name] != null) d[o.name] = +d[o.name];
                    }
                })
            });
        //console.log(data)
    }

    cfservice.refreshCf = function(projectId,requestedObsvs,assayId){
        var deferred = $q.defer();

        //console.log("=============Creating Assay "+assayId+" XF============")

        if(!assayId && requestedObsvs){
            assayId = requestedObsvs[0].activityId;
        }

        /**
         * Initialize xfilter data fields for this assayType
         */
        XfilterAssayMap[assayId] = {}
        XfilterAssayMap[assayId].dimensions = [];
        XfilterAssayMap[assayId].groups = [];
        SubjectAssayMap[assayId] = {};

        this.getData(projectId,requestedObsvs,assayId).then(function(dataTable){

            var data = dataTable.data;
            var columns = dataTable.header;

            cfservice.formatData(data, requestedObsvs);


            //console.log(data,columns)
            var cfdata = crossfilter(data);

            XfilterAssayMap[assayId].xfdata = cfdata
            XfilterAssayMap[assayId].all = cfdata.groupAll();
            XfilterAssayMap[assayId].columns = columns;

            /**
             * Create Subject Dimension
             */
            XfilterAssayMap[assayId].subjectDim = cfdata.dimension(function(d) {return d[subjectColumnName]})


            /**
             * Create Unique Subjects Group
             */
            var subjIndexDim = cfdata.dimension(function(d) {return d[subjectColumnName]})
            var subjectGroup = subjIndexDim.group();
            XfilterAssayMap[assayId].subjectGroup = subjectGroup


            /**
             * Create dimensions for each sample characterisitc
             */
            columns.forEach(function(sc){
                // console.log(sc);

                /**
                 * Dimension
                 */
                var dim = cfdata.dimension(function (d) {
                    return d[sc];
                });
                XfilterAssayMap[assayId].dimensions[sc] = dim;
                /**
                 * Group
                 */
                var grp = dim.group();




                // if(grp.all()[0].key === ""){
                //     console.log('filtering blanks');
                //     // grp.all()[0].key = "(Blanks)";
                //     grp = remove_empty_bins(grp);
                //     console.log(grp.all())
                // }




                var reducer = reductio()
                    .filter(function(d) { return  d[sc] !== "" })
                    .count(true);

                // if(sc ==='day')
                //     grp = remove_bins(grp)
                //
                // else
                    reducer(grp);



                // console.log(dim.groupAll().value());
                //groups[sc] = grp;
                XfilterAssayMap[assayId].groups[sc] = grp;
            })
            XfilterAssayMap[assayId].xfReady = true
            deferred.resolve(columns)
        });
        return deferred.promise
    };

    cfservice.getData = function(projectId,requestedObsvs,assayId){
        var deferred = $q.defer();

        assayDataService.getSampleData(projectId,assayId,requestedObsvs)
            .then(function(dataTable){
                //console.log('inside getDAta',response)
                //var dataToPlot = dataTable.rows;
                //var sampleColumns = response.header; //These are the list of HEADERS in the CF data
                //No need to maintain on the client?!
                deferred.resolve(dataTable)
            })

        return deferred.promise
    };

    var remove_empty_bins  = function (source_group) {
        return {
            all:function () {
                return source_group.all().filter(function(d) {
                    //return Math.abs(d.value) > 0.00001; // if using floating-point numbers
                    return d.value !== "" ; // if integers only
                });
            }
        };
    };

    var remove_bins  = function (source_group) { // (source_group, bins...}
        var bins = Array.prototype.slice.call(arguments, 1);
        return {
            all:function () {
                return source_group.all().filter(function(d) {
                    return bins.indexOf(d.key) !== "";
                });
            }
        };
    }

    var sort_group = function (group, order) {
        return {
            all: function() {
                var g = group.all(), map = {};

                g.forEach(function(kv) {
                    map[kv.key] = kv.value;
                });
                return order.map(function(k) {
                    return {key: k, value: map[k]};
                });
            }
        };
    };

    /********************************************
     DC TABLE FUNCTIONS
     **/

    cfservice.getTableDimension = function(assayId){
        return XfilterAssayMap[assayId].subjectDim
    }
    cfservice.getTableGroup = function(){
        return function(d) {return "booo"}
    }
    cfservice.getTableHeaders = function(assayId){
        var columns = [subjectColumnName];
        columns = columns.concat(XfilterAssayMap[assayId].columns)
        return columns;
    }
    cfservice.getSubjectHeader = function(){
        return subjectColumnName
    }

    /*******************************************
     */


    /*******************************************
     *
     * Count Widget Methods
     *
     */
    cfservice.getCountData = function(assayId){
        return XfilterAssayMap[assayId].xfdata
    }

    cfservice.getCountGroup = function(assayId){
        return XfilterAssayMap[assayId].all
    }

    cfservice.getSubjectCountData = function(assayId){
        return XfilterAssayMap[assayId].subjectGroup
    }

    cfservice.getSubjectCountGroup = function(assayId){

        var uniqueSubjGrp = {value: function() {
            if(XfilterAssayMap[assayId].subjectGroup.size() != 0)
                return XfilterAssayMap[assayId].subjectGroup.all().filter(function(kv){return kv.value>0;}).length;
            return 0;
        }}

        return uniqueSubjGrp;
    }
    /********************************************
     **/

    /********************************************
     *
     * XFlinker Methods
     */
    cfservice.filterBySubjects = function(filteredSubjectIds){
        // console.log("filtering assays by subjects")
        for (var assayId in XfilterAssayMap) {
            //console.log('before',assayId,XfilterAssayMap[assayId].subjectGroup.value().count)
            if (XfilterAssayMap.hasOwnProperty(assayId)) {
                XfilterAssayMap[assayId].subjectDim.filterFunction(function (d) {
                    return filteredSubjectIds.indexOf(d) > -1;
                });
                dc.redrawAll(assayId);
                //console.log('after filtering',assayId,XfilterAssayMap[assayId].subjectGroup.value())
                //uniqueSubjGrp = XfilterAssayMap[assayId].subjectDim.groupAll().reduce(reduceAddSubj, reduceRemoveSubj, initialSubj)
                //XfilterAssayMap[assayId].subjectGroup = uniqueSubjGrp
                // console.log('after regrouping',assayId,XfilterAssayMap[assayId].subjectGroup.value().count)
            }
        }

       // dc.redrawAll("assay");
    }

    cfservice.getCurrentSubjectIds = function(assayId){
        return ($.map(XfilterAssayMap[assayId].subjectDim.top(Infinity),
            function(d) {return d.subjectId }))
    }
    /********************************************
     */

    cfservice.cfReady = function(assayId){
        return XfilterAssayMap[assayId].xfReady;
    };

    cfservice.allXFready = function(){
        var ready = false;
        for(var key in XfilterAssayMap){
            ready = XfilterAssayMap[key].xfReady || ready
        }
        return ready
    }

    cfservice.getXFname = function(){
        return XFserviceName;
    };

    cfservice.resetSubjectFilter = function(){
        for (var assayId in XfilterAssayMap) {
            if (XfilterAssayMap.hasOwnProperty(assayId)) {
                XfilterAssayMap[assayId].subjectDim.filter(null);
                dc.redrawAll(assayId);
            }
        }
        //dc.redrawAll("assay");
    };

    cfservice.getDimension = function(key, assayId){
        return XfilterAssayMap[assayId].dimensions[key];
    };

    cfservice.hasDimension = function(dim, assayId){
        return dim in XfilterAssayMap[assayId].dimensions;
    };

    cfservice.getGroup = function(key, assayId){
        return XfilterAssayMap[assayId].groups[key];
    };

    cfservice.resetAll = function(){
        for (var assayId in XfilterAssayMap){
            XfilterAssayMap[assayId].subjectDim.filter(null);

            for (var dim in XfilterAssayMap[assayId].dimensions){
                XfilterAssayMap[assayId].dimensions[dim].filter(null);
            }
            dc.redrawAll(assayId);
        }
        //dc.redrawAll("assay");
    };

    cfservice.init= function(){
        XfilterAssayMap = {}
        SubjectAssayMap = {}
    }

    return cfservice;
}

angular.module('biospeak.dcPlots')
    .factory('AssayXF',['assayDataService','$q', AssayXF]);
