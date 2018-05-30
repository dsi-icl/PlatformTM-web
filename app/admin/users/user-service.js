'use strict';

function userService($http, $q,ngAppConfig){

    var service = {}
    var serviceBase = ngAppConfig.apiServiceBaseUri;


    var _saveUser = function(user){
        return $http({
            url: serviceBase + 'projects/'+user.projectId+'/users/'+user.id,
            method: 'PUT',
            data: angular.toJson(dataset)
        }).then(
            function (response) {
                return response.status === 202;
            }
        );
    };

    var _removeUser = function(projectId, userId){
        return $http({
            url: serviceBase + 'projects/'+projectId+'/users/'+userId,
            method: 'DELETE',
        }).then(
            function (response) {
                return {
                    files: (response.data)
                }
            }
        )
    }

    var _getProjectUsers = function(projectId){
        return $http({
            url: serviceBase + 'projects/' + projectId+'/users',
            method: 'GET'
        }).then(
            function(response){
                return response.data;
            }
        )
    };

    service.getProjectUsers = _getProjectUsers;
    service.deletUser = _deleteUser;
    service.updateUser = _saveUser;
    return service
}

angular
    .module('bioSpeak.config')
    .factory('userService',['$http', '$q','ngAppConfig', userService])