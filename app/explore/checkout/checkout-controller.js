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


    var i = 0;
    vm.fileIsReady=  function(ds){
        var Sec = 2000;
      var interval = setInterval(function(){
          i = i+1;
   //         console.log("Dataset with the following ID will be prepared",ds.id);
            checkoutService.isFileReady(ds.id)
                .then(function(result) {
                        ds.fileIsReady = result.outcome1;
                        console.log("File status is", ds.fileIsReady, "for " + ds.type + " dataset")
                                        })
          if(ds.fileIsReady == 2)
          {
              clearInterval(interval);
              console.log(ds.type, "dataset took", i*Sec/60000, "minutes to be prepared" );
              i =0;
          }

       }, Sec);
    }

    vm.downloadDataset = function(ds){
            console.log("Dataset with the following ID will be downloaded",ds.id);
            ds.isDownloading = true;
            checkoutService.downloadDataset(ds.id)
    //        .then(function(data){
    }

    vm.prepareDataset =  function(ds){
        console.log("Dataset with the following ID will be prepared",ds.id);
        vm.fileIsReady(ds);
        checkoutService.prepareDataset(ds.id)
            .then(function(response){
               vm.outcome =response.outcome;
                console.log("statusText for file preparation is ", vm.outcome );

            })

    }



}
angular.module('biospeak.explorer')
    .controller('checkoutCtrl', ['$q','$stateParams','checkoutService','DTColumnBuilder','DTOptionsBuilder',checkoutController]);