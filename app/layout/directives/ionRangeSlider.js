function ionRangeSlider($timeout) {
    return {
        restrict: 'A',
        scope: {
            rangeOptions: '=',
            to:'=',
            from:'=',
            min:'=',
            max:'=',
            onChange:'='
        },
        link: function (scope, elem, attrs) {
            //console.log(elem)
            //console.log(scope)
            elem.ionRangeSlider(scope.rangeOptions)
            /*elem.ionRangeSlider({
                min: scope.min,
                max: scope.max,
                type: 'double',
                prefix: '$',
                //maxPostfix: $scope.maxPostfix,
                //prettify: $scope.prettify,
                //grid: $scope.grid,
                //gridMargin: $scope.gridMargin,
                //postfix:$scope.postfix,
                //step:$scope.step,
                //hideMinMax:$scope.hideMinMax,
                //hideFromTo:$scope.hideFromTo,
                from:scope.from,
                to:scope.to,
                //disable:$scope.disable,
                onChange:scope.onChange
                //onFinish:$scope.onFinish
            });*/

            scope.$watch('rangeOptions', function(value) {
                //console.log("from changed",value)
                //elem.data("ionRangeSlider").update({from: value});
                //scope.$apply()
            },true);
        }
    }
}

angular
    .module('bioSpeak.layout')
    .directive('ionRangeSlider', ['$timeout',ionRangeSlider])
