/**
 * Created by iemam on 17/10/2014.
 */
angular.module('eTRIKSdata.dcPlots')


    .directive('chartingButton', function($compile){
        return {
            scope: { // attributes bound to the scope of the directive
                val: '@',
                obsid: '@',
                obsids:'=',
                domain:'@',
                grp: '@',
                isActive: '@active',
                isGroupBtn: '@',
                container: '@',
                section: '@',
                chartService: '@',
                projectId:'@'
            },

            /*controller: function($scope, $compile, $http) {
                // $scope is the appropriate scope for the directive
                this.addChild = function(nestedDirective) { // this refers to the controller
                    console.log('Got the message from nested directive:' + nestedDirective.message);
                }
            },*/
            link:
            function(scope, element, attrs){
                element.bind("click", function(){

                    var elemId = attrs.id+'-chart';
                    var isActive = scope.isActive === 'true'
                    console.log(isActive)
                    if(isActive){
                        scope.$apply(function(){
                            angular.element(document.getElementById(scope.container))
                                .append(
                                    $compile('<div id="'+elemId+'">' +
                                        '<dc-chart></dc-chart>'+
                                        '</div>')(scope)
                                )
                        })
                    }

                    else{
                        angular.element(document.getElementById(elemId)).remove();
                    }

                });
            }
        }
    })

    .directive('dcCountWidget',function(){
        return{
            restrict:'E',
            scope:{
                cf:'='
            },
            template:
                '<span id="subjCount" class="filter-count model-count number-display"></span>',
            link: function(scope, element, attrs){
                var cf = scope.cf
                var chartFactory = dc['dataCount'];
                // Create an unconfigured instance of the chart
                var chart = chartFactory(element[0]);
                var chartOptions = {};

                //scope.$watch('chartToPlot', function(newVal) {
                //    if (newVal) {
                //
                //    }
                //})
                scope.$watch(
                    function($scope) { return $scope.cf.getCountGroup(); },
                    function(newval, oldval){

                        if(newval){
                            //console.log(newval)
                            //console.log(cf.getCountData())
                            //console.log(cf.getCountGroup())
                            chartOptions["dimension"] = cf.getCountData()
                            chartOptions["group"] =  cf.getCountGroup()

                            chart.options(chartOptions);
                            chart.render();
                            //dc.renderAll();
                        }

                })



            }
        }
    })

    .directive('dcChart', function () {
        return {
            restrict: 'E',
            replace:true,
            /*scope: {
                val: '='
            },*/
            controller: ['$scope','$attrs','$injector','ExportCriteria',function($scope,$attrs,$injector, exportCriteria) {

                console.log('inside dc-chart controller')
                var chartService = $injector.get($scope.chartService);
                console.log('projectId ',$scope.projectId,$scope.val,$scope.obsid,$scope.grp)
                $scope.chartCFservice = chartService




                chartService.getDCchart($scope.projectId,$scope.val,$scope.obsid,$scope.grp)
                    .then(
                    function(chart){
                        $scope.chartToPlot = chart;
                    },
                    function(result){
                        console.log("Failed to create DC chart",result);
                    }
                );

                //chartService.getChartData($scope.val,$scope.obsid,$scope.domain)
                //    .then(
                //        // success function
                //        function(data) {
                //            /*console.log("GOT BACK from getChartData...")
                //            console.log(data)*/
                //            $scope.chartData = data;
                //        },
                //        // error function
                //        function(result) {
                //            console.log("Failed to get chart data " + result);
                //        });

                //$scope.addFilterToExport = function(filter){
                //    //console.log($scope.grp,$scope.val,filter)
                //    exportCriteria.addFilter(filter,$scope.val,$scope.grp)
                //};


            }],
            template:'<div style="padding-top: 20px;/*float: left;max-height: 200px; overflow: scroll*/">'+
                '<div class="chart-title" id="returnsLabel">'+
                '<span>{{val}}</span>'+
                '<span class="filter"></span> <a class="reset">reset</a> '+
                '</div>'+
                '<div class="clearfix"></div>'+
                //'<div><img src="img/icons/spinner.gif"></div>'+
                '</div>'
            ,
            link: function (scope, element, attrs) {

                //console.log(scope.val)

                scope.$watch('chartToPlot', function(newVal) {
                    if (newVal) {
                        //console.log(scope.chartToPlot)
                        scope.chartToPlot.anchor(element[0])

                        if(scope.val == 'study'){
                            scope.chartToPlot.on('filtered', function(chart, filter){
                                console.log('inside dc chart', filter)
                                //console.log(chart.title())
                                scope.chartCFservice.filterClinicalCF(filter,'study')
                                //dc.renderAll();
                            })
                        }


                        console.log('chartId',scope.chartToPlot.chartID())
                        console.log('chart group inside directive',scope.chartToPlot.chartGroup())
                        var groupChart = scope.chartToPlot.chartGroup()
                          //console.log(dc.chartRegistry.list())

                          //Set reset link
                            var a = angular.element(element[0].querySelector('a.reset'));
                            a.attr('href', 'javascript:;');
                            a.css('display', 'none');
                            a.on('click', function () {
                                scope.chartToPlot.filterAll();
                                dc.redrawAll();
                            });
                        scope.chartToPlot.render()

                        //dc.renderAll(groupChart);
                        //dc.redrawAll();
                    }
                })

    //            scope.$watch('chartData', function(newVal) {
    //                if (newVal) {
    //
    //                    var cfGroup = scope.chartData.group;
    //                    var cfDimension = scope.chartData.dimension;
    //                    var requiresBoxplot = scope.chartData.requiresBoxplot;
    //                    //console.log(requiresBoxplot)
    //                    var chartData = getChartOptions(scope.val,cfDimension, cfGroup, requiresBoxplot);
    //
    //                    //console.log(chartData)
    //
    //                    var chartFactory = dc[chartData.chartType];
    //                    var chart = chartFactory(element[0]);
    //
    //
    //
    //
    //                    console.log(chart.chartID())
    //                    console.log(dc.chartRegistry.list())
    //
    //                    chart.options(chartData.chartOptions);
    //
    //                    //Set reset link
    //                    var a = angular.element(element[0].querySelector('a.reset'));
    //                    a.attr('href', 'javascript:;');
    //                    a.css('display', 'none');
    //                    a.on('click', function () {
    //                        chart.filterAll();
    //                        dc.redrawAll();
    //                    });
    //
    //                    dc.renderAll();
    //                    //dc.redrawAll();
    ////                console.log(isNaN(cf.getGroup(scope.val).all()[0].key));
    ////                console.log(cf.getDimension(scope.val).top(1)[0][scope.val])
    ////                console.log(cf.getDimension(scope.val).bottom(1)[0][scope.val])
    ////                console.log(cf.getGroup(scope.val).all())
    ////                console.log(cfGroup)
    ////                console.log(cfGroup.all())
    ////                console.log(cfDimension.top(1))
    ////                console.log(cfDimension.bottom(1))
    //
    //                    //chart.on('filtered', function(chart, filter){
    //                    //    scope.addFilterToExport(filter)
    //                    //    //exportCriteria.addFilter(filter,scope.val,scope.grp)
    //                    //})
    //
    //                }
    //            });
                /*setTimeout(function () {
                    cf.add([{
                        "key": "KEY-6",
                        "state": "MD",
                        "topics": ["Science"],
                        "date": new Date("10/09/2012")
                    }]);
                    dc.redrawAll();
                }, 1000);*/

                /* var chart = dc.pieChart(element[0]);


                chart.width(180)
                 .height(180)
                 .radius(80)
                 //.innerRadius(10)
                 .dimension(cf.getDimension(scope.sc))
                 .group(cf.getGroup(scope.sc))
                 .colors(etriks.myColors())
                 .title(function(d){return d.value;});

                 console.log(chart)*/

                /*organismPartChart.width(300)
                 .height(400)
                 .margins({top: 15, left: 10, right: 10, bottom: 20})
                 .dimension(sampleTissueDim)
                 .group(sampleTissueGrp)
                 //.colors(etriks.myColors())
                 .title(function(d){return d.value;})
                 .elasticX(true)
                 .xAxis().ticks(4);

                 sampleTypeChart.width(300)
                 .height(220)
                 .margins({top: 15, left: 20, right: 10, bottom: 0})
                 .dimension(sampleTypeDim)
                 .group(sampleTypeGrp)
                 //                .colors(etriks.myColors())
                 .title(function(d){return d.value;})
                 .elasticX(true)
                 .xAxis().ticks(4);

                 ResponseTC
                 .width(216)
                 .height(170)
                 .margins({top: 10, right: 20, bottom: 40, left: 20})
                 .dimension(efTCDim)								// the values across the x axis
                 .group(efTCGrpF)							// the values on the y axis
                 .transitionDuration(500)
                 .centerBar(true)
                 .colors(etriks.myColors())
                 .gap(2)                                            // bar width Keep increasing to get right then back off.
                 .x(d3.scale.linear()
                 .domain(d3.extent(data, function(d) { return d.TC; }))
                 )
                 //.y(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.close; })]))
                 .elasticY(true)
                 .xAxis().tickFormat(function(v) {return v;});
                 */
            }
        };

        //function getChartOptions(val,cfDimension,cfGroup,requiresBoxplot){
        //
        //    var chartType,
        //        chartOptions = {};
        //
        //    if(requiresBoxplot){
        //        chartType = "boxPlot"
        //        chartOptions["width"] = 768 //384// //300//384//330//
        //        chartOptions["height"] = 480 //240//480 //260 //240 //200//
        //        //chartOptions["margins"] = {top: 10, right: 50, bottom: 30, left: 50}
        //        chartOptions["elasticX"] = "true"
        //        chartOptions["elasticY"] = "true"
        //        chartOptions["boxWidth"] = "10"
        //        chartOptions["boxPadding"] = "0.9"
        //            //.dimension(cfDimension)
        //            //.group(cfGroup)
        //
        //    }else if(isNaN(cfGroup.all()[0].key)){
        //        //Ordinal chart (rowChart or PieChart)
        //        var noOfGroups = cfGroup.size();
        //
        //        if(noOfGroups > 3){
        //            chartType = "rowChart"
        //            chartOptions["elasticX"] = "true"
        //            chartOptions["xAxis"] = {"ticks":"4"}
        //            chartOptions["width"] = "300"
        //            chartOptions["height"] = noOfGroups*30+20
        //        }
        //        else{
        //            chartType = "pieChart";
        //            chartOptions["radius"] = "60"
        //            chartOptions["width"] = "120"
        //            chartOptions["height"] = "120"
        //        }
        //    }else{
        //        //numeric bar chart
        //        maxValue = cfDimension.top(1)[0][val]
        //        minValue = getMinimumValue(cfDimension,val);
        //        //minValue = cfDimension.bottom(1)[0][val]
        //        //console.log('max ',maxValue)
        //        //console.log('min ',minValue)
        //
        //        chartType = "barChart";
        //        chartOptions["transitionDuration"] = "500"
        //        chartOptions["centerBar"] = "true"
        //        chartOptions["gap"] = "20"
        //        chartOptions["x"] = d3.scale.linear().domain([minValue,maxValue])
        //        chartOptions["elasticY"] = "true"
        //        chartOptions["width"] = "300"
        //        chartOptions["height"] = "170"
        //        chartOptions["xUnits"] = dc.units.fp.precision(0.05)
        //        //chartOptions["margins"] = "{top: 10, right: 10, bottom: 40, left: 20}"
        //        //chartOptions[".xAxis().tickFormat"] = "2"
        //        //d3.extent(data, function(d) { return d.TC; })
        //        // bar width Keep increasing to get right then back off.
        //        /* .x(d3.scale.linear()
        //         .domain(d3.extent(data, function(d) { return d.TC; }))
        //         )
        //         .y(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.close; })]))
        //         .xAxis().tickFormat(function(v) {return v;});
        //        */
        //    }
        //
        //
        //    chartOptions["dimension"] = cfDimension
        //    chartOptions["group"] = cfGroup
        //    chartOptions["title"] = function(d){return d.value;}
        //    chartOptions["colors"] = etriks.myColors();
        //
        //    var chartData = {}
        //    chartData.chartOptions = chartOptions;
        //    chartData.chartType = chartType;
        //    return chartData;
        //
        //};

        //function getMinimumValue(dimension, val){
        //    var orderedVals = dimension.bottom(Infinity)
        //    //console.log(orderedVals)
        //    var i=0;
        //    while (orderedVals[i][val]==null || orderedVals[i][val]=="") {
        //        i++;
        //    }
        //    //console.log(orderedVals[i][val])
        //    return orderedVals[i][val]
        //}
        //var sampleOriginChart = dc.pieChart("#dc-sampleOrigin-chart");
//        var margin = 20,
//            width = 960,
//            height = 500 - .5 - margin,
//            color = d3.interpolateRgb("#f77", "#77f");

        /*function getValidOptionsForChart(chart) {

         // all chart options are exposed via a function
         return _(chart).functions()
         .extend(directiveOptions)
         .map(function(s) {
         return 'dc' + s.charAt(0).toUpperCase() + s.substring(1);
         })
         .value();
         }

         function getOptionsFromAttrs(scope, attrs, validOptions) {
         return _(attrs.$attr)
         .keys()
         .intersection(validOptions)
         .map(function(key) {
         var value = scope.$eval(iAttrs[key]);
         // remove the dc- prefix if any
         if (key.substring(0, 2) === 'dc') {
         key = key.charAt(2).toLowerCase() + key.substring(3);
         }
         return [key, value];
         })
         .zipObject()
         .value();
         }*/
    })

    .directive('dcDatatable', function () {
    return {
        restrict: 'E',
        replace:true,
        /*scope: {
         val: '='
         },*/
        controller: ['$scope','$attrs','$injector','ExportCriteria',function($scope,$attrs,$injector, exportCriteria) {
            var chartService = $injector.get($scope.chartService);
            chartService.getTableData()
                .then(
                // success function
                function(data) {
//                            console.log("GOT BACK from getChartData...")
//                            console.log(data)
                    $scope.tableData = data;

                },
                // error function
                function(result) {
                    console.log("Failed to get chart data " + result);
                });

        }],
        template:

                     '<table class="table table-hover" id="dc-table-graph">'+
                            '<thead>'+
                                '<tr class="header">'+
                                    '<th ng-repeat="header in tableData.headers">{{header}}</th>'+
                                '</tr>'+
                            '</thead>'+
                     '</table>'
                 ,
        link: function (scope, element, attrs) {

            //console.log(scope.val)

            scope.$watch('tableData', function(newVal) {
                if (newVal) {

                    var cfDimension = scope.tableData.dimension;
                    var headers = scope.tableData.headers;
                    var chartFactory = dc["dataTable"];
                    var chart = chartFactory(element[0]);

                    /*console.log(cfDimension)
                    console.log(headers)
                    console.log(element[0])*/

                    var grp = function(d) {return d["USUBJID"]}

                    headers = [
                        function(d) { return d["USUBJID"]; },
                        function(d) { return d["visit"]; },
                        function(d) { return d["bmi"]; },
                        function(d) { return d["height"] },
                        function(d) { return d["weight"] },
                        function(d) { return d["temp"] },
                        function(d) { return d["hr"]},
                        function(d) { return d["diabp"]},
                        function(d) { return d["sysbp"]}
                    ]

                    chartOptions = {};
                    chartOptions["dimension"] = cfDimension
                    chartOptions["group"] = grp
                    chartOptions["width"] = "960"
                    chartOptions["height"] = "800"
                    console.log(headers)
                    chartOptions["columns"] = headers
                    chartOptions["sortBy"] = function (d) {
                        return d.visit;
                    }

                    chart.options(chartOptions);
                    dc.renderAll();

                }
            })
        }

    }
})

    .directive('dcNumberDisplay',function(){
        return{
            restrict: 'E',
            replace:true,
            //controller: ['$scope','$attrs','$injector',function($scope,$attrs,$injector) {
            //
            //    var chartService = $injector.get($scope.chartService);
            //
            //    chartService.getDCchart($scope.val,$scope.obsid)
            //        .then(
            //        function(chart){
            //            $scope.chartToPlot = chart;
            //        },
            //        function(result){
            //            console.log("Failed to create DC chart",result);
            //        }
            //    );
            //
            //
            //}],
            template:'<span id="subjClinicalCount" class="filter-count model-count number-display"></span>',
            link: function(scope, element, attrs){
            var cf = scope.cf
            var chartFactory = dc['numberDisplay'];
            // Create an unconfigured instance of the chart
            var chart = chartFactory(element[0]);
            var chartOptions = {};

            //scope.$watch('chartToPlot', function(newVal) {
            //    if (newVal) {
            //
            //    }
            //})
            scope.$watch(
                function($scope) { return $scope.cf.getSubjectGroup(); },
                function(newval, oldval){

                    if(newval){

                        var expCount = function(d) {
                            console.log(d)
                            //return d.size;
                        };

                        //console.log(newval)
                       // console.log(cf.getSubjcount());
                        //console.log( cf.getSubjectGroup().top(Infinity).length)

                        //var subjectCount = cf.getSubjectGroup().top(Infinity).length
                        chartOptions["valueAccessor"] = function(d){
                            //d = subjectCount
                            console.log('inside valueAccessor', d)
                            return d
                        };
                        chartOptions["group"] =  cf.getSubjectGroup()

                        chart.options(chartOptions);
                        chart.render();
                        //dc.renderAll();
                    }

                })



        }

        }
    })

    .directive('dcVisitChart',function(){
        return {
            restrict: 'E',
            replace: true,
            template: '<div style="padding-top: 20px;/*float: left;max-height: 200px; overflow: scroll*/">' +
            '<div class="chart-title" id="returnsLabel">' +
            '<span>{{val}}</span>' +
            '<span class="filter"></span> <a class="reset">reset</a> ' +
            '</div>' +
            '<div class="clearfix"></div>' +
                //'<div><img src="img/icons/spinner.gif"></div>'+
            '</div>'
            ,
            link: function (scope, element, attrs) {

                //console.log(scope.val)

                scope.$watch('chartToPlot', function (newVal) {
                    if (newVal) {
                        //console.log(scope.chartToPlot)
                        scope.chartToPlot.anchor(element[0])

                        console.log('chartId', scope.chartToPlot.chartID())
                        console.log('chart group inside directive', scope.chartToPlot.chartGroup())
                        var groupChart = scope.chartToPlot.chartGroup()
                        //console.log(dc.chartRegistry.list())

                        //Set reset link
                        var a = angular.element(element[0].querySelector('a.reset'));
                        a.attr('href', 'javascript:;');
                        a.css('display', 'none');
                        a.on('click', function () {
                            scope.chartToPlot.filterAll();
                            dc.redrawAll();
                        });
                        scope.chartToPlot.render()

                        //dc.renderAll(groupChart);
                        //dc.redrawAll();
                    }
                })
            }
        }
    });