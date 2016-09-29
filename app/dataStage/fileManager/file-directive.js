/**
 * Created by iemam on 15/10/2015.
 */

function fileDirective(){
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            fileInfo: '=',
            dblClickFn: '&',
            clickFn: '&'
        },
        template:
        '<div class="file-box outer"> ' +
            '<div class="file"> ' +
                '<a ng-dblclick="dblClickFn(fileInfo)" ng-click="clickFn(fileInfo)" ng-class="{ \'active\': fileInfo.selected }">' +

                    // '<div ng-hide="fileInfo.isDirectory" class="pull-right" ">'+
                    //     '<input  icheck type="checkbox" ng-change="updateFn(fileInfo)" ng-model="fileInfo.selected" >' +
                    // '</div>'+
                     '<span ng-hide="fileInfo.isDirectory" style="position:fixed" class="label pull-left" ng-class="{\'label-warning\': fileInfo.state==\'UPDATED\'}" >{{fileInfo.state}}</span>'+
                    '<span class="corner"></span> ' +
                    '<div class="icon"> ' +

                        '<i ng-hide="fileInfo.isDirectory" class="fa fa-file-text-o"></i> ' +
                        '<i ng-hide="!fileInfo.isDirectory"class="fa fa-folder"></i> '+
                    '</div> ' +
                    '<div class="file-name ">{{fileInfo.fileName}}<br/> ' +
                        '<small>Last modified: {{fileInfo.dateLastModified}}</small> ' +
                    '</div> ' +
                '</a> ' +
            '</div> ' +
        '</div>'

    }
}
//ui-sref="datastage.files({ dir: fileInfo.fileName})"
angular.module('bioSpeak.DataStager')
    .directive('fileDirective',[fileDirective])