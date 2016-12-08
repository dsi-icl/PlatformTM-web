/**
 * Created by iemam on 17/10/2014.
 */

//Include a dependency service which will request the cfdata as well as list of SCs and EFs
angular.module('eTRIKSdata.dcPlots',[])

    .factory('AssayCf',['assayDataService','$q', function(assayDataService,$q){


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
    }])

    .factory('SubjCf',['subjectDataService','$q',function(subjectDataService,$q){


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

            console.log('data AFTER passing to format data',data)

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
            console.log(data)
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

                console.log('data before passing to format data',data)
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
    }])

    .factory('ClinicalCf',['clinicalDataService','$q', function(clinicalDataService,$q){

        var subjectDim = {},
            subjectColumnName = "subjectId",
            visitColumnName = "visit";

        var XFserviceName = 'ClinicalCf'
        //var allSubjObservationsGrp;


        var dimensions = [],
            groups = [],
            timeGroups = [],
            timeDimension;

        var xfilter = {} //"findings":xf, "events":xf

        var findingsXfilter,
            eventsXfilter,
            findingsColumns,
            eventsColumns;


        var dataToPlot = {};
        var tableDimensions = {}, tableHeaders = {};
        var lastFilteredObs;
        var filteredFindings = [], filteredEvents = [];
        //var boxplots = [];

        var cfReady=false;
        var cfservice = {};

        cfservice.formatData = function(data, requestedObsvs){
            // format our data
            data.forEach(function(d) {
                //d.bmi   = d3.round(+d.bmi,1);
                //d.height   = d3.round(+d.height,2);

                requestedObsvs.forEach(function(o){
                   // console.log(o.id); console.log(o.dataType)
                    if(o.dataType != 'string'){
                        //console.log(o.id,' is numeric')
                        if(d[o.name] != null) d[o.name] = +d[o.name];
                    }
                    if(o.dataType == "string"){
                        if(d[o.name] == null) d[o.name] = ""
                    }
                })




                //d.date_e = dateFormat.parse(d.date_entered);
                //d.date_i = dateFormat.parse(d.date_issued);
            });
        }

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
                if(obs==visitColumnName)
                    return;

                /**
                 * Creating histogram count groups
                 */
                var dim = xfilter.dimension(function (d) {return d[obs]});
                dimensions[obs] = dim
                var grp = dim.group();
                //console.log('creating dimension for',obs,'dimension',dim)

                function remove_empty_bins(source_group) {
                    return {
                        all:function () {
                            return source_group.all().filter(function(d) {
                                return d.value.count != 0;
                            });
                        }
                    };
                }




                //var grp1 = dim.group().reduce(reduceAdd(obs),reduceRemove(obs),reduceInit);
                var reducer = reductio()
                    .filter(function(d) { return  d[obs] !=  ""})
                    .count(true);
                grp = reducer(grp);
                //grp.top(Infinity).filter(function(d) { return d.value.count > 0; });
                //var filtered_group = remove_empty_bins(grp);

                groups[obs] = grp;//filtered_group;
                //console.log('after reducing',grp.all())
                //console.log('reductio',obs,grp.all())
                //console.log('my group',obs, grp1.top(3))
                //console.log('cf group',obs, dim.group().all())


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
        }

        cfservice.getData = function(projectId,requestedObsvs){
            var deferred = $q.defer();
            clinicalDataService.getObservations(projectId,requestedObsvs)
                .then(function(data){
                    dataToPlot = data
                    //columns = data.columns;
                    deferred.resolve(dataToPlot)
                })
            return deferred.promise
        }

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
        }


        cfservice.getDimension = function(key){
            return dimensions[key];
        }

        cfservice.getGroup = function(key){
            return groups[key];
        }

        cfservice.getTimeDimension = function(){
            return timeDimension
        }

        cfservice.getGroupByTime = function(key){
            return timeGroups[key]
        }

        cfservice.getCountData = function(){
            return subjectDim.group()//.all();subjectGrp.group()
        }

        cfservice.getCountGroup = function() {
            return uniqueSubjGrpM
        }



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

        cfservice.filterBySubjects = function(filteredSubjectIds){
            if(!angular.isUndefined(tableDimensions['findings'])){
                //RESET subjectDimension filters
                //subjectDim['findings'].filter(null);
                //subjectDim['events'].filter(null);

                subjectDim['findings'].filterFunction(function(d) { return filteredSubjectIds.indexOf(d) > -1;})
                subjectDim['events'].filterFunction(function(d) { return filteredSubjectIds.indexOf(d) > -1;})
            }
                //subjectDim.filterFunction(function(d) { return filteredSubjectIds.indexOf(d) > -1;})
            dc.renderAll("clinical");
        }

        cfservice.syncfilters = function(){
            /*if (findingsColumns.indexOf(lastFilteredObs) > -1) {
                var findingsSubjIds = ($.map(subjectDim['findings'].top(Infinity), function(d) {return d.subjectId }));

                subjectDim['events'].filterFunction(function(d) { return findingsSubjIds.indexOf(d) > -1;})
            } else if (eventsColumns.indexOf(lastFilteredObs) > -1) {
                var eventsSubjIds = ($.map(subjectDim['events'].top(Infinity), function(d) {return d.subjectId }));
                subjectDim['findings'].filterFunction(function(d) { return eventsSubjIds.indexOf(d) > -1;})
            }*/
            cfservice.resetSubjectFilter();

            if(isEventsXFFiltered()){
                var eventsSubjIds = ($.map(subjectDim['events'].top(Infinity), function(d) {return d.subjectId }));
                subjectDim['findings'].filterFunction(function(d) { return eventsSubjIds.indexOf(d) > -1;})
            }

            if(isFindingsXFFiltered()){
                var findingsSubjIds = ($.map(subjectDim['findings'].top(Infinity), function(d) {return d.subjectId }));
                subjectDim['events'].filterFunction(function(d) { return findingsSubjIds.indexOf(d) > -1;})
            }
        }

        cfservice.getCurrentSubjectIds = function(){
            var findingsSubjIds = ($.map(subjectDim['findings'].top(Infinity), function(d) {return d.subjectId }));
            var eventsSubjIds = ($.map(subjectDim['events'].top(Infinity), function(d) {return d.subjectId }));

            var filteredSubjectIds = [];

            if(isFindingsXFFiltered()) {
                console.log('findings filtered')
                findingsSubjIds.forEach(function (id) {
                    if (filteredSubjectIds.indexOf(id) == -1)
                        filteredSubjectIds.push(id);
                })
            }
            if(isEventsXFFiltered()) {
                console.log('events filtered')
                eventsSubjIds.forEach(function (id) {
                    if (filteredSubjectIds.indexOf(id) == -1)
                        filteredSubjectIds.push(id);
                })
            }
            console.log(filteredSubjectIds.length);
            return filteredSubjectIds;//($.map(subjectDim['findings'].top(Infinity), function(d) {return d.subjectId }))
        }

        cfservice.getAllSubjFindingsGrp = function(){
            return findingsXfilter.groupAll()
        }
        cfservice.getAllSubjEventsGrp = function(){
            return eventsXfilter.groupAll()
        }


        /*cfservice.getVisitchart = function(projectId,val,grp){
         var deferred = $q.defer();
         var chart;

         chart = cfservice.createChart(val,grp)
         deferred.resolve(chart)
         return deferred.promise
         }*/

        cfservice.cfReady = function(){
            return cfReady;
        }

        cfservice.removeFilters = function(obs){
            console.log('inside remove filter ',obs, cfservice.getDimension(obs))
            cfservice.getDimension(obs).filterAll();
        }

        cfservice.getXFname = function(){
            return XFserviceName;
        }

        cfservice.setLastFilteredObs = function(obs){
            lastFilteredObs = obs;
        }





        cfservice.setActiveFilters = function(obs,filter){

            console.log('set active filter', obs, filter)

            var activeFilteredObs;
            if(findingsColumns.indexOf(obs) > -1)
                activeFilteredObs = filteredFindings;
            else if(eventsColumns.indexOf(obs) > -1)
                activeFilteredObs = filteredEvents;

            if(activeFilteredObs.indexOf(obs) != -1 && filter == null)
                activeFilteredObs.splice(activeFilteredObs.indexOf(obs),1);
            if(activeFilteredObs.indexOf(obs) == -1 && filter != null)
                activeFilteredObs.push(obs);
            console.log('active filters',activeFilteredObs,filteredFindings,filteredEvents)

        }

        cfservice.resetSubjectFilter = function(){

            if(subjectDim['findings']) subjectDim['findings'].filter(null);
            if(subjectDim['events']) subjectDim['events'].filter(null);
            //dc.redrawAll("clinical");
        }

        cfservice.isFiltered = function(){

            //console.log('inside isFiltered',isEventsXFFiltered(),is)
            return isEventsXFFiltered() || isFindingsXFFiltered();
        }

        var isEventsXFFiltered = function(){
            //console.log(filteredEvents.length, 'number of filtered event observations')
            return filteredEvents.length >0;
        }
        var isFindingsXFFiltered = function(){
            //console.log(filteredFindings.length, 'number of filtered findings observations')
            return filteredFindings.length >0;
        }

        return cfservice

    }])

    .factory('XFilterLinker',['ClinicalCf','SubjCf','AssayCf','$injector', function(ClinicalCf,SubjCf,AssayCf,$injector){

        var XFilterLinker = {}

        XFilterLinker.propagateFilter = function(xfFiltered){

            //var xfFiltered = $injector.get(xfilterServiceName);
            //console.log('filtered in ',xfFiltered);
            //var service = $injector.get(request);



            var filteredIds = xfFiltered.getCurrentSubjectIds();
            //console.log(filteredIds)
            // if(filteredIds.length == 0)return;

            if(xfFiltered.getXFname() == 'SubjCf'){
                console.log("subjects filtered");
                ClinicalCf.resetSubjectFilter();
                AssayCf.resetSubjectFilter();

                if(filteredIds.length == 0)return;

                ClinicalCf.filterBySubjects(filteredIds);
                AssayCf.filterBySubjects(filteredIds);

            }else if(xfFiltered.getXFname()  == 'ClinicalCf'){
                console.log("clinical filtered");

                SubjCf.resetSubjectFilter();
                AssayCf.resetSubjectFilter();

                if(filteredIds.length == 0)return;

                if(xfFiltered.isFiltered()){
                    SubjCf.filterBySubjects(filteredIds);
                    AssayCf.filterBySubjects(filteredIds);
                }

                ClinicalCf.syncfilters();
            }else if(xfFiltered.getXFname() == 'AssayCf'){
                console.log("assays filtered");

                SubjCf.resetSubjectFilter();
                ClinicalCf.resetSubjectFilter();

                if(filteredIds.length == 0)return;

                SubjCf.filterBySubjects(filteredIds);
                ClinicalCf.filterBySubjects(filteredIds);
            }

            //SubjCf.filterBySubjects(filteredIds);
            //ClinicalCf.filterBySubjects(filteredIds);
            //AssayCf.filterBySubjects(filteredIds);
        }

        XFilterLinker.removeFilter = function(chartGroup,obs){
            if(chartGroup == 'clinical'){
                //console.log("subjects filtered")
                ClinicalCf.removeFilters(obs);
                //AssayCf.filterBySubjects(filteredIds);
            }else if(chartGroup == 'subject'){
                //console.log("clinical filtered")
                SubjCf.removeFilters(obs);
                //AssayCf.filterBySubjects(filteredIds);
            }else if(chartGroup == 'AssayCf'){
                //console.log("assays filtered")
                //SubjCf.filterBySubjects(filteredIds);
                //ClinicalCf.filterBySubjects(filteredIds);
            }
        }

        return XFilterLinker;
    }])

