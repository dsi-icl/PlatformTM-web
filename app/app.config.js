/**
 * Created by iemam on 06/04/2017.
 */
var biospeakApp = angular.module('biospeak.app')

    .run(function($rootScope, $location,$state, AUTH_EVENTS, authService){

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
            $location.path('/login');
        });

        $rootScope.$on(AUTH_EVENTS.notAuthorized, function() {
            $state.go('home.unauthorized');
        });

        $rootScope.$on('$stateChangeStart', function (event, next, toParams, fromState, fromParams, options) {



            if (!authService.checkPermissionForView(next,toParams)){
                event.preventDefault();
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            }//else
                //console.log('OK to proceed')
        });


        $rootScope.$on('$stateChangeSuccess', function() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        });

    });

biospeakApp.config(function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(blob):/);

})

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
    apiServiceBaseUri: '/api/v1/'
    //apiServiceBaseUri: 'http://146.169.32.103/api/v1/'
    //apiServiceBaseUri: 'http://rachmaninoff.local:8080/'
    //apiServiceBaseUri: 'http://146.169.15.65:2483/'
    //apiServiceBaseUri: 'http://localhost:2483/api/v1/'
    //apiServiceBaseUri: 'http://localhost:5000/'
});