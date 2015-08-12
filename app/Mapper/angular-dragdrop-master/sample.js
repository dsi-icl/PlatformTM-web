var App = angular.module('drag-and-drop', ['ngDragDrop']);

App.controller('oneCtrl', function($scope, $timeout) {
  //$scope.images = [{'thumb': '1.png'},{'thumb': '2.png'},{'thumb': '3.png'},{'thumb': '4.png'}]
  $scope.identifierList = [];
  $scope.testsList=[];


  $scope.testNumberList=[1];
  $scope.testCount=1;

//////
    $scope.twoDimentionList=[{'testId':1, 'testDropList':[]}];

  $scope.addNewTest =function(){
    $scope.testCount++;
    $scope.testNumberList.push($scope.testCount);
      ///////////
      $scope.twoDimentionList.testId.push($scope.testCount);

  };
    ///////////////////
    angular.forEach($scope.standardData, function(val, key) {
        $scope.twoDimentionList.testId.push({});
    });
    $scope.getNewTestDropLit = function(index){

    };

    /////////////////
  $scope.removeNewTest = function(index){
      $scope.testNumberList.splice(index-1,1);

          $scope.testCount--;

  }
   $scope.getTestNumber = function() {
    return $scope.testNumberList;
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

angular.forEach($scope.standardData, function(val, key) {
    $scope.identifierList.push({});
  });
angular.forEach($scope.standardData, function(val, key) {
    $scope.testsList.push({});
  });

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

