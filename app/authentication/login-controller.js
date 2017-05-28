/**
 * Created by iemam on 15/09/2015.
 */

    'use strict'
    function loginController($scope, $rootScope, $state, $location, AUTH_EVENTS, authService){

        var vm = this;
        vm.loginData = {
            userName: "",
            password: "",
            signIn:false
        };
        vm.loginMessage='';
        vm.isSigningIn = false;

        //console.log($state)
        vm.state = $state;

        vm.login = function () {
            /*console.log($scope.loginData)
            $location.path('/explore/P-BVS');*/

            vm.isSigningIn = true;

            authService.login(vm.loginData).then(function (user) {

                    vm.isSigningIn = false;
                    $location.path('/dashboard');

                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $scope.setCurrentUser(user);

                },
                function (err) {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    console.log(err);
                    /*var errors = [];
                    for (var key in err) {
                        for (var i = 0; i < err[key].length; i++) {
                            errors.push(err[key][i]);
                        }
                    }*/
                    vm.isSigningIn = false;
                    vm.loginfailed = true;
                    vm.loginMessage = "Failed to log in: " + err.msg;
                });
        }
    }

    angular.module('bioSpeak.userAuth')
        .controller('loginController',['$scope','$rootScope','$state','$location','AUTH_EVENTS', 'authService',loginController])

