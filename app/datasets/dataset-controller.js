'use strict';
function DatasetCtrl($scope, $state, $filter, $stateParams, datasetService) {
    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.datasetId = $stateParams.datasetId;

    vm.ddTypes = [
        { value: "SubjectDatasetDescriptor", text: 'Subject Dataset Descriptor' },
        { value: "ObservationDatasetDescriptor", text: 'Observation Dataset Descriptor' },
        { value: "FeatureDatasetDescriptor", text: 'Feature Dataset Descriptor' },
        { value: "SampleDatasetDescriptor", text: 'Biosample Dataset Descriptor' }
    ];

    vm.fieldTypes = [
        { value: "0", text: 'Identifier Field' },
        { value: "1", text: 'Designation Field' },
        { value: "2", text: 'Classifier Field' },
        { value: "3", text: 'Property Field' },
        { value: "4", text: 'Property Value Field' },
        { value: "5", text: 'Time Series Field' }
    ];

    vm.showDDtype = function () {
        var selected = [];
        if (vm.descriptor)
            if (vm.descriptor.datasetType) {
                selected = $filter('filter')(vm.ddTypes, { value: vm.descriptor.datasetType });
            }
        return selected.length ? selected[0].text : 'Not set';
    };

    vm.showFieldType = function (field) {

        let fieldType = field.fieldType;
        const result = fieldType.replace(/[A-Z]/g, ' $&').trim();
        return result
    };



    vm.plotSwitchClicked = function (var1, var2) {
        //plot functionality....
    }

    datasetService.getPrimaryDatasetResource.get({datasetId:vm.datasetId, projectId:vm.projectId},function(data){
        console.log("clinical dataset", data)
        vm.dataset = data;
    })



    datasetService.getDescriptorResource.getDescriptorView({
        descriptorId: "1cbae5d8-64b9-455c-8cbb-9d284164ec7d"
    }, function (response) {
        console.log("retrieved new descriptor", response)
        vm.descriptor = response;
    })


}

angular.module('bioSpeak.datasets')
    .controller('DatasetCtrl', ['$scope', '$state', '$filter', '$stateParams', 'datasetService', DatasetCtrl]);