var mapperApp =angular.module('eTRIKSdata.mapper',[]);

  //demoApp.config(['$routeProvider',
  //    function($routeProvider) {
  //        $routeProvider
  //                .when('/',{
  //                    templateUrl:'default.html'
  //                })
  //                .when('/VistalSigns',{
  //                    templateUrl:'VitalSigns.html'
  //                })
  //                .otherwise({redirectTo: '/'});
  //    }]);


mapperApp.config(function($stateProvider, $urlRouterProvider) {
    //$urlRouterProvider.when('', 'Mapper/default.html');
    $stateProvider
        // route to show our basic form (/form)
        .state('mapper', {
            url: '/mapper',
            templateUrl: 'Mapper/main.html',
            controller: 'czDropDownMenuController'
        })
            .state('mapper.VitalSigns',{
                url:'/mapper/VitalSigns',
                templateUrl:'Mapper/VitalSigns.html'
            })
});

mapperApp.controller('czDropDownMenuController',function($scope){
        $scope.findings=[
            {name:'Drug Accountability (DA)', link:"#/DrugAccountability"},
            {name:'Death Details (DD)', link:"#/DeathDetails"},
            {name:'ECG Test Results (EG)', link:""},
            {name:'Inclusion/Exclusion Critierion Not Met (IE)', link:""},
            {name:'Immunogenicity Specimen Accessments (IS)', link:""},
            {name:'Laboratory Test Results (LB)', link:""},
            {name:'Microbiology Specimen (MB)', link:""},
            {name:'Microscopic Findings (MI)', link:""},
            {name:'Morphology (MO)', link:""},
            {name:'Microbiology Susceptibility Test (MS)', link:""},
            {name:'PK Concentrations (PC)', link:""},
            {name:'PK Parameters (PP)', link:""},
            {name:'Physical Examination (PE)', link:""},
            {name:'Questionnaires (QS)', link:""},
            {name:'Reproductive System Findings (RP)', link:""},
            {name:'Disease Response (RS)', link:""},
            {name:'Subject Characteristics (SC)', link:""},
            {name:'Subject Status (SS)', link:""},
            {name:'Tumor Identification (TU)', link:"TumorIdentification"},
            {name:'Tumor Results (TR)', link:"TumorResults"},
            {name:'Vital Signs (VS)', link:".VitalSigns"}
        ];
        $scope.interventions=[
            {name:'Concomitant Medications (CM)', link:"#/ConcomitantMedications"},
            {name:'Exposure as Collected (EC)', link:"#/ExposureasCollected"},
            {name:'Exposure (EX)', link:"#/Exposure (EX)"},
            {name:'Substance Use (SU)', link:"#/SubstanceUse"},
            {name:'Procedures (PR)', link:"#/Procedures"}
        ];
        $scope.events=[
            {name:'Adverse Events (AE)', link:"#/AdverseEvents"},
            {name:'Clinical Events (CE)', link:"#/ClinicalEvents"},
            {name:'Disposition (DS)', link:"#/Disposition"},
            {name:'Protocol Deviations (DV)', link:"#/ProtocolDeviations"},
            {name:'Healthcare Encounters (HO)', link:"#/HealthcareEncounters"},
            {name:'Medical History (MH)', link:"#/MedicalHistory"}

        ];
    });

mapperApp.controller('czUserUploadsController', function($scope){
    $scope.userUplaodVariables =[
        'patient_code',
        'systolic_blood_pressure',
        'diastolic_blood_pressure',
        'heart_rate',
        'respiratory_rate',
        'visit_date'
    ];
});




    //demoApp.controller('domainsViewController',function($scope, $route, $routeParams, $location){
    //    $scope.$route = $route;
    //    $scope.$location = $location;
    //    $scope.$routeParams = $routeParams;
    //});
    //demoApp.config(function($routeProvider, $locationProvider){
    //    $routeProvider
    //            .when('/',{
    //                templateUrl:'default.html'
    //            })
    //            .when('/VistalSigns',{
    //                templateUrl:'VitalSigns.html'
    //            })
    //            .otherwise({redirectTo: '/'});
    //});
