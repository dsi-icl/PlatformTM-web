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


        cfservice.getData = function(){
            var deferred = $q.defer();

            /*assayDataService.getObservations('CRC305C',observations)
                .then(function(data){
                    dataToPlot = data.observations;
                    deferred.resolve(dataToPlot)
                })*/

            // 1- Get the data
            // 2- Preprocess if needed (coerce, round, format...etc)
            // 3- Initialize crossfilter
            // 4- Create dimensions and groups

            //onclick check that the observation is not present in the service
            //if not present send a request to server to get data sending the array of observations
            //currently displayed
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

        cfservice.getChartData = function(key){

            var deferred = $q.defer();
            var chartData = {}


            if(angular.isDefined(dimensions[key])){
                chartData.group = groups[key];
                chartData.dimension = dimensions[key];
                deferred.resolve(chartData)
            }else{
                //console.log("DATA NOT FOUND IN CF")
                EFs.push(key)
                this.setup().then(function(){
                    //console.log("GOT UPDATED DATA")
                    chartData.group = groups[key];
                    chartData.dimension = dimensions[key];
                    deferred.resolve(chartData)
                })
            }

            return deferred.promise;
        }

        cfservice.getDimension = function(key){

            return dimensions[key];
        }

        cfservice.getGroup = function(key){
//            console.log(key)
            return groups[key];
        }

        cfservice.getCountData = function(){
            return cfdata
        }
        cfservice.getCountGroup = function(){
            return all
        }

        return cfservice
    }])

    .factory('SubjCf',['subjectDataService','$q',function(subjectDataService,$q){

        var subjChars =
            ['Cohort','Age','Gender','Race','Ethnicity'];

        var subjCharsDB =
            ['arm','age','sex','race','ethnic'];

        var dimensions = [], groups = [];
        var cfdata;
        var all;
        var dataToPlot;

        var subjCfService = {}

        subjCfService.getData = function(StudyId){
            var deferred = $q.defer();

            subjectDataService.getSubjData(StudyId,subjCharsDB)
                .then(function(data){
                    dataToPlot = data.scs;
                    deferred.resolve(dataToPlot)
                })

            return deferred.promise
        }

        subjCfService.setup = function(StudyId){
            var deferred = $q.defer();

//          d3.tsv("../data/subject-data2.txt", function (data) {
            this.getData(StudyId).then(function(data){
                //use property dataType to coerce string to numerals
                data.forEach(function(d) {
                    //d.dtg   = dtgFormat.parse(d.origintime.substr(0,19));
                    //d.lat   = +d.latitude;
                    //d['Age']  = +d['Age'];
                    //d.Race   = d.Race;
                    //d.depth = d3.round(+d.depth,0);
                });


                cfdata = crossfilter(data);
                all = cfdata.groupAll();

                /*dc.dataCount('.dc-data-count')
                    .dimension(ndx)
                    .group(all);*/

                /*var countDim = cfdata.dimension(function (d) {
                    return d["PatientID"];
                });
                subjCountGrp = countDim.group().reduceCount();*/
                //console.log('inside setup ',subjCountGrp)

                subjCharsDB.forEach(function(sc){
                    //console.log((sc.value))
                    var dim = cfdata.dimension(function (d) {
                        return d[sc];
                    });
                    dimensions[sc] = dim
                    var grp = dim.group().reduceCount();
                    /*var grpF = {
                        all: function () {
                            return grp.all().filter(function(d) { return +d.key > 0; })
                        },
                        size: function(){
                            return grp.all().filter(function(d) { return +d.key > 0; }).size()
                        }

                    }*/
                    groups[sc] = grp;
                })
                deferred.resolve()
            })
            return deferred.promise
        }

        subjCfService.getChartData = function(key){

            var deferred = $q.defer();
            var chartData = {}

            //
            if(angular.isDefined(dimensions[key])){
                chartData.group = groups[key];
                chartData.dimension = dimensions[key];
                deferred.resolve(chartData)
            }//else{
            //    //console.log("DATA NOT FOUND IN CF")
            //    observations.push(key)
            //    this.setup().then(function(){
            //        //console.log("GOT UPDATED DATA")
            //        chartData.group = groups[key];
            //        chartData.dimension = dimensions[key];
            //        deferred.resolve(chartData)
            //    })
            //}

            return deferred.promise;
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

        return subjCfService
    }])

    .factory('ClinicalCf',['clinicalDataService','$q', function(clinicalDataService,$q){

        var observationCodes = [];
        var observationIds = [];
        //var observations = ['bmi','height','weight','temp','hr','diabp','sysbp'];
        //var observations = ['bmi','height','weight','diabp'];
        var headers = ['SUBJECT','VISIT','BMI','HEIGHT','WEIGHT','TEMPERATURE','HEART RATE','DIASTOLIC BP','SYSTOLIC BP'];

        var subjectDim, subjectGrp,
            subjectColumnName = "subjectId";
            //subjectColumnName = "usubjid";
        var visitColumn = "visit"
        //var observations = ['diabp'];
        var dimensions = [], groups = [];

        var cfData;
        var dataToPlot;
        var boxplots = [];

        var cfservice = {}

        //make getData a deferred promise
        cfservice.getData = function(){
            var deferred = $q.defer();

            //clinicalDataService.getObservations('CRC305C',observationCodes)
            //    .then(function(data){
            //        dataToPlot = data.observations;
            //        deferred.resolve(dataToPlot)
            //    })
            clinicalDataService.getObservations('CRC305C',observationIds)
                .then(function(data){
                    dataToPlot = data.observations;
                    deferred.resolve(dataToPlot)
                })

            // 1- Get the data
            // 2- Preprocess if needed (coerce, round, format...etc)
            // 3- Initialize crossfilter
            // 4- Create dimensions and groups

            //onclick check that the observation is not present in the service
            //if not present send a request to server to get data sending the array of observations
            //currently displayed
            return deferred.promise
        }

        cfservice.setup = function(){
            //cfData.remove();
            var deferred = $q.defer();

            /*function reduceAdd(p, v) {
                if( v[subjColumnName] in p.subjects)
                    p.subjects[v[subjColumnName]]++;
                else p.subjects[v.USUBJID] = 1;
                p.push(v[subjColumnName]);
                return p;

*//*                ++p.count;
                p.total += v[USUBJID];
                return p;*//*
            }

            function reduceRemove(p, v) {
                *//*p.subjects[v.USUBJID]--;
                if(p.subjects[v.USUBJID] === 0)
                    delete p.subjects[v.USUBJID];*//*
                *//*--p.count;
                p.total -= v.value;*//*
                p.splice(p.indexOf(v[subjColumnName]), 1);
                return p;
            }

            function reduceInitial() {
                return [];
                //return {subjects: {}};
                //return {count: 0, total: 0};
            }*/

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

            /*function reduceAdd(key) {
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
                return {count: 0, total: 0};
            }*/

            //d3.json("../data/clinicalTest2.json",function(data){
            //d3.tsv("../data/VS_mod_full.txt", function (data) {
            this.getData().then(function(data){
                /*console.log(data)*/

                var jsonQobj=jsonQ(data);

                //var subjects = jsonQobj.find('usubjid').unique()
                var subjects = jsonQobj.find('subjectId').unique()
                var noOfSubj = subjects.length
                console.log(observationCodes)

                observationCodes.forEach(function(obs){
                    var nonnull = jsonQobj.find(obs, function () {
                        //return this != ""
                        return  !isNaN(this)
                    });
                    noOfObservations = nonnull.value().length
                    console.log('number of observations',noOfObservations)
                    console.log('number of subjects',noOfSubj);

                    //if(noOfObservations > noOfSubj)
                    //    boxplots.push(obs)
                })

                //console.log(boxplots)

                // format our data
                //var dtgFormat = d3.time.format("%Y-%m-%dT%H:%M:%S");
                //var testobs = 'weight';
                //TODO: add DataType to data and use it to coerce dimensions
                data.forEach(function(d) {
                    //d.dtg   = dtgFormat.parse(d.origintime.substr(0,19));
                    d.bmi   = d3.round(+d.bmi,1);
                    d.height   = d3.round(+d.height,2);
                    d.weight = d3.round(+d.weight,1);
                    //d[testobs] = d3.round(+d[testobs],1)
                    d.diabp = +d.diabp;
                    d.sysbp = +d.sysbp;
                    d.hr = +d.hr;
                    d.temp = +d.temp;

                    //d.date_e = dateFormat.parse(d.date_entered);
                    //d.date_i = dateFormat.parse(d.date_issued);

                });
                // console.log(data);

                cfData = crossfilter(data);  // Gets 'observations' into crossfilter


                //CREATE a dimension for the subject Ids
                subjectDim = cfData.dimension(function(d) {return d[subjectColumnName]})
                //console.log('subject dimension',subjectDim)
                //subjectGrp = subjDim.group()
                //number of subjects
                //console.log(subjGrp.size())

                //visitDim = cfData.dimension(function(d) {return d[visitColumn]})
                //visitGrp = visitDim.group()

                //console.log(visitGrp.all())

                observationCodes.forEach(function(obs){


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
                    }else{



                    //console.log(obs)
                    //TEMP
              /*      if(obs == 'diabp'){

                       console.log("IN SETUP")

                    }else{
                        console.log("NOT GOING IN HERE")*/
                        //console.log(angular.toJson(obs));
                        var dim = cfData.dimension(function (d) {return d[obs]});
                        dimensions[obs] = dim

                    //TEST multiplicity
                    /*var obsGrpBySubj = dim.group().reduce(reduceAdd,reduceRemove,reduceInitial)
                    console.log(obs,' ',obsGrpBySubj.all())*/


                        //var grp = dim.group();
                        //dim.filter(function(d) { return +d.key > 0; })
                        var grp = dim.group().reduce(reduceAdd(obs),reduceRemove(obs),reduceInit);
                        //var grp = dim.group()
                        /*var grpF = {
                            all: function () {
                                return grp.all().filter(function(d) { return +d.key > 0; })
                            },
                            size: function(){
                                return grp.all().filter(function(d) { return +d.key > 0; }).size()
                            }

                        }*/

                        //console.log('obs ',obs, ' ',grp.all())
                        //console.log(grp.top(1))
                        groups[obs] = grp;
                    }

                })

                //console.log(cfData)
                deferred.resolve()

            });
            return deferred.promise
        }

        cfservice.getDimension = function(key){
            return dimensions[key];
        }

        cfservice.getGroup = function(key){
            return groups[key];
        }

        cfservice.getChartData = function(obsCode, obsId, domain, obs){
            console.log('dimensions',dimensions)
            console.log('observations',observationCodes)
            console.log('requested obs',obsCode)
            console.log('requested obs id',obsId)

            var deferred = $q.defer();
            var chartData = {}

            //TODO: need to find an alternative way to check obs exists or not

            if(angular.isDefined(dimensions[obsCode])){
                console.log('Dimension found ',obsCode)
                chartData.group = groups[obsCode];
                chartData.dimension = dimensions[obsCode];
                chartData.requiresBoxplot = boxplots.indexOf(obsCode)!= -1
                deferred.resolve(chartData)
            }else{
                console.log("DATA NOT FOUND IN CF")
                //observation
                observationCodes.push(obsCode)
                observationIds.push(obsId)
                this.setup().then(function(){
                    //console.log("GOT UPDATED DATA")
                    chartData.group = groups[obsCode];
                    chartData.dimension = dimensions[obsCode];
                    chartData.requiresBoxplot = boxplots.indexOf(obsCode)!= -1
                    deferred.resolve(chartData)
                })
            }

            return deferred.promise;
        }

        cfservice.getTableHeaders = function(){
            var deferred = $q.defer();
            deferred.resolve(observationCodes)
            return deferred.promise
        }

        cfservice.getTableData = function(){
            var deferred = $q.defer();
            var tableData ={}
            //this.setup().then(function(){
                //console.log("GOT UPDATED DATA")
                tableData.dimension = subjectDim;
                tableData.headers = headers;
                deferred.resolve(tableData)
            //})
            return deferred.promise
        }

        cfservice.getCountData = function(){
            return subjectDim
        }
        cfservice.getCountGroup = function(){
            return subjectDim.groupAll()
        }



        return cfservice

    }])
