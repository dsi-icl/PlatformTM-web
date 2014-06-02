/**
 * Created by iemam on 24/04/2014.
 */
var myapp = angular.module('myapp', ["ui.router"])
myapp.config(function($stateProvider){
    $stateProvider
        .state('index', {
            url: "",
            views: {
                "viewA": {
                    templateUrl: 'partials/study_clinical.html'
                },
                "viewB": {
                    template: "index.viewB"
                }
            }
        })
//        .state('route1', {
//            url: "/route1",
//            views: {
//                "viewA": {
//                    template: "route1.viewA"
//                },
//                "viewB": {
//                    template: "route1.viewB"
//                }
//            }
//        })
//        .state('route2', {
//            url: "/route2",
//            views: {
//                "viewA": {
//                    template: "route2.viewA"
//                },
//                "viewB": {
//                    template: "route2.viewB"
//                }
//            }
//        })
})