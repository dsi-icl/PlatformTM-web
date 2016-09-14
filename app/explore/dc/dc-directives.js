/**
 * Created by iemam on 17/10/2014.
 */
angular.module('eTRIKSdata.dcPlots')


    /*.directive('dcChartControl',function($compile){
        return{

        }
    })*/

    /**
     * chartingButton requires obs.o3id, obs.isActive, obs.id
     */
    .directive('chartingButton', function($compile){
        return {
            restrict: 'EA',
            scope:{
                obs:'=',
                chartingOpts:'='
            },
            //require: '?slickSlider',
            controller: function($scope, $compile, $http) {
                /*this.cs = ['ibrahim','emam','assem','zeinab','adel'];
                this.sliderElementId = $scope.obs.code+"_slider";
                this.sliderElementId = $scope.obs.code+"_slider";
                this.obs = $scope.obs
                this.addChart = function(c){
                    $scope.cs.push('MEME');
                    console.log('inside add chart', this.sliderElementId)
                    //angular.element(document.getElementById(this.sliderElementId)).slick('slickAdd','<div>MEMEMEMEME</div>');
                }*/
            },
            //controllerAs: 'chartingButton',

            link: function(scope, element, attrs, slickCtrl){

                //var control = element.parent().find('.slider-control:first')
                //scope.chartingButton = chartingButton;

                //console.log('slider control ',scope.obs.code)
                /*scope.$watch('charts', function(newVal) {
                    if (newVal) {

                    }
                })*/

                //console.log(element)

                //element.find('a:first').bind("click", function(){
                element.bind("click", function(){

                    console.log(scope.obs,' CLICKED')
                    //console.log(scope)

                    var icon = element.find('i:first');
                    icon.toggleClass('fa-toggle-off').toggleClass('fa-toggle-on');

                    //var elemId = attrs.id+'-chart';
                    var isActive = scope.obs.isActive === true

                    console.log(scope.chartingOpts.chartContainerId)
                    console.log(isActive)

                    var sliderElementId = scope.obs.o3id+"_slider";
                    console.log(sliderElementId)
                    //console.log(!document.getElementById(sliderElementId))


                    if(!document.getElementById(sliderElementId)){
                        //if(isActive){
                            //console.log(scope.obs.code+"_slider")
                            scope.$apply(function(){
                                angular.element(document.getElementById(scope.chartingOpts.chartContainerId))
                                    .append(
                                    $compile(
                                        '<div style="width: 300px; margin-left:10px;" id="'+sliderElementId+'" ' +
                                        'slick-slider="{dots: true, arrows: true, draggable:false, slidesToShow:1, infinite:false, variableWidth:true}" '+
                                        'style=" padding: 0px 30px 0px 30px;">' +
                                            '<dc-chart charting-opts="chartingOpts" obs="obs"></dc-chart>'+
                                        //'<div style="width: 250px;" ng-repeat="c in chartingButton.cs">{{c}}</div>'+
                                        '</div>')(scope)
                                )
                            })
                       // }
                    }

                    else{
                        console.log("slider exists already")
                        if(!isActive){
                            console.log('Removing chart')
                            angular.element(document.getElementById(sliderElementId)).remove();
                            return;
                        }
                        //else{
                            console.log('adding chart to obs', scope.obs.id)

                            //scope.$apply(function(){
                            //    angular.element(document.getElementById(sliderElementId))
                            //        .slick('slickAdd','<div>{{obs.code}}</div>');
                            //})
                            //var charthtml = $compile('<dc-chart charting-opts="chartingOpts" obs="obs"></dc-chart>')
                            //angular.element(document.getElementById(sliderElementId)).slick('unslick');
                            //scope.$apply(function(){

                        if(!angular.element(document.getElementById(sliderElementId))){
                            scope.$apply(function(){
                                angular.element(document.getElementById(scope.chartingOpts.chartContainerId))
                                    .append(
                                    $compile(
                                        '<div style="width: 300px; margin-left:30px;margin-right:30px;" id="'+sliderElementId+'" ' +
                                        'slick-slider="{dots: true, arrows: true, draggable:false, slidesToShow:1, infinite:false, variableWidth:true}" '+
                                        'style=" padding: 0px 30px 0px 30px;">' +
                                        '<dc-chart charting-opts="chartingOpts" obs="obs"></dc-chart>'+
                                            //'<div style="width: 250px;" ng-repeat="c in chartingButton.cs">{{c}}</div>'+
                                        '</div>')(scope)
                                )
                            })
                        }
                        else
                                angular.element(document.getElementById(sliderElementId))
                                    .slick('slickAdd',$compile('<dc-chart charting-opts="chartingOpts" obs="obs"></dc-chart>')(scope));
                        /*angular.element(document.getElementById(sliderElementId))
                            .slick('changeSlide','next');*/
                            //})
                            //angular.element(document.getElementById(sliderElementId)).slick('reinit');
                            //console.log(slickCtrl);
                        //}

                    }


                    //console.log(element.select(i).class)


                });


            }
        }
    })


    .directive('dcChartSlider',function($timeout){
        return {
            restrict: 'EA',//add a control here and
            scope:true,
           /* template:
            '<div style="width: 250px;">' +
            '<slick id="{{val}}_slider" ' +
            'dots="true" slides-to-show="1" center-mode="false" ' +
            'variable-width="true"> ' +
                //'<dc-chart ng-repeat="chart in charts"></dc-chart>'+
                '<div style="width: 250px;" ng-repeat="c in cs">{{c}}</div>'+
            '</slick>' +
            '</div>',*/
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
            /*scope:{
                obs:'=',
                chartingOpts:'=',
                variable: '@'
            },*/
            controller: ['$scope','$attrs','$injector',function($scope,$attrs,$injector) {

                //console.log($scop)
                console.log('dcChart scope ',$scope);

                var chartService = $injector.get($scope.chartingOpts.DCchartService);
                $scope.chartservice = chartService;

                var xfilterService = $injector.get($scope.chartingOpts.xfilterService);
                $scope.xfService = xfilterService;

                /*var expService = $injector.get($scope.chartingOpts.exportService);
                $scope.expService = expService;*/

                var filtersServ = $injector.get($scope.chartingOpts.filtersService);
                $scope.filtersService = filtersServ;

                var chartDataType = 'Count';//$scope.role;

                //console.log('inside dc-chart controller')
                //console.log('projectId ',$scope.projectId,'val ',$scope.val,'obsid ',$scope.obsid,'chart grp',$scope.grp)

                chartService.getDCchart($scope.chartingOpts.projectId,$scope.obs.code,$scope.obs.id,$scope.chartingOpts.chartGroup,xfilterService, chartDataType,$scope.obs)
                    .then(
                    function(chart){
                        $scope.chartToPlot = chart;

                        $scope.chartToPlot.on('filtered', function(chart, filter){

                            console.log("===EVENT===CHART===FILTERED",chart.chartID(),'FILTER:',filter)
                            $scope.chartservice.propagateFilter($scope.chartingOpts.xfilterService);

                            //$scope.filtersService.updateFilters($scope.chartingOpts.chartGroup,chart.dimName,chart.filters())
                            //console.log("filters for " + $scope.chartingOpts.chartGroup,chart.dimName,chart.filters())


                            //dc.renderAll("Clinical");
                        })
                    },
                    function(result){
                        console.log("Failed to create DC chart",result);
                    }
                );

            }],
            template:'<div style="padding-top: 20px;/*float: left;max-height: 200px; overflow: scroll*/">'+
                '<div  id="returnsLabel">'+
                    '<div class="pull-left chart-title">'+
                        '<span>{{obs.o3}}</span>'+
                        '<span class="filter"></span> <a class="reset">reset</a> '+
                    '</div>'+
                    /*'<div ng-hide="chartingOpts.chartGroup == \'subject\'" class="pull-right chart-options">'+
                        '<ul>'+
                            '<li> <a class="count-chart"> <i class="fa fa-bar-chart-o"></i></a></li>'+
                            '<li> <a class="box-chart"> <i class="flat-icon flaticon-candlestick"></i></a></li>'+
                            '<li> <a class="zoom"> <i class="fa fa-search-plus"></i></a></li>'+
                        '</ul>'+
                    '</div>'+*/
                '</div>'+
                '<div class="clearfix"></div>'+
                '</div>'
            ,
            link: function (scope, element, attrs) {
                scope.$watch('chartToPlot', function(newVal) {
                    if (newVal) {
                        var groupChart = scope.chartingOpts.chartGroup
                        console.log()
                        scope.chartToPlot.anchor(element[0], groupChart);


                        var d = angular.element(element[0].querySelector('div.chart-options'));
                        d.css('display', 'inherit');

                        //Set reset link
                        var a = angular.element(element[0].querySelector('a.reset'));
                        a.attr('href', 'javascript:;');
                        a.css('display', 'none');
                        a.on('click', function () {
                            scope.chartToPlot.filterAll(groupChart);
                            dc.redrawAll(groupChart);
                        });

                        //Set alt link
                        var a1 = angular.element(element[0].querySelector('a.box-chart'));
                        a1.attr('href', 'javascript:;');
                        a1.on('click', function () {
                            //$scope.obs.code,$scope.obs.id,$scope.chartingOpts.chartGroup,xfilterService, chartDataType,$scope.obs
                            scope.chartservice.getDCchart(scope.chartingOpts.projectId, scope.val, scope.obs.id, scope.chartingOpts.chartGroup, scope.xfService, 'GroupedByTime')
                                .then(
                                function (chart) {
                                    scope.chartToPlot = chart;
                                });

                            //scope.chartToPlot.anchor(element[0],scope.grp);
                            //scope.chartToPlot.filterAll(groupChart);
                            //dc.redrawAll(groupChart);
                        });

                        var a2 = angular.element(element[0].querySelector('a.count-chart'));
                        a2.attr('href', 'javascript:;');
                        a2.on('click', function () {
                            scope.chartservice.getDCchart(scope.chartingOpts.projectId, scope.val, scope.obs.id, scope.chartingOpts.chartGroup, scope.xfService, 'Count')
                                .then(
                                function (chart) {
                                    scope.chartToPlot = chart;
                                });

                            //scope.chartToPlot.anchor(element[0],scope.grp);
                            //scope.chartToPlot.filterAll(groupChart);
                            //dc.redrawAll(groupChart);
                        });

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
                        console.log(newval)
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