/**
 * Created by iemam on 06/10/2014.
 */
angular.module('eTRIKSdata.plots')

    .directive('cdzArm', function(){
        return{
            restrict: 'AE',
            replace: true,
            template:
                '<div ng-if="scSelected" id="' + chartId + '"-container" class="pull-left subject-chart">' +
                '<h2>' + chartType.replace("-", " ") + '</h2>' +
                '<div id="' + chartId + '">' +
                '<svg></svg>' +
                '</div>' +
                '</div>',
            controller: function($scope){

            }

        }
    })