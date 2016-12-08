/**
 * Created by iemam on 17/10/2014.
 */
angular.module('eTRIKSdata.dcPlots')


    /*.directive('dcChartControl',function($compile){
        return{

        }
    })*/

/**
 * groupChartButton
 */
    .directive('groupChartButton',function($compile){
        return{
            restrict: 'A',
            scope:{
                obsGrps:'=',
                chartingOpts:'=',
            },
            link: function(scope, element){
                element.bind("click", function() {
                    console.log(scope.obsGrps, ' CLICKED')
                    scope.obsGrps.isLocked = true;


                })
            }
        }
    })
/**
 * chartingButton requires obs.o3id, obs.isActive, obs.id
 * cardId , chartId
 * chartContainerId
 * chartingOptions (chartService, xfService, chartGroup ...etc) only to pass to dc-chart directive
 *
 * o3 (Text to display as name for the observation
 */
    .directive('chartingButton', function($compile){
        return {
            restrict: 'EA',
            scope:{
                obs:'=',
                chartingOpts:'=',
                quals: '='
            },
            link: function(scope, element){
                element.bind("click", function(){
                    console.log(scope.obs,' CLICKED')

                    var isActive = scope.obs.isActive === true;
                    var chartId = scope.obs.id+"_chart";//scope.obs.o3id+"_"+scope.obs.qO2id+"_chart";
                    var cardId = scope.obs.o3id+"_card";


                    if(!document.getElementById(cardId)){
                        scope.$apply(function(){
                            angular.element(document.getElementById(scope.chartingOpts.chartContainerId))
                                .prepend(
                                    $compile(
                                        '<div class="cardlock" id="'+ cardId +'">'+
                                            // '<div class="">'+
                                                '<div class="card">'+
                                                    '<h1 class="border-bottom">{{obs.o3}}</h1>'+
                                                    '<dc-chart-menu obs="obs" quals="quals" charting-opts="chartingOpts"  class="qualifier-menu"></dc-chart-menu>'+
                                                '<div>' +
                                            // '</div>' +
                                        '</div>'
                                    )(scope)
                                )
                        })
                    }


                    if(!document.getElementById(chartId)){
                            scope.$apply(function(){
                                angular.element(document.getElementById(cardId).querySelector('div.card'))
                                    .append(
                                    $compile(
                                        '<div id="'+ chartId +'"class="chart" ng-switch="obs.dataType">' +
                                            '<dc-time-chart ng-switch-when="dateTime" charting-opts="chartingOpts" obs="obs"></dc-time-chart>'+
                                            '<dc-chart ng-switch-default charting-opts="chartingOpts" obs="obs"></dc-chart>'+
                                        '</div>'
                                    )(scope)
                                )
                            });
                    }
                    else{
                        console.log("chart exists already")
                        if(!isActive){
                            console.log('Removing chart')
                            angular.element(document.getElementById(cardId)).remove();

                            //console.log(angular.element(document.getElementById(cardId).querySelector('div.card')))
                            //console.log(angular.element(document.getElementById(cardId).querySelector('div.card').querySelector('div.chart')))
                            /*if(!angular.element(document.getElementById(cardId).querySelector('div.card').querySelector('div.chart')))
                                angular.element(document.getElementById(cardId)).remove();*/
                            return;
                        }
                    }
                });


            }
        }
    })

    .directive('groupControl',function($compile){
        return{
            restrict:'EA',
            scope:{
                grp:'='
            },
            link: function(scope,element){
                element.bind("ifchanged",function(){
                    console.log(scope.grp)
                })
            }
        }
    })


    /*.directive('dcChartContainer',function($timeout){
        return {
            restrict: 'EA',//add a control here and
            scope:true,
            template:
                '<div class="anchor">'+
                    '<div id="chartslock">'+
                        '<div class="anchor">'+
                            '<div id="charts">'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>',
            controller: ['$scope','$attrs','$injector',function($scope,$attrs,$injector) {
                var charts = [];

                this.addSlide = function(chart){

                }
                //$scope.chartOptions
                //$scope.addChart = function(){
                //    $('.add-remove').slick('slickAdd','<dc-chart></dc-chart>');
                //}
                //
                //$scope.addChart = function(chartRequestParams){
                //    charts.push(chartRequestParams)
                //}
            }],
            link : function(scope,element,attrs){
                //console.log('slider scope ',scope);

                $timeout(function() {
                    $(element).slick(scope.$eval(attrs.dcChartSlider));
                });

                function addSlide(chart) {
                    element.slick('slickAdd',chart)
                }

                function removeSlide(chart){

                }


            }
        }
    })

    .directive('slickSlider',function($timeout){
        return {
            restrict: 'A',
            scope:true,
            controller: function($scope){
                this.test = function(){
                    console.log('here')
                    console.log(this)
                    console.log($scope.obs, $scope.chartingOpts)

                }
            },
            controllerAs: 'slickSlider',
            link: function(scope,element,attrs) {
                $timeout(function() {
                    $(element).slick(scope.$eval(attrs.slickSlider));
                });
            }
        }
    })*/

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
                chartingOpts:'='
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

                $scope.done = false;

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
                        $scope.done = true;


                        if(plot.chartType == 'barChart'){
                            console.log("calling the reangeChart")
                            chartService.getDCchart($scope.chartingOpts.projectId,$scope.chartingOpts.chartGroup,xfilterService,"rangeChart",$scope.obs)
                                .then(function(chart2){
                                    $scope.rangeChart = chart2

                                    $scope.chartToPlot = plot;

                                    //console.log("back from both charts", chart, chart2)
                                })
                        }else
                            $scope.chartToPlot = plot;
                    },
                    function(result){
                        console.log("Failed to create DC chart",result);
                    }
                );



            }],
            template:

            '<div class="obs-chart">'+
                    '<div class="chart-title">'+
                        '<h5>{{obs.qO2_label}}</h5>'+
                    '</div>'+
                    '<div ng-hide="done" style="margin-top:70px" class="sk-spinner sk-spinner-fading-circle"> ' +
                        '<div class="sk-circle1 sk-circle"></div> ' +
                        '<div class="sk-circle2 sk-circle"></div> ' +
                        '<div class="sk-circle3 sk-circle"></div> ' +
                        '<div class="sk-circle4 sk-circle"></div> ' +
                        '<div class="sk-circle5 sk-circle"></div> ' +
                        '<div class="sk-circle6 sk-circle"></div> ' +
                        '<div class="sk-circle7 sk-circle"></div> ' +
                        '<div class="sk-circle8 sk-circle"></div> ' +
                        '<div class="sk-circle9 sk-circle"></div> ' +
                        '<div class="sk-circle10 sk-circle"></div> ' +
                        '<div class="sk-circle11 sk-circle"></div> ' +
                        '<div class="sk-circle12 sk-circle"></div> ' +
                    '</div>'+
                    /*'<div  class="chart-options">'+
                        '<ul>'+
                            // '<li> <a class="count-chart"> <i class="fa fa-bar-chart-o"></i></a></li>'+
                            // '<li> <a class="box-chart"> <i class="flat-icon flaticon-candlestick"></i></a></li>'+
                            // '<li> <a class="zoom"> <i class="fa fa-search-plus"></i></a></li>'+
                            // '<li>' +
                            //      '<div class="form-group" id="data_5"> ' +
                            //         // '<label>Date Range</label> ' +
                            //         '<div class="form-group"> ' +
                            //             '<label class="col-sm-1 control-label">From:</label>'+
                            //             '<div class="col-sm-4"><input date-time format="D MMM YYYY HH:mm" date-change="filterFrom" auto-close="true" ng-model="from"> </input></div>' +
                            //             '<label class="col-sm-1 control-label">To:</label>'+
                            //             '<div class="col-sm-4"><input date-time format="D MMM YYYY HH:mm" date-change="filterTo" auto-close="true" ng-model="to" > </input></div>' +
                            //             // '<span><i uib-dropdown-toggle class="fa fa-calendar"></i></span>'+
                            //             // '<div> ' + '<span>Selected date: <br/> {{(a|date)}} - {{(b|date)}} </span> ' + '</div> ' +
                            //             // '<div uib-dropdown-menu> ' +
                            //             //     '<div date-range format="D MMM YYYY HH:mm" start="a" end="b" auto-close="false"></div> ' +
                            //             // '</div> ' +
                            //         '</div>'+
                            //         '<a ng-click="filterChart()" class="btn btn-lnk btn-xs"><i class="fa fa-filter"></i></a>'+
                            //      '</div>'+
                            //     // '<div class="input-group date">'+
                            //     //     '<input type="datetime" class="form-control" date-time ng-model="sampleDate" format="yyyy-MM-dd HH:mm" view="month" auto-close="true">'+
                            //     //     '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>'+
                            //     // '</div>'+
                            // '</li>'+
                        '</ul>'+
                    '</div>'+
*/

                    '<div id="mainChart">' +
                        '<div class="chartControls"> ' +
                            '<span class="reset" style="visibility: hidden;">' +
                            ' Filtered by: <span class="filter"></span>' +
                                '<a> reset </a> ' +
                            '</span>'+
                        '</div>'+
                        '<div class="clearfix"></div>'+
                    '</div>'+


                    '<div id="range-chart"></div>'+
            '</div>',
            link: function (scope, element, attrs) {
                scope.$watch('chartToPlot', function(newVal) {
                    if (newVal) {
                        var groupChart = scope.chartingOpts.chartGroup
                        //var d = angular.element(document.getElementById(sliderElementId))
                        scope.chartToPlot.anchor(element[0].querySelector('#mainChart'), groupChart);

                        if(scope.rangeChart){
                            console.log('rangeChart is there',scope.rangeChart)
                            scope.rangeChart.anchor(element[0].querySelector('#range-chart'), groupChart);
                            scope.chartToPlot.rangeChart(scope.rangeChart);

                            //scope.chartToPlot.rangeChart(scope.rangeChart)
                        }



                        var d = angular.element(element[0].querySelector('div.chart-options'));
                        d.css('display', 'inline-block');

                        //Set reset link
                        var a = angular.element(element[0].querySelector('div.chartControls').querySelector('span.reset').querySelector('a'));
                        a.on('click', function () {
                            console.log('RESETTING FILTER')
                            //scope.chartToPlot.filterAll(groupChart);
                            if(scope.chartToPlot.chartType == 'barChart')scope.chartToPlot.focus();
                            scope.chartToPlot.filterAll(groupChart);
                            scope.chartToPlot.render();
                            if(scope.rangeChart){
                                //scope.rangeChart.focus();
                                scope.rangeChart.filterAll(groupChart);
                                //scope.rangeChart.render();
                            }
                            dc.redrawAll(groupChart);
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
                chartingOpts:'='
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


            '<div  class="chart-options">'+
            '<ul>'+

            '<li>' +
            '<div  id="data_5"> ' +
            // '<label>Date Range</label> ' +
            '<div > ' +
            '<label class="col-sm-1 control-label">From:</label>'+
            '<div class="col-sm-4"><input date-time format="D MMM YYYY HH:mm" date-change="filterFrom" auto-close="true" ng-model="from"> </input></div>' +
            '<label class="col-sm-1 control-label">To:</label>'+
            '<div class="col-sm-4"><input date-time format="D MMM YYYY HH:mm" date-change="filterTo" auto-close="true" ng-model="to" > </input></div>' +
            // '<span><i uib-dropdown-toggle class="fa fa-calendar"></i></span>'+
            // '<div> ' + '<span>Selected date: <br/> {{(a|date)}} - {{(b|date)}} </span> ' + '</div> ' +
            // '<div uib-dropdown-menu> ' +
            //     '<div date-range format="D MMM YYYY HH:mm" start="a" end="b" auto-close="false"></div> ' +
            // '</div> ' +
            '</div>'+
            '<a ng-click="filterChart()" class="btn btn-lnk btn-xs"><i class="fa fa-filter"></i></a>'+
            '</div>'+
            // '<div class="input-group date">'+
            //     '<input type="datetime" class="form-control" date-time ng-model="sampleDate" format="yyyy-MM-dd HH:mm" view="month" auto-close="true">'+
            //     '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>'+
            // '</div>'+
            '</li>'+
            '</ul>'+
            '</div>'+


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
                        var groupChart = scope.chartingOpts.chartGroup
                        //var d = angular.element(document.getElementById(sliderElementId))
                        scope.chartToPlot.anchor(element[0].querySelector('#mainChart'), groupChart);





                        var d = angular.element(element[0].querySelector('div.chart-options'));
                        d.css('display', 'inline-block');

                        //Set reset link
                        var a = angular.element(element[0].querySelector('div.chartControls').querySelector('span.reset').querySelector('a'));
                        a.on('click', function () {
                            console.log('RESETTING FILTER')
                            //scope.chartToPlot.filterAll(groupChart);
                            if(scope.chartToPlot.chartType == 'barChart')scope.chartToPlot.focus();
                            scope.chartToPlot.filterAll(groupChart);
                            scope.chartToPlot.render();
                            if(scope.rangeChart){
                                //scope.rangeChart.focus();
                                scope.rangeChart.filterAll(groupChart);
                                //scope.rangeChart.render();
                            }
                            dc.redrawAll(groupChart);
                        });



                        scope.chartToPlot.render();

                    }
                })
            }
        };
    })

    .directive('dcChartMenu', function() {
        return {
            restrict: 'EA',
            scope: {
                obs: '=',
                chartingOpts: '=',
                quals:'='
            },
            replace:true,
            controller: function ($scope, $element) {
                console.log('menu scope',$scope.obs, $scope.quals)

                /*if(!$scope.quals) return

                for(var i=0; i<$scope.quals.length; i++){

                    // ObsGrp.obsRequest.termIds = ObsGrp.obsRequest.termIds.concat(ObsGrp.observations[i].defaultObservation.termIds);
                    // ObsGrp.obsRequest.o3code = ObsGrp.observations[i].defaultObservation.o3code
                    // ObsGrp.obsRequest.qO2 = ObsGrp.observations[i].defaultObservation.qO2
                    // ObsGrp.obsRequest.qO2_label = ObsGrp.observations[i].defaultObservation.qO2_label
                    // ObsGrp.obsRequest.dataType = ObsGrp.observations[i].defaultObservation.dataType
                    // ObsGrp.obsRequest.id = ObsGrp.observations[i].defaultObservation.id;

                    $scope.quals[i].termIds = $scope.obs.termIds;
                    $scope.quals[i].o3code = $scope.obs.o3code;
                    $scope.quals[i].o3 = $scope.obs.o3;
                    $scope.quals[i].o3id = $scope.obs.o3id;
                    $scope.quals[i].id = $scope.obs.o3code + " ["+$scope.quals[i].qO2+"]";

                    console.log($scope.quals[i])

                }*/
            },
            template:
            '<div class="dropdown" uib-dropdown>'+
                '<a class="dropdown-toggle" href uib-dropdown-toggle>'+
                    '<i class="fa fa-ellipsis-v"></i>'+
                '</a>'+
                '<ul class=" dropdown-menu dropdown-menu-right plotting-options"> ' +
                    '<li class="dropdown-header">Chart Value for {{obs.o3}}</li>'+
                    '<li ng-repeat="var in quals">' +
                        '<div  class="checkbox">'+
                            '<input id="checkbox_{{var.id}}" type="checkbox" ' +
                            'charting-button  obs="var"  ' +
                            'ng-init="var.isActive = false" ng-click="var.isActive = !var.isActive" ' +
                            'charting-opts="chartingOpts" >' +
                            '<label uib-tooltip="{{var.qO2_label}}" for="checkbox_{{var.id}}">{{var.qO2_label}}</label>' +
                        '</div>' +
                    '</li> ' +
                '</ul>'+
            '</div>'
        }
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
                        console.log('doing it for subject and module is',scope.module)
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

    .directive('dcCountWidget',function(){
        return{
            restrict:'E',
            scope:{
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
                '<span ng-if="xfService.cfReady(module)" id="{{grp}}_Counter" class="filter-count model-count number-display"></span>',//+
                //' from(<span class="total-count"></span>)',
            link: function(scope, element, attrs){
                scope.$watch(
                    function($scope) { return $scope.xfService.cfReady(scope.module); },
                    function(newval, oldval){
                        if(newval){
                            var chart = scope.chartservice.createDCcounter(scope.xfService,scope.module)
                            chart.anchor(element[0],scope.grp);
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