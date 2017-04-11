/**
 * Created by iemam on 15/09/2015.
 */



    'use strict'
    function loginController($scope, $rootScope, $state, $location, AUTH_EVENTS, authService){

        //var vm = this;
        $scope.loginData = {
            userName: "",
            password: "",
            signIn:false
        };

        //console.log($state)
        $scope.$state = $state;

        $scope.login = function () {
            /*console.log($scope.loginData)
            $location.path('/explore/P-BVS');*/

            $scope.loginData.signIn = true;

            authService.login($scope.loginData).then(function (user) {

                    $scope.loginData.signIn = false;
                    $location.path('/dashboard');

                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $scope.setCurrentUser(user);

                },
                function (err) {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    $scope.message = err.error_description;
                });
        }
    }

    angular.module('bioSpeak.userAuth')
        .controller('loginController',['$scope','$rootScope','$state','$location','AUTH_EVENTS', 'authService',loginController])

