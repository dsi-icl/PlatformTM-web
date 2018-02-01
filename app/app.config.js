/**
 * Created by iemam on 06/04/2017.
 */
var biospeakApp = angular.module('biospeak.app')

    .run(function($rootScope, AUTH_EVENTS, authService){

        $rootScope.$on('$stateChangeStart', function (event, next) {

            // var authorizedRoles = next.data.authorizedRoles;

            /*if (!authService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                if (authService.isAuthenticated()) {
                    // user is not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    // user is not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }*/
        });

        /**
         * ROUTE CHANGE: START
         * Triggered when a route change is initiated
         */
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

            // Show curtain loader
            $rootScope.$broadcast('curtain', true);


            /**
             * CHECK:
             * Check if user is authenticated
             */


        });

        $rootScope.$on('$stateChangeSuccess', function() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        });
    });

biospeakApp.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});
biospeakApp.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
})

biospeakApp.constant('ngAppConfig', {
    //apiServiceBaseUri: '/api/v1/'
    //apiServiceBaseUri: 'http://146.169.32.103/api/v1/'
    //apiServiceBaseUri: 'http://rachmaninoff.local:8080/'
    //apiServiceBaseUri: 'http://146.169.15.65:2483/'
    apiServiceBaseUri: 'http://localhost:2483/'
    //apiServiceBaseUri: 'http://localhost:5000/'
});