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
            scope:{},
            link: function(scope, element){

            }
        }
    })
/**
 * chartingButton requires obs.o3id, obs.isActive, obs.id
 */
    .directive('chartingButton', function($compile){
        return {
            restrict: 'EA',
            scope:{
                obs:'=',
                chartingOpts:'=',
                quals: '='
            },
            controller: function($scope, $compile, $http) {
            },
            //controllerAs: 'chartingButton',

            link: function(scope, element){
                //element.find('a:first').bind("click", function(){
                element.bind("click", function(){
                    console.log(scope.obs,' CLICKED')

                    var icon = element.find('i');
                    icon.toggleClass('fa-toggle-off').toggleClass('fa-toggle-on');

                    var isActive = scope.obs.isActive === true
                    var chartId = scope.obs.o3id+"_"+scope.obs.qO2id+"_chart";
                    var cardId = scope.obs.o3id+"_card";


                    if(!document.getElementById(cardId)){
                        scope.$apply(function(){
                            angular.element(document.getElementById(scope.chartingOpts.chartContainerId))
                                .prepend(
                                    $compile(
                                        '<div class="cardlock" id="'+ cardId +'">'+
                                            '<div class="">'+
                                                '<div class="card">'+
                                                    '<h1 class="border-bottom">{{obs.o3}}</h1>'+
                                                    /*'<div> ' +
                                                     '<a style="font-size:12px" class="btn btn-xs btn-outline"' +
                                                     'charting-button  obs="q" ' +
                                                     'ng-init="q.isActive = false" ' +
                                                     'ng-click="q.isActive = !q.isActive"  ' +
                                                     'charting-opts="chartingOpts"'+
                                                     'ng-repeat="q in quals">' +
                                                     '<i class="fa fa-toggle-off"></i> {{q.qO2_label}} </a>' +
                                                     '</div>'+*/
                                                '<div>' +
                                            '</div>' +
                                        '</div>'
                                    )(scope)
                                )
                        })
                    }


                    if(!document.getElementById(chartId)){
                            scope.$apply(function(){
                                angular.element(document.getElementById(cardId).querySelector('div.card'))
                                    .append(
                                    $compile('<div id="'+ chartId +'"class="chart">' +
                                                '<dc-chart charting-opts="chartingOpts" obs="obs"></dc-chart>'+'</div>'
                                    )(scope)
                                )
                            });
                    }
                    else{
                        console.log("chart exists already")
                        if(!isActive){
                            console.log('Removing chart')
                            angular.element(document.getElementById(chartId)).remove();
                            return;
                        }
                    }
                });


            }
        }
    })


    .directive('dcChartContainer',function($timeout){
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

    .directive('dcChartSliderControl',function(){
        return {

            //scope:{
            //    target: '@',
            //    obs: '@',
            //    value: '='
            //},
            scope: true,
            restrict: 'EA',




            /*transclude: true,*/
            //require:'^chartingButton',
            //templateUrl:'explore/dc/partials/chart_slider.html',
            controller: function($scope){

            },
            controllerAs: 'dcChartSliderControl',
            //require: '^chartingButton',
            link : function(scope,element,attrs,chartCtrl){
                //var optionsKey = attrs.gridsterItem,
                //    options;

               // var plotter = controllers[0],
               //     slidercontrol = controllers[1];

                //console.log(plotter)
                //console.log(slidercontrol)

                //scope.plotter = plotter;
                //console.log('HERE');
                element.bind("change", function(){
                    console.log('slider control',scope)
                    console.log('slider element ',element)
                    //console.log('required controeller ')
                    console.log(scope)
                    chartCtrl.addChart(scope.obs.code)

                    //targEle = angular.element(document.getElementById(scope.target))

                    if(element.checked){
                        console.log('element checked')
                        //Add a slide to the dc-chartscroll-panel add dc-chart to
                        //will need from the scope:
                        //the qualifier , the slide panel and basically add dc-chart with the qualifier

                        chartControl.addChart(element.value)
                        /*targEle.slick('slickAdd','<dc-chart></dc-chart>');

                        //selecting the parent slickslider element
                        scope.$apply(function(){
                            angular.element(document.getElementById(scope.container))
                                .append(
                                $compile(
                                    '<div  style=" padding: 0px 30px 0px 30px;" id="'+elemId+'"> ' +
                                    '<dc-chart-scroll-panel></dc-chart-scroll-panel>'+
                                    '</div>')(scope)
                            )
                        })*/

                    }
                })
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
    })

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

                //console.log('inside dc-chart controller')
                //console.log('projectId ',$scope.projectId,'val ',$scope.val,'obsid ',$scope.obsid,'chart grp',$scope.grp)

                chartService.getDCchart($scope.chartingOpts.projectId,$scope.obs.code,$scope.obs.id,$scope.chartingOpts.chartGroup,xfilterService, chartDataType,$scope.obs)
                    .then(
                    function(chart){
                        $scope.chartToPlot = chart;
                    },
                    function(result){
                        console.log("Failed to create DC chart",result);
                    }
                );

            }],
            template:
            '<div style="outline: none;">'+
                '<div>'+
                    '<div class="pull-left chart-title">'+
                        '<h5>{{obs.qO2_label}}</h5>'+

                    '</div>'+
                    /*'<div ng-hide="chartingOpts.chartGroup == \'subject\'" class="pull-right chart-options">'+
                        '<ul>'+
                            '<li> <a class="count-chart"> <i class="fa fa-bar-chart-o"></i></a></li>'+
                            '<li> <a class="box-chart"> <i class="flat-icon flaticon-candlestick"></i></a></li>'+
                            '<li> <a class="zoom"> <i class="fa fa-search-plus"></i></a></li>'+
                        '</ul>'+
                    '</div>'+*/
                '</div>'+
                '<div class="obs-chart"> ' +
                    '<span class="filter"></span> <a class="reset">reset</a> '+
                '</div>'+

            '</div>'
            ,
            link: function (scope, element, attrs) {
                scope.$watch('chartToPlot', function(newVal) {
                    if (newVal) {
                        var groupChart = scope.chartingOpts.chartGroup
                        //var d = angular.element(document.getElementById(sliderElementId))
                        scope.chartToPlot.anchor(element[0].querySelector('div.obs-chart'), groupChart);


                        var d = angular.element(element[0].querySelector('div.obs-chart').querySelector('div.chart-options'));
                        d.css('display', 'inherit');

                        //Set reset link
                        var a = angular.element(element[0].querySelector('div.obs-chart').querySelector('a.reset'));
                        a.attr('href', 'javascript:;');
                        a.css('display', 'none');
                        a.on('click', function () {
                            scope.chartToPlot.filterAll(groupChart);
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

                        /*element.on('filtered',function(chart, filter){

                            console.log("===EVENT===CHART===FILTERED",chart.chartID())
                            scope.chartservice.propagateFilter(scope.chartingOpts.xfilterService);

                            scope.filtersService.updateFilters(scope.chartingOpts.chartGroup,chart.dimName,chart.filters())
                            //console.log("filters for " + $scope.chartingOpts.chartGroup,chart.dimName,chart.filters())


                            //dc.renderAll("Clinical");
                        })*/

                        scope.chartToPlot.render()

                        //console.log('chartId',scope.chartToPlot.chartID())
                        //console.log('chart group inside directive',scope.chartToPlot.chartGroup())
                        //console.log('subject cf size',scope.chartCFservice.getCountData().size())
                        //console.log('subject group',scope.chartCFservice.subjDimension().group())
                        //console.log('subject groupAll',scope.chartCFservice.subjDimension().group().all())
                        //console.log('subject dimension groupAll value',scope.chartCFservice.subjDimension().groupAll().value())
                        //console.log('Group chart ', groupChart)
                        //dc.renderAll(groupChart);
                        //dc.redrawAll();
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