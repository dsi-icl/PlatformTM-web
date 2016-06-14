/**
 * Created by iemam on 03/07/2014.
 */
angular.module('bioSpeak.config',["ui.bootstrap","ngResource",'eTRIKSdata.utils.service'])

    .config(function($stateProvider, $urlRouterProvider){

   /* $urlRouterProvider.otherwise('/manager');*/

        $stateProvider
            .state('manager', {
                abstract : true,
                url: "/{studyId}/setup",
                templateUrl:"layout/content.html",
                controller: "logOutController",
                resolve: {
                    loadDependency: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serie:true,
                                files: ['lib/plugins/footable/js/footable.all.min.js', 'lib/plugins/footable/css/footable.core.css',

                                    'lib/plugins/ui-select/js/select.min.js', 'lib/plugins/ui-select/css/select.css',
                                    'lib/plugins/angular-ui-select/js/select.min.js', 'lib/plugins/angular-ui-select/css/select.css',
                                    'lib/plugins/angular-xeditable/js/xeditable.min.js','lib/plugins/angular-xeditable/css/xeditable.css']
                            },
                            {
                                name: 'ui.footable',
                                files: ['lib/plugins/footable/js/angular-footable.js']
                            }
                        ]);
                    },
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: ['lib/plugins/iCheck/custom.css', 'lib/plugins/iCheck/icheck.min.js']
                            }
                        ]);
                    }
                }
            })
            .state('manager.main',{
                url:'/dashboard',
                templateUrl: 'manager/activities/activity-list.html',
                controller: 'ActivityListController as vm'
                /*views:{
                    '':{
                        templateUrl:"manager/studyManager.html"
                    },
                    'study-plan@manager':{
                        templateUrl:"manager/study-plan/study-plan.html"
                    },
                    'study-activities@manager':{
                        templateUrl: "manager/activities/activity-list.html",
                        controller:'ActivityListController'
                    }
                }*/
            })
            .state('manager.activity',{
                url:'/activities/{activityId}',
                templateUrl: "manager/activities/activity-detail.html",
                controller: "ActivityCtrl as vm"
                /*views:{
                 '':{
                 templateUrl:"manager/studyManager.html"
                 },
                 'study-plan@manager':{
                 templateUrl:"manager/study-plan/study-plan.html"
                 },
                 'study-activities@manager':{
                 templateUrl: "manager/activities/activity-list.html",
                 controller:'ActivityListController'
                 }
                 }*/
            })
            .state('manager.assay',{
                url:'/assays/{assayId}',
                templateUrl: "manager/activities/assayConfig.html",
                controller: "AssayConfigCtrl as vm",
                resolve: {
                    loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                        console.log("loading service");
                        return $ocLazyLoad.load('manager/activities/assayConfig-service.js');
                    }]
                }
                /*views:{
                 '':{
                 templateUrl:"manager/studyManager.html"
                 },
                 'study-plan@manager':{
                 templateUrl:"manager/study-plan/study-plan.html"
                 },
                 'study-activities@manager':{
                 templateUrl: "manager/activities/activity-list.html",
                 controller:'ActivityListController'
                 }
                 }*/
            })

            //.state('manager.datasets', {
            //    url: '/{studyId}/manage/datasets/{datasetId}',
            //    templateUrl: "manager/activities/datasets.html",
            //    controller: "DatasetController"
            //})

            //.state('datasets',{
            //    //abstract:true,
            //    url:"/{studyId}/configure/datasets",
            //    templateUrl: "manager/activities/datasets.html"
            //})
            //
            //.state('manager.activities',{
            //    abstract:true,
            //    url:"/activities",
            //    template: '<ui-view/>'
            //})

            //.state('manager.activities.detail',{
            //    url:'/{activityId}',
            //    views:{
            //        'activities.detail@manager':{
            //            url:'',
            //            templateUrl:'manager/activities/activities-detail.html',
            //            controller: 'ActivityCtrl'
            //        }
            //    }
            //})
            //
            //.state('manager.activities.detail.dataset',{
            //    url:'/dataset?domainId/{datasetId}',
            //    templateUrl:'manager/activities/dataset-detail.html',
            //    controller: 'DatasetController'
            //})
            //
            //.state('manager.activities.detail.newdataset',{
            //    url:'/selectTemplate',
            //    templateUrl: 'manager/activities/dataset-templates.html',
            //    controller: 'DatasetTemplatesCtrl'
            //})
            //
            //.state('manager.activities.detail.dataset.variable',{
            //    url:'/variable/:variableId',
            //    templateUrl:'manager/activities/variable-detail.html',
            //    controller:'VariableController'
            //})

    })/*.constant('ngAPISettings', {
        apiServiceBaseUri: 'http://rachmaninoff.local:8080/'
        //apiServiceBaseUri: 'http://ehs.biospeak.solutions/sandbox/'
    });*/


    /*.run(function(editableOptions) {

        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

    });*/
