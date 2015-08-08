var App = angular.module('drag-and-drop', ['ngDragDrop']);

App.controller('userUploadVariablesCtr', function($scope, $timeout) {
  
  $scope.identifierList = [];
  angular.forEach(function(val, key) {
    $scope.identifierList.push({});
  });


  $scope.userUploadVariables =[
    { 'title': 'patient_code', 'drag': true },
    { 'title': 'systolic_blood_pressure', 'drag': true },
    { 'title': 'diastolic_blood_pressure', 'drag': true },
    { 'title': 'heart_rate', 'drag': true },
    { 'title': 'respiratory_rate', 'drag': true },
    { 'title': 'visit_date', 'drag': true }
  ];

  $scope.startCallback = function(event, ui, title) {
    console.log('You started draggin: ' + title.title);
    $scope.draggedTitle = title.title;
  };

  $scope.stopCallback = function(event, ui) {
    console.log('Why did you stop draggin me?');
  };

  $scope.dragCallback = function(event, ui) {
    console.log('hey, look I`m flying');
  };

  $scope.dropCallback = function(event, ui) {
    console.log('hey, you dumped me :-(' , $scope.draggedTitle);
  };

  $scope.overCallback = function(event, ui) {
    console.log('Look, I`m over you');
  };

  $scope.outCallback = function(event, ui) {
    console.log('I`m not, hehe');
  };
});



App.controller('mappingFormSelectionController',function($scope){
    
    $scope.standardsData = {
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
});