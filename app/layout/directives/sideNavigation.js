/**
 * Created by iemam on 14/09/2015.
 * taken from inspinia
 */

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function(){
                element.metisMenu();

            });

            // Enable initial fixed sidebar
            var sidebar = element.parent();
            sidebar.slimScroll({
                height: '100%',
                railOpacity: 0.9
            });
        }
    };
}


angular
    .module('bioSpeak.layout')
    .directive('sideNavigation', sideNavigation)