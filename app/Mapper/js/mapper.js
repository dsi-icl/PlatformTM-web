var mapperApp =angular.module('eTRIKSdata.mapper',['ngDragDrop']);


mapperApp.config(function($stateProvider, $urlRouterProvider) {
    //$urlRouterProvider.when('', 'Mapper/default.html');
    $stateProvider
        // route to show our basic form (/form)
        .state('mapper', {
            url: '/mapper',
            templateUrl: 'Mapper/main.html',
            controller: 'dragAndDropController',
            data:{domainName:''}
        })

            //findings
            .state('mapper.VitalSigns',{
                url:'/VitalSigns',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Vital Signs';
                $scope.shortName ='VS';
            }
            //reslove:{PlaceHolder:function(){return {
            //            domainName:'VitalSigns',
            //            shortName:'VS'};}}

            })
            .state('mapper.DrugAccountability',{
                 url:'/DrugAccountability',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Drug Accountability';
                $scope.shortName ='DA';
            }
            })
            .state('mapper.DeathDetails',{
                url:'/mapper/DeathDetails',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Death Details';
                $scope.shortName ='DD';
            }
            })
            .state('mapper.ECGTestResults',{
                url:'/mapper/ECGTestResults',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='ECG Test Results';
                $scope.shortName ='EG';
            }
            })
            .state('mapper.InclusionExclusionCritierionNotMet',{
                url:'/mapper/InclusionExclusionCritierionNotMet',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Inclusion/Exclusion Critierion Not Met';
                $scope.shortName ='IE';
            }
            })

            .state('mapper.ImmunogenicitySpecimenAccessments',{
                url:'/mapper/ImmunogenicitySpecimenAccessments',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Immunogenicity Specimen Accessments ';
                $scope.shortName ='IS';
            }
            })
            .state('mapper.LaboratoryTestResults',{
                url:'/mapper/LaboratoryTestResults',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Laboratory Test Results';
                $scope.shortName ='LB';
            }
            })
            .state('mapper.MicrobiologySpecimen',{
                url:'/mapper/MicrobiologySpecimen',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Microbiology Specimen';
                $scope.shortName ='MB';
            }
            })
            .state('mapper.MicroscopicFindings',{
                url:'/mapper/MicroscopicFindings',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Microscopic Findings';
                $scope.shortName ='MI';
            }
            })

            .state('mapper.Morphology',{
                url:'/mapper/Morphology',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Morphology';
                $scope.shortName ='MO';
            }
            })
            .state('mapper.MicrobiologySusceptibilityTest',{
                url:'/mapper/MicrobiologySusceptibilityTest',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Microbiology Susceptibility Test';
                $scope.shortName ='MS';
            }
            })
            .state('mapper.PKConcentrations',{
                url:'/mapper/PKConcentrations',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='PK Concentrations';
                $scope.shortName ='PC';
            }
            })
            .state('mapper.PKParameters',{
                url:'/mapper/PKParameters',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='PK Parameters';
                $scope.shortName ='PP';
            }
            })

            .state('mapper.PhysicalExamination',{
                url:'/mapper/PhysicalExamination',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Physical Examination';
                $scope.shortName ='PE';
            }
            })

            .state('mapper.Questionnaires',{
                url:'/mapper/Questionnaires',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Questionnaires';
                $scope.shortName ='QS';
            }
            })

            .state('mapper.ReproductiveSystemFindings',{
                url:'/mapper/ReproductiveSystemFindings',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Reproductive System Findings';
                $scope.shortName ='RP';
            }
            })
            .state('mapper.DiseaseResponse',{
                url:'/mapper/DiseaseResponse',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Disease Response';
                $scope.shortName ='RS';
            }
            })
            .state('mapper.SubjectCharacteristics',{
                url:'/mapper/SubjectCharacteristics',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Subject Characteristics';
                $scope.shortName ='SC';
            }
            })
            .state('mapper.SubjectStatus',{
                url:'/mapper/SubjectStatus',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Subject Status';
                $scope.shortName ='SS';
            }
            })
            .state('mapper.TumorIdentification',{
                url:'/mapper/TumorIdentification',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Tumor Identification';
                $scope.shortName ='TU';
            }
            })
            .state('mapper.TumorResults',{
                url:'/mapper/TumorResults',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Tumor Results';
                $scope.shortName ='TR';
            }
            })

             //Interventions
            .state('mapper.ConcomitantMedications',{
                url:'ConcomitantMedications',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Concomitant Medications';
                $scope.shortName ='CM';
            }
            })
            .state('mapper.ExposureasCollected',{
                url:'ExposureasCollected',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Exposureas Collected';
                $scope.shortName ='EC';
            }
            })
            .state('mapper.Exposure',{
                url:'Exposure',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Exposure';
                $scope.shortName ='EX';
            }
            })
            .state('mapper.SubstanceUse',{
                url:'SubstanceUse',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Substance Use';
                $scope.shortName ='SU';
            }
            })
            .state('mapper.Procedures',{
                url:'Procedures',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Procedures';
                $scope.shortName ='PR';
            }
            })

            //Events
            .state('mapper.AdverseEvents',{
                url:'/mapper/AdverseEvents',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Adverse Events';
                $scope.shortName ='AE';
            }
            })
            .state('mapper.ClinicalEvents',{
                url:'/mapper/ClinicalEvents',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Clinical Events';
                $scope.shortName ='CE';
            }
            })
            .state('mapper.Disposition',{
                url:'/mapper/Disposition',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Disposition';
                $scope.shortName ='DS';
            }
            })
            .state('mapper.ProtocolDeviations',{
                url:'/mapper/ProtocolDeviations',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Protocol Deviations';
                $scope.shortName ='DV';
            }
            })
            .state('mapper.HealthcareEncounters',{
                url:'/mapper/HealthcareEncounters',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Healthcare Encounters';
                $scope.shortName ='HO';
            }
            })
            .state('mapper.MedicalHistory',{
                url:'/mapper/MedicalHistory',
                templateUrl:'Mapper/standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='MedicalHistory';
                $scope.shortName ='MH';
            }
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

    $scope.userUplaodVariables =[
        {selected:false, label:'patient_code'},
        {selected:false, label: 'systolic_blood_pressure'},
        {selected:false, label:'diastolic_blood_pressure'},
        {selected:false, label:'heart_rate'},
        {selected:false, label:'respiratory_rate'},
        {selected:false, label:'visit_date'}
    ];
    //$scope.selectedRow=null;
    //$scope.setClickedRow = function(index){
    //    $scope.selectedRow = index;
    //};
});



