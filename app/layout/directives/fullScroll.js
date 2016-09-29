/**
 * Created by iemam on 15/08/2016.
 */
function fullScroll($timeout){
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: '100%',
                    railOpacity: 0.9
                });

            });
        }
    };
}

angular
    .module('bioSpeak.layout')
    .directive('fullScroll', sideNavigation)