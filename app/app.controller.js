/**
 * Created by iemam on 06/04/2017.
 */
angular.module('biospeak.app').controller('appController', function ($scope, $location, /*USER_ROLES,*/ authService) {


    authService.getCurrentUser().then(function(response){

        $scope.currentUser = response.user;
        console.log($scope.currentUser)
    })
    //$scope.currentUser = null;
    //temp
    //$scope.currentUser = {'userName':'bahlool'};
    //$scope.userRoles = USER_ROLES;
    //$scope.isAuthorized = authService.isAuthorized;

    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user
        console.log($scope.currentUser)
    };

    $scope.loginData = {
        userName: "",
        password: ""
    };

    $scope.message = "";

    $scope.logout = function () {
        /*console.log($scope.loginData)
         $location.path('/explore/P-BVS');*/
        console.log("Logging out")
        authService.logOut().then(function (response) {

                $location.path('/login');
            },
            function (err) {
                $scope.message = err.error_description;
            });
    }

    $scope.isExplore = function (){
        var param = $location.path().split(/[\s/]+/)[2];
        return param == 'explore';
    }
})