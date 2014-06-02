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
;
