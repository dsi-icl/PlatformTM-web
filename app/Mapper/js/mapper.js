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
            .state('mapper.DrugAccountability',{
                 url:'/mapper/VitalSigns',
                templateUrl:'Mapper/VitalSigns.html'
            })
});

mapperApp.controller('czDropDownMenuController',function($scope){
        $scope.findings=[
            {name:'Drug Accountability (DA)', link:".DrugAccountability"},
            {name:'Death Details (DD)', link:".DeathDetails"},
            {name:'ECG Test Results (EG)', link:".ECGTestResults"},
            {name:'Inclusion/Exclusion Critierion Not Met (IE)', link:".InclusionExclusionCritierionNotMet"},
            {name:'Immunogenicity Specimen Accessments (IS)', link:".ImmunogenicitySpecimenAccessments"},
            {name:'Laboratory Test Results (LB)', link:".LaboratoryTestResults"},
            {name:'Microbiology Specimen (MB)', link:".MicrobiologySpecimen"},
            {name:'Microscopic Findings (MI)', link:".MicroscopicFindings"},
            {name:'Morphology (MO)', link:".Morphology"},
            {name:'Microbiology Susceptibility Test (MS)', link:".MicrobiologySusceptibilityTest"},
            {name:'PK Concentrations (PC)', link:".PKConcentrations"},
            {name:'PK Parameters (PP)', link:".PKParameters"},
            {name:'Physical Examination (PE)', link:".PhysicalExamination"},
            {name:'Questionnaires (QS)', link:".Questionnaires"},
            {name:'Reproductive System Findings (RP)', link:".ReproductiveSystemFindings"},
            {name:'Disease Response (RS)', link:".DiseaseResponse"},
            {name:'Subject Characteristics (SC)', link:".SubjectCharacteristics"},
            {name:'Subject Status (SS)', link:".SubjectStatus"},
            {name:'Tumor Identification (TU)', link:".TumorIdentification"},
            {name:'Tumor Results (TR)', link:".TumorResults"},
            {name:'Vital Signs (VS)', link:".VitalSigns"}
        ];
        $scope.interventions=[
            {name:'Concomitant Medications (CM)', link:".ConcomitantMedications"},
            {name:'Exposure as Collected (EC)', link:".ExposureasCollected"},
            {name:'Exposure (EX)', link:".Exposure"},
            {name:'Substance Use (SU)', link:".SubstanceUse"},
            {name:'Procedures (PR)', link:".Procedures"}
        ];
        $scope.events=[
            {name:'Adverse Events (AE)', link:".AdverseEvents"},
            {name:'Clinical Events (CE)', link:".ClinicalEvents"},
            {name:'Disposition (DS)', link:".Disposition"},
            {name:'Protocol Deviations (DV)', link:".ProtocolDeviations"},
            {name:'Healthcare Encounters (HO)', link:".HealthcareEncounters"},
            {name:'Medical History (MH)', link:".MedicalHistory"}

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

    $scope.mappingStandardsData = {
        "domain":"VS",
        "indentifiers":[
            {"name":"STUDYID",
             "label":"Study Identifier"
            },
            {"name":"USUBJID",
             "lable":"Unique Subject Identifier"}
        ],
        "obsVariables":[
            {"name":"VSTESTCD",
             "label":"Vital Signs Test Short Name"},
            {"name":"VSTEST",
                "label":"Vital Signs Test"},
            {"name":"VSORRES",
                "label":"Vital Signs Test Result"},
            {"name":"VSORRESU",
                "label":"Vital Signs Test Result Unit"}
        ]
    }
    $scope.Identifers=[
        {variableName:"Study Identifier (STUDYID)*:", mappingVar: '< input type="text" class="form-control">' },
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

    $scope.removeItem = function removeItem(row) {
        var index = $scope.Identifers.indexOf(row);
        if (index !== -1) {
            $scope.Identifers.splice(index, 1);
        }
    };
    $scope.matchVar = function(){

    }
});


mapperApp.controller ('addTestController',function($scope){
    $scope.testCount=0;
});

mapperApp.directive("addtestsbutton", function(){

    return {
        restrict: "E",
        template: "<button addtests class=\"btn btn-md btn-success \">Add New Test</button>"
    }
});
mapperApp.directive("addtests", function($compile){
    return function(scope, element, attrs){
        element.bind("click", function(){
            scope.testCount++;
            angular.element(
                document.getElementById('space-for-newTest')).append(
                $compile("<div><h4>Test"+scope.testCount+"</h4> <table class=\"table table-bordered \"> <tr> <td class=\"variableNameTd\">Vital Sins Test Name(VSTEST)*: </td> <td><input type=\"text\" class=\"form-control\"></td> </tr> <tr> <td class=\"variableNameTd\">Result or Finding in Original Units (VSORRES)*:</td> <td>Mapping Variable</td> </tr> <tr> <td class=\"variableNameTd\">Original Units (VSORRESU)*:</td> <td><input type=\"text\" class=\"form-control\"></td> </tr> </table></div>")(scope));

            //<table class="table table-bordered ">
            //    <tr>
            //    <td class="variableNameTd">Vital Sins Test Name(VSTEST)*: </td>
            //<td><input type="text" class="form-control"></td>
            //    </tr>
            //    <tr>
            //    <td class="variableNameTd">Result or Finding in Original Units (VSORRES)*:</td>
            //<td>Mapping Variable</td>
            //</tr>
            //<tr>
            //<td class="variableNameTd">Original Units (VSORRESU)*:</td>
            //<td><input type="text" class="form-control"></td>
            //    </tr>
            //    </table>

        });
    };
});


