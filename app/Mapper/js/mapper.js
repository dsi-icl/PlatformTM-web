var mapperApp =angular.module('eTRIKSdata.mapper',[]);


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
    $scope.selectedRow=null;
    $scope.userUplaodVariables =[
        {selected:false, label:'patient_code'},
        {selected:false, label: 'systolic_blood_pressure'},
        {selected:false, label:'diastolic_blood_pressure'},
        {selected:false, label:'heart_rate'},
        {selected:false, label:'respiratory_rate'},
        {selected:false, label:'visit_date'}
    ];
    $scope.setClickedRow = function(index){
        $scope.selectedRow = index;
    };

});

mapperApp.controller('mappingFormSelectionController',function($scope){
    $scope.selectedRow=null;

    $scope.Identifers=[
        {variableName:"Study Identifier (STUDYID)*:", mappingVar:"Replace_Input_Form"},
        {variableName:"Domain Abbreviation (DOMAIN)*", mappingVar:'VS'},
        {variableName:'Unique Subject Identifier (USUBJID)*:', mappingVar:'MappingForm'},
        {variableName:'Unique Subject Identifier (USUBJID)*:', mappingVar:'MappingForm'},

    ];

    $scope.topic=[
        {variableName:'Vital Signs Test Short Name (VSTESTCD)*:', mappingVar:'VSTESTCD' }
    ];

    $scope.setClickedRow= function(index){
        $scope.selectedRow = index;
    };
});


mapperApp.controller ('addTestController',function($scope){
    $scope.testCount=0;
});

mapperApp.directive("addtestsbutton", function(){
    return {
        restrict: "E",
        template: "<button addtests >Add New Test</button>"
    }
});
mapperApp.directive("addtests", function($compile){
    return function(scope, element, attrs){
        element.bind("click", function(){
            scope.testCount++;
            angular.element(
                document.getElementById('space-for-newTest')).append(
                $compile("<div><h4>Test"+scope.testCount+"</h4><ul> <li>Vital Sigs Test Name(VSTEST)*: &nbsp;<input> </li> <li >Result or Finding in Original Units (VSORRES)*:&nbsp;</li> <li >Original Units (VSORRESU)*:&nbsp;<input> </li> </ul> </div>")(scope));

            //<div>
            //<ul class="list-group">
            //    <li class="list-group-item">Vital Sins Test Name(VSTEST)*: &nbsp;<input type="text" class="form-control"> </li>
            //    <li class="list-group-item">Result or Finding in Original Units (VSORRES)*:&nbsp;</li>
            //<li class="list-group-item">Original Units (VSORRESU)*:&nbsp;<input type="text" class="form-control"></li>
            //    </ul>
            //    </div>
        });
    };
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
