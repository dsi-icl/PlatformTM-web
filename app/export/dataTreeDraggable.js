/**
 * Created by iemam on 12/07/2016.
 */

function Tree(){
    return {
        restrict:'A',
        replace:true,
        scope: {
            treeData: '='
        },
        template:'<div class="fields-tree" drag-sub-tree ng-repeat="subTree in treeData" root-node="subTree"></div>'
    }
}

function subTree(){
    return {
        restrict: 'A',
        replace: true,
        scope: {
            rootNode:'='
        },
        controller: ['$scope','$attrs','$injector',function($scope,$attrs,$injector) {
            //$scope.chartservice = $injector.get($scope.chartService);
            //$scope.xfService = $injector.get($scope.xfilterService);
        }],
        template:'<ul class="list-group ">'+
                    '<li class="list-group-node">'+
                        '<div class="btn-group btn-block">'+
                            '<button class="btn btn-sm node-toggle" data-toggle="collapse" href="#{{rootNode.id}}">'+
                                '<span class="caret"></span>'+
                            '</button>'+
                            '<div class="list-group-item-text col-md-11" ' + 'id="grp_{{rootNode.id}}"'+ '>'+
                                '<span>{{rootNode.text}}</span>'+//' <span>({{group.count}})</span>'+
                            '</div>'+
                        '</div>'+
                        '<ul id="{{rootNode.id}}"  class="list-group collapse">'+
                            '<li drag-tree-node class="list-group-item" ng-repeat="node in rootNode.children" node="node" </li>'+
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
         node:'='
         },
        scope:true,
        template:
        '<div>' +
            '<button btn-checkbox data-drag="true" data-jqyoui-options="{revert: \'invalid\',helper:\'clone\'}" ng-model="node.field" jqyoui-draggable="{animate:true,placeholder:true,placeholder:\'keep\'}"  id="field_{{node.id}}" ' + ' style="color: #222f3f;" > ' +
                '<i class="fa fa-plus-circle" ></i> <span>{{node.text}}</span>' +
            '</button>'+
            // '<cl-option-menu obs="obs" charting-opts="chartingOpts"  class="pull-right"></cl-option-menu>'+
        '</div>',

        link: function (scope, element, attrs) {
            //console.log('clTreeObs scope',scope.chartingOpts)

            if (angular.isArray(scope.node.children)) {
                //console.log(scope.node)
                $compile('<div drag-sub-tree root-node="node"></div>')(scope, function(cloned, scope){
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
