/**
 * Created by iemam on 17/10/2014.
 */

//Include a dependency service which will request the cfdata as well as list of SCs and EFs
angular.module('eTRIKSdata.dcPlots',['eTRIKSdata.exporter'])

    .factory('AssayCf',function(){

        var SCs = ['SourceType','Localisation','SampleType'];
        var EFs = ['Treatment','TreatementResponse[TC]','RTV','RECIST','IC50'];

        var dimensions = [], groups = [];

        var cfservice = {}

        cfservice.setup = function(scope){
            d3.tsv("../data/methylation_merged.txt", function (data) {

                //use property dataType to coerce string to numerals

                data.forEach(function(d) {
                    //d.dtg   = dtgFormat.parse(d.origintime.substr(0,19));
                    //d.lat   = +d.latitude;
                    d['TreatementResponse[TC]']  = +d['TreatementResponse[TC]'];
                    //d.TC   = d3.round(+d.TC,1);
                    //d.depth = d3.round(+d.depth,0);
                });


                var cfdata = crossfilter(data);

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


                    var grp = dim.group().reduceCount();
                    var grpF = {
                        all: function () {
                            return grp.all().filter(function(d) { return +d.key > 0; })
                        },
                        size: function(){
                            return grp.all().filter(function(d) { return +d.key > 0; }).size()
                        }

                    }
                    groups[ef] = grpF;

                });

                /*console.log(dimensions)
                console.log(groups)*/
                /**
                 * *****************************************************
                 */


                //TC
                /*var efTreatmentDim = cfdata.dimension(function (d) {
                    return d.treatment;
                })
                var efTreatmentGrp = efTreatmentDim.group();


                var efTCDim = cfdata.dimension(function (d) {
                    return d.TC;
                })
                var efTCGrp = efTCDim.group().reduceCount();
                var efTCGrpF = {
                    all: function () {
                        return efTCGrp.all().filter(function(d) { return +d.key > 0; })
                        //return efTCGrp.top(Infinity).filter( function (d) { return d.value !== 0; } );
                    }
                }
                */
            })
        }

        cfservice.getDimension = function(key){

            return dimensions[key];
        }

        cfservice.getGroup = function(key){
//            console.log(key)
            return groups[key];
        }

        return cfservice
    })

    .factory('SubjCf',function(){

        var subjChars =
            ['Cohort','Age','Gender','Race','Status'];

        var dimensions = [], groups = [];
        var cfdata;
        var all;

        var subjCfService = {}

        subjCfService.setup = function(scope){
            d3.tsv("../data/subject-data2.txt", function (data) {

                //use property dataType to coerce string to numerals

                data.forEach(function(d) {
                    //d.dtg   = dtgFormat.parse(d.origintime.substr(0,19));
                    //d.lat   = +d.latitude;
                    d['Age']  = +d['Age'];
                    d.Race   = d.Race;
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

                subjChars.forEach(function(sc){
                    //console.log((sc.value))

                    var dim = cfdata.dimension(function (d) {
                        return d[sc];
                    });
                    dimensions[sc] = dim
                    //var grp = dim.group();
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


            })
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
    })

    .factory('ClinicalCf',['clinicalDataService','$q', function(clinicalDataService,$q){



        var observations = ['bmi','height'];

        var dimensions = [], groups = [];
        var cfData;
        var dataToPlot;

        var cfservice = {}


        //make getData a deferred promise
        cfservice.getData = function(){
            var deferred = $q.defer();

            clinicalDataService.getObservations('BioVaCSAFE',observations)
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
            var deferred = $q.defer();

            /*d3.tsv("../data/clinicalData.txt", function (data) {*/
            this.getData().then(function(data){
                /*console.log(data)*/

                // format our data
                //var dtgFormat = d3.time.format("%Y-%m-%dT%H:%M:%S");

/*                data.forEach(function(d) {
                    //d.dtg   = dtgFormat.parse(d.origintime.substr(0,19));
                    d.bmi   = d3.round(+d.bmi,1);
                    d.height   = d3.round(+d.height,1);
                    d.weight = d3.round(+d.weight,0);
                });*/

                cfData = crossfilter(data);  // Gets 'observations' into crossfilter
                observations.forEach(function(obs){
                    var dim = cfData.dimension(function (d) {console.log(d);return d[obs]});
                    dimensions[obs] = dim
                    var grp = dim.group();
                    groups[obs] = grp;
                })
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

        cfservice.getChartData = function(key){

            var deferred = $q.defer();
            var chartData = {}

            if(angular.isDefined(dimensions[key])){
                chartData.group = groups[key];
                chartData.dimension = dimensions[key];
                deferred.resolve(chartData)
            }else{
                console.log("DATA NOT FOUND IN CF")
                observations.push(key)
                this.setup().then(function(){
                    console.log("GOT UPDATED DATA")
                    chartData.group = groups[key];
                    chartData.dimension = dimensions[key];
                    deferred.resolve(chartData)
                })
            }

            return deferred.promise;
        }

        return cfservice

    }])
