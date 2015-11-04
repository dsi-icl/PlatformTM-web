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

        /*cfservice.getDCchart = function(projectId,scName, scID,chartGrp){

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

                subjChars.push(scName); //used for building CF dimensions,
                                        // should be the same as column name in the CF table
                subjCharsIds.push(scID); //used for querying new and old SCs

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
        }*/


        /*cfservice.getChartData = function(key){

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
        }*/

        /*cfservice.getDimension = function(key){

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
*/
        return cfservice
    }])

    .factory('SubjCf',['subjectDataService','$q',function(subjectDataService,$q){

        var ScIdToSCNameMap = [];
        var subjChars
        var subjCharsIds = [];

        var chartIdToObs = [];
        var obsToChartId = [];
        var dimensions = [], groups = [];
        var cfdata;
        var all;
        var dataToPlot;

        var subjCfService = {}
        var cfReady;
        var counterWidgetId;
        var subjectColumnName = "subjectId";
        var subjectDim;

        subjCfService.getData = function(StudyId,subjCharsIds){
            var deferred = $q.defer();

            subjectDataService.getSubjData(StudyId,subjCharsIds)
                .then(function(response){
                    //console.log('inside getDAta',response)
                    dataToPlot = response.data;
                    subjChars = response.header; //These are the list of HEADERS in the CF data
                    //No need to maintain on the client?!
                    deferred.resolve(dataToPlot)
                })

            return deferred.promise
        }

        subjCfService.refreshCf = function(StudyId,subjCharsIds){
            var deferred = $q.defer();

            this.getData(StudyId, subjCharsIds).then(function(data){
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
                    //console.log((sc.value))
                    var dim = cfdata.dimension(function (d) {
                        return d[sc];
                    });
                    dimensions[sc] = dim
                    //console.log('adding dimension',sc, ' ',dim.top(1))
                    var grp = dim.group().reduceCount();
                    groups[sc] = grp;
                    //console.log('adding group',sc, ' ',dim.groupAll())
                })
                cfReady = true
                deferred.resolve(subjChars)
            })
            return deferred.promise
        }

        /*subjCfService.refreshCharts = function(){
            var allCharts = dc.chartRegistry.list('subject');
            //console.log('Inside refresh charts ',allCharts)
            var oldFilters
            allCharts.forEach(function(chart){
                //console.log('got chart ',chart.chartID(),' ',chart.chartGroup())
                oldFilters = chart.filters(); // Get current filters
                chart.filter(null); // Reset all filters on current chart
                chart.expireCache();

                //I need to know which observations this id was associated with so that I can query for
                // the new dimensions created for this observation
                var obs = chartIdToObs[chart.chartID()]

                if(!angular.isUndefined(obs)) {
                    //console.log('refreshing ', obs)
                    chart.dimension(subjCfService.getDimension(obs))
                    chart.group(subjCfService.getGroup(obs));
                    oldFilters.forEach(function (filter) {
                        chart.filter(filter)
                    })
                }

                if(chart.chartID() == counterWidgetId){
                    //console.log('refreshing counter')
                    chart.dimension(subjCfService.getCountData())
                    chart.group(subjCfService.getCountGroup());
                }
            })
        }*/

        /*subjCfService.getDCchart = function(projectId,scName, scID,chartGrp){

            var deferred = $q.defer();
            var chart;

            console.log('Inside getDC chart',projectId,scName,scID)
            //Checks if a chart had been previously selected for this observation
            if (angular.isDefined(obsToChartId[scName])) {
                console.log('Chart found ', scName)
                chartId = obsToChartId[scName];

                dc.chartRegistry.list().forEach(function(c){
                    console.log('chartId: ', c.chartID(),'chartGroup: ', c.chartGroup())
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

                subjChars.push(scName); //used for building CF dimensions,
                                        // should be the same as column name in the CF table
                subjCharsIds.push(scID); //used for querying new and old SCs

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
        }*/

        /*subjCfService.createChart = function(obsName,chartGrp){

            var cfDimension = subjCfService.getDimension(obsName)
            var cfGroup = subjCfService.getGroup(obsName)

            //console.log('inside create chart', obsName,cfDimension,cfGroup,dimensions,groups)

            //var requiresBoxplot = scope.chartData.requiresBoxplot;
            var chartData = getChartOptions(obsName,cfDimension, cfGroup, false);

            //CREATE CHART
            var chartFactory = dc[chartData.chartType];
            var chart = chartFactory();
            chart.options(chartData.chartOptions);
            /!*chart.chartGroup(chartGrp);
             dc.registerChart(chart,chartGrp)*!/

            //Reference to chart dimension and group used when refreshing data
            //chartDimensions[chart.chartID()] = cfDimension;
            //chartGroups[chart.chartID()] = cfGroup;
            //Reference to the created chart used when replotting the chart
            obsToChartId[obsName] = chart.chartID();
            chartIdToObs[chart.chartID()] = obsName;

            return chart
        }*/

        /*subjCfService.createDCcounter = function(countObj, chartGrp){
            var chartFactory = dc['dataCount'];
            var chart = chartFactory();
            var chartOptions = {};
            chartOptions["dimension"] = subjCfService.getCountData()
            chartOptions["group"] =  subjCfService.getCountGroup()
            chart.options(chartOptions);
            counterWidgetId = chart.chartID();
            /!*chart.options(chartData.chartOptions);
             chart.chartGroup(chartGrp);
             dc.registerChart(chart,chartGrp)

             obsToChartId[countObj] = chart.chartID();
             chartIdToObs[chart.chartID()] = countObj;*!/
            return chart
        }*/

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

        /*function getChartOptions(val,cfDimension,cfGroup,requiresBoxplot){

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

            }else if(isNaN(cfGroup.all()[0].key)){
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
                    //chartOptions["legend"] = dc.legend().x(140).y(0).gap(5)
                }
            }else{
                //numeric bar chart
                maxValue = cfDimension.top(1)[0][val]
                minValue = getMinimumValue(cfDimension,val);
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

        };*/

        /*function getMinimumValue(dimension, val){
            var orderedVals = dimension.bottom(Infinity)
            //console.log(orderedVals)
            var i=0;
            while (orderedVals[i][val]==null || orderedVals[i][val]=="") {
                i++;
            }
            //console.log(orderedVals[i][val])
            return orderedVals[i][val]
        }*/

        subjCfService.filterBySubjects = function(filteredSubjectIds){
            subjectDim.filterFunction(function(d) { return filteredSubjectIds.indexOf(d) > -1;})
            //dc.renderAll("subject");
        }

        /*subjCfService.propagateFilter = function(){
            var filteredIds = ($.map(subjectDim.top(Infinity), function(d) {return d.subjectId }))
            ClinicalCf.filterBySubjects(filteredIds);
            AssayCf.filterBySubjects(filteredIds);

        }*/

        subjCfService.getCurrentSubjectIds = function(){
            return ($.map(subjectDim.top(Infinity), function(d) {return d.subjectId }))
        }

        /*subjCfService.filterClinicalCF = function(filter,dimensionName){
         //console.log(cfdata)
         //console.log(subjectDim.top(Infinity))
         //console.log(subjectDim.group().all())
         //console.log(cfdata.groupAll().value())

         var filtered = ($.map(subjectDim.top(Infinity), function(d) {return d.subjectId }))
         ClinicalCf.filterClinicalData(filter,dimensionName,filtered);
         }*/

        subjCfService.cfReady = function(){
            return cfReady;
        }

        return subjCfService
    }])

    .factory('ClinicalCf',['clinicalDataService','$q', function(clinicalDataService,$q){

        var myName = "ClinicalCf";
        var observationCodes = [];
        var observationIds = [];

        var requestedObsvs = {};

        //var headers = ['SUBJECT','VISIT','BMI','HEIGHT','WEIGHT','TEMPERATURE','HEART RATE','DIASTOLIC BP','SYSTOLIC BP'];

        var columns;
        var subjectDim, subjectGrp,
            subjectColumnName = "subjectId";
        var allGroup;


        var visitColumn = "visit", studyColumn = "study",
            armColumn = "arm", siteColumn = "site";

        var dimensions = [], groups = [];

        var chartIdToObs = [];
        var obsToChartId = [];
        var tableWidgetId,counterWidgetId;

        var cfData;
        var dataToPlot;
        var boxplots = [];

        var cfReady;
        var cfservice = {};


        cfservice.getData = function(studyId,requestedObsvs){
            var deferred = $q.defer();
            clinicalDataService.getObservations(studyId,requestedObsvs)
                .then(function(data){
                    dataToPlot = data.observations;
                    columns = data.columns;
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

            this.getData(studyId,requestedObsvs)
                .then(function(data){


                //TODO:do a different plot for multiple points/subject charts
                /* var jsonQobj=jsonQ(data);
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
                 })*/



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


                /*visitDim = cfData.dimension(function(d) {return d[visitColumn]})
                visitGrp = visitDim.group()
                dimensions[visitColumn] = visitDim
                groups[visitColumn] = visitGrp;*/

                /*studyDim = cfData.dimension(function(d) {return d[studyColumn]})
                studyGrp = studyDim.group()
                dimensions[studyColumn] = studyDim
                groups[studyColumn] = studyGrp;*/

                /*siteDim = cfData.dimension(function(d) {return d[siteColumn]})
                siteGrp = siteDim.group()
                dimensions[siteColumn] = siteDim
                groups[siteColumn] = siteGrp;*/

                /*armDim = cfData.dimension(function(d) {return d[armColumn]})
                armGrp = armDim.group()
                dimensions[armColumn] = armDim
                groups[armColumn] = armGrp;*/


                //console.log('observationCodes inside refresh cf', columns)

                /**
                 * Create Dimensions for each column in the data
                 */
                columns.forEach(function(obs){
                    //console.log('Adding ',obs, ' to crossfilter');
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
                        //console.log(obs,' created dimension ',dim.top(1), ' in crossfilter');
                        dimensions[obs] = dim
                        var grp = dim.group().reduce(reduceAdd(obs),reduceRemove(obs),reduceInit);
                        //console.log(obs,' created group ',grp.all(), ' in crossfilter');
                        /*var grpF = {
                         all: function () {
                         return grp.all().filter(function(d) { return +d.key > 0; })
                         },
                         size: function(){
                         return grp.all().filter(function(d) { return +d.key > 0; }).size()
                         }
                         }*/
                        groups[obs] = grp;
                    }
                })

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

        /*cfservice.refreshCharts = function(){

            var allCharts = dc.chartRegistry.list('clinical');
            //console.log('Inside refresh charts ',allCharts)
            var oldFilters

            allCharts.forEach(function(chart){
                //console.log('got chart ',chart.chartID(),' ',chart.chartGroup())
                if(chart.chartGroup() == "clinical"){
                    oldFilters = chart.filters(); // Get current filters
                    chart.filter(null); // Reset all filters on current chart
                    chart.expireCache();

                    //I need to know which observations this id was associated with so that I can query for
                    // the new dimensions created for this observation
                    var obs = chartIdToObs[chart.chartID()]
                    if(!angular.isUndefined(obs)){
                        //console.log('refreshing ',obs)
                        chart.dimension(cfservice.getDimension(obs))
                        chart.group(cfservice.getGroup(obs));
                        oldFilters.forEach(function(filter){
                            chart.filter(filter)
                        })
                    }

                    if(chart.chartID() == tableWidgetId){
                        //console.log('refreshing table')
                        chart.dimension(cfservice.getTableDimension())
                        chart.group(cfservice.getTableGroup());
                        chart.columns(columns);
                    }
                    if(chart.chartID() == counterWidgetId){
                        //console.log('refreshing counter')
                        chart.dimension(cfservice.getCountData())
                        chart.group(cfservice.getCountGroup());
                    }

                }
            })
        }*/

        /*cfservice.getDCchart = function(projectId,obsCode, obsId, chartGroup){

            var deferred = $q.defer();
            var chart;

            //Checks if a chart had been previously selected for this observation
            if (angular.isDefined(obsToChartId[obsCode])) {
                console.log('Inside Clinical xf Chart found ', obsCode)
                chartId = obsToChartId[obsCode];

                dc.chartRegistry.list().forEach(function(c){
                    console.log('chartId: ', c.chartID(),'chartGroup: ', c.chartGroup())
                    if(c.chartID() == chartId)
                        chart = c
                })

                //chart = dc.chartRegistry.list().get(chartId);
                deferred.resolve(chart)
            } else {
                console.log("Inside getDC-chart: DATA NOT FOUND IN CF")

                //TODO: THIS IS where chart refresh should be done
                //1- Need to get the new requested observation
                //2- Add it to the previously selected observations
                //3- refresh cross filter with new data
                //4- iterate through already created charts and reset them
                // 4a- for each chart set dimension, group and filter
                //5- renderall/ redrawall

                /!**
                 * ************************TEMP HACK******************************
                 *!/
                if(obsId.indexOf('4') == 0)
                    observationCodes.push(obsCode+' sev');

                observationCodes.push(obsCode);
                observationIds.push(obsId);
                requestedObsvs[obsCode] = obsId

                console.log('observationCodes',observationCodes)
                console.log('observationIds',observationIds)
                console.log('requestedObs',requestedObsvs)
                /!**
                 * ****************************************************************
                 *!/

                cfservice.refreshCf().then(function () {
                    cfservice.refreshCharts();

                    if(obsId.indexOf('4') == 0)
                        obsCode = obsCode+' sev'
                    chart = cfservice.createChart(obsCode,chartGroup)
                    deferred.resolve(chart)
                })
            }
            return deferred.promise
        }*/

        /* cfservice.createChart = function(obsName,chartGrp){

            var cfDimension = cfservice.getDimension(obsName)
            var cfGroup = cfservice.getGroup(obsName)

            console.log("Creating chart for ",obsName);
            console.log('chart group ',chartGrp);
            console.log(obsName,' dimension top 3',cfDimension.top(3))
            console.log(obsName,' group size ',cfGroup.size())

            //var requiresBoxplot = scope.chartData.requiresBoxplot;
            var chartData = cfservice.getChartOptions(obsName,cfDimension, cfGroup, false);

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
        }*/

        /*cfservice.createDCcounter = function(countObj, chartGrp){
            var chartFactory = dc['dataCount'];
            var chart = chartFactory();
            var chartOptions = {};
            chartOptions["dimension"] = cfservice.getCountData()
            chartOptions["group"] =  cfservice.getCountGroup()
            chart.options(chartOptions);
            counterWidgetId = chart.chartID();

            /!*console.log('dimension size ', cfservice.getCountData().size())
             console.log('group size ', cfservice.getCountGroup().value())

             chart.options(chartData.chartOptions);
             chart.chartGroup(chartGrp);
             dc.registerChart(chart,chartGrp)


             obsToChartId[countObj] = chart.chartID();
             chartIdToObs[chart.chartID()] = countObj;*!/
            return chart
        }*/

        /*cfservice.createDCtable = function(){
            var chartFactory = dc['dataTable'];
            var chart = chartFactory();
            var chartOptions = {};
            chartOptions["dimension"] = this.getTableDimension();//subjectDim;//cfservice.getCountData()
            chartOptions["group"] =  this.getTableGroup();//function(d) {return d[subjectColumnName]}//cfservice.getCountGroup()
            chartOptions["columns"] = columns //observationCodes
            chartOptions["width"] = "960"
            chartOptions["height"] = "800"
            chartOptions["sortBy"] = function(d){
                return d[subjectColumnName];
            }

            chart.options(chartOptions);
            /!*chart.chartGroup('clinical');
             dc.registerChart(chart,'clinical')*!/
            tableWidgetId = chart.chartID();

            return chart
        }*/

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
            return function(d) {return d[subjectColumnName]}
        }

        /*cfservice.getChartOptions = function(val,cfDimension,cfGroup,requiresBoxplot){

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

        };*/

        /*cfservice.getMinimumValue = function(dimension, val){
            var orderedVals = dimension.bottom(Infinity)
            //console.log(orderedVals)
            var i=0;
            while (orderedVals[i][val]==null || orderedVals[i][val]=="") {
                i++;
            }
            //console.log(orderedVals[i][val])
            return orderedVals[i][val]
        }*/

        cfservice.filterBySubjects = function(filteredSubjectIds){
            if(!angular.isUndefined(subjectDim))
                subjectDim.filterFunction(function(d) { return filteredSubjectIds.indexOf(d) > -1;})
            //dc.renderAll("clinical");
        }

        cfservice.getCurrentSubjectIds = function(){
            return ($.map(subjectDim.top(Infinity), function(d) {return d.subjectId }))
        }

        /*cfservice.propagateFilter = function(){
            var filteredIds = ($.map(subjectDim.top(Infinity), function(d) {return d.subjectId }))
            SubjectCf.filterBySubjects(filteredIds);
            //AssayCf.filterBySubjects(filteredIds);

        }*/

        /*cfservice.filterClinicalData = function(filter,dimensionName,filteredData){
         //console.log('filter',filter,'dimension',dimensionName)
         //console.log(subjectDim.group().all())
         //console.log(subjectDim.top(Infinity))
         //console.log(uniqueSubjGrp.value().subjects)
         //var gg = uniqueSubjGrp.value().subjects;
         //console.log(uniqueSubjGrp.value().subjects.size())
         var selectedSubjects = ["CRC305D-GENT060-2010","CRC305D-GENT061-4015"];

         var dd = ["CRC305C-9001-303","CRC305C-9010-306","CRC305C-9014-308","CRC305C-9015-311","CRC305C-9026-314","CRC305C-9031-317","CRC305C-9041-322","CRC305C-9043-327","CRC305C-9044-331","CRC305C-9046-329","CRC305C-9050-323","CRC305C-9056-336","CRC305C-9063-334","CRC305C-9066-339","CRC305C-9068-341","CRC305C-9069-342","CRC305C-9073-345","CRC305C-9078-1321","CRC305C-9082-347","CRC305C-9088-1302"];
         var ee = ["CRC305C-9001-303","CRC305C-9010-306","CRC305C-9014-308","CRC305C-9015-311","CRC305C-9026-314","CRC305C-9031-317","CRC305C-9041-322","CRC305C-9043-327","CRC305C-9044-331","CRC305C-9046-329","CRC305C-9050-323","CRC305C-9056-336","CRC305C-9063-334","CRC305C-9066-339","CRC305C-9068-341","CRC305C-9069-342","CRC305C-9073-345","CRC305C-9078-1321","CRC305C-9082-347","CRC305C-9088-1302","CRC305D-GENT001-1001","CRC305D-GENT002-1002","CRC305D-GENT003-2001","CRC305D-GENT004-1017","CRC305D-GENT005-1016","CRC305D-GENT006-3016","CRC305D-GENT007-3006","CRC305D-GENT008-3012","CRC305D-GENT009-2015","CRC305D-GENT010-3017","CRC305D-GENT011-1015","CRC305D-GENT012-3021","CRC305D-GENT013-1009","CRC305D-GENT014-1011","CRC305D-GENT015-3020","CRC305D-GENT016-3013","CRC305D-GENT017-1010","CRC305D-GENT018-1014","CRC305D-GENT019-1018","CRC305D-GENT020-3018","CRC305D-GENT021-3015","CRC305D-GENT022-3019","CRC305D-GENT023-3014","CRC305D-GENT024-1003","CRC305D-GENT025-1006","CRC305D-GENT026-3008","CRC305D-GENT027-3001","CRC305D-GENT028-3005","CRC305D-GENT029-1007","CRC305D-GENT031-3004","CRC305D-GENT032-1012","CRC305D-GENT033-3003","CRC305D-GENT034-3002","CRC305D-GENT035-1013","CRC305D-GENT036-1005","CRC305D-GENT037-3010","CRC305D-GENT038-3009","CRC305D-GENT039-3007","CRC305D-GENT040-3011","CRC305D-GENT041-1008","CRC305D-GENT042-1004","CRC305D-GENT043-4014","CRC305D-GENT044-4013","CRC305D-GENT045-2004","CRC305D-GENT046-4010","CRC305D-GENT047-4004","CRC305D-GENT048-4011","CRC305D-GENT049-2006","CRC305D-GENT050-4002","CRC305D-GENT051-2002","CRC305D-GENT052-4007","CRC305D-GENT054-2012","CRC305D-GENT055-2014","CRC305D-GENT056-2017","CRC305D-GENT057-4009","CRC305D-GENT058-4022","CRC305D-GENT059-2007","CRC305D-GENT060-2010","CRC305D-GENT061-4015","CRC305D-GENT062-4005","CRC305D-GENT063-2003","CRC305D-GENT064-4019","CRC305D-GENT065-2005","CRC305D-GENT067-4016","CRC305D-GENT068-4006","CRC305D-GENT069-2011","CRC305D-GENT070-4001","CRC305D-GENT071-4008","CRC305D-GENT072-4017","CRC305D-GENT073-4003","CRC305D-GENT074-2009","CRC305D-GENT075-4023","CRC305D-GENT076-4020","CRC305D-GENT077-4018","CRC305D-GENT078-2013","CRC305D-GENT079-2008","CRC305D-GENT080-4021","CRC305D-GENT082-2029","CRC305D-GENT083-4025","CRC305D-GENT084-2018","CRC305D-GENT085-4037","CRC305D-GENT086-2030","CRC305D-GENT087-4041","CRC305D-GENT088-2033","CRC305D-GENT089-2037","CRC305D-GENT090-4039","CRC305D-GENT091-2038","CRC305D-GENT092-4034","CRC305D-GENT093-2032","CRC305D-GENT094-2031","CRC305D-GENT095-4036","CRC305D-GENT096-4033","CRC305D-GENT097-2035","CRC305D-GENT098-2036","CRC305D-GENT099-2034","CRC305D-GENT100-4042","CRC305D-GENT101-4035","CRC305D-GENT103-4040","CRC305D-GENT104-2019","CRC305D-GENT105-4027","CRC305D-GENT106-4028","CRC305D-GENT107-4031","CRC305D-GENT108-2026","CRC305D-GENT109-4038","CRC305D-GENT110-2024","CRC305D-GENT111-2022","CRC305D-GENT112-4026","CRC305D-GENT113-4024","CRC305D-GENT114-4030","CRC305D-GENT115-2028","CRC305D-GENT116-2021","CRC305D-GENT117-2027","CRC305D-GENT118-2025","CRC305D-GENT119-4029","CRC305D-GENT120-2023","CRC305D-GENT121-1029","CRC305D-GENT122-1030","CRC305D-GENT123-3028","CRC305D-GENT124-3023","CRC305D-GENT125-3029","CRC305D-GENT126-2020","CRC305D-GENT127-1037","CRC305D-GENT128-1024","CRC305D-GENT129-1026","CRC305D-GENT130-1023","CRC305D-GENT131-3027","CRC305D-GENT132-1028","CRC305D-GENT133-1025","CRC305D-GENT134-1027","CRC305D-GENT135-1022","CRC305D-GENT136-1021","CRC305D-GENT137-1020","CRC305D-GENT140-3026","CRC305D-GENT141-1039","CRC305D-GENT142-3030","CRC305D-GENT143-3024","CRC305D-GENT145-3037","CRC305D-GENT146-1019","CRC305D-GENT147-1032","CRC305D-GENT148-3036","CRC305D-GENT149-3038","CRC305D-GENT150-3022","CRC305D-GENT152-1035","CRC305D-GENT153-1041","CRC305D-GENT154-1033","CRC305D-GENT155-1038","CRC305D-GENT156-3035","CRC305D-GENT157-3034","CRC305D-GENT158-1031","CRC305D-GENT159-3031","CRC305D-GENT161-1036","CRC305D-GENT162-3033","CRC305D-GENT163-1034","CRC305D-GENT164-3040","CRC305D-GENT165-3039","CRC305D-GENT168-3046","CRC305D-GENT169-1045","CRC305D-GENT171-3056","CRC305D-GENT172-1053","CRC305D-GENT173-4052","CRC305D-GENT174-2048","CRC305D-GENT175-4048","CRC305D-GENT176-4047","CRC305D-GENT177-3058","CRC305D-GENT178-4051","CRC305D-GENT179-4046","CRC305D-GENT180-3057","CRC305D-GENT181-2047","CRC305D-GENT182-3053","CRC305D-GENT183-1059","CRC305D-GENT184-3044","CRC305D-GENT187-4043","CRC305D-GENT188-3049","CRC305D-GENT189-2040","CRC305D-GENT190-2041","CRC305D-GENT191-4045","CRC305D-GENT192-2043","CRC305D-GENT194-2042","CRC305D-GENT195-2044","CRC305D-GENT196-2045","CRC305D-GENT197-4049","CRC305D-GENT198-4044","CRC305D-GENT199-2055","CRC305D-GENT200-2054","CRC305D-GENT201-2057","CRC305D-GENT202-2053","CRC305D-GENT203-2049","CRC305D-GENT204-4056","CRC305D-GENT205-4060","CRC305D-GENT206-2056","CRC305D-GENT207-4058","CRC305D-GENT208-2060","CRC305D-GENT210-4053","CRC305D-GENT211-4055","CRC305D-GENT212-4059","CRC305D-GENT213-2058","CRC305D-GENT215-2050","CRC305D-GENT216-4054","CRC305D-GENT217-2052","CRC305D-GENT218-4057","CRC305D-GENT219-3048","CRC305D-GENT220-3041","CRC305D-GENT221-1046","CRC305D-GENT222-1043","CRC305D-GENT223-3045","CRC305D-GENT224-1042","CRC305D-GENT225-2039","CRC305D-GENT226-2046","CRC305D-GENT227-3043","CRC305D-GENT228-1049","CRC305D-GENT229-1044","CRC305D-GENT230-3051","CRC305D-GENT231-3050","CRC305D-GENT232-1056","CRC305D-GENT233-1050","CRC305D-GENT234-3042","CRC305D-GENT235-1058","CRC305D-GENT236-1060","CRC305D-GENT237-1051","CRC305D-GENT238-1052","CRC305D-GENT239-1057","CRC305D-GENT240-1055","CRC305D-GENT241-3052","CRC305D-GENT242-3054","CRC305D-GENT243-3059","CRC305D-GENT244-1054","CRC305D-GENT245-3055","CRC305D-GENT246-3060"];
         //console.log(ss.length)
         var ff =
         subjectDim.filterFunction(function(d) { return filteredData.indexOf(d) > -1;})
         dc.renderAll("clinical");

         //subjectDim.filterFunction(function(d) { return d in filteredData;});
         //console.log(subjectDim.top(Infinity));dc.renderAll("clinical");

         /!*if(angular.isDefined(dimensions[dimensionName])){
         dimensions[dimensionName].filterExact(filter)
         dc.renderAll("clinical");
         }*!/
         //subjectDim.filter()
         //console.log(subjectDim.top(Infinity))

         }*/

        cfservice.getVisitchart = function(projectId,val,grp){
            var deferred = $q.defer();
            var chart;

            chart = cfservice.createChart(val,grp)
            deferred.resolve(chart)
            return deferred.promise
        }

        cfservice.cfReady = function(){
            return cfReady;
        }

        cfservice.getMyName = function(){

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
                console.log("subjects filtered")
                ClinicalCf.filterBySubjects(filteredIds);
                //AssayCf.filterBySubjects(filteredIds);
            }else if(xfilterServiceName == 'ClinicalCf'){
                console.log("clinical filtered")
                SubjCf.filterBySubjects(filteredIds);
                //AssayCf.filterBySubjects(filteredIds);
            }else if(xfilterServiceName == 'AssayCf'){
                console.log("assays filtered")
                SubjCf.filterBySubjects(filteredIds);
                ClinicalCf.filterBySubjects(filteredIds);
            }

            //SubjCf.filterBySubjects(filteredIds);
            //ClinicalCf.filterBySubjects(filteredIds);
            //AssayCf.filterBySubjects(filteredIds);
        }

        return XFilterLinker;
    }])

    .factory('xFilterService',['$injector','$q',function($injector,$q){


        /**
         * maintains the xfilter data for subject, clinical and assay data
         * gets data, sets dimensions
         * @type {{}}
         */

        var xfService = {}

        var ScIdToSCNameMap = [];//can replace the two variables below
        var observationCodes = [];
        var observationIds = [];


        var chartIdToObs = [];
        var obsToChartId = [];

        var chartGroup = '';

        /**
         * Cross filter methods
         */

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
                /* var jsonQobj=jsonQ(data);
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
                 })*/



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

                /**
                 * Create Dimensions for each column in the data
                 */
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

        /**
         * Charting methods
         *
         * **/

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

                /**
                 * *********************************************
                 */
                    //observation
                ScIdToSCNameMap[scID] = scName //this is coming from charting buttons
                //i.e. the SCchars from SQL DB
                //they should have the same name that would be
                //returned from NOSQL

                observationCodes.push(scName); //used for building CF dimensions,
                                        // should be the same as column name in the CF table
                observationIds.push(scID); //used for querying new and old SCs

                /**
                 * ******************************************
                 */
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

        /**********************
         * private methods
         */


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
                /* .x(d3.scale.linear()
                 .domain(d3.extent(data, function(d) { return d.TC; }))
                 )
                 .y(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.close; })]))
                 .xAxis().tickFormat(function(v) {return v;});
                 */
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
