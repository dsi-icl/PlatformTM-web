/**
 * Created by iemam on 06/10/2015.
 */

'use strict';
function stepTwoController($scope,$state,$stateParams,wizardService){

    var activityId = $stateParams.activityId;
    var datasetId = $stateParams.datasetId;
    var fileName = $stateParams.file;

    $scope.vm = {
        datasetId: datasetId,
        activityId: activityId,
        fileName: fileName,
        mapSaved: false,
        fileMatched: false,
        dataIsloaded: false

    }
    console.log('Controller Two scope',$scope.vm)
    console.log('inside step two controller',$stateParams)

    wizardService.getOriFileInfo(datasetId)
        .then(function(fileInfo){
            $scope.fileInfo = fileInfo
            $scope.vm.dataIsloaded = true
            //if(!fileInfo.templateMatched)
                return wizardService.getTemplateMap(datasetId)
        })
        .then(function(template) {
            $scope.vm.template = template;
        })

    //$scope.fileMatched = false;
    $scope.topicColumnCount=1;
    /*var storedMap = wizardService.getMap(datasetId)
    console.log("storedMap",storedMap)

    //if(storedMap == null)

    else $scope.vm.template = storedMap;*/

    $scope.dataFile={};
    $scope.dataFile.isNormalized = true;
    $scope.dataFile.templateMatched = false;
    $scope.dataFile.topicColumns=[1]
    $scope.dataFile.topicColumnCount=1;

    //if(!$scope.fileMatched)
    //    wizardService.getFileHeader(datasetId)
    //        .then(function(headers){
    //            $scope.dataFile.columnHeaders = headers;
    //            return wizardService.getTemplateMap(datasetId)
    //        })
    //        .then(function(template){
    //            $scope.vm.template = template;
    //    });





    $scope.addTopicColumn = function(){
        $scope.dataFile.isNormalized = false;
        $scope.dataFile.topicColumnCount++;
        $scope.dataFile.topicColumns.push($scope.dataFile.topicColumnCount)
        $scope.vm.template.topicColumns.push($scope.dataFile.topicColumnCount)
        //
        console.log($scope.dataFile.topicColumns)
    }

    $scope.removeMap = function(variable,index){
        $scope.dataFile.columnHeaders.push(variable.mapToColList[index]);
        /*delete variable.mapToColList[index];
         variable.mapToColList.length-=1;*/
        variable.mapToColList[index] = null;
    }

    $scope.saveMapping = function(){
        wizardService.mapFileToTemplate(datasetId,$scope.vm.template).then(function(success){
            if(success)
                $scope.vm.mapSaved = true;
            console.log("File transformed successfully");

        })
        /*wizardService.saveMap(datasetId,$scope.vm.template)*/
        console.log($scope.vm.template);
        //TODO:check something about the map to see if its been changed

    }

    $scope.goToStep3 = function(){
        //TODO:ADD map to FILE object and save to database
        //go to step 3 with only datasetId and activityId
        //$scope.vm.selectedDataset.dataFile = $scope.$parent.vm.fileSelected
        //wizardService.updateDatasetFile($scope.vm.selectedDataset).then(function(){
        //    $state.go('datastage.wizard.step_two',{ file: $scope.$parent.vm.fileSelected,
        //        activityId: $scope.vm.selectedActivity.id, datasetId: $scope.vm.selectedDataset.id });
        //})

        $state.go('datastage.wizard.step_three',{ activityId: $scope.vm.activityId, datasetId: $scope.vm.datasetId });
    }

    $scope.inputChanged = function(elem){
        //console.log(elem)
    }


    /*$scope.startCallback = function(event, ui, title) {
        console.log('You started draggin: ' + title);
        $scope.draggedTitle = title;
    };
    $scope.stopCallback = function(event, ui) {
        console.log('Why did you stop draggin me?');
    };
    $scope.dragCallback = function(event, ui) {
        console.log('hey, look I`m flying');
    };*/
    $scope.dropCallback = function(event, ui, variable, index) {
        console.log('Before dropCallback',variable)
        variable.mapToStringValueList[index] = null;//$scope.draggedTitle
        console.log('After dropCallback',variable)
        //console.log('hey, you dumped me :-(' , $scope.draggedTitle);
    };
    /*$scope.overCallback = function(event, ui) {
        console.log('Look, I`m over you');
    };
    $scope.outCallback = function(event, ui) {
        console.log('I`m not, hehe');
    };*/

}


angular.module('bioSpeak.import')
    .controller('stepTwoController',['$scope','$state','$stateParams','wizardService',stepTwoController])


