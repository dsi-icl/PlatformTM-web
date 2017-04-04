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

            uniqueSubjGrp = {value: function() {
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

        subjCfService.refreshCf = function(projectId,requestedObsvs){
            var deferred = $q.defer();

            this.getData(projectId, requestedObsvs).then(function(data){

                //console.log('inside inititialize')
                //console.log('dataToPlot',dataToPlot)
                //console.log('data',data)


                subjCfService.formatData(data, requestedObsvs);

                cfdata = crossfilter(data);
                all = cfdata.groupAll();
                //console.log('inside initialize',subjChars)

                subjectDim = cfdata.dimension(function(d) {return d[subjectColumnName]})
                dimensions[subjectColumnName] = subjectDim

                // console.log("=============Creating Subject XF============")

                subjChars.forEach(function(sc){
                    // console.log("creating dimension for ",sc);
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
            //console.log(key, groups[key].top(3))
            return groups[key];
        }

        subjCfService.getCountData = function(){
            return cfdata
        }

        subjCfService.getCountGroup = function(){
            return all
        }

        subjCfService.getCountValue = function(){
            if(cfReady)
                return all.value()
            else return null
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
            console.log("filtering subject module subject dimension")
            if(subjectDim){
                subjectDim.filterFunction(function(d) { return filteredSubjectIds.indexOf(d) > -1;})
                dc.redrawAll("subject");
            }

        }

        subjCfService.getCurrentSubjectIds = function(){
            //TODO: CHECK IF ANY DIMENSIONS ARE FILTERED FIRST
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
            //console.log('resetting subject xfilter')
            if(subjectDim) subjectDim.filter(null);
            dc.redrawAll("subject");
        }

        subjCfService.getXFname = function(){
            return XFserviceName;
        }

        subjCfService.setActiveFilters = function(obs,filter){

        }

        subjCfService.resetXF = function(){
            cfReady = false
        }

        return subjCfService
    }])

    .factory('ClinicalCf',['clinicalDataService','$q', function(clinicalDataService,$q){

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


        var dataToPlot = {};
        var tableDimensions = {}, tableHeaders = {};
        var lastFilteredObs;
        var filteredFindings = [], filteredEvents = [];

        var cfReady=false;
        var cfservice = {};

        cfservice.formatData = function(data, requestedObsvs){
            // format our data
            data.forEach(function(d) {

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

                /*function remove_empty_bins(source_group) {
                    return {
                        all:function () {
                            return source_group.all().filter(function(d) {
                                return d.value.count != 0;
                            });
                        }
                    };
                }*/

                //console.log(obs,grp.all())
                if(grp.all()[0] && grp.all()[0].key == "")
                    grp.all()[0].key = "(Blanks)"


                //var grp1 = dim.group().reduce(reduceAdd(obs),reduceRemove(obs),reduceInit);
                var reducer = reductio()
                    .filter(function(d) { return  d[obs] !=  "x"})
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
            //console.log('filtered findings',filteredFindings)
            //console.log('filtered events',filteredEvents)

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

        cfservice.filterBySubjects = function(filteredSubjectIds){

            if(!angular.isUndefined(tableDimensions['findings'])){
                //RESET subjectDimension filters
                //subjectDim['findings'].filter(null);
                //subjectDim['events'].filter(null);
                console.log("filtering clinical on subjects",filteredSubjectIds.length)


                subjectDim['findings'].filterFunction(function(d) { return filteredSubjectIds.indexOf(d) > -1;})
                subjectDim['events'].filterFunction(function(d) { return filteredSubjectIds.indexOf(d) > -1;})



                IsSubjectFiltered = true;
            }
            //subjectDim.filterFunction(function(d) { return filteredSubjectIds.indexOf(d) > -1;})
            dc.redrawAll("clinical");
        }

        cfservice.getCurrentSubjectIds = function(){
            if(!cfReady)
                return;
            var findingsSubjIds = ($.map(subjectDim['findings'].top(Infinity), function(d) {return d.subjectId }));
            var eventsSubjIds = ($.map(subjectDim['events'].top(Infinity), function(d) {return d.subjectId }));

            var filteredSubjectIds = [];

            filteredSubjectIds = findingsSubjIds

            //This was doing the union of
            /*if(isFindingsXFFiltered()) {
                //console.log('findings filtered')
                findingsSubjIds.forEach(function (id) {
                    if (filteredSubjectIds.indexOf(id) == -1)
                        filteredSubjectIds.push(id);
                })
            }
            if(isEventsXFFiltered()) {
                //console.log('events filtered')
                eventsSubjIds.forEach(function (id) {
                    if (filteredSubjectIds.indexOf(id) == -1)
                        filteredSubjectIds.push(id);
                })
            }*/
            console.log(filteredSubjectIds.length);
            return filteredSubjectIds;//($.map(subjectDim['findings'].top(Infinity), function(d) {return d.subjectId }))
        }

        cfservice.resetSubjectFilter = function(){

            if(subjectDim['findings']) subjectDim['findings'].filter(null);
            if(subjectDim['events']) subjectDim['events'].filter(null);
            dc.redrawAll("clinical");
        }

        cfservice.isSubjectFiltered = function(){
            return IsSubjectFiltered;
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

        var subjectSubjectIds, subjectXFisFiltered;
        var clinicalSubjectIds, clinicalXFsubjIsFiltered;

        var _subjectFilters = {}

        _subjectFilters['subjectXF'] = []
        _subjectFilters['clinicalXF'] = []
        _subjectFilters['assayXF'] = []

        var _removeFilterHandler = function (filters, chartName) {
            console.log('removing filter by chart',chartName)
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].chart <= chartName && filters[i].chart >= chartName) {
                    filters.splice(i, 1);
                    break;
                }
            }
            return filters;
        };

        var _hasFilterHandler = function (filters, chartName, filter) {
            //if (filter === null || typeof(filter) === 'undefined') {
            //    return filters.length > 0;
            //}
            return filters.some(function (f) {
               /* console.log(f.filter, filter)
                console.log(f.filter.some(function(i){return filter.indexOf(i) == -1}));*/

                return chartName <= f.chart && chartName >= f.chart  //TODO: add check on filteredIds
            });
        };

        var _addFilterHandler = function (filters, chartName, filter) {
            if(_hasFilterHandler(filters,chartName, filter))
                _removeFilterHandler(filters,chartName)


            console.log('ADDING FILTER BY CHART', chartName)
            filters.push({chart:chartName,filter:filter});
            //else console.log('FILTER BY CHART ALREADY ADDED')
            return filters;
        };

        var _retainAll = function(filters){

            var intersect = filters[0].filter;

            for(var i=1; i<filters.length; i++){
                intersect = intersect.filter(function(n){
                    return filters[i].filter.indexOf(n) !== -1
                })
            }

            return intersect;
        }

        XFilterLinker.reApplySubjectFilter = function(xfFiltered){

            console.log("===REAPPLYING PREVIOUS SUBJECT FILTERS===")

            //ADDING A CHART TO CLINICAL, APPLY IDS FROM SUBJECT AND ASSAY
            if(xfFiltered.getXFname()  == 'ClinicalCf' && _subjectFilters['clinicalXF'].length > 0){
                console.log('SUBJECT AND ASSAY TO CLINICAL')
                //REAPPLY subjectFilteredIds and AssaySubjectFiltered Ids

                let filteredIds = _retainAll(_subjectFilters['clinicalXF']);
                ClinicalCf.resetSubjectFilter();
                ClinicalCf.filterBySubjects(filteredIds);

                //TODO: AssayCF.getCurrentSubjectIds and APPLY to ClinicalCf.filterBySubjects

            }

            //ADDING A CHART TO SUBJECT, APPLY IDS FROM CLINICAL AND ASSAY
            if(xfFiltered.getXFname()  == 'SubjCf' && _subjectFilters['subjectXF'].length > 0){
                console.log('CLINICAL AND ASSAY TO SUBJECT')

                let filteredIds = _retainAll(_subjectFilters['subjectXF']);
                SubjCf.resetSubjectFilter();
                SubjCf.filterBySubjects(filteredIds);

                //TODO: AssayCF.getCurrentSubjectIds and APPLY to SubjCf.filterBySubjects

            }

            //ADDING A CHART TO ASSAY, APPLY IDS FROM SUBJECT AND CLINICAL
            if(xfFiltered.getXFname()  == 'AssayCf' && _subjectFilters['assayXF'].length > 0){
                console.log('CLINICAL AND SUBJECT TO ASSAY')
                let filteredIds = _retainAll(_subjectFilters['assayXF']);
                AssayCf.resetSubjectFilter();
                AssayCf.filterBySubjects(filteredIds);
            }

            console.log("===END OF REAPPLYING PREVIOUS SUBJECT FILTERS===")
        }

        XFilterLinker.propagateFilter = function(xfFiltered, chartName, filter){

            console.log("====PROPAGATING FILTER====")

            var subjectIds;

            if(xfFiltered.getXFname() == 'SubjCf'){

                subjectIds = xfFiltered.getCurrentSubjectIds();
                if(subjectIds.length == 0)return;

                console.log("SUBJECT TO CLINICAL AND ASSAY");
                ClinicalCf.resetSubjectFilter();
                AssayCf.resetSubjectFilter();

                if(filter == null){
                    _subjectFilters['clinicalXF'] = _removeFilterHandler(_subjectFilters['clinicalXF'],chartName)
                    _subjectFilters['assayXF'] = _removeFilterHandler(_subjectFilters['assayXF'],chartName)
                }

                else{
                    _addFilterHandler(_subjectFilters['clinicalXF'],chartName,subjectIds);
                    _addFilterHandler(_subjectFilters['assayXF'],chartName,subjectIds);
                }

                if(_subjectFilters['clinicalXF'].length > 0){
                    subjectIds  = _retainAll(_subjectFilters['clinicalXF']);
                    //console.log('Filters to propagate to subjects', subjectIds.length);
                    ClinicalCf.filterBySubjects(subjectIds);
                }

                if(_subjectFilters['assayXF'].length > 0){
                    subjectIds = _retainAll(_subjectFilters['assayXF'])
                    // console.log('Filters to propagate to assays', subjectIds.length)
                    AssayCf.filterBySubjects(subjectIds);
                }

            }

            else if(xfFiltered.getXFname()  == 'ClinicalCf'){

                subjectIds = xfFiltered.getCurrentSubjectIds();
                if(subjectIds.length == 0)return;

                console.log("CLINICAL TO SUBJECT AND ASSAY");
                SubjCf.resetSubjectFilter();
                AssayCf.resetSubjectFilter();

                if(filter == null){
                    _subjectFilters['subjectXF'] = _removeFilterHandler(_subjectFilters['subjectXF'],chartName)
                    _subjectFilters['assayXF'] = _removeFilterHandler(_subjectFilters['assayXF'],chartName)
                }

                else{
                    _addFilterHandler(_subjectFilters['subjectXF'],chartName,subjectIds);
                    _addFilterHandler(_subjectFilters['assayXF'],chartName,subjectIds);
                }

                //console.log('_filters[subjectXF]:',_filters['subjectXF'])
                //console.log('_filters[assayXF]:',_filters['assayXF'])
                //var filterIds = _intersectIds(_filters['clinicalXF']);

                if(_subjectFilters['subjectXF'].length > 0){
                    subjectIds  = _retainAll(_subjectFilters['subjectXF']);
                    //console.log('Filters to propagate to subjects', subjectIds.length);
                    SubjCf.filterBySubjects(subjectIds);
                }

                if(_subjectFilters['assayXF'].length > 0){
                    subjectIds = _retainAll(_subjectFilters['assayXF'])
                    //console.log('Filters to propagate to assays', subjectIds.length)
                    AssayCf.filterBySubjects(subjectIds);
                }

                // ClinicalCf.syncfilters();
            }

            /*else if(xfFiltered.getXFname() == 'AssayCf'){
                //console.log("assays filtered");

                SubjCf.resetSubjectFilter();
                ClinicalCf.resetSubjectFilter();

                if(filteredIds.length == 0)return;

                SubjCf.filterBySubjects(filteredIds);
                ClinicalCf.filterBySubjects(filteredIds);
            }*/

            console.log("====END OF PROPAGATING FILTER====")
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

