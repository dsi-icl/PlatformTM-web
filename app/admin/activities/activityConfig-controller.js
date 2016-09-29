/**
 * Created by iemam on 17/05/2016.
 */

'use strict';
function ActivityConfigCtrl($scope, $state, $stateParams, ActivityResource, DatasetResource,$timeout,SweetAlert,toaster,$q) {
    var vm = this;
    vm.projectId = $stateParams.projectId;
    //vm.scope = $scope

    //console.log("Activity Controller requested")
    //console.log($stateParams.activityId);

    vm.selectTemplate = false;
    vm.showFieldInfo = false;
    vm.creatingCfield = false;

    vm.dataTypes = ['STRING','INTEGER','DOUBLE','DATETIME'];
    vm.varTypes = ['SUBMITTED','DERIVED']

    vm.dictTerms = ['MILD','SEVERE','MODERATE'];
    vm.expressionList = [];

    vm.computeFunctions = [
        {name:'AVERAGE',type:'Aggregation',
            template:[
                {val:'AVG',type:'syntax'},
                {val:'',type:'var'},
                {val:'GROUP BY ',type:'syntax'},
                {vars:[],type:'multivar'}]
        },
        {name:'SUM',type:'Aggregation',
            template:[
                {val:'SUM',type:'syntax'},
                {val:'',type:'var'},
                {val:'GROUP BY ',type:'syntax'},
                {val:'',type:'var'}]},
        {name:'MAX',type:'Aggregation',
            template:[
                {val:'MAX',type:'syntax'},
                {val:'',type:'var'},
                {val:'GROUP BY ',type:'syntax'},
                {val:'',type:'var'}]},
        {name:'MIN',type:'Aggregation',
            template:[
                {val:'MIN',type:'syntax'},
                {val:'',type:'var'},
                {val:'GROUP BY ',type:'syntax'},
                {val:'',type:'var'}]},
        {name:'CASE',type:'Transform',
            template:[
                {val:'CASE',type:'syntax'},
                {val:'',type:'var'},
                {val:'WHEN',type:'syntax'},
                {val:'',type:'param'},
                {val:'THEN',type:'syntax'},
                {val:'',type:'param'},
                {val:'END',type:'syntax'}]
        },
        {name:'CASE (WHEN)',type:'Transform',
            template:[
                {val:'WHEN',type:'syntax'},
                {val:'',type:'param'},
                {val:'THEN',type:'syntax'},
                {val:'',type:'param'}]}


    ];

    var activity;
    if($stateParams.activityId==0){
        console.log("New Activity");
        activity = new ActivityResource();
        activity.projectId = $stateParams.projectId;//"Study1"
        activity.isNew = true;
        activity.status = "New";
        activity.datasets = [];
        activity.activityId = 0;

        vm.activity = activity;
        DatasetResource.query(function(response){
            console.log("querying for datasets", response)
            vm.clinicaldomains = response;
        })
    }
    else if($stateParams.activityId){
        ActivityResource.get({ activityId: $stateParams.activityId }, function(response){
            activity = response;
            activity.isNew = false;

            vm.activity = activity

            $timeout(function(){
                //console.log($('#ds_template_tbl'))
                $('#ds_template_tbl').trigger('footable_redraw');
            }, 1000);

            DatasetResource.query(function(response){
                vm.clinicaldomains = response;
            })

        });
    }



    vm.createNewCfield = function(){
        if(vm.creatingCfield){
            //vm.creatingCfield = true;
            vm.cField = {}

            vm.cField.isSelected = true;
            vm.cField.isRequired = false;
            vm.cField.isCurated = false;
            //vm.cField.dictionaryName = null;
            //cField.order
        }
        //console.log(vm.cField);
        vm.showFieldInfo = false;
        vm.selField = {};

    };

    vm.cancelAddVariableToDS = function(){
        vm.creatingCfield = false;
        vm.clearExpression();
        console.log('canceling cfield')

    };

    vm.addVariableToDS = function(){

        if(vm.cField.name){
            vm.cField.accession = 'V-COMP-' + vm.activity.datasets[0].code+'-'+vm.cField.name;

            //console.log(vm.activity)
            //if(!vm.cField.usingFunc)

            this.finalizeExpression()

            vm.cField.expressionList = vm.expressionList
            console.log(vm.cField)

            if(vm.cField.varType == 'DERIVED')
                vm.cField.isComputed = true;
            vm.activity.datasets[0].variables.push(vm.cField)
            toaster.pop('success', "SUCCESS", vm.cField.name+" has been added to dataset template successfully.",8000);
            vm.cField = {};
            vm.expressionList = [];
        }
        else {
                toaster.warning("Warning","No variable added to dataset template")
        }

        
    };




    /**
     * Called when a variable is being dragged to prepare the equivalent expression element to be
     * added to the expression
     * @param event
     * @param ui
     * @param field
     */
    vm.prepareEE = function(event,ui,variable){
        //console.log(field)
        var e = {}
        e.temp = {}
        e.temp.val = variable.accession
        e.temp.type = 'var'
        e.temp.display = variable.name

        e.val = variable.accession
        e.type = 'var'
        e.display = variable.name
        console.log('Preparing expression element',e);
        variable.ee = e;
    }

    vm.addOperator = function(op){
        if(!vm.cField.usingFunc){
            var e = {}
            e.val = op
            e.type = 'op'
            e.display = op
            vm.expressionList.push(e);
            this.updateEEseq();
        }
    }

    vm.addFunc = function(func){
        vm.showExpressionDiv = true;
        if(!vm.cField) vm.cField = {};
        vm.cField.usingFunc = true;

        if(func.name == 'CASE (WHEN)'){
            var currExpression = vm.expressionList;
            if(currExpression[0].val == 'CASE'){
                var pos = currExpression.length-1
                var newcasewhen =  $.extend( true, [], func.template );
                var result = currExpression.slice( 0, pos ).concat( newcasewhen).concat( currExpression.slice( pos ) );
                //console.log('after adding new case when',result);
                //console.log('after temp',temp);
                for(var i=0; i<result.length;i++){
                    result[i].seq = i;
                }
                vm.expressionList = result;
            }
        }
        else{
            vm.expressionList = $.extend( true, [], func.template );
            this.updateEEseq()
        }
    };




    vm.beforeDropOverExpressionDiv = function(){
        var deferred = $q.defer();
        // console.log('before term drop OVER DIV');
        if (!vm.cField.usingFunc) {
            deferred.resolve();
            console.log('DROPPING OVER DIV')
        } else {
            deferred.reject();
            console.log('REJECT DROPPING OVER DIV')
        }
        return deferred.promise;
    }

    vm.beforeDropOverExpressionElement = function(event,ui,e) {
        var deferred = $q.defer();
        var draggedType = ui.draggable.context.attributes['ng-model'].value
        // console.log('dropping over ',e.type,' and dragging ',draggedType, ' usingFunc is ',vm.cField.usingFunc)
        if ((e.type == 'param' && draggedType == 'term' || e.type=='var' && draggedType =='var'  || (e.type=='multivar' && draggedType =='var')) ) {
            deferred.resolve();
            console.log('DROPPING',e)
        } else {
            deferred.reject();
            console.log('REJECT DROPPING')
        }
        return deferred.promise;
    };

    vm.varDropped = function(event, ui, variable){
        console.log(variable)


        
         if(!variable.vars){
        //     variable.val = [];
        //     // var e = {}
        //     // e.val = variable.vars[variable.vars.length-1].val
        //     // vm.expressionList.push(e);
        //     angular.forEach(variable.vars,function(v){
        //
        //         variable.val.push(v.val)
        //     })
        //     //variable.val = variable.vars;
        // }
        // else{
            variable.val = variable.temp.val
            variable.display = variable.temp.display
        }
        console.log('after',variable)
        console.log(vm.expressionList)
    }

    vm.finalizeExpression = function(){
        var j;
        for(var i=0; i< vm.expressionList.length;i++) {
            if(vm.expressionList[i].vars){
                j=i
                angular.forEach(vm.expressionList[i].vars,function(v){
                    var e = {}
                    e.val = v.val
                    e.type = v.type
                    vm.expressionList.push(e);
                })
            }
        }
        if(j)
            vm.expressionList.splice(j, 1);

        console.log(vm.expressionList)
    }


    // vm.dropFunction = function(event, ui, element) {
    //     //element.val = element.sourceVar.accession
    //     //element.display = element.sourceVar.name
    //     console.log(event,ui,element);
    //
    //
    // };

    vm.updateEEseq = function(){

        for(var i=0; i< vm.expressionList.length;i++) {
            vm.expressionList[i].seq = i;
        }
        console.log('Expression List AFTER updating sequence ' ,vm.expressionList)
    }

    vm.dropTerm = function(event, ui, element) {
        element.val = element.param;
        element.display = element.param;
    };

    vm.inputChanged = function(e){
        console.log(e)
        e.name = e.val
    }






    vm.clearExpression = function(){
        vm.expressionList = [];
        vm.cField.expressionList = {};
        vm.cField.usingFunc = false;
        console.log('clearing')
    }

    vm.fieldInfo = function(field){
        vm.showFieldInfo = true;
        vm.selField = field;
    };





    vm.saveActivity = function() {
        if (vm.activity.name != null && vm.activity.name != ''){

            if (vm.activity.isNew) {
                vm.activity.$save(function (response) {
                    toaster.pop('success', "SUCCESS", vm.activity.name," was successfully CREATED.",8000);
                    $state.transitionTo('admin.project', $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                });
            }
            else {
                vm.activity.$update(function (response) {
                    toaster.pop('success', "SUCCESS", vm.activity.name," was successfully UPDATED.",8000);
                    $state.transitionTo('admin.project', $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                });
            }
        }else
            toaster.warning("Warning","Activity has no name!")
    };

    vm.dontSaveActivity = function(){
        vm.activity = {}
        $state.go('admin.project',{
            projectId: vm.projectId}
        );
    }

    vm.selectTemplate = function(dataset){
        console.log("CHOSE TEAMPLATE", dataset.name)
            dataset.isNew = true;
            dataset.activityId = $stateParams.activityId;
            vm.activity.datasets.push(dataset);

        $timeout(function(){
            vm.activeTabIndex = (vm.activity.datasets.length - 1);
        });
            //console.log(vm.activity)

            $timeout(function(){
                //console.log($('#ds_template_tbl'))
                $('#ds_template_tbl').trigger('footable_redraw');
            });

            //vm.selectTemplate=false;
        // })
    };

    vm.showDSvars = function(domain) {
        vm.showDS = domain;
    }


    vm.tabSelected = function(ds){
        vm.currDS = ds;
    };

    vm.deleteDS = function(){

        SweetAlert.swal({
                title: "Are you sure you want to delete "+vm.currDS.name+"?",
                text: "All associated data files will be deleted and all loaded data attached to this data will be permanently deleted! ",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: false,
                closeOnCancel: false },
            function (isConfirm) {
                if (isConfirm) {
                    var pos;
                    for(var i=0; i< vm.activity.datasets.length;i++) {
                        console.log(i)
                        if(vm.currDS.id == vm.activity.datasets[i].id){
                            console.log(i, 'for',vm.currDS.name)
                            pos = i;
                            break;
                        }
                    }
                    vm.activity.datasets.splice(pos,1)
                    SweetAlert.swal("Deleted!", "Dataset "+vm.currDS.name+" has been deleted.", "success");
                } else {
                    SweetAlert.swal("Cancelled", "", "error");
                }
            });
    }
}

angular.module('bioSpeak.config')
    .controller('ActivityConfigCtrl',['$scope', '$state','$stateParams','ActivityResource','DatasetResource','$timeout','SweetAlert','toaster','$q',ActivityConfigCtrl]);
