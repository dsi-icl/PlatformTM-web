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

        cfservice.getDCchart = function(projectId,scName, scID,chartGrp){

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

                subjChars.push(scName); //used for building CF dimensions,
                                        // should be the same as column name in the CF table
                subjCharsIds.push(scID); //used for querying new and old SCs

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

    .factory('SubjCf',['subjectDataService','ClinicalCf','$q',function(subjectDataService,ClinicalCf,$q){

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

        subjCfService.getData = function(StudyId){
            var deferred = $q.defer();

            subjectDataService.getSubjData(StudyId,subjCharsIds)
                .then(function(response){
                    //console.log('inside getDAta',response)
                    dataToPlot = response.data
                    subjChars = response.scs; //These are the list of HEADERS in the CF data
                                                //No need to maintain on the client?!
                    deferred.resolve(dataToPlot)
                })

            return deferred.promise
        }

        subjCfService.initialize = function(StudyId){
            var deferred = $q.defer();

//          d3.tsv("../data/subject-data2.txt", function (data) {
            this.getData(StudyId).then(function(data){
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
                console.log('inside initialize',subjChars)

                subjChars.forEach(function(sc){
                    //console.log((sc.value))
                    var dim = cfdata.dimension(function (d) {
                        return d[sc];
                    });
                    dimensions[sc] = dim
                    console.log('adding dimension',sc, ' ',dim.top(1))
                    var grp = dim.group().reduceCount();
                    groups[sc] = grp;
                    console.log('adding group',sc, ' ',dim.groupAll())
                })
                cfReady = true
                deferred.resolve(subjChars)
            })
            return deferred.promise
        }

        subjCfService.refreshCharts = function(){
            var allCharts = dc.chartRegistry.list('subject');
            console.log('Inside refresh charts ',allCharts)
            var oldFilters
            allCharts.forEach(function(chart){
                console.log('got chart ',chart.chartID(),' ',chart.chartGroup())
                oldFilters = chart.filters(); // Get current filters
                chart.filter(null); // Reset all filters on current chart
                chart.expireCache();

                //I need to know which observations this id was associated with so that I can query for
                // the new dimensions created for this observation
                var obs = chartIdToObs[chart.chartID()]

                if(!angular.isUndefined(obs)) {
                    console.log('refreshing ', obs)
                    chart.dimension(subjCfService.getDimension(obs))
                    chart.group(subjCfService.getGroup(obs));
                    oldFilters.forEach(function (filter) {
                        chart.filter(filter)
                    })
                }

                if(chart.chartID() == counterWidgetId){
                    console.log('refreshing counter')
                    chart.dimension(subjCfService.getCountData())
                    chart.group(subjCfService.getCountGroup());
                }
            })
        }

        subjCfService.getDCchart = function(projectId,scName, scID,chartGrp){

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

                subjChars.push(scName); //used for building CF dimensions,
                                        // should be the same as column name in the CF table
                subjCharsIds.push(scID); //used for querying new and old SCs

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

        subjCfService.createChart = function(obsName,chartGrp){

            var cfDimension = subjCfService.getDimension(obsName)
            var cfGroup = subjCfService.getGroup(obsName)

            //console.log('inside create chart', obsName,cfDimension,cfGroup,dimensions,groups)

            //var requiresBoxplot = scope.chartData.requiresBoxplot;
            var chartData = getChartOptions(obsName,cfDimension, cfGroup, false);

            //CREATE CHART
            var chartFactory = dc[chartData.chartType];
            var chart = chartFactory();
            chart.options(chartData.chartOptions);
            /*chart.chartGroup(chartGrp);
            dc.registerChart(chart,chartGrp)*/

            //Reference to chart dimension and group used when refreshing data
            //chartDimensions[chart.chartID()] = cfDimension;
            //chartGroups[chart.chartID()] = cfGroup;
            //Reference to the created chart used when replotting the chart
            obsToChartId[obsName] = chart.chartID();
            chartIdToObs[chart.chartID()] = obsName;

            return chart
        }

        subjCfService.createDCcounter = function(countObj, chartGrp){
            var chartFactory = dc['dataCount'];
            var chart = chartFactory();
            var chartOptions = {};
            chartOptions["dimension"] = subjCfService.getCountData()
            chartOptions["group"] =  subjCfService.getCountGroup()
            chart.options(chartOptions);
            counterWidgetId = chart.chartID();
            /*chart.options(chartData.chartOptions);
            chart.chartGroup(chartGrp);
            dc.registerChart(chart,chartGrp)

            obsToChartId[countObj] = chart.chartID();
            chartIdToObs[chart.chartID()] = countObj;*/
            return chart
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

        function getChartOptions(val,cfDimension,cfGroup,requiresBoxplot){

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

        function getMinimumValue(dimension, val){
            var orderedVals = dimension.bottom(Infinity)
            //console.log(orderedVals)
            var i=0;
            while (orderedVals[i][val]==null || orderedVals[i][val]=="") {
                i++;
            }
            //console.log(orderedVals[i][val])
            return orderedVals[i][val]
        }

        subjCfService.filterClinicalCF = function(filter,dimensionName){
         ClinicalCf.filterClinicalData(filter,dimensionName);
        }

        subjCfService.cfReady = function(){
            return cfReady;
        }

        return subjCfService
    }])

    .factory('ClinicalCf',['clinicalDataService','$q', function(clinicalDataService,$q){

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


/*        cfservice.cf_reset = function(xfilter, dims, newData) {
            var i;
            for (i = 0; i < dims.length; i++) {
                // Clear all filters from this dimension.
                // Necessary because xf.remove only removes records
                // matching the current filter.
                dims[i].filter(null);
            }
            xfilter.remove(); // Remove all data from the crossfilter
            xfilter.add(newData);
            return xfilter;
        }*/


        cfservice.getData = function(){
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

        cfservice.refreshCharts = function(){

            var allCharts = dc.chartRegistry.list('clinical');
            console.log('Inside refresh charts ',allCharts)
            var oldFilters

            allCharts.forEach(function(chart){
                console.log('got chart ',chart.chartID(),' ',chart.chartGroup())
                if(chart.chartGroup() == "clinical"){
                    oldFilters = chart.filters(); // Get current filters
                    chart.filter(null); // Reset all filters on current chart
                    chart.expireCache();

                    //I need to know which observations this id was associated with so that I can query for
                    // the new dimensions created for this observation
                    var obs = chartIdToObs[chart.chartID()]
                    if(!angular.isUndefined(obs)){
                        console.log('refreshing ',obs)
                        chart.dimension(cfservice.getDimension(obs))
                        chart.group(cfservice.getGroup(obs));
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

        cfservice.getDCchart = function(projectId,obsCode, obsId, chartGroup){

            var deferred = $q.defer();
            var chart;

            //Checks if a chart had been previously selected for this observation
            if (angular.isDefined(obsToChartId[obsCode])) {
                console.log('Chart found ', obsCode)
                chartId = obsToChartId[obsCode];

                dc.chartRegistry.list().forEach(function(c){
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

                /**
                 * ****************************************************************
                 */
                if(obsId.indexOf('4') == 0)
                    observationCodes.push(obsCode+' sev');

                observationCodes.push(obsCode);
                //observationCodes.push(obsCode)
                observationIds.push(obsId);

                requestedObsvs[obsCode] = obsId

                console.log('observationCodes',observationCodes)
                console.log('observationIds',observationIds)
                console.log('requestedObs',requestedObsvs)
                /**
                 * ****************************************************************
                 */

                cfservice.refreshCf().then(function () {
                    cfservice.refreshCharts();

                    if(obsId.indexOf('4') == 0)
                        obsCode = obsCode+' sev'
                    chart = cfservice.createChart(obsCode,chartGroup)
                    deferred.resolve(chart)
                })
            }
            return deferred.promise
        }

        cfservice.createChart = function(obsName,chartGrp){

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
        }

        cfservice.createDCcounter = function(countObj, chartGrp){
            var chartFactory = dc['dataCount'];
            var chart = chartFactory();
            var chartOptions = {};
            chartOptions["dimension"] = cfservice.getCountData()
            chartOptions["group"] =  cfservice.getCountGroup()
            chart.options(chartOptions);
            counterWidgetId = chart.chartID();

            /*console.log('dimension size ', cfservice.getCountData().size())
            console.log('group size ', cfservice.getCountGroup().value())

            chart.options(chartData.chartOptions);
            chart.chartGroup(chartGrp);
            dc.registerChart(chart,chartGrp)


            obsToChartId[countObj] = chart.chartID();
            chartIdToObs[chart.chartID()] = countObj;*/
            return chart
        }

        cfservice.createDCtable = function(){
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
            /*chart.chartGroup('clinical');
            dc.registerChart(chart,'clinical')*/
            tableWidgetId = chart.chartID();

            return chart
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
            return function(d) {return d[subjectColumnName]}
        }

        cfservice.getChartOptions = function(val,cfDimension,cfGroup,requiresBoxplot){

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

        cfservice.getMinimumValue = function(dimension, val){
            var orderedVals = dimension.bottom(Infinity)
            //console.log(orderedVals)
            var i=0;
            while (orderedVals[i][val]==null || orderedVals[i][val]=="") {
                i++;
            }
            //console.log(orderedVals[i][val])
            return orderedVals[i][val]
        }

        cfservice.filterClinicalData = function(filter,dimensionName){
            console.log('filter',filter,'dimension',dimensionName)
            if(angular.isDefined(dimensions[dimensionName])){
                dimensions[dimensionName].filterExact(filter)
                dc.renderAll("clinical");
            }

        }

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


        return cfservice

    }])

    .factory('xFilterService',['$injector','$q',function($injector,$q){

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
