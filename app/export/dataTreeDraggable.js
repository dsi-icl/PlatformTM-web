/**
 * Created by iemam on 12/07/2016.
 */

function Tree($compile){
    return {
        restrict:'A',
        scope: {
            treeData: "=",
            nclick: "&",
            searchTree: "="
        },
        controller: function($scope){
          //console.log('field in Tree directive',this.ibrahim);
            //this.ibrahim = $scope.ibrahim
            //console.log("Tree scope ",$scope)
            this.outer = function(node){
                // console.log("I'm even here NOW",node)
                this.nclick({node:node});
            }
            //this.adel = this.ibrahim
        },
        controllerAs: 'st',
        bindToController: true,
        template:'<div class="fields-tree" drag-sub-tree ng-repeat="subTree in st.treeData" root-node="subTree" subtreeclick="st.outer(node)" search-tree="st.searchTree"></div>',

        link: function(scope, element, attrs){

        }
    }
}

function subTree($compile){
    return {
        restrict: 'A',
        scope: {
            rootNode: '=',
            subtreeclick: '&',
            searchTree: '='
        },
        //require:'cx',
        // transclude:true,
        controller: function($scope){
            this.outer = function(node) {
                // this.output = term;
                // console.log("I'm here TOO",node);
                //console.log($scope)
                //$scope.$parent.$parent.$parent.fldCtrl.toggleNode();

                this.subtreeclick({node: node});
                //console.log("I'm here TOO",this.subtreeclick);
            };
            //console.log("subTree scope ",$scope)
            //console.log('parent of subtree scope, shuold be = tree scope',$scope.$parent);
        },
        controllerAs: 'st',
        bindToController: true,
        template:'<ul class="list-group ">'+
                    '<li class="list-group-node">'+
                        '<div class="btn-group btn-block">'+
                            '<button class="btn btn-sm node-toggle" data-toggle="collapse" href="#{{st.rootNode.id}}">'+
                                '<span class="caret"></span>'+
                            '</button>'+
                            '<div class="list-group-item-text col-md-11" ' + 'id="grp_{{st.rootNode.id}}"'+ '>'+
                                '<span>{{st.rootNode.text}}</span>'+//' <span>({{group.count}})</span>'+
                            '</div>'+
                        '</div>'+
                        '<ul id="{{st.rootNode.id}}"  class="list-group collapse">'+
                            '<li drag-tree-node class="list-group-item" ng-repeat="node in st.rootNode.children | filter:{text: st.searchTree}" node="node" fields="fields" nodeclick="st.outer(node)"</li>'+
                        '</ul>'+
                    '</li>'+
                 '</ul>',

        link: function(scope, element, attrs){
            
        }

    }
}

function draggableTreeNode($compile){
    return{
        restrict:'A',
        scope:{
            node: '=',
            nodeclick: '&',
            fields: '='
         },
        controller: function($scope){
            this.execute = function(param){
                // console.log("at least I'm here",param)
                this.nodeclick({node: param});
                //console.log($scope.fields)
                //console.log("at least I'm here",this.nodeclick);
            }
        },
        controllerAs: 'dt',
        bindToController: true,
        template:
        '<div>' +
            /*'<button uib-btn-checkbox data-drag="true" data-jqyoui-options="{revert: \'invalid\',helper:\'clone\'}" ng-model="node.field" jqyoui-draggable="{animate:true,placeholder:true,placeholder:\'keep\'}"  id="field_{{node.id}}" ' + ' style="color: #222f3f;" > ' +
                '<i class="fa fa-plus-circle" ></i> <span>{{node.text}}</span>' +
            '</button>'+*/
            '<button  uib-btn-checkbox ng-model="dt.node.selected" ng-click="dt.execute(dt.node)" class="btn btn-primary btn-xs "  style="background-color: #23c6c8;border-radius: 0px; outline: none;" id="field_{{dt.node.id}}" ' + ' > ' +
                '<i ng-if="!dt.node.selected" class="fa fa-plus-circle" ></i><i ng-if="dt.node.selected" class="fa fa-minus-circle" ></i> <span>{{dt.node.text}}</span>' +
             '</button>'+
            // '<cl-option-menu obs="obs" charting-opts="chartingOpts"  class="pull-right"></cl-option-menu>'+
        '</div>',

        link: function (scope, element, attrs) {
            //console.log('clTreeObs scope',scope.chartingOpts)
            //console.log(scope)
            if (angular.isArray(scope.dt.node.children)) {
                //console.log(scope.node)
                $compile('<div drag-sub-tree root-node="dt.node" subtreeclick="dt.execute(node)"></div>')(scope, function(cloned, scope){
                    element.replaceWith(cloned);
                });
            }
        }
    }
}

angular.module('draggableFieldTree',[])
    .directive('draggableTree',[Tree])
    .directive('dragSubTree',[subTree])
    .directive('dragTreeNode',['$compile',draggableTreeNode])


/*
angular.module('bioSpeak.export')
    .directive('dragTreeNode',['$compile',draggableTreeNode])*/
