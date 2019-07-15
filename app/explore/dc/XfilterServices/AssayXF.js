/**
 * Created by iemam on 17/10/2014.
 */
'use strict';

function AssayXF(assayDataService,$q){

    var cfservice = {};

    var subjectColumnName = "subjectId";
    var sampleColumnName = "sampleId";
    var XFserviceName = 'AssayCf';
    var XfilterAssayMap = {};
    var SubjectAssayMap = {};


    cfservice.initializeXf = function(assayId){
        //console.log("initializing xf for ",assayId)
        XfilterAssayMap[assayId] = {};
        XfilterAssayMap[assayId].xfReady = false;
    };


    cfservice.initXF = function (assayXfObj) {

        var ready = true;
        return $q.when(ready,function () {
            for (var assayId in assayXfObj) {
                XfilterAssayMap[assayId] = {};
                XfilterAssayMap[assayId].xfReady = false;
                XfilterAssayMap[assayId].dimensions = [];
                XfilterAssayMap[assayId].groups = [];
                SubjectAssayMap[assayId] = {};
                createXF(assayId,assayXfObj[assayId].data,assayXfObj[assayId].keys);
            }
        })


    }

    var createXF = function(assayId,data, keys){

        //cfservice.formatData(data, requestedObsvs);
        //console.log('creating', assayId,data, keys)

        var cfdata = crossfilter(data);

        XfilterAssayMap[assayId].xfdata = cfdata
        XfilterAssayMap[assayId].all = cfdata.groupAll();
        XfilterAssayMap[assayId].columns = keys;

        /**
         * Create Subject Dimension
         */
        var subjIndexDim = cfdata.dimension(function(d) {return d[subjectColumnName]})
        var subjectGroup = subjIndexDim.group();
        XfilterAssayMap[assayId].subjectDim = subjIndexDim;
        XfilterAssayMap[assayId].subjectGroup = subjectGroup

        //var sampleIndexDim = cfdata.dimension(function(d) {return d[sampleColumnName]})
        //var sampleGroup = subjIndexDim.group();


        /**
         * Create dimensions for each sample characterisitc
         */
        keys.forEach(function(key){
            /**
             * Dimension
             */
            var dim = cfdata.dimension(function (d) {return d[key];});
            //var dim = cfdata.dimension(function (d) {return d[key] ? d[key] : 0;},true)
            XfilterAssayMap[assayId].dimensions[key] = dim;
            /**
             * Group
             */
            var grp = dim.group();
            var reducer = reductio()
                .filter(function(d) { return  d[key] !== "" })
                .count(true);
            reducer(grp);

            XfilterAssayMap[assayId].groups[key] = grp;
        });
        XfilterAssayMap[assayId].xfReady = true;
    }

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
    }

    cfservice.refreshCf = function(projectId,requestedObsvs,assayId){
        var deferred = $q.defer();

        //console.log("=============Creating Assay "+assayId+" XF============",requestedObsvs)

        if(!assayId && requestedObsvs){
            assayId = requestedObsvs[0].activityId;
        }

        /**
         * Initialize xfilter data fields for this assayType
         */
        // XfilterAssayMap[assayId] = {}
        // XfilterAssayMap[assayId].dimensions = [];
        // XfilterAssayMap[assayId].groups = [];
        // SubjectAssayMap[assayId] = {};

        this.getData(projectId,requestedObsvs,assayId).then(function(dataTable){
            var data = dataTable.data;
            var keys = dataTable.keys;
            cfservice.formatData(data, requestedObsvs);
            createXF(assayId,data,keys);
            deferred.resolve(keys)
        });
        return deferred.promise
    };

    cfservice.getData = function(projectId,requestedObsvs,assayId){
        var deferred = $q.defer();
        assayDataService.getSampleData(projectId,assayId,requestedObsvs)
            .then(function(data){
                deferred.resolve(data)
            });
        return deferred.promise
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
     *
     * Count Widget Methods
     *
     */
    cfservice.getCountData = function(assayId){
        return XfilterAssayMap[assayId].groups[sampleColumnName]
    }

    cfservice.getCountGroup = function(assayId){
        return XfilterAssayMap[assayId].dimensions[sampleColumnName].groupAll()
    }

    cfservice.getSubjectCountData = function(assayId){
        return XfilterAssayMap[assayId].subjectGroup
    }

    cfservice.getSubjectCountGroup = function(assayId){
        return {value: function() {
                if(XfilterAssayMap[assayId].subjectGroup.size() !== 0)
                    return XfilterAssayMap[assayId].subjectGroup.all().filter(function(kv){return kv.value>0;}).length;
                return 0;
            }};
    }

    cfservice.getSampleCountData = function(assayId){
        //return XfilterAssayMap[assayId].xfdata
        return XfilterAssayMap[assayId].groups[sampleColumnName]
    }
    cfservice.getSampleCountGroup = function(assayId){
        //return XfilterAssayMap[assayId].all
        return XfilterAssayMap[assayId].dimensions[sampleColumnName].groupAll()
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
    cfservice.getSubjectKey = function () {
        return subjectColumnName;
    };
    cfservice.getSampleKey = function () {
        return sampleColumnName;
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
