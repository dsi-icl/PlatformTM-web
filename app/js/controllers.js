'use strict';

/* Controllers */

angular
    .module('myApp.controllers',[])

    .controller('SubjectsCtrl', ['$scope',function($scope) {
        $scope.title = "Subjects";
        $scope.subjChars = ['Age','Gender','Ethnic Origin','Marital Status','Education','Occupation','Paternal Ethnicity','Maternal Ethnicity'];
        $scope.toggleSCPlot = function(sc){
            this.scSelected = !this.scSelected;
//            $scope.togglePlot = sc;
            var chartId = "subject-" + sc + "-plot";

//            if ($(this).hasClass("selected")) {
//                $(this).removeClass("selected");
//                $("#" + chartId + "-container").remove();
//            } else {
//                $(this).addClass("selected");
                etriks.function.addChartContainer("subject", sc, chartId);
                etriks.function.addGraph(chartId, "data/data.json", "pie");
//            }
        }
//        $scope.isSelected = function(sc){
//            return $scope.selected === sc;
//        }
    }])

    .controller('ClinicalCtrl', [function() {

    }])

    .controller('AssayCtrl', [function() {

    }])

    .controller('pieCtrl',['$scope',function($scope){
        $scope.exampleData = [
                	{ key: "male", y: 74 },
                     { key: "Female", y: 48 }
//                     { key: "Three", y: 9 },
//                     { key: "Four", y: 7 },
//                     { key: "Five", y: 4 },
//                     { key: "Six", y: 3 },
//                     { key: "Seven", y: 9 }
                 ];
        $scope.xFunction = function(){
            return function(d) {
                return d.key;
            };
        }
        $scope.yFunction = function(){
            return function(d) {
                return d.y;
            };
        }

        $scope.descriptionFunction = function(){
            return function(d){
                return d.key;
            }
        }

        var colorArray = ['#39C2D7','#2C3E50','#39b3d7','#35495E'];
        $scope.colorFunction = function() {
            return function(d, i) {
                return colorArray[i];
            };
        }
    }])

    .controller('subjPlotsCtrl',['$scope', function($scope){

    }]);