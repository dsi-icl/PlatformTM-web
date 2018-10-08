/**
 * Created by iemam on 06/04/2017.
 */
angular.module('biospeak.app')
    .controller('appController', function ($scope, $location, $state, /*USER_ROLES,*/ authService) {
        if($location.url() !=="/signup" && $location.url() !=="/login")
            authService.getCurrentUser().then(function(response){
                $scope.currentUser = response.user;
            });

    //$scope.userRoles = USER_ROLES;
    //$scope.isAuthorized = authService.isAuthorized;

    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user
    };

    $scope.loginData = {
        userName: "",
        password: ""
    };


    $scope.message = "";
    $scope.logout = function () {
        authService.logOut().then(function (response) {
                $location.path('/login');

        },
            function (err) {
                $scope.message = err.error_description;
            });
    };
});