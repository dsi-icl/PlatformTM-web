/**
 * Created by iemam on 06/04/2017.
 */
var biospeakApp = angular.module('biospeak.app')

    .run(function($rootScope, $location,$state, $uibModalStack,AUTH_EVENTS, authService){

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
            $location.path('/login');
        });

        $rootScope.$on(AUTH_EVENTS.notAuthorized, function() {
            console.log($state)
            $state.go('project.403');
        });

        $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
            $state.go('project.home',{projectId:142});
        });

        $rootScope.$on(AUTH_EVENTS.accountCreated, function() {
            $state.go('confirm');
        });

        $rootScope.$on('$stateChangeStart', function (event, next, toParams, fromState, fromParams, options) {

            authService.checkPermissionForView(next,toParams).then(function (isAllowed) {
              if(!isAllowed){
                  event.preventDefault();
                  $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
              }
                $uibModalStack.dismissAll();
            })

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
    notAuthorized: 'auth-not-authorized',
    accountCreated: 'auth-account-created'
});
biospeakApp.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
})

biospeakApp.constant('ngAppConfig', {
    apiServiceBaseUri: '/api/v1/'
    //apiServiceBaseUri: 'http://localhost:5000/'
});