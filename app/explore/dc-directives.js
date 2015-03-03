/**
 * Created by iemam on 17/10/2014.
 */
angular.module('eTRIKSdata.dcPlots')


    .directive('chartingButton', function($compile){
        return {
            scope: { // attributes bound to the scope of the directive
                val: '@',
                grp: '@',
                isActive: '@active',
                container: '@',
                section: '@',
                chartService: '@'
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
                    console.log(scope)
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

                scope.$watch(
                    function($scope) { return $scope.cf.getCountGroup(); },
                    function(newval, oldval){
                    //console.log(newval)
                       // console.log(cf.getCountData())
                       // console.log(cf.getCountGroup())

                        chartOptions["dimension"] = cf.getCountData()
                        chartOptions["group"] =  cf.getCountGroup()

                        chart.options(chartOptions);
                        dc.renderAll();
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

                var chartService = $injector.get($scope.chartService);
                //$scope.cf = chartService;

                //var chartData //= chartService.getChartData($scope.val);

                //$scope.chartData = chartData;
                //console.log($scope.chartData)
                chartService.getChartData($scope.val)
                    .then(
                        // success function
                        function(data) {
                            console.log("GOT BACK from getChartData...")
                            console.log(data)
                            $scope.chartData = data;
                        },
                        // error function
                        function(result) {
                            console.log("Failed to get chart data " + result);
                        });




                $scope.addFilterToExport = function(filter){
                    console.log($scope.grp,$scope.val,filter)
                    exportCriteria.addFilter(filter,$scope.val,$scope.grp)
                };


            }],
            template:'<div style="padding-top: 20px;float: left;max-height: 200px; overflow: scroll">'+
                '<div class="chart-title" id="returnsLabel">'+
                '<span>{{val}}</span>'+
                '<a class="reset">reset</a> <span class="filter"></span>'+
                '</div>'+
                '<div class="clearfix"></div>'+
                '</div>'
            ,
            link: function (scope, element, attrs) {

                console.log(scope.val)

                scope.$watch('chartData', function(newVal) {
                    if (newVal) {

                        var cfGroup = scope.chartData.group;
                        var cfDimension = scope.chartData.dimension;
                        var chartData = getChartOptions(scope.val,cfDimension, cfGroup);

                        var chartFactory = dc[chartData.chartType];
                        var chart = chartFactory(element[0]);
                        chart.options(chartData.chartOptions);

//                console.log(isNaN(cf.getGroup(scope.val).all()[0].key));
//                console.log(cf.getDimension(scope.val).top(1)[0][scope.val])
//                console.log(cf.getDimension(scope.val).bottom(1)[0][scope.val])
//                console.log(cf.getGroup(scope.val).all())
//                console.log(cfGroup)
//                console.log(cfGroup.all())
//                console.log(cfDimension.top(1))
//                console.log(cfDimension.bottom(1))


                        chart.on('filtered', function(chart, filter){
                            scope.addFilterToExport(filter)
                            //exportCriteria.addFilter(filter,scope.val,scope.grp)
                        })


                        //Set reset link
                        var a = angular.element(element[0].querySelector('a.reset'));
                        a.attr('href', 'javascript:;');
                        a.css('display', 'none');
                        a.on('click', function () {
                            chart.filterAll();
                            dc.redrawAll();
                        });

                        dc.renderAll();

                    }
                });
                /*setTimeout(function () {
                    cf.add([{
                        "key": "KEY-6",
                        "state": "MD",
                        "topics": ["Science"],
                        "date": new Date("10/09/2012")
                    }]);
                    dc.redrawAll();
                }, 1000);*/

                // whenever the bound 'exp' expression changes, execute this
                /*scope.$watch('exp', function (newVal, oldVal) {
                    // ...
                });*/

                // var chart = dc.pieChart(element[0]);


                /*chart.width(180)
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

        function getChartOptions(val,cfDimension,cfGroup){

            var chartType,
                chartOptions = {};

            //check for type of plotted values
            if(isNaN(cfGroup.all()[0].key)){
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
                    chartOptions["width"] = "160"
                    chartOptions["height"] = "160"
                }
            }else{
                //numeric bar chart
                maxValue = cfDimension.top(1)[0][val]
                minValue = cfDimension.bottom(1)[0][val]
                console.log(maxValue)
                console.log(minValue)
                chartType = "barChart";
                chartOptions["transitionDuration"] = "500"
                chartOptions["centerBar"] = "true"
                chartOptions["gap"] = "20"
                chartOptions["x"] = d3.scale.linear().domain([minValue,maxValue])
                chartOptions["elasticY"] = "true"
                chartOptions["width"] = "300"
                chartOptions["height"] = "170"
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

        }
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
    });