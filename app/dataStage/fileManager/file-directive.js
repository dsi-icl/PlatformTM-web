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
        template: '<div class="file-box"> ' +
        '<div class="file"> ' +
        '<a href="">' +
        '<div class="pull-right" ">'+
        '<input icheck type="checkbox" ng-change="updateFn(fileInfo)" ng-model="fileInfo.selected" ></div>'+
        '<span class="corner"></span> ' +
        '<div class="icon"> ' +
        '<i class="fa fa-file-text-o"></i> ' +
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