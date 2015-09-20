/**
 * Created by iemam on 10/09/2015.
 */

(function () {
    angular.module('bioSpeak.fileManager', [])

    /*app.run(['authService', function (authService) {
        authService.fillAuthData();
    }]);*/


})();


function config($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('files',{
            url: "/files",
            templateUrl: "fileManager/fileManager.html"//,
            //controller: "loginController"
        })

        /*.state('signup',{
            url: "/signup",
            templateUrl:"authentication/signup.html",
            controller : "signupController"
        })*/


}


angular
    .module('bioSpeak.fileManager')
    .config(config);
