/**
 * Created by iemam on 17/10/2014.
 */

//Include a dependency service which will request the cfdata as well as list of SCs and EFs
angular.module('eTRIKSdata.dcPlots',['eTRIKSdata.exporter'])

    .factory('AssayCf',['assayDataService','$q', function(assayDataService,$q){

        var SCs = ['class','sampleType','batch'];
        var EFs = ['Treatment','DaysAfterVaccination'];

        var dimensions = [], groups = [];

        var cfservice = {}
        var cfdata
        var all

        var gexSampleXfilter,
            luminexSampleXfilter,
            cytofSampleXfilter,
            gexSampleColumns,
            luminexSampleColumns,
            cytofSampleColumns

        var cfReady=false;


        cfservice.getData = function(){
            var deferred = $q.defer();
            assayDataService.getSampleData(studyId)
                .then(function(data){
                    dataToPlot = data
                    //columns = data.columns;
                    deferred.resolve(dataToPlot)
                })
            return deferred.promise
        }

        cfservice.setup = function(scope){

            var deferred = $q.defer();

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

            d3.tsv("../data/bvs-gex.txt", function (data) {

                //use property dataType to coerce string to numerals

                data.forEach(function(d) {
                    //d.dtg   = dtgFormat.parse(d.origintime.substr(0,19));
                    //d.lat   = +d.latitude;
                    //d['TreatementResponse[TC]']  = +d['TreatementResponse[TC]'];
                    //d.TC   = d3.round(+d.TC,1);
                    //d.depth = d3.round(+d.depth,0);
                });


                cfdata = crossfilter(data);
                all = cfdata.groupAll();

                /**
                 * ************Sample Plots****************************
                 */

                SCs.forEach(function(sc){
                    //console.log((sc.value))

                    var dim = cfdata.dimension(function (d) {
                        return d[sc];
                    });
                    dimensions[sc] = dim
                    var grp = dim.group();
                    groups[sc] = grp;

                })

                EFs.forEach(function(ef){
                    // console.log((ef))

                    var dim = cfdata.dimension(function (d) {
                        return d[ef];
                    });
                    dimensions[ef] = dim


                    var grp = dim.group();
                    var grpF = {
                        all: function () {
                            return grp.all().filter(function(d) { return d.key != 'N/A'; })
                        },
                        size: function(){
                            return grp.all().filter(function(d) { return d.key != 'N/A'; }).length
                        }

                    }
                    //console.log(ef,' ',grp.all().filter(function(d) { return d.key != 'N/A'; }))
                    groups[ef] = grpF;

                });
                deferred.resolve()

            })
            return deferred.promise
        }

        cfservice.cfReady = function(){
            return cfReady;
        }
        return cfservice
    }])

    .factory('SubjCf',['subjectDataService','$q',function(subjectDataService,$q){


        var subjChars;
        var dimensions = [], groups = [];
        var cfdata;
        var all;
        var dataToPlot;

        var subjCfService = {}
        var cfReady;
        var subjectColumnName = "subjectId";
        var subjectDim;

        subjCfService.getData = function(StudyId,requestedObsvs){
            var deferred = $q.defer();

            subjectDataService.getSubjData(StudyId,requestedObsvs)
                .then(function(response){
                    //console.log('inside getDAta',response)
                    dataToPlot = response.data;
                    subjChars = response.header; //These are the list of HEADERS in the CF data
                    //No need to maintain on the client?!
                    deferred.resolve(dataToPlot)
                })

            return deferred.promise
        }

        subjCfService.refreshCf = function(StudyId,requestedObsvs){
            var deferred = $q.defer();

            this.getData(StudyId, requestedObsvs).then(function(data){
                //use property dataType to coerce string to numerals

                //console.log('inside inititialize')
                //console.log('dataToPlot',dataToPlot)
                //console.log('data',data)


                data.forEach(function(d) {
                    //d.dtg   = dtgFormat.parse(d.origintime.substr(0,19));
                    //d.lat   = +d.latitude;
                    //d['Age']  = +d['Age'];
                    //d.Race   = d.Race;
                    //d.depth = d3.round(+d.depth,0);
                });

                cfdata = crossfilter(dataToPlot);
                all = cfdata.groupAll();
                //console.log('inside initialize',subjChars)

                subjectDim = cfdata.dimension(function(d) {return d[subjectColumnName]})
                dimensions[subjectColumnName] = subjectDim



                subjChars.forEach(function(sc){
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
            dc.renderAll("subject");
        }

        return subjCfService
    }])

    .factory('ClinicalCf',['clinicalDataService','$q', function(clinicalDataService,$q){

        //var columns;
        var subjectDim,
            subjectColumnName = "subjectId",
            visitColumnName = "visit";
        //var allSubjObservationsGrp;


        var dimensions = [],
            groups = [],
            timeGroups = [],
            timeDimension;

        //var cfData;

        var xfilter = {} //"findings":xf, "events":xf

        var findingsXfilter,
            eventsXfilter,
            findingsColumns,
            eventsColumns


        var dataToPlot = {};
        //var boxplots = [];

        var cfReady=false;
        var cfservice = {};

        cfservice.formatData = function(data){
            // format our data
            //TODO: add DataType to data and use it to coerce dimensions
            data.forEach(function(d) {
                d.bmi   = d3.round(+d.bmi,1);
                d.height   = d3.round(+d.height,2);
                d['weight [VSORRES]'] = d3.round(+d['weight [VSORRES]'],1);
                d['hcrp [LBORRES]'] = d3.round(+d['hcrp [LBORRES]'],1);
                d['diabp [VSORRES]'] = +d['diabp [VSORRES]']
                d['sysbp [VSORRES]'] = +d['sysbp [VSORRES]'];
                d.hr = +d.hr;
                d.temp = +d.temp;
                //d.date_e = dateFormat.parse(d.date_entered);
                //d.date_i = dateFormat.parse(d.date_issued);
            });
        }

        cfservice.generateXf = function(data,columns,isFindings){

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
                //var grp1 = dim.group().reduce(reduceAdd(obs),reduceRemove(obs),reduceInit);
                var reducer = reductio()
                    .filter(function(d) { return  d[obs] != "" })
                    .count(true)
                reducer(grp);
                groups[obs] = grp;
                //console.log('reductio',obs,grp.all())
                //console.log('my group',obs, grp1.top(3))
                //console.log('cf group',obs, dim.group().all())


                /**
                 * Creating boxplot array groups for time-based observations
                 * ...DOING IT FOR FINDINGS ONLY FOR NOW
                 */
                if(isFindings){
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
                }

            })

            return xfilter
        }

        cfservice.getData = function(studyId,requestedObsvs){
            var deferred = $q.defer();
            clinicalDataService.getObservations(studyId,requestedObsvs)
                .then(function(data){
                    dataToPlot = data
                    //columns = data.columns;
                    deferred.resolve(dataToPlot)
                })
            return deferred.promise
        }

        cfservice.refreshCf = function(studyId,requestedObsvs){
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

            this.getData(studyId,requestedObsvs)
                .then(function(data){
                    console.log('inside refresh data')
                    /*
                     //d3.csv("../data/morley.csv", function(error, experiments) {
                     d3.csv("../data/diabp.csv", function(error, experiments) {
                     console.log('doing wbc')
                     ndx = crossfilter(experiments);
                     //console.log(experiments)
                     //runDimension = ndx.dimension(function(d) {return [d.USUBJID, +d.VISITNUM]; });
                     //runGroup = runDimension.group().reduceSum(function(d) { return +d.WBC; });
                     //runDimension = ndx.dimension(function(d) {return [+d.Expt, +d.Run]; });
                     //runGroup = runDimension.group().reduceSum(function(d) { return +d.Speed; });
                     visitDimension = ndx.dimension(function(d) {return [ d.visit]; });
                     //sysbpGroup = visitDimension.group().reduceCount(function(d) { return +d.sysbp; });


                     sysbpGroup     = visitDimension.group().reduce(
                     function(p,v) {
                     p.push(+v.sysbp);
                     return p;
                     },
                     function(p,v) {
                     p.splice(p.indexOf(+v.sysbp), 1);
                     return p;
                     },
                     function() {
                     return [];
                     }
                     );
                     dimensions['sysbp'] = visitDimension
                     groups['sysbp'] = sysbpGroup

                     cfReady = true;
                     deferred.resolve(cfReady)
                     });*/


                    /*
                     //TODO:do a different plot for multiple points/subject charts
                     var jsonQobj=jsonQ(data);
                     var subjects = jsonQobj.find('subjectId').unique()
                     noOfSubj = subjects.length
                     columns.forEach(function(obs){
                     var nonnull = jsonQobj.find(obs, function () {
                     //return this != ""
                     return  !isNaN(this)
                     });
                     noOfObservations = nonnull.value().length
                     //console.log('number of observations',noOfObservations)
                     //console.log('number of subjects',noOfSubj);

                     if(noOfObservations > noOfSubj)
                     boxplots.push(obs)
                     })*/

                    //console.log(data.findingsTbl)
                    /**
                     * Format to data types
                     */
                    cfservice.formatData(data.findingsTbl);

                    /**
                     * Get table headers
                     */
                    findingsColumns = data.findingsTblHeader;
                    eventsColumns = data.eventsTblHeader;


                    /**
                     * Generate Xfilter(s)
                     */
                    findingsXfilter = cfservice.generateXf(data.findingsTbl,findingsColumns,true);
                    eventsXfilter = cfservice.generateXf(data.eventsTbl,eventsColumns,false);

                    // format our data
                    //TODO: add DataType to data and use it to coerce dimensions
                    //data.forEach(function(d) {
                    //    d.bmi   = d3.round(+d.bmi,1);
                    //    d.height   = d3.round(+d.height,2);
                    //    d['weight [VSORRES]'] = d3.round(+d['weight [VSORRES]'],1);
                    //    d['hcrp [LBORRES]'] = d3.round(+d['hcrp [LBORRES]'],1);
                    //    d['diabp [VSORRES]'] = +d['diabp [VSORRES]']
                    //    d['sysbp [VSORRES]'] = +d['sysbp [VSORRES]'];
                    //    d.hr = +d.hr;
                    //    d.temp = +d.temp;
                    //    //d.date_e = dateFormat.parse(d.date_entered);
                    //    //d.date_i = dateFormat.parse(d.date_issued);
                    //});

                    // Gets 'observations' into crossfilter
                    //cfData = crossfilter(data);



                    ////number of subject Observations
                    //allSubjObservationsGrp= cfData.groupAll()

                    //TODO: merge subject count for both events and findings xfilters
                    //BUGGY .. will not work
                    subjectDim = findingsXfilter.dimension(function(d) {return d[subjectColumnName]})
                    uniqueSubjGrp = subjectDim.groupAll().reduce(reduceAddSubj, reduceRemoveSubj, initialSubj)
                    uniqueSubjGrpM = {value: function() {
                        return uniqueSubjGrp.value().count;
                    } };






                    /**
                     * Create Dimensions for each column in the data
                     */
                    //columns.forEach(function(obs){
                    //    if(obs==visitColumnName)
                    //        return;
                    //
                    //    //console.log('Adding ',obs, ' to crossfilter');
                    //    if(boxplots.indexOf(obs)!= -1){
                    //        console.log("doing boxplot for ",obs)
                    //        dim = cfData.dimension(function(d) {return d['visit']})
                    //        dimensions[obs] = dim;
                    //        grp = dim.group().reduce(
                    //            function(p,v) {
                    //                p.push(v[obs]);
                    //                return p;
                    //            },
                    //            function(p,v) {
                    //                p.splice(p.indexOf(v[obs]), 1);
                    //                return p;
                    //            },
                    //            function() {
                    //                return [];
                    //            }
                    //        )
                    //        groups[obs] = grp;
                    //    }
                    //    else{
                    //
                    //        /**
                    //         * Creating histogram count groups
                    //         */
                    //        var dim = cfData.dimension(function (d) {return d[obs]});
                    //        dimensions[obs] = dim
                    //        var grp = dim.group();
                    //        //var grp1 = dim.group().reduce(reduceAdd(obs),reduceRemove(obs),reduceInit);
                    //        var reducer = reductio()
                    //            .filter(function(d) { return  d[obs] != "" })
                    //            .count(true)
                    //        reducer(grp);
                    //        console.log('reductio',obs,grp.all())
                    //        //console.log('my group',obs, grp1.top(3))
                    //        console.log('cf group',obs, dim.group().all())
                    //        groups[obs] = grp;
                    //
                    //        /**
                    //         * Creating boxplot array groups for time-based observations
                    //         */
                    //
                    //
                    //        var timeGroup = timeDimension.group();
                    //        var timeDimReducer = reductio()
                    //            .filter(function(d) { return  d[obs] != "" ; })
                    //            .count(true)
                    //            .dataList(true)
                    //            .valueList(function (d) { return d[obs]; });
                    //        timeDimReducer(timeGroup)
                    //        timeGroups[obs] = timeGroup;
                    //
                    //        /*var grpF = {
                    //         all: function () {
                    //         return grp.all().filter(function(d) { return +d.key > 0; })
                    //         },
                    //         size: function(){
                    //         return grp.all().filter(function(d) { return +d.key > 0; }).size()
                    //         }
                    //         }*/
                    //    }
                    //})
                    //
                    ////dimensions['sysbp'] = timeDimension
                    ////groups['sysbp'] = sysbpGroup
                    //
                    //console.log(dimensions)
                    //console.log(groups)
                    cfReady = true;
                    deferred.resolve(cfReady)
                });

            return deferred.promise
        }


        //TEMP parameter to only do timegroups for findigs




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

        cfservice.getTableDimension = function(){
            return subjectDim
        }

        cfservice.getTableGroup = function(){
            return function(d) {return "booo"}
            //return function(d) {return d[subjectColumnName]}
        }

        //TODO: add parameter findings or events
        cfservice.getTableHeaders = function(){
            var header = [subjectColumnName];
            header = header.concat(findingsColumns)
            return findingsColumns;
        }


        cfservice.getSubjectHeader = function(){
            return subjectColumnName
        }

        cfservice.filterBySubjects = function(filteredSubjectIds){
            if(!angular.isUndefined(subjectDim))
                subjectDim.filterFunction(function(d) { return filteredSubjectIds.indexOf(d) > -1;})
            dc.renderAll("clinical");
        }

        cfservice.getCurrentSubjectIds = function(){
            return ($.map(subjectDim.top(Infinity), function(d) {return d.subjectId }))
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

        return cfservice

    }])

    .factory('XFilterLinker',['ClinicalCf','SubjCf','AssayCf','$injector', function(ClinicalCf,SubjCf,AssayCf,$injector){

        var XFilterLinker = {}

        XFilterLinker.propagateFilter = function(xfilterServiceName){

            var xfFiltered = $injector.get(xfilterServiceName);
            //console.log('filtered in ',xfFiltered);

            //var service = $injector.get(request);

            var filteredIds = xfFiltered.getCurrentSubjectIds();
            //console.log(xfFiltered)

            if(xfilterServiceName == 'SubjCf'){
                //console.log("subjects filtered")
                ClinicalCf.filterBySubjects(filteredIds);
                //AssayCf.filterBySubjects(filteredIds);
            }else if(xfilterServiceName == 'ClinicalCf'){
                //console.log("clinical filtered")
                SubjCf.filterBySubjects(filteredIds);
                //AssayCf.filterBySubjects(filteredIds);
            }else if(xfilterServiceName == 'AssayCf'){
                //console.log("assays filtered")
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
