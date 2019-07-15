/**
 * Created by iemam on 14/09/2015.
 * Ctrl C Ctrl V from inspinia
 */

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a id="menu-button"class=" btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars fa-2x"></i><div><small>MENU</small></div></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {

                $("body").toggleClass("mini-navbar");
                // if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                //     // Hide menu in order to smoothly turn on when maximize menu
                //     $('#data-cart').hide();
                //     // For smoothly turn on menu
                //     setTimeout(
                //         function () {
                //             $('#data-cart').fadeIn(500);
                //         }, 100);
                // } else if ($('body').hasClass('fixed-sidebar')){
                //     $('#data-cart').hide();
                //     setTimeout(
                //         function () {
                //             $('#data-cart').fadeIn(500);
                //         }, 300);
                // } else {
                //     // Remove all inline style from jquery fadeIn function to reset menu state
                //     $('#data-cart').removeAttr('style');
                // }
            }
        }
    };
}

angular
    .module('bioSpeak.layout')
    .directive('minimalizaSidebar', ['$timeout',minimalizaSidebar])
