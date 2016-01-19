/**
 * Created by iemam on 15/10/2015.
 */

function fileDirective(){
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            fileInfo: '=',
            updateFn: '&'
        },
        template:
        '<div class="file-box"> ' +
            '<div class="file"> ' +
                '<a ui-sref="datastage.files({ dir: fileInfo.fileName})">' +

                    '<div ng-hide="fileInfo.isDirectory" class="pull-right" ">'+
                        '<input  icheck type="checkbox" ng-change="updateFn(fileInfo)" ng-model="fileInfo.selected" >' +
                    '</div>'+
                    '<span ng-hide="fileInfo.isDirectory" class="label label-info pull-left" ng-class="{\'label-warning\': fileInfo.state==\'Modified\'}" >{{fileInfo.state}}</span>'+
                    '<span class="corner"></span> ' +
                    '<div class="icon"> ' +

                        '<i ng-hide="fileInfo.isDirectory" class="fa fa-file-text-o"></i> ' +
                        '<i ng-hide="!fileInfo.isDirectory"class="fa fa-folder"></i> '+
                    '</div> ' +
                    '<div class="file-name small">{{fileInfo.fileName}}<br/> ' +
                        '<small>Last modified: {{fileInfo.dateAdded}}</small> ' +
                    '</div> ' +
                '</a> ' +
            '</div> ' +
        '</div>'

    }
}

angular.module('bioSpeak.DataStager')
    .directive('fileDirective',[fileDirective])