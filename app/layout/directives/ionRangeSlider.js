function ionRangeSlider() {
    return {
        restrict: 'A',
        scope: {
            rangeOptions: '='
        },
        link: function (scope, elem, attrs) {
            console.log(elem)
            console.log(scope)
            elem.ionRangeSlider(scope.rangeOptions);

        }
    }
}

angular
    .module('bioSpeak.layout')
    .directive('ionRangeSlider', [ionRangeSlider])
