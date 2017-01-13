/**
 * Created by iemam on 09/12/2016.
 */
'use strict'
function checkoutController($q,$stateParams,checkoutService,DTColumnBuilder,DTOptionsBuilder) {

    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.dtColumns=[];

    var projectId = $stateParams.projectId;
    var cartId = $stateParams.cartId;

    // console.log(projectId,cartId);

    checkoutService.getSavedCart(projectId,cartId)
     .then(function(data){
        console.log(data)
         vm.cart = data.cart

     });

     checkoutService.createCheckoutDatasets(cartId)
     .then(function(datasets){
         //console.log(datasets)
        vm.datasets = datasets;
     });


    vm.getDatasetPreview = function(ds){
        ds.show = 'preview'
        checkoutService.getDatasetPreview(ds.id)
            .then(function(tabledata){
                console.log(tabledata)
                ds.dtColumns=[]
                tabledata.columns.forEach(function(col){
                    ds.dtColumns.push(DTColumnBuilder.newColumn(col.columnName,col.label));
                });
                ds.previewReady = true;
                ds.dtOptions = DTOptionsBuilder.fromFnPromise(function(){

                    return checkoutService.getDatasetsContent(ds.id)
                })
                ds.show = 'preview'
            })
    }
    //added part Start ********************************************************
    vm.downloadDataset = function(datasetId){
            checkoutService.downloadDataset(datasetId)
    //        .then(function(data){
    //            $state.go('datastage.files',{dir:$scope.vm.dir});
    //        })
    }
    //added part finish ********************************************************

    // vm.datasets = [];
    // var dataset = {};
    // dataset.type = "PHENO";
    // dataset.name = "Pheno Data"
    // dataset.fields = [];
    // var field = {};
    // field.name = "Age" ;
    // field.colHeader = "AGE";
    // field.isNumeric = true;
    //
    // var filter = {}
    // filter.update = function(slider){
    //     filter.from = slider.fromNumber;
    //     filter.to = slider.toNumber;
    //     //filter.field.isFiltered = true;
    //     //_updateField(filter.field);
    //     $scope.$apply();
    // };
    // filter.ionSliderOptions = {
    //     min: 25,
    //     max: 79,
    //     //from: 36,
    //     //to: 50,
    //     type: 'double',
    //     postfix: ' '+'years',//filter.unit,
    //     maxPostfix: "+",
    //     prettify: true,
    //     grid: true,
    //     onChange: filter.update
    // };
    //
    // field.filter = filter
    // dataset.fields.push(field)
    //
    // var field2 = {}
    // field2.name = "ARM"
    // field2.colHeader = "ARM"
    // field2.isNumeric = false;
    // field2.filter = {}
    // field2.valueSet = ['FLUAD','PLACEBO','VARILIX','VACCINE']
    // field2.filter.filterValues=[];
    //
    // dataset.fields.push(field2)
    //
    // vm.datasets.push(dataset);
    // var dataset2 = {}
    // dataset2.type = "OMICS"
    // dataset2.name = "Transcriptomic Data"
    // vm.datasets.push(dataset2);


}
angular.module('biospeak.explorer')
    .controller('checkoutCtrl', ['$q','$stateParams','checkoutService','DTColumnBuilder','DTOptionsBuilder',checkoutController]);