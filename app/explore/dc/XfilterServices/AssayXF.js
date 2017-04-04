/**
 * Created by iemam on 17/10/2014.
 */
'use strict';

function AssayXF(assayDataService,$q){

    var cfservice = {};

    var subjectColumnName = "subjectId";
    var XFserviceName = 'AssayCf'

    var dimensions = [], groups = [];
    var subjectDim;
    //var sampleColumns;
    //var dataToPlot;


    var ndxPerAssay = {};
    var allPerAssay = {};
    var cfReady=false;

    var dimensionsPerAssay = {}

    var XfilterAssayMap = {}
    var SubjectAssayMap = {}


    cfservice.initializeXf = function(assayId){
        //console.log("initializing xf for ",assayId)
        XfilterAssayMap[assayId] = {}
        XfilterAssayMap[assayId].xfReady = false;
    }


    cfservice.formatData = function(data, requestedObsvs){
        var dateFormat = d3.time.format('%Y-%m-%dT%H:%M').parse
        if(requestedObsvs)
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

    cfservice.refreshCf = function(projectId,requestedObsvs,assayId){
        var deferred = $q.defer();

        //console.log("=============Creating Assay "+assayId+" XF============")

        if(!assayId && requestedObsvs){
            assayId = requestedObsvs[0].activityId;
        }

        dimensionsPerAssay[assayId] = {}

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
            let subjIndexDim = cfdata.dimension(function(d) {return d[subjectColumnName]})
            let subjectGroup = subjIndexDim.group();
            XfilterAssayMap[assayId].subjectGroup = subjectGroup


            /**
             * Create dimensions for each sample characterisitc
             */
            columns.forEach(function(sc){
                //console.log(sc);
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
                var reducer = reductio()
                    .filter(function(d) { return  d[sc] != "" })
                    .count(true)
                reducer(grp);
                //groups[sc] = grp;
                XfilterAssayMap[assayId].groups[sc] = grp;
            })
            XfilterAssayMap[assayId].xfReady = true
            deferred.resolve(columns)
        })
        return deferred.promise
    }

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
    }

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

        let uniqueSubjGrp = {value: function() {
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
        console.log("filtering assays by subjects")
        for (var assayId in XfilterAssayMap) {
            //console.log('before',assayId,XfilterAssayMap[assayId].subjectGroup.value().count)
            if (XfilterAssayMap.hasOwnProperty(assayId)) {
                XfilterAssayMap[assayId].subjectDim.filterFunction(function (d) {
                    return filteredSubjectIds.indexOf(d) > -1;
                })
                //console.log('after filtering',assayId,XfilterAssayMap[assayId].subjectGroup.value())
                //uniqueSubjGrp = XfilterAssayMap[assayId].subjectDim.groupAll().reduce(reduceAddSubj, reduceRemoveSubj, initialSubj)
                //XfilterAssayMap[assayId].subjectGroup = uniqueSubjGrp
                // console.log('after regrouping',assayId,XfilterAssayMap[assayId].subjectGroup.value().count)
            }
        }

        dc.redrawAll("assay");
    }

    cfservice.getCurrentSubjectIds = function(assayId){
        return ($.map(XfilterAssayMap[assayId].subjectDim.top(Infinity),
            function(d) {return d.subjectId }))
    }
    /********************************************
     */

    cfservice.cfReady = function(assayId){
        return XfilterAssayMap[assayId].xfReady;
    }

    cfservice.getXFname = function(){
        return XFserviceName;
    }

    cfservice.resetSubjectFilter = function(){
        for (var assayId in XfilterAssayMap) {
            if (XfilterAssayMap.hasOwnProperty(assayId)) {
                XfilterAssayMap[assayId].subjectDim.filter(null);
            }
        }
        dc.redrawAll("assay");
    }

    cfservice.getDimension = function(key, assayId){
        // console.log(key)
        // console.log(assayId)
        // console.log(XfilterAssayMap)

        return XfilterAssayMap[assayId].dimensions[key];
    }

    cfservice.getGroup = function(key, assayId){
//            console.log(key)
        return XfilterAssayMap[assayId].groups[key];
    }



    cfservice.setActiveFilters = function(obs,filter){

    }

    return cfservice;
}

angular.module('biospeak.dcPlots')
    .factory('AssayXF',['assayDataService','$q', AssayXF]);
