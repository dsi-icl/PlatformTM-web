
angular.module('eTRIKSdata.dcPlots')

    .factory('DCchartingService',['$q','$injector','XFilterLinker',
        function($q,$injector,XFilterLinker){


        var DCservice = {}

        var obsToChartId = [], //used to retrieving previously created charts
            chartIdToObs = []; //used when refreshing charts after xfilter data refresh


        //TEMP ... should be merged to the same varaible eventually either as a hashtable or list of ids
        var requestedObsvs = {};
        var subjCharsIds = [];
        var tableWidgetId,counterWidgetId;
        ////////////////////////////
        //needed columns,tableWidgetId,counterWidgetId,observationCodes,observationIds


        DCservice.getDCchart = function(projectId,obsCode, obsId, chartGroup, xfilterService){

            var deferred = $q.defer();
            var chart;

            //Checks if a chart had been previously selected for this observation
            if (angular.isDefined(obsToChartId[obsCode])) {
                //console.log('Chart found ', obsCode)
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
                var param;

                if(chartGroup == 'clinical'){


                    /**
                     * ************************TEMP HACK******************************
                     */
                        //if(obsId.indexOf('4') == 0)
                        //observationCodes.push(obsCode+' sev');

                        //observationCodes.push(obsCode);
                        //observationIds.push(obsId);

                    requestedObsvs[obsCode] = obsId
                    param = requestedObsvs

                    //console.log('observationCodes',observationCodes)
                    //console.log('observationIds',observationIds)
                    //console.log('requestedObs',requestedObsvs)
                    /**
                     * ****************************************************************
                     */
                }

                if(chartGroup == 'subject'){
                    /**
                     **********************************************
                     */
                        //observation
                        //ScIdToSCNameMap[scID] = scName //this is coming from charting buttons
                        //i.e. the SCchars from SQL DB
                        //they should have the same name that would be
                        //returned from NOSQL

                        //subjChars.push(scName); //used for building CF dimensions,
                        // should be the same as column name in the CF table
                    subjCharsIds.push(obsId); //used for querying new and old SCs

                    param = subjCharsIds

                    /*********************************************
                     * */
                }

                xfilterService.refreshCf(projectId,param)

                    .then(function () {
                        DCservice.refreshCharts(chartGroup,xfilterService);

                        /**************TEMP HACK FOR BVS******************/
                        if(obsId.indexOf('4') == 0 && projectId=='P-BVS')
                            obsCode = obsCode+' sev'
                        /***********************************/
                        chart = DCservice.createChart(obsCode,chartGroup,xfilterService)
                        deferred.resolve(chart)
                    })
                ;
            }
            return deferred.promise
        }

        DCservice.createChart = function(obsName,chartGrp,xfilterService){

            var cfDimension = xfilterService.getDimension(obsName)
            var cfGroup = xfilterService.getGroup(obsName)

            console.log("Creating chart for ",obsName);
            console.log('chart group ',chartGrp);
            console.log(obsName,' dimension top 3',cfDimension.top(3))
            console.log(obsName,' group size ',cfGroup.size())

            //var requiresBoxplot = scope.chartData.requiresBoxplot;
            var chartData = DCservice.getChartOptions(obsName,cfDimension, cfGroup, false);

            //CREATE CHART
            var chartFactory = dc[chartData.chartType];
            var chart = chartFactory();
            chart.options(chartData.chartOptions);
            //chart.chartGroup(chartGrp);
            //dc.registerChart(chart,chartGrp)


            //caching
            obsToChartId[obsName] = chart.chartID();
            chartIdToObs[chart.chartID()] = obsName;

            //console.log('adding ',obsName, ' to obsToChartId',obsToChartId[obsName]);
            //console.log('chartIdToObs: ',chartIdToObs)
            return chart
        }

        DCservice.refreshCharts = function(chartGroup,xfilterService){

            var allCharts = dc.chartRegistry.list(chartGroup);
            //console.log('Inside refresh charts ',allCharts)
            var oldFilters

            allCharts.forEach(function(chart){
                //console.log('got chart ',chart.chartID(),' ',chart.chartGroup())
                if(chart.chartGroup() == chartGroup){
                    oldFilters = chart.filters(); // Get current filters
                    chart.filter(null); // Reset all filters on current chart
                    chart.expireCache();

                    //I need to know which observations this id was associated with so that I can query for
                    // the new dimensions created for this observation
                    var obs = chartIdToObs[chart.chartID()]
                    if(!angular.isUndefined(obs)){
                        //console.log('refreshing ',obs)
                        chart.dimension(xfilterService.getDimension(obs))
                        chart.group(xfilterService.getGroup(obs));
                        oldFilters.forEach(function(filter){
                            chart.filter(filter)
                        })
                    }

                    if(chart.chartID() == tableWidgetId){
                        //console.log('refreshing table')
                        chart.dimension(xfilterService.getTableDimension())
                        chart.group(xfilterService.getTableGroup());
                        chart.columns(columns);
                    }
                    if(chart.chartID() == counterWidgetId){
                        //console.log('refreshing counter')
                        chart.dimension(xfilterService.getCountData())
                        chart.group(xfilterService.getCountGroup());
                    }

                }
            })
        }

        DCservice.createDCcounter = function(xfilterService){
            var chartFactory = dc['dataCount'];
            var chart = chartFactory();
            var chartOptions = {};
            chartOptions["dimension"] = xfilterService.getCountData()
            chartOptions["group"] =  xfilterService.getCountGroup()
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

        DCservice.createDCtable = function(xfilterService){
            var chartFactory = dc['dataTable'];
            var chart = chartFactory();
            var chartOptions = {};
            chartOptions["dimension"] = xfilterService.getTableDimension();//subjectDim;//cfservice.getCountData()
            chartOptions["group"] =  xfilterService.getTableGroup();//function(d) {return d[subjectColumnName]}//cfservice.getCountGroup()
            chartOptions["columns"] = xfilterService.getTableHeaders();//columns //observationCodes
            chartOptions["width"] = "960"
            chartOptions["height"] = "800"
            chartOptions["sortBy"] = function(d){
                return d[xfilterService.getSubjectHeader()];
                //return d[subjectColumnName];
            }

            chart.options(chartOptions);
            /*chart.chartGroup('clinical');
             dc.registerChart(chart,'clinical')*/
            tableWidgetId = chart.chartID();

            return chart
        }

        DCservice.getChartOptions = function(val,cfDimension,cfGroup,requiresBoxplot){

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
                maxValue = parseInt(cfDimension.top(1)[0][val])
                minValue = parseInt(DCservice.getMinimumValue(cfDimension,val));

                var minTail = parseInt(minValue/4)
                var maxTail = parseInt(maxValue/4)
                maxValue = maxValue + maxTail;
                minValue = minValue - minTail;

                //minValue = cfDimension.bottom(1)[0][val]
                console.log('max ',maxValue)
                console.log('min ',minValue)

                chartType = "barChart";
                chartOptions["transitionDuration"] = "500"
                chartOptions["centerBar"] = "true"
                chartOptions["gap"] = "20"
                chartOptions["x"] = d3.scale.linear().domain([minValue,maxValue])
                chartOptions["elasticY"] = "true"
                //chartOptions["elasticX"] = "true"
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

        DCservice.getMinimumValue = function(dimension, val){
            var orderedVals = dimension.bottom(Infinity)
            //console.log(orderedVals)
            var i=0;
            while (orderedVals[i][val]==null || orderedVals[i][val]=="") {
                i++;
            }
            //console.log(orderedVals[i][val])
            return orderedVals[i][val]
        }

        DCservice.propagateFilter = function(xfilterServiceName){
            XFilterLinker.propagateFilter(xfilterServiceName);
            //dc.renderAll();
        }

        return DCservice;
}])