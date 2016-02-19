/**
 * Created by iemam on 06/10/2015.
 */

'use strict';
function stepTwoController($scope,$state,$stateParams,wizardService){

    var activityId = $stateParams.activityId;
    var datasetId = $stateParams.datasetId;
    var fileName = $stateParams.file;
    var fileId = $stateParams.fileId;
    var standardFileId;

    $scope.vm = {
        datasetId: datasetId,
        activityId: activityId,
        //fileName: fileName,
        mapSaved: false,
        fileMatched: false,
        dataIsloaded: false

    }
    console.log('Controller Two scope',$scope.vm)
    console.log('inside step two controller',$stateParams)

    wizardService.getOriFileInfo(datasetId,fileId)
        .then(function(fileInfo){
            $scope.fileInfo = fileInfo
            if($scope.fileInfo.isStandard)  standardFileId = fileInfo.dataFileId;
            $scope.vm.dataIsloaded = true
            if(!fileInfo.templateMatched)
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
        //TODO: should return the id of the standard datafile created to pass on to next step
        wizardService.mapFileToTemplate(datasetId,fileId,$scope.vm.template).then(function(fileID){
            //if(success)
                $scope.vm.mapSaved = true;
            standardFileId = fileID;
            console.log("File transformed successfully", fileID);

        })
        /*wizardService.saveMap(datasetId,$scope.vm.template)*/
        console.log($scope.vm.template);
        //TODO:check something about the map to see if its been changed

    }
    $scope.cancel = function(){
        $state.go('datastage.files',{studyId:$stateParams.studyId, dir:''})
    }

    $scope.goToStep3 = function(){
        //TODO:ADD map to FILE object and save to database
        //go to step 3 with only datasetId and activityId
        //$scope.vm.selectedDataset.dataFile = $scope.$parent.vm.fileSelected
        //wizardService.updateDatasetFile($scope.vm.selectedDataset).then(function(){
        //    $state.go('datastage.wizard.step_two',{ file: $scope.$parent.vm.fileSelected,
        //        activityId: $scope.vm.selectedActivity.id, datasetId: $scope.vm.selectedDataset.id });
        //})

        $state.go('datastage.wizard.step_three',{ activityId: $scope.vm.activityId, datasetId: $scope.vm.datasetId, standardFileId: standardFileId });
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


