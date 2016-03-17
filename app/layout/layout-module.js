/**
 * Created by iemam on 14/09/2015.
 */
    angular.module('bioSpeak.layout', [
        //'ui.router',                    // Routing
        //'oc.lazyLoad',                  // ocLazyLoad
        //'ui.bootstrap',                 // Ui Bootstrap
        //'pascalprecht.translate',       // Angular Translate
        //'ngIdle',                       // Idle timer
        //'ngSanitize'                    // ngSanitize
    ])

function logOutController($scope, $location, authService){

    //var vm = this;
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
}

angular.module('bioSpeak.layout')
    .controller('logOutController',['$scope', '$location', 'authService',logOutController])