
angular.module('biospeak.dcPlots')

    .factory('DCchartingService',['$q','$injector','XFilterLinker','cartService',
        function($q,$injector,XFilterLinker,cartService){


            var DCservice = {}

            var DataTypeEnum = {
                COUNT: 1,
                GROUPED_BY_TIME: 2,
                SERIES: 3
            };

            var obsToChartId = [], //used to retrieving previously created charts
                chartIdToObs = []; //used when refreshing charts after xfilter data refresh

            var activeCharts = [];
            var activeChartsForObs = [];

            var longitudinalCharts = [];


            //TEMP ... should be merged to the same varaible eventually either as a hashtable or list of ids
            var requestedObsvs = [];
            var counterWidgetId;
            ////////////////////////////


            //needed columns,tableWidgetId,counterWidgetId,observationCodes,observationIds


            DCservice.getChartInfo = function(projectId, chartGroup, obsRequest){
                //will need clinicalDataService / assayDataService / SubjectDataService
            }

            DCservice.getDCchart = function(projectId, chartGroup, xfilterService,chartDataType, obsRequest, module){

                var deferred = $q.defer();
                var chart;
                var obsId = obsRequest.name;

                //console.log("=========1- Getting CHART for",obsId," ================== ")
                //console.log("===params: ",projectId, obsId, chartGroup, xfilterService,chartDataType, obsRequest, module);

                //if chartType is not specified, return the default which is the count chart/histogram/pie/rowChart
                //the logic of if chart is not found refreshData, recreate xfilter and recreate dimensions should not apply if an alternative charttye
                //is requested for an already generated

                //if observation exists as dimension then retrieve it from obsChartId using the aspect
                //if not found then createChart for requested Aspect
                //if not found in xfilter then refreshxf then getchart

                if (angular.isDefined(obsToChartId[obsId+'_'+chartDataType])) {

                    chartId = obsToChartId[obsId+'_'+chartDataType];
                    //console.log('Chart found ', obsId, 'chartId: ',chartId)
                    //console.log('DC Regsitry ',chartGroup,dc.chartRegistry.list(chartGroup))
                    dc.chartRegistry.list(chartGroup).forEach(function(c){
                        //console.log('looking for previously plotted chart', c.dimName, c.chartID(), chartId)
                        if(c.chartID() == chartId) {
                            chart = c;
                            //console.log("Chart found in DC Registry ")
                        }
                    });


                    if(!chart){
                        console.log("ERROR: Chart not found in Registry")
                        return
                    }

                    activeChartsForObs[obsId] = chart.chartID();
                    deferred.resolve(chart)
                }
                else if(!angular.isUndefined(xfilterService.getDimension(obsId, module))){
                    //console.log("Observation ",obsId, " exists in XF. Creating ",chartDataType)
                    chart = DCservice.createChart(obsId,chartGroup,xfilterService,chartDataType, obsRequest.dataType,module);
                    activeChartsForObs[obsId] = chart.chartID();
                    deferred.resolve(chart)
                }
                else {
                    //console.log("++Requested observation NOT FOUND IN XF++")
                    requestedObsvs.push(obsRequest);
                    //param = requestedObsvs
                    //console.log('requestedObs',requestedObsvs)

                    xfilterService.refreshCf(projectId,requestedObsvs,module)
                        .then(function () {
                            chart = DCservice.createChart(obsId,chartGroup,xfilterService,chartDataType,obsRequest.dataType,module)

                            DCservice.refreshCharts(chartGroup,xfilterService,module);
                            DCservice.reApplySubjectFilter(xfilterService);
                            if(chart != null) activeChartsForObs[obsId] = chart.chartID();
                            //console.log("CREATED CHART FOR ",obsId,chartGroup,' chartId', chart.chartID())
                            //console.log('==========DONE=============')
                            deferred.resolve(chart)
                        })
                }
                return deferred.promise
            };

            DCservice.createChart = function(obsId,chartGrp,xfilterService,chartDataType, dataType, module){

                //TODO: add two parameters this method O3 and qO2 or
                //depending on the role, the right dimension, group is retrieved
                var cfDimension,cfGroup;


                if(chartDataType == 'GroupedByTime'){
                    cfDimension = xfilterService.getTimeDimension()
                    cfGroup = xfilterService.getGroupByTime(obsId)
                }else{
                    cfDimension = xfilterService.getDimension(obsId, module)
                    cfGroup = xfilterService.getGroup(obsId, module)
                }

                // console.log(cfGroup.all())
                if(cfGroup.all().length == 1 && cfGroup.all()[0].key == "(Blanks)")
                    return null;


                //console.log("=======2=CREATING ",chartDataType," CHART for ",obsId, " dataype:",dataType);

                var chartData = DCservice.getChartOptions(obsId, cfDimension, cfGroup, chartDataType, dataType);


                //CREATE CHART
                var chartFactory = dc[chartData.chartType];
                var chart = chartFactory();
                chart.options(chartData.chartOptions);
                chart.chartType = chartData.chartType;
                chart.dimName = obsId;
                chart.dataType = chartDataType;
                //chart.chartGroup(chartGrp);
                //console.log(dc.chartRegistry.list(chartGrp));

                 if(chart.chartDataType != "rangeChart"){
                     chart.on('filtered',function(chart,filter){

                         if(chart.isRefocusing){
                             console.log('Chart is refocusing');
                             return;
                         }


                         console.log("/////EVENT CHART",chart.dataType, "FILTERED////",obsId,'FILTER:',filter);
                         // console.log('chart is refreshing ', chart.IsRefreshing)
                         // console.log('----PROPAGATING FILTER TO OTHER XFilters')
                         // xfilterService.setActiveFilters(chart.dimName,filter);


                         DCservice.propagateFilter(xfilterService,chart.dimName,filter);
                         //DCservice.reApplySubjectFilter(xfilterService)
                         //if(filter != null)


                         if(chart.IsRefreshing)
                             return;

                         // console.log('----APPLYING FILTER TO CART----')
                         var isRangeFilter = false;
                         if(filter)
                             isRangeFilter = (filter.filterType == 'RangedFilter');
                         cartService.applyFilter(obsId,chart.filters(),isRangeFilter,module);


                     });
                 }



                //caching
                obsToChartId[obsId+"_"+chartDataType] = chart.chartID();
                chartIdToObs[chart.chartID()] = obsId;

                return chart
            }

            DCservice.refreshCharts = function(chartGroup, xfilterService, module){

                var allCharts = dc.chartRegistry.list(chartGroup);// change that to activeCharts?
                // console.log('=======3===REFRESHING CHARTS====='+chartGroup+'========= '+allCharts.length+' in total')
                var oldFilters
                //console.log(allCharts)
                allCharts.forEach(function(chart){
                    //console.log('got chart ',chart.chartID(),' ',chart.chartGroup(), chart)
                    if(chart.chartGroup() == chartGroup){


                        oldFilters = chart.filters(); // Get current filters
                        //console.log('a',oldFilters)
                        chart.IsRefreshing = true;
                        // console.log('//////////// CLEARING FILTERS ',chart.dimName,'///////////////')
                        //chart.filter(null); // Reset all filters on current chart
                        //console.log('b',oldFilters)
                        //chart.expireCache();
                        // console.log('/////////////FINISHED CLEARING FILTERS ',chart.dimName,'//////////////')


                        //I need to know which observations this id was associated with so that I can query for
                        // the new dimensions created for this observation
                        var obs = chartIdToObs[chart.chartID()]
                        if(!angular.isUndefined(obs)){
                            // console.log('/////REFRESHING CHART FOR ',obs, ' IN  MODULE/////////', module)
                            chart.dimension(xfilterService.getDimension(obs,module))
                            chart.group(xfilterService.getGroup(obs,module));
                        }

                        if(chart.chartType == 'dataTable'){
                            // console.log('/////REFRESHING TABLE FOR ',module,' MODULE/////////')
                            chart.dimension(xfilterService.getTableDimension(chart.module ))
                            chart.group(xfilterService.getTableGroup());
                            chart.columns(xfilterService.getTableHeaders(chart.module ));

                        }
                        if(chart.chartType == 'dataCount' ){
                            // console.log('/////REFRESHING COUNTER WIDGET FOR ',module,' MODULE/////////')
                            chart.dimension(xfilterService.getCountData(chart.module))
                            chart.group(xfilterService.getCountGroup(chart.module));
                        }


                        if(oldFilters.length > 0){
                            if(oldFilters.length > 1){
                                oldFilters = new Array(oldFilters)
                            }
                            else {
                                oldFilters = oldFilters[0]
                            }
                            //console.log('/////REAPPLYING FILTERS ',oldFilters,' FOR ',obs,'/////////')
                            chart.replaceFilter(oldFilters)
                        }

                        ///})
                        //console.log('redrawing',obs);
                        chart.IsRefreshing = false;
                        //chart.redraw();

                    }
                });

                dc.redrawAll(chartGroup)
            }

            DCservice.createDCcounter = function(xfilterService,module,type){
                var chartFactory = dc['dataCount'];
                var chart = chartFactory();
                var chartOptions = {};

                if(type == 'subject'){
                    //console.log(xfilterService.getSubjectCountData(module).size())
                    //console.log(xfilterService.getSubjectCountGroup(module).value())
                    chartOptions["dimension"] = xfilterService.getSubjectCountData(module)
                    chartOptions["group"] =  xfilterService.getSubjectCountGroup(module)
                }else{
                    chartOptions["dimension"] = xfilterService.getCountData(module)
                    chartOptions["group"] =  xfilterService.getCountGroup(module)
                }

                chart.options(chartOptions);
                chart.chartType = 'dataCount';
                chart.dimName = "counter";
                chart.module = module;
                counterWidgetId = chart.chartID();

                return chart
            };

            DCservice.createDCcounterBar = function(xfilterService, module, type){
                var chartFactory = dc['dataCountBar'];
                var chart = chartFactory();
                var chartOptions = {};

                if(type == 'subject'){
                    chartOptions["dimension"] = xfilterService.getSubjectCountData(module)
                    chartOptions["group"] =  xfilterService.getSubjectCountGroup(module)
                }else{
                    chartOptions["dimension"] = xfilterService.getCountData(module)
                    chartOptions["group"] =  xfilterService.getCountGroup(module)
                }

                chart.options(chartOptions);
                chart.chartType = 'dataCount';
                chart.dimName = "counterBar";
                chart.module = module;
                counterWidgetId = chart.chartID();
                return chart
            };

            DCservice.createDCtable = function(xfilterService,module){

                if(!xfilterService.cfReady(module))
                    return false;
                var chartFactory = dc['dataTable'];
                var chart = chartFactory();
                var chartOptions = {};
                chartOptions["dimension"] = xfilterService.getTableDimension(module);//subjectDim;//cfservice.getCountData()
                chartOptions["group"] =  function(d) {return "booo"}//xfilterService.getTableGroup();
                chartOptions["columns"] = xfilterService.getTableHeaders(module);//columns //observationCodes
                chartOptions["width"] = "960"
                chartOptions["height"] = "800"
                chartOptions["showGroups"] = 'false';
                chartOptions["sortBy"] = function(d){
                    return d[xfilterService.getSubjectHeader()];
                }

                chart.options(chartOptions);
                chart.chartType = 'dataTable';
                chart.dimName = "table"
                chart.module = module;
                chart.on('renderlet', function (table) {
                    // each time table is rendered remove nasty extra row dc.js insists on adding
                    table.select('tr.dc-table-group').remove();
                });


                return chart
            };

            DCservice.getChartOptions = function(val,cfDimension,cfGroup,chartDataType,dataType){

                var chartType,
                    chartOptions = {};

                //console.log("Data type is", dataType, val)



                //if(val == 'sysbp') requiresBoxplot = true;
                if(chartDataType == 'GroupedByTime'){
                  //  console.log("doing boxplot")
                    chartType = "boxPlot"
                    chartOptions["width"] = 384 //768////
                    chartOptions["height"] = 240 //480////
                    chartOptions["margins"] = {top: 10, right: 50, bottom: 20, left: 50}
                    chartOptions["elasticX"] = "true"
                    chartOptions["elasticY"] = "true"
                    //chartOptions["boxWidth"] = "10"
                    //chartOptions["boxPadding"] = "0.9"
                    //.dimension(cfDimension)
                    //.group(cfGroup)

                }

                else if(dataType === 'dateTime'){
                    //console.log('making a time chart')
                    chartType = "barChart";
                    chartOptions["width"] = "2000";
                    var maxDate = cfDimension.top(1)[0][val]
                    var minDate = DCservice.getMinimumValue(cfDimension,val)

                        //console.log(maxDate,minDate);
                    //chartOptions["margins"] = {top: 10, right: 20, bottom: 30, left: 30}

                    chartOptions["x"] = d3.time.scale().domain([minDate, maxDate]);

                    chartOptions["xUnits"] = d3.time.minutes
                    //chartOptions["round"] = (d3.time.month.round)
                    //chartOptions["yUnits"] = d3.time.days;
                    //chartOptions["renderArea"] = true
                    chartOptions["barPadding"] = 0.1;
                    chartOptions["outerPadding"] = 0.05;
                    chartOptions["brushOn"] =true;
                    //chartOptions["renderDataPoints"] = true

                }

                else if(dataType === 'ordinal' || dataType == 'integer'){

                    chartType = "barChart";
                    chartOptions["x"]  = d3.scale.ordinal();
                    chartOptions["xUnits"] = dc.units.ordinal;
                     //   .brushOn(false)
                     //   .xAxisLabel('Fruit')
                     //   .yAxisLabel('Quantity Sold')
                     //   .dimension(fruitDimension)
                    chartOptions["barPadding"] = 0.1;
                    chartOptions["outerPadding"] = 0.05;
                    chartOptions["yAxisLabel"] = "Frequency"
                    chartOptions["xAxisLabel"] = val
                     //   .group(sumGroup);
                }
                //else if(isNaN(cfGroup.all()[0].key)){
                else if(dataType == "string"){

                    //console.log(cfGroup.all())
                    //Ordinal chart (rowChart or PieChart)

                    var noOfGroups = cfGroup.size();

                    //console.log('number of groups',noOfGroups)
                    //console.log('groups',cfGroup.all())
                    //console.log('dimensions groupall',cfDimension.groupAll().value())
                    //console.log('dimensions top',cfDimension.top(Infinity))

                    if(noOfGroups > 1){
                        //console.log("Plotting a DC row chart ")
                        chartType = "rowChart"
                        chartOptions["elasticX"] = "true"
                        chartOptions["xAxis"] = {"ticks":"4"}
                        chartOptions["width"] = "300"
                        chartOptions["height"] = noOfGroups*30+20
                        //var chartHeight = "180"
                        //chartOptions["fixedBarHeight"] = chartheight - (noOfGroups + 1) * gap / count
                        chartOptions["margins"] = {top: 10, right: 10, bottom: 20, left: 10}
                    }
                    else{
                        //console.log("making a pie chart ")
                        chartType = "pieChart";
                        chartOptions["radius"] = "100"
                        chartOptions["innerRadius"] = "50"
                        chartOptions["width"] = "300"
                        chartOptions["height"] = "250"
                        chartOptions["renderLabel"] = true
                        chartOptions["externalLabels"] = "50"
                        chartOptions["externalRadiusPadding"] ="20"
                        chartOptions["drawPaths"] = true
                        chartOptions["legend"] = dc.legend()
                        //chartOptions["slicesCap"] = "4"
                    }
                }



                else{
                    //console.log("Plotting a DC bar chart")
                    //numeric bar chart
                    //console.log(cfDimension.top(1)); console.log(cfGroup.all()[0].value)
                    maxValue = parseFloat(cfDimension.top(1)[0][val])
                    minValue = parseFloat(DCservice.getMinimumValue(cfDimension,val));

                    //var minTail = parseInt(minValue/4)
                    //var maxTail = parseInt(maxValue/4)

                    var offset = (maxValue - minValue )/10.0

                    //console.log('offset',offset, 'min before',minValue,'max before', maxValue)
                    maxValue = maxValue + offset;
                    minValue = minValue - offset;

                    //minValue = cfDimension.bottom(1)[0][val]
                    //console.log('max ',maxValue)
                    //console.log('min ',minValue)

                    chartType = "barChart";
                    chartOptions["transitionDuration"] = "500"
                    chartOptions["centerBar"] = "true"
                    chartOptions["gap"] = "20"
                    chartOptions["xAxisMin"] = minValue
                    chartOptions["xAxisMax"] = maxValue
                    chartOptions["x"] = d3.scale.linear().domain([minValue,maxValue])
                    //chartOptions["elasticX"] = "true"
                    chartOptions["elasticY"] = "true"
                    //chartOptions["elasticX"] = "true"

                    chartOptions["width"] = "310"
                    chartOptions["renderArea"] = true;
                    chartOptions["renderHorizontalGridLines"] = true;

                    if(chartDataType == 'rangeChart'){
                        //console.log('setting range chart to 40')
                        chartOptions["height"] = "60";

                        chartOptions["yAxisLabel"] = "";
                        chartOptions["xAxisLabel"] = "";
                        chartOptions["xAxisLabel"] = "";
                        chartOptions["margins"] = {top: 0, right: 50, bottom: 30, left: 30};
                        chartOptions["mouseZoomable"] = false;
                        chartOptions["brushOn"] = true;
                    }else{
                        chartOptions["height"] = "180"
                        chartOptions["yAxisLabel"] = "Frequency"
                        chartOptions["xAxisLabel"] = val
                        chartOptions["mouseZoomable"] = "true"
                        chartOptions["brushOn"] = false;
                    }

                    //chartOptions["transitionDuration"] = 1000

                    chartOptions["xUnits"] = dc.units.fp.precision(0.01)

                     //+ " values"
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
                chartOptions["valueAccessor"] = function(p) { return p.value.count; }
                chartOptions["controlsUseVisibility"] = true

                if(chartDataType == 'GroupedByTime'){
                    //chartOptions["dimension"] = cfDimension
                    chartOptions["group"] = cfGroup
                    chartOptions["valueAccessor"] = function(p) { return p.value.valueList; }
                }
                chartOptions["title"] = function(d){return d.value.count;}
                chartOptions["colors"] = etriks.myColors();

                var chartData = {}
                chartData.chartOptions = chartOptions;
                chartData.chartType = chartType;
                return chartData;

            };

            DCservice.getMinimumValue = function(dimension, val){
                var orderedVals = dimension.bottom(Infinity)
                //console.log(orderedVals)
                var i=0;
                while (orderedVals[i][val]==null || orderedVals[i][val]=="") {
                    i++;
                }
                //console.log(orderedVals[i][val])
                return orderedVals[i][val]
            };

            DCservice.propagateFilter = function(xfilterService, chartName, filter){
                XFilterLinker.propagateFilter(xfilterService, chartName, filter);
            };
            DCservice.reApplySubjectFilter = function(xfilterService){
                XFilterLinker.reApplySubjectFilter(xfilterService)
            };

            DCservice.filterChart = function(chart,filter,chartGrp){
                chart.filter(filter);

            };

            DCservice.clearAllCharts = function(){

            };

            return DCservice;
        }])