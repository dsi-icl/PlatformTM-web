/**
 * Created by iemam on 15/09/2015.
 */



    'use strict'
    function loginController($scope, $location, authService){

        //var vm = this;
        $scope.loginData = {
            userName: "",
            password: "",
            signIn:false
        };

        $scope.message = "";

        $scope.login = function () {
            /*console.log($scope.loginData)
            $location.path('/explore/P-BVS');*/

            $scope.loginData.signIn = true;

            //$timeout(function(){
            //    // Simulate some service
            //    $scope.loadingDemo = false;
            //},2000)
            authService.login($scope.loginData).then(function (response) {
                    console.log(response)
                    $scope.loginData.signIn = false;

                    $location.path('/home');
                },
                function (err) {
                    $scope.message = err.error_description;
                });
        }
    }

    angular.module('bioSpeak.userAuth')
        .controller('loginController',['$scope', '$location', 'authService',loginController])

