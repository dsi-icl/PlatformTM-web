/**
 * Created by iemam on 15/09/2015.
 */

(function(){

    'use strict'
    function loginController($scope, $location, authService, ngAuthSettings){

        //var vm = this;
        $scope.loginData = {
            userName: "",
            password: ""
        };

        $scope.message = "";

        $scope.login = function () {
            /*console.log($scope.loginData)
            $location.path('/explore/P-BVS');*/
            authService.login($scope.loginData).then(function (response) {

                    $location.path('/explore/P-BVS');
                },
                function (err) {
                    $scope.message = err.error_description;
                });
        }
    }

    angular.module('bioSpeak.userAuth')
        .controller('loginController',['$scope', '$location', 'authService', 'ngAuthSettings',loginController])

})();