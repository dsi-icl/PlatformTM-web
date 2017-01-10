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

    var gexSampleXfilter,
        luminexSampleXfilter,
        cytofSampleXfilter,
        gexSampleColumns,
        luminexSampleColumns,
        cytofSampleColumns;


    cfservice.initializeXf = function(assayId){
        console.log("initializing xf for ",assayId)
        XfilterAssayMap[assayId] = {}
        XfilterAssayMap[assayId].xfReady = false;
    }


    cfservice.refreshCf = function(projectId,assayId,requestedObsvs){
        var deferred = $q.defer();
        dimensionsPerAssay[assayId] = {}

        /**
         * Initialize xfilter data fields for this assayType
         */
        XfilterAssayMap[assayId] = {}
        XfilterAssayMap[assayId].dimensions = [];
        XfilterAssayMap[assayId].groups = [];

        this.getData(projectId, assayId,requestedObsvs).then(function(res){
            //use property dataType to coerce string to numerals
            var data = res.data;
            var columns = res.header;

            data.forEach(function(d) {
                //d.dtg   = dtgFormat.parse(d.origintime.substr(0,19));
                //d.lat   = +d.latitude;
                //d['Age']  = +d['Age'];
                //d.Race   = d.Race;
                //d.depth = d3.round(+d.depth,0);
            });


            //console.log(data,columns)
            var cfdata = crossfilter(data);
            //allPerAssay[assayId] = cfdata.groupAll();
            //ndxPerAssay[assayId] = cfdata;

            XfilterAssayMap[assayId].xfdata = cfdata
            XfilterAssayMap[assayId].all = cfdata.groupAll();
            XfilterAssayMap[assayId].columns = columns;

            /**
             * Create Subject Dimension
             */
            //subjectDim = cfdata.dimension(function(d) {return d[subjectColumnName]})
            //dimensions[subjectColumnName] = subjectDim
            XfilterAssayMap[assayId].subjectDim = cfdata.dimension(function(d) {return d[subjectColumnName]})

            console.log("=============Refreshing ASSAY "+assayId+" XF ============")

            /**
             * Create dimensions for each sample characterisitc
             */
            columns.forEach(function(sc){
                console.log(sc);
                /**
                 * Dimension
                 */
                var dim = cfdata.dimension(function (d) {
                    return d[sc];
                });
                XfilterAssayMap[assayId].dimensions[sc] = dim;
                //dimensions[sc] = dim
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

    cfservice.getData = function(projectId,assayId,requestedObsvs){
        var deferred = $q.defer();

        assayDataService.getSampleData(projectId,assayId,requestedObsvs)
            .then(function(response){
                //console.log('inside getDAta',response)
                var dataToPlot = response.data;
                var sampleColumns = response.header; //These are the list of HEADERS in the CF data
                //No need to maintain on the client?!
                deferred.resolve(response)
            })

        return deferred.promise
    }

    /********************************************
     DC TABLE FUNCTIONS
     **/
    cfservice.getTableDimension = function(assayId){
        return XfilterAssayMap[assayId].subjectDim
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
    /********************************************
     **/

    /********************************************
     *
     * XFlinker Methods
     */
    cfservice.filterBySubjects = function(filteredSubjectIds){
        for (var assayId in XfilterAssayMap) {
            if (XfilterAssayMap.hasOwnProperty(assayId)) {
                XfilterAssayMap[assayId].subjectDim.filterFunction(function (d) {
                    return filteredSubjectIds.indexOf(d) > -1;
                })
            }
        }
        dc.renderAll("assay");
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
        if(!angular.isUndefined(subjectDim))
            subjectDim.filter(null);
    }



    return cfservice
}

angular.module('biospeak.dcPlots')
    .factory('AssayXF',['assayDataService','$q', AssayXF]);
