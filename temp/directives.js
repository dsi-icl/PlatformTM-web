'use strict';

/* Directives */


angular.module('myApp.directives', [])
    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }])

    .directive('chartContainer', function(){
        return {
            restrict: 'A',
            template: '<div id="' + chartId + "-container" + '" class="pull-left subject-chart">' +
                        '<h2>' + chartType.replace("-", " ") + '</h2>' +
                        '<div id="' + chartId + '">' +
                            '<svg></svg>' +
                        '</div>' +
                       '</div>',
            link: function(scope, elem, attrs){

            }
        }
    })

    .directive('subjPlot', function(){
        return {
            restrict: 'A',
            link: function(scope, elem, attrs){

            }
        }
    })

    .directive('magnitudeChart',['cf',function(cf) {
        return{
            restrict:'E',
            scope:{
                val: '='
            },
            link: function(scope,elem,attrs){
                var magnitudeChart = dc.barChart("#dc-magnitude-chart");

                // Magnitide Bar Graph Summed
                magnitudeChart.width(480)
                    .height(150)
                    .margins({top: 10, right: 10, bottom: 20, left: 40})
                    .dimension(magValue)								// the values across the x axis //READ FROM CF factory
                    .group(magValueGroupSum)							// the values on the y axis     //READ FROM CF factory
                    .transitionDuration(500)
                    .centerBar(true)
                    .gap(56)                                            // bar width Keep increasing to get right then back off.
                    .x(d3.scale.linear().domain([0.5, 7.5]))
                    .elasticY(true)
                    .xAxis().tickFormat(function(v) {return v;});

                dc.renderAll(["magnitudeChart"]);
            }
        }
    }])

    .directive()
;
