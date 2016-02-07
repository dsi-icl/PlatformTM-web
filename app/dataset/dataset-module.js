/**
 * Created by iemam on 10/09/2015.
 */


function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('datasetView', {
            abstract: true,
            url: "/{studyId}",
            templateUrl: "layout/content.html"
        })
        .state('datasetView.test', {
            url: "/dataset/dataview",
            templateUrl: "dataset/dataView.html",
            controller: "datasetCtrl"/*,
             resolve: {
             loadPlugin: function ($ocLazyLoad) {
             return $ocLazyLoad.load([
             {
             insertBefore: '#loadBefore',
             files: ['lib/jstree/jstree.js', '/lib/jstree/themes/default/style.min.css']
             }
             ]);
             },
             loadDependency: ['$ocLazyLoad',function($ocLazyLoad){
             return $ocLazyLoad.load(
             {

             files: ['lib/ngJsTree/ngJsTree.js'
             ]
             }
             )
             }]
             /!*loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
             return $ocLazyLoad.load([

             ]);
             }],
             loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
             return $ocLazyLoad.load([
             'dataStage/fileManager/fileManager-controller.js'
             ]);
             }],*!/

             }*/
        })
    /*.state('datastage.upload', {
     url: "/upload",
     templateUrl: "/upload.html",
     controller : "uploadController",
     resolve: {
     loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
     return $ocLazyLoad.load([
     'dataStage/upload/upload-controller.js'
     ]);
     }]
     }
     })*//*.state("datastage.upload", {
     url: "/upload/{dir}",
     onEnter: ['$stateParams', '$state', '$modal', 'fileService',function($stateParams, $state, $modal, fileService) {
     $modal.open({
     templateUrl: "dataStage/upload/upload.html",
     resolve: {
     loadController:['$ocLazyLoad',function($ocLazyLoad){
     return $ocLazyLoad.load([
     'dataStage/upload/upload-controller.js'
     ]);
     }]
     },
     controller: 'uploadController'
     }).result.finally(function($stateParams) {
     fileService.getFiles()
     .then(function(data){
     //vm.files = data.files;
     //console.log(data)
     //$scope.vm = vm;
     $state.go('datastage.files',{studyId:$stateParams.studyId, dir:$stateParams.dir})
     })
     }, function () {
     console.info('Modal dismissed at: ' + new Date());
     $state.go('^');
     });

     }]
     });*/

    /*.state('datastage.wizard',{
     url: "/wizard",
     templateUrl: "/import_wizard.html",
     controller: "/wizard/importController"//,
     /!*resolve: {
     loadPlugin: function ($ocLazyLoad) {
     return $ocLazyLoad.load([
     {
     files: ['lib/plugins/iCheck/custom.css','lib/plugins/iCheck/icheck.min.js']
     }
     ]);
     }
     }*!/
     })

     .state('datastage.wizard.step_one', {
     url: '/step_one',
     templateUrl: '/step_one.html'/!*,
     data: { pageTitle: 'Wizard form' }*!/
     })
     .state('wizard.step_two', {
     url: '/step_two',
     templateUrl: '/step_two.html'/!*,
     data: { pageTitle: 'Wizard form' }*!/
     })
     .state('wizard.step_three', {
     url: '/step_three',
     templateUrl: '/step_three.html'/!*,
     data: { pageTitle: 'Wizard form' }*!/
     })*/




}

angular
    .module('eTRIKSdata.export')
    .config(config)
