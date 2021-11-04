/**
 * Created by iemam on 03/07/2014.
 */
angular.module('bioSpeak.config',['ui.bootstrap','ngResource']);


var managerConfig = function($stateProvider){

    $stateProvider
        .state('project.manager', {
            abstract : true,
            url: "/admin",
            templateUrl:"admin/project/adminContent.html",
            // data: {
            //     requiresAuthentication: true,
            //     permissions: ["can-manage"]
            //     authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
            // },
            resolve: {
                loadAngularXEditable: ['$ocLazyLoad', '$injector', function ($ocLazyLoad, $injector) {
                    return $ocLazyLoad.load({
                        files:['lib/plugins/angular-xeditable/js/xeditable.min.js']
                    }).then(function () {
                        var editableThemes = $injector.get('editableThemes');
                        editableThemes.bs3.inputClass = 'input-sm';
                        editableThemes.bs3.buttonsClass = 'btn-sm';
                        var editableOptions = $injector.get('editableOptions');
                        editableOptions.theme = 'bs3';
                    });
                }],
                loadCSS:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        {
                            serie:true,
                            insertBefore: '#load_css_before',
                            files:['lib/plugins/ui-select/css/select.css',
                                'lib/plugins/angular-ui-select/css/select.css',
                                'lib/plugins/angular-xeditable/css/xeditable.css',
                                'lib/plugins/ngSweetAlert/css/sweetalert.css']
                        }
                    ])
                }],
                loadDependency: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie:true,
                            files: ['lib/plugins/iCheck/custom.css', 'lib/plugins/iCheck/icheck.min.js',
                                'lib/plugins/footable/js/footable.all.min.js', 'lib/plugins/footable/css/footable.core.css',
                                'lib/plugins/ui-select/js/select.min.js',
                                'lib/plugins/angular-ui-select/js/select.min.js',
                                'lib/plugins/ngSweetAlert/js/sweetalert.min.js',
                                'lib/plugins/ngSweetAlert/js/ngSweetAlert.min.js',
                                'lib/plugins/angular-file-upload/angular-file-upload.min.js'
                            ]
                        },
                        {
                            name: 'ui.footable',
                            files: ['lib/plugins/footable/js/angular-footable.js']
                        }
                    ]);
                }
            }
        })
        .state('project.manager.main', {
            url: "/main",
            views:{
                '':{
                    templateUrl: 'admin/project/project.html',
                    controller:'ProjectCtrl as vm',
                    resolve: {


                        loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                            console.log("loading project service");
                            return $ocLazyLoad.load('admin/project/project-service.js');
                        }],
                        loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                            console.log("loading project controller");
                            return $ocLazyLoad.load('admin/project/project-controller.js');
                        }]
                    }
                }
            }
        })

        .state('define',{
            abstract:true,
            url:'/define/{projectId}',
            templateUrl:'layout/noNavContent.html',
            controller: "defineController as vm",
            resolve: {
                loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('admin/define-controller.js');
                }]
            }
        })
        .state('define.activity',{
            url:'/activities/{activityId}',
            templateUrl: "admin/activities/activityConfig.html",
            controller: "ActivityConfigCtrl as vm",
            resolve: {
                loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    console.log("loading service");
                    return $ocLazyLoad.load('admin/activities/activityConfig-service.js');
                }],
                loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                    console.log("loading controller");
                    return $ocLazyLoad.load('admin/activities/activityConfig-controller.js');
                }]
            }
        })
        .state('define.assay',{
            url:'/assays/{assayId}',
            templateUrl: "admin/activities/assayConfig.html",
            controller: "AssayConfigCtrl as vm",
            resolve: {
                loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    console.log("loading service");
                    return $ocLazyLoad.load('admin/activities/assayConfig-service.js');
                }],
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load(['admin/activities/assayConfig-controller.js'
                    ]);
                }]
            }
        })
        .state('define.subject',{
            url:'/subjects/{activityId}',
            templateUrl: "admin/subjects/subjectConfig.html",
            controller: "SubjectConfigCtrl as vm",
            resolve: {
                loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    console.log("loading service");
                    return $ocLazyLoad.load('admin/subjects/subjectConfig-service.js');
                }],
                loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                    console.log("loading controller");
                    return $ocLazyLoad.load('admin/subjects/subjectConfig-controller.js');
                }]
            }
        })
        .state('define.study',{
            url:'/studies/{studyId}',
            templateUrl: "admin/studies/study.html",
            controller: "StudyCtrl as vm",
            resolve: {
                loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    console.log("loading service");
                    return $ocLazyLoad.load('admin/studies/study-service.js');
                }],
                loadDirectives:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load(['admin/studies/study-plan-directives.js'
                    ]);
                }],
                loadController:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load(['admin/studies/study-controller.js'
                    ]);
                }]
            }
        })
}

angular.module('bioSpeak.config').config(managerConfig);




