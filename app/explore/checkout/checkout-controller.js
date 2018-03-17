/**
 * Created by iemam on 09/12/2016.
 */
'use strict'
function checkoutController($timeout,$stateParams,checkoutService,DTColumnBuilder,DTOptionsBuilder, toaster) {

    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.dtColumns=[];
    vm.datasets = [];

    var projectId = $stateParams.projectId;
    var cartId = $stateParams.cartId;


    checkoutService.getSavedCart(projectId,cartId)
        .then(function(data){
            vm.cart = data.cart
     });

     checkoutService.createCheckoutDatasets(cartId)
         .then(function(datasets){
             vm.datasets = datasets;
             vm.checkout = false
     });


    vm.getDatasetPreview = function(ds){
        ds.show = 'preview'
        checkoutService.getDatasetPreview(ds.id)
            .then(function(tabledata){
                // console.log(tabledata)
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
        var Sec = 8000;
        var interval = setInterval(function(){
            i = i+1;
   //       console.log("Dataset with the following ID will be prepared",ds.id);
            checkoutService.isFileReady(ds.id)
                .then(function(result) {
                        ds.fileStatus = result.outcome1;
                        //console.log("File status is", ds.fileStatus, "for " + ds.type + " dataset")
                });
            if(ds.fileStatus === 2)
            {
              clearInterval(interval);
                toaster.pop({type:'info', body:'dataset'+ds.name+' is ready for download', timeout:8000});
              //console.log(ds.type, "dataset took", i*Sec/60000, "minutes to be prepared" );
              i =0;
            }

       }, Sec);
    };

    vm.downloadDataset = function(ds){
            console.log("Dataset with the following ID will be downloaded",ds.id);
            ds.isDownloading = true;
            checkoutService.downloadDataset(ds.id)
    //        .then(function(data){
    };

    vm.prepareDataset =  function(ds){
        //console.log("Dataset with the following ID will be prepared",ds.id);
        ds.fileStatus = 1;
        vm.fileIsReady(ds);
        checkoutService.prepareDataset(ds.id)
            .then(function(response){
               vm.outcome =response.outcome;
            })

    }

vm.submitForm = function(ds){
    $timeout(function() {
        document.getElementById('but_'+ds.id).click();
    }, 0);
}

    vm.saveDataset = function(ds){

        checkoutService.saveDataset(ds).then(function(accepted){
            if(accepted)
            toaster.pop({type:'success', body:'dataset successfully UPDATED.', timeout:8000});
        })
    }

}
angular.module('biospeak.explorer')
    .controller('checkoutCtrl', ['$timeout','$stateParams','checkoutService','DTColumnBuilder','DTOptionsBuilder','toaster',checkoutController]);