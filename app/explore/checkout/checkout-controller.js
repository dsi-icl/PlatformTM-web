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

    vm.downloadDataset = function(datasetId){
            console.log("Dataset with the following ID will be downloaded",datasetId);
            checkoutService.downloadDataset(datasetId)
    //        .then(function(data){
    }
}
angular.module('biospeak.explorer')
    .controller('checkoutCtrl', ['$q','$stateParams','checkoutService','DTColumnBuilder','DTOptionsBuilder',checkoutController]);