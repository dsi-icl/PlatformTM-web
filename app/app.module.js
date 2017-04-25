/**
 * Created by iemam on 06/04/2017.
 */
var biospeakApp = angular.module('biospeak.app', [
    "ui.bootstrap",
    "toaster",
    "ngAnimate",
    "ui.router",
    "ngSanitize",
    'oc.lazyLoad',
    'LocalStorageModule',                  // ocLazyLoad
    "bioSpeak.layout",
    "bioSpeak.config",
    "biospeak.explorer",
    "bioSpeak.export",
    "bioSpeak.userAuth",
    "bioSpeak.DataStager",
    "bioSpeak.import"
]);