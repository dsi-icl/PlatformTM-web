/**
 * Created by iemam on 17/10/2014.
 */
angular.module('biospeak.dcPlots')


    /**
     *
     *  scope params: chartService, xfilterService, exportService,
     *  projectId, val, obsid, grp, returnValue
     */
    .directive('dcChart', function () {
        return {
            restrict: 'EA',
            replace:true,
            scope:{
                obs:'=',
                chartingOpts:'=',
                module:'=',
                onFiltered:'&'
            },
            controller: ['$scope','$attrs','$injector',function($scope,$attrs,$injector) {

                var chartService = $injector.get($scope.chartingOpts.DCchartService);
                $scope.chartservice = chartService;

                var xfilterService = $injector.get($scope.chartingOpts.xfilterService);
                $scope.xfService = xfilterService;

                var chartDataType = 'Count';
                var plot;

                $scope.mainChartId = $scope.obs.name.replace(/[\[\]/\s]/g, '_') + "_" + chartDataType+"_"+$scope.module;
                $scope.rangeChartId = $scope.obs.name.replace(/[\[\]/\s]/g, '_') + "_rangeChart_"+$scope.module;
                $scope.done = false;

                chartService.getDCchart($scope.chartingOpts.projectId,$scope.module,xfilterService,chartDataType,$scope.obs)
                    .then(
                        function(chart){
                            plot = chart;
                            $scope.done = true;
                            if(plot === null)
                            {
                                $scope.nochart = true;
                                return;
                            }

                            if(plot.chartType === 'barChart' && $scope.obs.dataType !== "ordinal" && $scope.obs.dataType !== "integer"){
                                chartService.getDCchart($scope.chartingOpts.projectId,$scope.module,xfilterService,"rangeChart",$scope.obs)
                                    .then(function(chart2){
                                        $scope.rangeChart = chart2;
                                        $scope.chartToPlot = plot;
                                    })
                            }else
                                $scope.chartToPlot = plot;
                        },
                        function(result){
                            console.error("Failed to create DC chart",result);
                        }
                );
            }],
            template:

            '<div class="obs-chart">'+
                    '<div class="chart-title">'+
                        '<h5>{{obs.qO2_label}}</h5>'+
                    '</div>'+
            '<div  ng-if="!done" class="chart-loading" >'+
            '<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>'+
            '<span class="sr-only">Loading...</span>'+
            '</div>'+
                    '<div ng-show="nochart"><small>No observations recorded</small></div>'+

                    '<div id="{{mainChartId}}">' +
                        '<div class="chartControls"> ' +
                            '<span class="reset" style="visibility: hidden;">' +
                            ' Filtered by: <span class="filter"></span>' +
                                '<a> reset </a> ' +
                            '</span>'+
                        '</div>'+
                        '<div class="clearfix"></div>'+
                    '</div>'+

                    '<div id="{{rangeChartId}}"></div>'+
            '</div>',
            link: function (scope, element, attrs) {
                scope.$watch('chartToPlot', function(newVal) {
                    if (newVal) {
                        //var groupChart = scope.chartingOpts.chartGroup;
                        var obsId = scope.obs.name;
                        var chartGroup = scope.module;
                        var mainChartId = '#'+scope.mainChartId;
                        var rangeChartId = '#'+scope.rangeChartId;

                        //ANCHOR THE PLOT
                        scope.chartToPlot.anchor(element[0].querySelector(mainChartId), chartGroup);
                        // console.log('anchroing',element[0].querySelector(mainChartId),chartGroup);

                        //SET ONFILTERED
                        scope.chartToPlot.on('filtered',function(chart, filter){



                            if(scope.chartToPlot.isRefocusing){
                                //console.log('Chart is refocusing');
                                return;
                            }
                            scope.chartservice.propagateFilter(scope.xfService,chart.dimName,filter);

                            if(scope.chartToPlot.IsRefreshing)
                                return;
                            // console.log('----APPLYING FILTER TO CART----')
                            scope.onFiltered({obsId:obsId,module:chartGroup,filters:chart.filters(),filter:filter});
                        });


                        //ATTACH RANGE CHART IF AVAILABLE
                        if(scope.rangeChart){
                            scope.rangeChart.anchor(element[0].querySelector(rangeChartId), chartGroup);
                            scope.chartToPlot.rangeChart(scope.rangeChart);
                        }


                        //SET RESET ONCLICK
                        var a = angular.element(element[0].querySelector('div.chartControls').querySelector('span.reset').querySelector('a'));
                        a.on('click', function () {
                            if(scope.chartToPlot.chartType === 'barChart' && scope.chartToPlot.dataType !== 'ordinal' && scope.chartToPlot.dataType !== "integer"){
                                scope.chartToPlot.isRefocusing = true;
                                scope.chartToPlot.focus();
                                scope.chartToPlot.isRefocusing = false;
                            }
                            scope.chartToPlot.filterAll();
                            if(scope.rangeChart){
                                scope.rangeChart.filterAll();
                            }
                            dc.renderAll(chartGroup);
                        });

                        //Set alt link
                        // var a1 = angular.element(element[0].querySelector('a.box-chart'));
                        // a1.attr('href', 'javascript:;');
                        // a1.on('click', function () {
                        //     //$scope.obs.code,$scope.obs.id,$scope.chartingOpts.chartGroup,xfilterService, chartDataType,$scope.obs
                        //     scope.chartservice.getDCchart(scope.chartingOpts.projectId, scope.val, scope.obs.id, scope.chartingOpts.chartGroup, scope.xfService, 'GroupedByTime')
                        //         .then(
                        //         function (chart) {
                        //             scope.chartToPlot = chart;
                        //         });
                        //
                        //     //scope.chartToPlot.anchor(element[0],scope.grp);
                        //     //scope.chartToPlot.filterAll(groupChart);
                        //     //dc.redrawAll(groupChart);
                        // });

                        // var a2 = angular.element(element[0].querySelector('a.count-chart'));
                        // a2.attr('href', 'javascript:;');
                        // a2.on('click', function () {
                        //     scope.chartservice.getDCchart(scope.chartingOpts.projectId, scope.val, scope.obs.id, scope.chartingOpts.chartGroup, scope.xfService, 'Count')
                        //         .then(
                        //         function (chart) {
                        //             scope.chartToPlot = chart;
                        //         });
                        //
                        //     //scope.chartToPlot.anchor(element[0],scope.grp);
                        //     //scope.chartToPlot.filterAll(groupChart);
                        //     //dc.redrawAll(groupChart);
                        // });



                        scope.chartToPlot.render();
                        if(scope.rangeChart)
                            scope.rangeChart.render();

                    }
                })
            }
        };
    })

    .directive('dcTimeChart', function () {
        return {
            restrict: 'EA',
            replace:true,
            scope:{
                obs:'=',
                chartingOpts:'=',
                onFiltered:'&'
            },
            controller: ['$scope','$attrs','$injector',function($scope,$attrs,$injector) {

                var chartService = $injector.get($scope.chartingOpts.DCchartService);
                $scope.chartservice = chartService;

                var xfilterService = $injector.get($scope.chartingOpts.xfilterService);
                $scope.xfService = xfilterService;

                /*var expService = $injector.get($scope.chartingOpts.exportService);
                 $scope.expService = expService;*/

                /*var filtersServ = $injector.get($scope.chartingOpts.filtersService);
                 $scope.filtersService = filtersServ;*/

                var chartDataType = 'Count';//$scope.role;

                var from,to;
                var plot;

                //console.log('inside dc-chart controller')
                //console.log('projectId ',$scope.projectId,'val ',$scope.val,'obsid ',$scope.obsid,'chart grp',$scope.grp)

                //obs.id is a unique id for the requested observation and the qualifier requested to chart
                //(e.g. HEADACHE [AEOCCUR] , HEADHACHE [AESEV] ... it's a combination of the object of observation and a qualifier
                // could replace with o3id_qo2id
                //used for uniquely identifying charts for erquested observations AND also used as xfilter dimension key
                chartService.getDCchart($scope.chartingOpts.projectId,$scope.chartingOpts.chartGroup,xfilterService,chartDataType,$scope.obs)
                    .then(
                        function(chart){
                            plot = chart
                                $scope.chartToPlot = plot;
                        },
                        function(result){
                            console.log("Failed to create DC chart",result);
                        }
                    );

                $scope.filterFrom = function(fromto,date){
                    console.log(fromto,date._d);
                    from = date._d;

                }
                $scope.filterTo = function(fromto,date){
                    console.log(fromto,date._d);
                    to = date._d;
                }
                $scope.filterChart = function(){
                    plot.filter(dc.filters.RangedFilter(from,to));
                    dc.redrawAll($scope.chartingOpts.chartGroup);
                }

            }],
            template:
            '<div class="obs-chart">'+
            // '<div  class="chart-options">'+
            // '<ul>'+

            // '<li>' +
            // '<div  id="data_5"> ' +
            // '<label>Date Range</label> ' +
            // '<div > ' +
            // '<label class="col-sm-1 control-label">From:</label>'+
            // '<div class="col-sm-4"><input date-time format="D MMM YYYY HH:mm" date-change="filterFrom" auto-close="true" ng-model="from"> </input></div>' +
            // '<label class="col-sm-1 control-label">To:</label>'+
            // '<div class="col-sm-4"><input date-time format="D MMM YYYY HH:mm" date-change="filterTo" auto-close="true" ng-model="to" > </input></div>' +
            // '<span><i uib-dropdown-toggle class="fa fa-calendar"></i></span>'+
            // '<div> ' + '<span>Selected date: <br/> {{(a|date)}} - {{(b|date)}} </span> ' + '</div> ' +
            // '<div uib-dropdown-menu> ' +
            //     '<div date-range format="D MMM YYYY HH:mm" start="a" end="b" auto-close="false"></div> ' +
            // '</div> ' +
            // '</div>'+
            // '<a ng-click="filterChart()" class="btn btn-lnk btn-xs"><i class="fa fa-filter"></i></a>'+
            // '</div>'+
            // '<div class="input-group date">'+
            //     '<input type="datetime" class="form-control" date-time ng-model="sampleDate" format="yyyy-MM-dd HH:mm" view="month" auto-close="true">'+
            //     '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>'+
            // '</div>'+
            // '</li>'+
            // '</ul>'+
            // '</div>'+


            '<div id="mainChart">' +
            '<div class="chartControls"> ' +
            '<span class="reset" style="visibility: hidden;">' +
            ' Filtered by: <span class="filter"></span>' +
            '<a> reset </a> ' +
            '</span>'+
            '</div>'+
            '<div class="clearfix"></div>'+
            '</div>'+



            '</div>',
            link: function (scope, element, attrs) {
                scope.$watch('chartToPlot', function(newVal) {
                    if (newVal) {
                        var chartGroup = scope.chartingOpts.chartGroup;
                        var obsId = scope.obs.name;

                        //ANCHOR THE PLOT
                        //scope.chartToPlot.anchor(element[0].querySelector(mainChartId), chartGroup);
                        scope.chartToPlot.anchor(element[0].querySelector('#mainChart'), chartGroup);


                        //SET ONFILTERED
                        scope.chartToPlot.on('filtered',function(chart, filter){



                            if(scope.chartToPlot.isRefocusing){
                                //console.log('Chart is refocusing');
                                return;
                            }
                            scope.chartservice.propagateFilter(scope.xfService,chart.dimName,filter);

                            if(scope.chartToPlot.IsRefreshing)
                                return;
                            // console.log('----APPLYING FILTER TO CART----')
                            scope.onFiltered({obsId:obsId,module:chartGroup,filters:chart.filters(),filter:filter});
                        });



                        // var d = angular.element(element[0].querySelector('div.chart-options'));
                        // d.css('display', 'inline-block');

                        //SET RESET ONCLICK
                        //var a = angular.element(element[0].querySelector('div.chartControls').querySelector('span.reset').querySelector('a'));
                        //a.on('click', function () {
                        //    if(scope.chartToPlot.chartType === 'barChart' && scope.chartToPlot.dataType !== 'ordinal' && scope.chartToPlot.dataType !== "integer"){
                        //        scope.chartToPlot.isRefocusing = true;
                        //        scope.chartToPlot.focus();
                        //        scope.chartToPlot.isRefocusing = false;
                        //    }
                        //    scope.chartToPlot.filterAll();
                        //    if(scope.rangeChart){
                        //        scope.rangeChart.filterAll();
                        //    }
                        //    dc.renderAll(chartGroup);
                        //});

                        //SET RESET ONCLICK
                        var a = angular.element(element[0].querySelector('div.chartControls').querySelector('span.reset').querySelector('a'));
                        a.on('click', function () {
                            console.log('RESETTING FILTER',scope.chartToPlot.chartType)
                            //scope.chartToPlot.filterAll(groupChart);
                            if(scope.chartToPlot.chartType === 'barChart'){
                                //scope.chartToPlot.isRefocusing = true;
                                scope.chartToPlot.focus(null);
                                //scope.chartToPlot.isRefocusing = false;
                            }

                            //scope.chartToPlot.filter(null);
                            //dc.renderAll(chartGroup);
                            scope.chartToPlot.render();
                        });



                        scope.chartToPlot.render();

                    }
                })
            }
        };
    })

    .directive('dcDatatable', function () {
    return {
        restrict: 'E',
        replace:true,
        scope: { // attributes bound to the scope of the directive
            grp: '@',
            chartService: '@',
            xfilterService: '@',
            projectId:'@',
            module:'@'
        },
        controller: ['$scope','$attrs','$injector',function($scope,$attrs,$injector) {
            $scope.chartservice = $injector.get($scope.chartService);
            $scope.xfService = $injector.get($scope.xfilterService);
        }],
        template:
            '<table class="table table-hover" id="dc-table-graph"></table>',
        link: function (scope, element) {
            scope.$watch(
                function($scope) { return $scope.xfService.cfReady(scope.module); },
                function(newval, oldval){
                    if(newval){
                        //console.log(newval)
                        var chart = scope.chartservice.createDCtable(scope.xfService,scope.module)
                        // console.log('doing it for subject and module is',scope.module)
                        chart.anchor(element[0],scope.grp);
                        //var chart = scope.cf.createDCtable()
                        //console.log(chart.columns());
                        //chart.anchor(element[0],'clinical');
                        chart.render()
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
                            //console.log('inside valueAccessor', d)
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

    .directive('dcCountBar',function(){
        return{
            restrict: 'E',
            scope:{
                chartService: '@',
                xfilterService: '@',
                type:'@',
                module:'@'
            },
            controller: ['$scope','$attrs','$injector',function($scope,$attrs,$injector) {
                $scope.chartservice = $injector.get($scope.chartService);
                $scope.xfService = $injector.get($scope.xfilterService);


            }],
            template: '<span ng-if="xfService.cfReady(module)" id="{{grp}}_CounterBar" class="filter-count number-display "></span>',
            link: function(scope, element, attrs){
                scope.$watch(
                    function($scope) { return $scope.xfService.cfReady(scope.module);},
                    function(newval){
                        if(newval){
                            var chart = scope.chartservice.createDCcounterBar(scope.xfService,scope.module,scope.type);
                            chart.anchor(element[0],scope.module);
                            chart.render();
                        }
                    })
            }
        }
    })

    .directive('dcCountWidget',function(){
        return{
            restrict:'E',
            scope:{
                chartService: '@',
                xfilterService: '@',
                type:'@',
                module:'@'
            },
            controller: ['$scope','$attrs','$injector',function($scope,$attrs,$injector) {
                $scope.chartservice = $injector.get($scope.chartService);
                $scope.xfService = $injector.get($scope.xfilterService);
            }],
            template:
                '<span ng-if="xfService.cfReady(module)" id="{{grp}}_Counter" class="filter-count"></span>',
            link: function(scope, element, attrs){
                scope.$watch(
                    function($scope) { return $scope.xfService.cfReady(scope.module); },
                    function(newval, oldval){
                        if(newval){
                            var chart = scope.chartservice.createDCcounter(scope.xfService,scope.module,scope.type)
                            // console.log('anchroing',element[0],scope.module);
                            chart.anchor(element[0],scope.module);
                            chart.render();
                        }
                    })
            }
        }
    })

    .directive('dcChartVisit',function(){
        return {
            restrict: 'E',
            replace: true,
            template: '<div style="padding-top: 20px;/*float: left;max-height: 200px; overflow: scroll*/">' +
            '<div class="chart-title" id="returnsLabel">' +
            '<span>Visits</span>' +
            '<span class="filter"></span> <a class="reset">reset</a> ' +
            '</div>' +
            '<div class="clearfix"></div>' +
                //'<div><img src="img/icons/spinner.gif"></div>'+
            '</div>',

            controller: ['$scope','$attrs','$injector','ExportCriteria',function($scope,$attrs,$injector, exportCriteria) {

                //console.log('inside dc-chart controller')
                var chartService = $injector.get($scope.chartService);
                console.log('projectId ',$scope.projectId,$scope.val,$scope.obsid,$scope.grp)
                $scope.chartCFservice = chartService




                chartService.getVisitchart($scope.projectId,$scope.val,$scope.grp)
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
            link: function (scope, element, attrs) {

                //console.log(scope.val)

                scope.$watch('chartToPlot', function (newVal) {
                    if (newVal) {
                        //console.log(scope.chartToPlot)
                        scope.chartToPlot.anchor(element[0])

                        //console.log('chartId', scope.chartToPlot.chartID())
                        //console.log('chart group inside directive', scope.chartToPlot.chartGroup())
                        v//ar groupChart = scope.chartToPlot.chartGroup()
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