/**
 * Created by iemam on 09/12/2016.
 */
'use strict'
function checkoutController($timeout,$stateParams,checkoutService,DTColumnBuilder,DTOptionsBuilder, toaster, $uibModal) {

    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.dtColumns=[];
    vm.datasets = [];
    vm.saving = false;
    vm.dataset ={};
    vm.checkoutResults = [];

    var projectId = $stateParams.projectId;
    var cartId = $stateParams.cartId;


    checkoutService.getSavedCart(projectId,cartId)
        .then(function(data){
            vm.cart = data.cart
     });

     checkoutService.createCheckoutDatasets(cartId)
         .then(function(result){
             console.log(result)
             vm.checkoutResults = result;
             vm.checkout = false
     });


    var i = 0;
    vm.fileIsReady=  function(ds){
        var Sec = 5000;
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

    };

    vm.openSaveForm = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'explore/checkout/saveDatasetForm.html',
            controller: function ($uibModalInstance) {
                var dsModalCtrl = this;
                dsModalCtrl.ok = function () {
                    //var ad = new checkoutService.getAnalysisDatasetResource();
                    var ad = {};
                    ad.name = dsModalCtrl.ds.name;
                    ad.description = dsModalCtrl.ds.description;
                    ad.queryId = cartId;
                    ad.files = vm.checkoutResults;
                    vm.saveDataset(ad);
                    // ad.$save(function(response) {
                    //     //console.log("Project created",response);
                    //     toaster.pop('success', "SUCCESS", ad.name," was successfully CREATED.",8000);
                    //
                    // });

                    $uibModalInstance.close();

                };

                dsModalCtrl.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                    //vm.dontSaveProject();

                };
            },
            controllerAs: 'dsModalCtrl'
        });
    }

    vm.saveDataset = function(ad){

        if(ad.name && ad.description){
            checkoutService.saveDataset(ad).then(function(accepted){
                if(accepted)
                toaster.pop({type:'success', body:'dataset successfully UPDATED.', timeout:8000});
            })
            // ad.$save(function(response) {
            //     //console.log("Project created",response);
            //     toaster.pop('success', "SUCCESS", ad.name," was successfully CREATED.",8000);
            //     $stateParams.projectId = response.id;
            //     $state.transitionTo($state.current, $stateParams, {
            //         reload: true,
            //         inherit: false,
            //         notify: true
            //     });
            // });
        }
        else{
            //toaster.pop('error',"", "Please enter the project 'Name' and 'Title' before creating the project.",8000);
            toaster.pop({
                type: 'error',
                title: '',
                body: "Please enter the project 'Name' and 'Title' before creating the project.",
                showCloseButton: true
            });
        }


    }

}
angular.module('biospeak.explorer')
    .controller('checkoutCtrl', ['$timeout','$stateParams','checkoutService','toaster','$uibModal',checkoutController]);