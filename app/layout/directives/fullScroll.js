/**
 * Created by iemam on 15/08/2016.
 */
function fullScroll($timeout){
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: 'auto',
                    railOpacity: 0.9,
                    color: '#0095a2',
                    allowPageScroll: true,
                    alwaysVisible: true
                });

            });
        }
    };
}

angular
    .module('bioSpeak.layout')
    .directive('fullScroll', fullScroll)