var mapperApp =angular.module('eTRIKSdata.mapper',['ngDragDrop']);


mapperApp.config(function($stateProvider, $urlRouterProvider) {
    //$urlRouterProvider.when('', 'Mapper/default.html');
    $stateProvider
        // route to show our basic form (/form)
        .state('mapper', {
            url: '/mapper',
            templateUrl: 'Mapper/main.html',
            controller: 'czDropDownMenuController',

        })

            //findings
            .state('mapper.VitalSigns',{
                url:'/VitalSigns',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html'
            })
            .state('mapper.DrugAccountability',{
                 url:'/DrugAccountability',
                templateUrl:'Mapper/standardFormParts/Findings/DrugAccountability.html'
            })
            .state('mapper.DeathDetails',{
                url:'/mapper/DeathDetails',
                templateUrl:'Mapper/standardFormParts/Findings/DeathDetails.html'
            })
            .state('mapper.ECGTestResults',{
                url:'/mapper/ECGTestResults',
                templateUrl:'Mapper/standardFormParts/Findings/ECGTestResults.html'
            })
            .state('mapper.InclusionExclusionCritierionNotMet',{
                url:'/mapper/InclusionExclusionCritierionNotMet',
                templateUrl:'Mapper/standardFormParts/Findings/InclusionExclusionCritierionNotMet.html'
            })

            .state('mapper.ImmunogenicitySpecimenAccessments',{
                url:'/mapper/ImmunogenicitySpecimenAccessments',
                templateUrl:'Mapper/standardFormParts/Findings/ImmunogenicitySpecimenAccessments.html'
            })
            .state('mapper.LaboratoryTestResults',{
                url:'/mapper/LaboratoryTestResults',
                templateUrl:'Mapper/standardFormParts/Findings/LaboratoryTestResults.html'
            })
            .state('mapper.MicrobiologySpecimen',{
                url:'/mapper/MicrobiologySpecimen',
                templateUrl:'Mapper/standardFormParts/Findings/MicrobiologySpecimen.html'
            })
            .state('mapper.MicroscopicFindings',{
                url:'/mapper/MicroscopicFindings',
                templateUrl:'Mapper/standardFormParts/Findings/MicroscopicFindings.html'
            })

            .state('mapper.Morphology',{
                url:'/mapper/Morphology',
                templateUrl:'Mapper/standardFormParts/Findings/Morphology.html'
            })
            .state('mapper.MicrobiologySusceptibilityTest',{
                url:'/mapper/MicrobiologySusceptibilityTest',
                templateUrl:'Mapper/standardFormParts/Findings/MicrobiologySusceptibilityTest.html'
            })
            .state('mapper.PKConcentrations',{
                url:'/mapper/PKConcentrations',
                templateUrl:'Mapper/standardFormParts/Findings/PKConcentrations.html'
            })
            .state('mapper.PKParameters',{
                url:'/mapper/PKParameters',
                templateUrl:'Mapper/standardFormParts/Findings/PKParameters.html'
            })

            .state('mapper.PhysicalExamination',{
                url:'/mapper/PhysicalExamination',
                templateUrl:'Mapper/standardFormParts/Findings/PhysicalExamination.html'
            })

            .state('mapper.Questionnaires',{
                url:'/mapper/Questionnaires',
                templateUrl:'Mapper/standardFormParts/Findings/Questionnaires.html'
            })

            .state('mapper.ReproductiveSystemFindings',{
                url:'/mapper/ReproductiveSystemFindings',
                templateUrl:'Mapper/standardFormParts/Findings/ReproductiveSystemFindings.html'
            })
            .state('mapper.DiseaseResponse',{
                url:'/mapper/DiseaseResponse',
                templateUrl:'Mapper/standardFormParts/Findings/DiseaseResponse.html'
            })
            .state('mapper.SubjectCharacteristics',{
                url:'/mapper/SubjectCharacteristics',
                templateUrl:'Mapper/standardFormParts/Findings/SubjectCharacteristics.html'
            })
            .state('mapper.SubjectStatus',{
                url:'/mapper/SubjectStatus',
                templateUrl:'Mapper/standardFormParts/Findings/SubjectStatus.html'
            })
            .state('mapper.TumorIdentification',{
                url:'/mapper/TumorIdentification',
                templateUrl:'Mapper/standardFormParts/Findings/TumorIdentification.html'
            })
            .state('mapper.TumorResults',{
                url:'/mapper/TumorResults',
                templateUrl:'Mapper/standardFormParts/Findings/TumorResults.html'
            })

             //Interventions
            .state('mapper.ConcomitantMedications',{
                url:'ConcomitantMedications',
                templateUrl:'Mapper/standardFormParts/Interventions/ConcomitantMedications.html'
            })
            .state('mapper.ExposureasCollected',{
                url:'ExposureasCollected',
                templateUrl:'Mapper/standardFormParts/Interventions/ExposureasCollected.html'
            })
            .state('mapper.Exposure',{
                url:'Exposure',
                templateUrl:'Mapper/standardFormParts/Interventions/Exposure.html'
            })
            .state('mapper.SubstanceUse',{
                url:'SubstanceUse',
                templateUrl:'Mapper/standardFormParts/Interventions/SubstanceUse.html'
            })
            .state('mapper.Procedures',{
                url:'Procedures',
                templateUrl:'Mapper/standardFormParts/Interventions/Procedures.html'
            })

            //Events
            .state('mapper.AdverseEvents',{
                url:'/mapper/AdverseEvents',
                templateUrl:'Mapper/standardFormParts/Events/AdverseEvents.html'
            })
            .state('mapper.ClinicalEvents',{
                url:'/mapper/ClinicalEvents',
                templateUrl:'Mapper/standardFormParts/Events/ClinicalEvents.html'
            })
            .state('mapper.Disposition',{
                url:'/mapper/Disposition',
                templateUrl:'Mapper/standardFormParts/Events/Disposition.html'
            })
            .state('mapper.ProtocolDeviations',{
                url:'/mapper/ProtocolDeviations',
                templateUrl:'Mapper/standardFormParts/Events/ProtocolDeviations.html'
            })
            .state('mapper.HealthcareEncounters',{
                url:'/mapper/HealthcareEncounters',
                templateUrl:'Mapper/standardFormParts/Events/HealthcareEncounters.html'
            })
            .state('mapper.MedicalHistory',{
                url:'/mapper/MedicalHistory',
                templateUrl:'Mapper/standardFormParts/Events/MedicalHistory.html'
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


mapperApp.controller('dragAndDropController', function($scope, $timeout) {

    $scope.identifierList = [];
    $scope.testsList= [[]];


    $scope.testNumberList=[1];
    $scope.testCount=1;



    $scope.addNewTest =function(){
        $scope.testCount++;
        $scope.testNumberList.push($scope.testCount);
        $scope.testsList.push([]);
        angular.forEach($scope.standardData.obsVariables, function(val, key) {
            $scope.testsList[$scope.testCount-1].push({});
        });

    };

    $scope.removeNewTest = function(index){
        $scope.testNumberList.splice(index-1,1);
        $scope.testCount--;

    }
    $scope.getTestNumber = function() {
        return $scope.testNumberList;
    };
    $scope.submitData = function(){
        return {
            "testNumber":$scope.testCount,
            "identiferList":$scope.identifierList,
            "testsList":$scope.testsList
        }
    }
    $scope.uploadVariables = [
        { 'title': 'patient_code', 'drag': true },
        { 'title': 'systolic_blood_pressure', 'drag': true },
        { 'title': 'diastolic_blood_pressure', 'drag': true },
        { 'title': 'heart_rate', 'drag': true },
        { 'title': 'respiratory_rate', 'drag': true },
        { 'title': 'visit_date', 'drag': true }
    ];

    $scope.standardData = {
        "domain":"VS",

        "indentifiers":[
            {"name":"STUDYID",
                "label":"Study Identifier"
            },
            {"name":"USUBJID",
                "label":"Unique Subject Identifier"}
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


    };

    angular.forEach($scope.standardData.obsVariables, function(val, key) {
        $scope.identifierList.push({});
    });
    angular.forEach($scope.standardData.obsVariables, function(val, key) {
        $scope.testsList[$scope.testCount-1].push({});
    });

    //$scope.startCallback = function(event, ui, title) {
    //    console.log('You started draggin: ' + title.title);
    //    $scope.draggedTitle = title.title;
    //};
    //
    //$scope.stopCallback = function(event, ui) {
    //
    //};
    //
    //$scope.dragCallback = function(event, ui) {
    //
    //};
    //
    //$scope.dropCallback = function(event, ui) {
    //    console.log('Drop down' , $scope.draggedTitle);
    //};
    //
    //$scope.overCallback = function(event, ui) {
    //
    //};
    //
    //$scope.outCallback = function(event, ui) {
    //  //  console.log('I`m not, hehe');
    //};
});