/*
 .factory('xFilterService',['$injector','$q',function($injector,$q){


 /!**
 * maintains the xfilter data for subject, clinical and assay data
 * gets data, sets dimensions
 * @type {{}}
 *!/

 var xfService = {}

 var ScIdToSCNameMap = [];//can replace the two variables below
 var observationCodes = [];
 var observationIds = [];


 var chartIdToObs = [];
 var obsToChartId = [];

 var chartGroup = '';

 /!**
 * Cross filter methods
 *!/

 xfService.getData = function(){
 var deferred = $q.defer();
 clinicalDataService.getObservations('CRC305C',requestedObsvs)
 .then(function(data){
 dataToPlot = data.observations;
 columns = data.columns;
 deferred.resolve(dataToPlot)
 })
 return deferred.promise
 }

 cfservice.refreshCf = function(){
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

 this.getData().then(function(data){


 //TODO:do a different plot for multiple points/subject charts
 /!* var jsonQobj=jsonQ(data);
 var subjects = jsonQobj.find('subjectId').unique()
 noOfSubj = subjects.length

 observationCodes.forEach(function(obs){
 var nonnull = jsonQobj.find(obs, function () {
 //return this != ""
 return  !isNaN(this)
 });
 noOfObservations = nonnull.value().length
 console.log('number of observations',noOfObservations)
 console.log('number of subjects',noOfSubj);

 if(noOfObservations > noOfSubj)
 boxplots.push(obs)
 })*!/



 // format our data
 //TODO: add DataType to data and use it to coerce dimensions
 data.forEach(function(d) {
 d.bmi   = d3.round(+d.bmi,1);
 d.height   = d3.round(+d.height,2);
 d.weight = d3.round(+d.weight,1);
 d.diabp = +d.diabp;
 d.sysbp = +d.sysbp;
 d.hr = +d.hr;
 d.temp = +d.temp;
 //d.date_e = dateFormat.parse(d.date_entered);
 //d.date_i = dateFormat.parse(d.date_issued);
 });

 cfData = crossfilter(data);  // Gets 'observations' into crossfilter

 //number of subject Observations
 allGroup= cfData.groupAll()

 subjectDim = cfData.dimension(function(d) {return d[subjectColumnName]})
 uniqueSubjGrp = subjectDim.groupAll().reduce(reduceAddSubj, reduceRemoveSubj, initialSubj)
 uniqueSubjGrpM = {value: function() {
 return uniqueSubjGrp.value().count;
 } };


 visitDim = cfData.dimension(function(d) {return d[visitColumn]})
 visitGrp = visitDim.group()
 dimensions[visitColumn] = visitDim
 groups[visitColumn] = visitGrp;

 studyDim = cfData.dimension(function(d) {return d[studyColumn]})
 studyGrp = studyDim.group()
 dimensions[studyColumn] = studyDim
 groups[studyColumn] = studyGrp;

 siteDim = cfData.dimension(function(d) {return d[siteColumn]})
 siteGrp = siteDim.group()
 dimensions[siteColumn] = siteDim
 groups[siteColumn] = siteGrp;

 armDim = cfData.dimension(function(d) {return d[armColumn]})
 armGrp = armDim.group()
 dimensions[armColumn] = armDim
 groups[armColumn] = armGrp;


 console.log('observationCodes inside refresh cf', observationCodes)

 /!**
 * Create Dimensions for each column in the data
 *!/
 observationCodes.forEach(function(obs){
 console.log('Adding ',obs, ' to crossfilter');
 if(boxplots.indexOf(obs)!= -1){
 console.log("doing boxplot for ",obs)
 dim = cfData.dimension(function(d) {return d['visit']})
 dimensions[obs] = dim;
 grp = dim.group().reduce(
 function(p,v) {
 p.push(v[obs]);
 return p;
 },
 function(p,v) {
 p.splice(p.indexOf(v[obs]), 1);
 return p;
 },
 function() {
 return [];
 }
 )
 groups[obs] = grp;
 }
 else{
 var dim = cfData.dimension(function (d) {return d[obs]});
 console.log(obs,' created dimension ',dim.top(1), ' in crossfilter');
 dimensions[obs] = dim
 var grp = dim.group().reduce(reduceAdd(obs),reduceRemove(obs),reduceInit);
 console.log(obs,' created group ',grp.all(), ' in crossfilter');
 groups[obs] = grp;
 }
 })

 cfReady = true;
 deferred.resolve(cfReady)
 });

 return deferred.promise
 }

 /!**
 * Charting methods
 *
 * **!/

 xfService.createChart = function(obsName,chartGrp){

 var cfDimension = xfService.getDimension(obsName)
 var cfGroup = xfService.getGroup(obsName)

 console.log("Creating chart for ",obsName);
 console.log('chart group ',chartGrp);
 console.log(obsName,' dimension top 3',cfDimension.top(1))
 console.log(obsName,' group size ',cfGroup.size())

 //var requiresBoxplot = scope.chartData.requiresBoxplot;
 var chartData = xfService.getChartOptions(obsName,cfDimension, cfGroup, false);

 //CREATE CHART
 var chartFactory = dc[chartData.chartType];
 var chart = chartFactory();
 chart.options(chartData.chartOptions);
 //chart.chartGroup(chartGrp);
 //dc.registerChart(chart,chartGrp)



 obsToChartId[obsName] = chart.chartID();
 chartIdToObs[chart.chartID()] = obsName;

 console.log('adding ',obsName, ' to obsToChartId',obsToChartId[obsName]);
 console.log('chartIdToObs: ',chartIdToObs)


 return chart
 }

 xfService.refreshCharts = function(){

 var allCharts = dc.chartRegistry.list(chartGroup);
 console.log('Inside refresh charts ',allCharts)
 var oldFilters

 allCharts.forEach(function(chart){
 console.log('got chart ',chart.chartID(),' ',chart.chartGroup())
 if(chart.chartGroup() == chartGroup){
 oldFilters = chart.filters(); // Get current filters
 chart.filter(null); // Reset all filters on current chart
 chart.expireCache();

 //I need to know which observations this id was associated with so that I can query for
 // the new dimensions created for this observation
 var obs = chartIdToObs[chart.chartID()]
 if(!angular.isUndefined(obs)){
 console.log('refreshing ',obs)
 chart.dimension(xfService.getDimension(obs))
 chart.group(xfService.getGroup(obs));
 oldFilters.forEach(function(filter){
 chart.filter(filter)
 })
 }

 if(chart.chartID() == tableWidgetId){
 console.log('refreshing table')
 chart.dimension(cfservice.getTableDimension())
 chart.group(cfservice.getTableGroup());
 chart.columns(columns);
 }
 if(chart.chartID() == counterWidgetId){
 console.log('refreshing counter')
 chart.dimension(cfservice.getCountData())
 chart.group(cfservice.getCountGroup());
 }

 }
 })
 }

 xfService.getDCchart = function(projectId,scName, scID,chartGrp){

 var deferred = $q.defer();
 var chart;

 console.log('Inside getDC chart',projectId,scName,scID)
 //Checks if a chart had been previously selected for this observation
 if (angular.isDefined(obsToChartId[scName])) {
 console.log('Chart found ', scName)
 chartId = obsToChartId[scName];

 dc.chartRegistry.list().forEach(function(c){
 if(c.chartID() == chartId)
 chart = c
 })
 deferred.resolve(chart)
 } else {
 console.log("Subject Characteristic NOT FOUND IN CF")

 /!**
 * *********************************************
 *!/
 //observation
 ScIdToSCNameMap[scID] = scName //this is coming from charting buttons
 //i.e. the SCchars from SQL DB
 //they should have the same name that would be
 //returned from NOSQL

 observationCodes.push(scName); //used for building CF dimensions,
 // should be the same as column name in the CF table
 observationIds.push(scID); //used for querying new and old SCs

 /!**
 * ******************************************
 *!/
 this.initialize(projectId).then(function () {

 subjCfService.refreshCharts();

 //TODO: could replace obsCode with obsId if both obsCode and obsID
 //TODO: are grouped together in a map
 chart = subjCfService.createChart(scName,chartGrp)
 //console.log(chart)

 //chartData.group = groups[obsCode];
 //chartData.dimension = dimensions[obsCode];
 //chartData.requiresBoxplot = boxplots.indexOf(obsCode)!= -1
 deferred.resolve(chart)
 })
 }
 return deferred.promise
 }

 /!**********************
 * private methods
 *!/


 xfService.getCountData = function(){
 return subjectDim.group()//.all();subjectGrp.group()
 }

 xfService.getCountGroup = function() {
 return uniqueSubjGrpM
 }

 xfService.getTableDimension = function(){
 return subjectDim
 }

 xfService.getTableGroup = function(){
 return function(d) {return d[subjectColumnName]}
 }

 xfService.getChartOptions = function(val,cfDimension,cfGroup,requiresBoxplot){

 var chartType,
 chartOptions = {};

 if(requiresBoxplot){
 chartType = "boxPlot"
 chartOptions["width"] = 768 //384// //300//384//330//
 chartOptions["height"] = 480 //240//480 //260 //240 //200//
 //chartOptions["margins"] = {top: 10, right: 50, bottom: 30, left: 50}
 chartOptions["elasticX"] = "true"
 chartOptions["elasticY"] = "true"
 chartOptions["boxWidth"] = "10"
 chartOptions["boxPadding"] = "0.9"
 //.dimension(cfDimension)
 //.group(cfGroup)

 }
 else if(isNaN(cfGroup.all()[0].key)){
 //Ordinal chart (rowChart or PieChart)
 var noOfGroups = cfGroup.size();

 if(noOfGroups > 3){
 chartType = "rowChart"
 chartOptions["elasticX"] = "true"
 chartOptions["xAxis"] = {"ticks":"4"}
 chartOptions["width"] = "300"
 chartOptions["height"] = noOfGroups*30+20
 }
 else{
 chartType = "pieChart";
 chartOptions["radius"] = "60"
 chartOptions["width"] = "120"
 chartOptions["height"] = "120"
 }
 }else{
 //numeric bar chart
 maxValue = cfDimension.top(1)[0][val]
 minValue = cfservice.getMinimumValue(cfDimension,val);
 //minValue = cfDimension.bottom(1)[0][val]
 //console.log('max ',maxValue)
 //console.log('min ',minValue)

 chartType = "barChart";
 chartOptions["transitionDuration"] = "500"
 chartOptions["centerBar"] = "true"
 chartOptions["gap"] = "20"
 chartOptions["x"] = d3.scale.linear().domain([minValue,maxValue])
 chartOptions["elasticY"] = "true"
 chartOptions["width"] = "300"
 chartOptions["height"] = "170"
 chartOptions["xUnits"] = dc.units.fp.precision(0.05)
 chartOptions["yAxisLabel"] = "No. of Observations"
 chartOptions["xAxisLabel"] = "Values"
 //chartOptions["margins"] = "{top: 10, right: 10, bottom: 40, left: 20}"
 //chartOptions[".xAxis().tickFormat"] = "2"
 //d3.extent(data, function(d) { return d.TC; })
 // bar width Keep increasing to get right then back off.
 /!* .x(d3.scale.linear()
 .domain(d3.extent(data, function(d) { return d.TC; }))
 )
 .y(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.close; })]))
 .xAxis().tickFormat(function(v) {return v;});
 *!/
 }


 chartOptions["dimension"] = cfDimension
 chartOptions["group"] = cfGroup
 chartOptions["title"] = function(d){return d.value;}
 chartOptions["colors"] = etriks.myColors();

 var chartData = {}
 chartData.chartOptions = chartOptions;
 chartData.chartType = chartType;
 return chartData;

 };

 xfService.getMinimumValue = function(dimension, val){
 var orderedVals = dimension.bottom(Infinity)
 //console.log(orderedVals)
 var i=0;
 while (orderedVals[i][val]==null || orderedVals[i][val]=="") {
 i++;
 }
 //console.log(orderedVals[i][val])
 return orderedVals[i][val]
 }

 }])
 */