mapperApp.controller('dragAndDropController', function($scope, $timeout) {


    //Array to store the mapping variable for identifier
    $scope.identifierList = [];
    // Two dimentional array to store all tests. Each test may contain several variables
    $scope.testsList= [[]];


    $scope.testNumberList=[1];
    $scope.testCount=1;



    $scope.getDomainName = function(){
        return  $scope.domainName;
    };
    $scope.getShortName = function(){
        return  $scope.shortName;
    };

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
    };

    $scope.uploadVariables = [
        { 'title': 'patient_code', 'drag': true },
        { 'title': 'systolic_blood_pressure', 'drag': true },
        { 'title': 'diastolic_blood_pressure', 'drag': true },
        { 'title': 'heart_rate', 'drag': true },
        { 'title': 'respiratory_rate', 'drag': true },
        { 'title': 'visit_date', 'drag': true }
    ];

    $scope.standardData = {
        "indentifiers":[
            {"name":"STUDYID",
                "label":"Study Identifier"
            },
            {"name":"USUBJID",
                "label":"Unique Subject Identifier"},
            {"name":"VSSEQ",
                "label":"Sequence Number"}
        ],

        "obsVariables":[
            //{"name":"TESTCD",
            //    "label":"Test Short Name"},
            //{"name":"TEST",
            //    "label":"Test"},
            {"name":"ORRES",
                "label":"Test Result"}
            //{"name":"VSORRESU",
            //    "label":"Vital Signs Test Result Unit"}
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



//mapperApp.controller('mappingFormSelectionController',function($scope){
//    //$scope.selectedRow=null;
//
//    $scope.mappingStandardsData = {
//        "indentifiers":[
//            {"name":"STUDYID",
//             "label":"Study Identifier"
//            },
//            {"name":"USUBJID",
//             "lable":"Unique Subject Identifier"}
//        ],
//        "obsVariables":[
//            {"name":"TESTCD",
//             "label":"Test Short Name"},
//            {"name":"TEST",
//                "label":"Test"},
//            {"name":"ORRES",
//                "label":"Test Result"},
//            {"name":"ORRESU",
//                "label":"Test Result Unit"}
//        ]
//    }
//$scope.Identifers=[
//    {variableName:"Study Identifier (STUDYID)*:", mappingVar: '< input type="text" class="form-control">' },
//    {variableName:"Domain Abbreviation (DOMAIN)*", mappingVar:'VS'},
//    {variableName:'Unique Subject Identifier (USUBJID)*:', mappingVar:'MappingForm'},
//    {variableName:'Unique Subject Identifier (USUBJID)*:', mappingVar:'MappingForm'},
//
//];

//$scope.topic=[
//    {variableName:'Vital Signs Test Short Name (VSTESTCD)*:', mappingVar:'VSTESTCD' }
//];

//$scope.setClickedRow= function(index){
//    $scope.selectedRow = index;
//};
//
//$scope.removeItem = function removeItem(row) {
//    var index = $scope.Identifers.indexOf(row);
//    if (index !== -1) {
//        $scope.Identifers.splice(index, 1);
//    }
//};
//});



//mapperApp.controller ('addTestController',function($scope){
//    $scope.testCount=0;
//});

//mapperApp.directive("addtestsbutton", function(){
//
//    return {
//        restrict: "E",
//        template: "<button addtests class=\"btn btn-md btn-success \">Add New Test</button>"
//    }
//});
//mapperApp.directive("addtests", function($compile){
//    return function(scope, element, attrs){
//        element.bind("click", function(){
//            scope.testCount++;
//            angular.element(
//                document.getElementById('space-for-newTest')).append(
//                $compile("<div><h4>Test"+scope.testCount+"</h4> <table class=\"table table-bordered \"> <tr> <td class=\"variableNameTd\">Vital Sins Test Name(VSTEST)*: </td> <td><input type=\"text\" class=\"form-control\"></td> </tr> <tr> <td class=\"variableNameTd\">Result or Finding in Original Units (VSORRES)*:</td> <td>Mapping Variable</td> </tr> <tr> <td class=\"variableNameTd\">Original Units (VSORRESU)*:</td> <td><input type=\"text\" class=\"form-control\"></td> </tr> </table></div>")(scope));
//
//            //<table class="table table-bordered ">
//            //    <tr>
//            //    <td class="variableNameTd">Vital Sins Test Name(VSTEST)*: </td>
//            //<td><input type="text" class="form-control"></td>
//            //    </tr>
//            //    <tr>
//            //    <td class="variableNameTd">Result or Finding in Original Units (VSORRES)*:</td>
//            //<td>Mapping Variable</td>
//            //</tr>
//            //<tr>
//            //<td class="variableNameTd">Original Units (VSORRESU)*:</td>
//            //<td><input type="text" class="form-control"></td>
//            //    </tr>
//            //    </table>
//
//        });
//    };
//});


