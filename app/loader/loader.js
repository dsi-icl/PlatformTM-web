/**
 * Created by iemam on 21/01/2015.
 */
// create our angular app and inject ngAnimate and ui-router
// =============================================================================
angular.module('eTRIKSdata.loader', ['ngAnimate'])

// configuring our routes
// =============================================================================
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

            // route to show our basic form (/form)
            .state('form', {
                url: '/form',
                templateUrl: 'loader/form.html',
                controller: 'formController'
            })

            // nested states
            // each of these sections will have their own view
            // url will be nested (/form/profile)
            .state('form.profile', {
                url: '/profile',
                templateUrl: 'loader/form-profile.html'
            })

            // url will be /form/interests
            .state('form.interests', {
                url: '/interests',
                templateUrl: 'loader/form-interests.html'
            })

            // url will be /form/payment
            .state('form.payment', {
                url: '/payment',
                templateUrl: 'loader/form-payment.html'
            });

        // catch all route
        // send users to the form page
        $urlRouterProvider.otherwise('/form/profile');
    })

// our controller for the form
// =============================================================================
    .controller('formController', function($scope) {

        // we will store all of our form data in this object
        $scope.formData = {};

        // function to process the form
        $scope.processForm = function() {
            alert('awesome!');
        };

    });