/**
 * Created by iemam on 15/09/2015.
 */

(function(){

    'use strict';

    function signupController($scope, $location, $state, authService){

        $scope.savedSuccessfully = false;
        $scope.message = "";
        $scope.qrCodeSrc = "";
        $scope.qrCode = "";

        $scope.registration = {
            firstName: "",
            lastName: "",
            organization: "",
            email: "",
            password: "",
            confirmPassword: ""
        };

        $scope.$state = $state;

        $scope.signUp = function () {

            $scope.registration.userName = $scope.registration.email
            authService.saveRegistration($scope.registration).then(function (response) {

                    $scope.savedSuccessfully = true;
                    $scope.message = "User registered successfully, generating QR code...";
                    //$scope.qrCode = response.psk;
                    //$scope.qrCodeSrc = "https://chart.googleapis.com/chart?chs=260x260&chld=M|0&cht=qr&chl=otpauth://totp/" + $scope.registration.userName + "%3Fsecret%3D" + $scope.qrCode;

                    $scope.registration.userName= "";
                    $scope.registration.password = "";
                    $scope.registration.confirmPassword = "";
                    $location.path('/dashboard');

                },
                function (response) {
                    //console.log(response)
                    var errors = [];
                    for (var key in response) {
                        for (var i = 0; i < response[key].length; i++) {
                            errors.push(response[key][i]);
                        }
                    }
                    $scope.savedSuccessfully = false;
                    $scope.message = "Failed to register user:" + errors.join(' ');
                });
        };

    }

    angular.module('bioSpeak.userAuth')
        .controller('signupController', ['$scope', '$location', '$state', 'authService',signupController])

})();