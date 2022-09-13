var hasPermission =  function(authService) {
    return {
        restrict: 'A',
        scope: {
            hasPermission: '@',
            project: '='
        },

        link: function(scope, element, attrs) {
            // if(!angular.isString(scope.permission)) {
            //     throw 'hasPermission value must be a string'
            // }

            //console.log('here',scope)
            var value = scope.hasPermission.trim();

            var notPermissionFlag = value[0] === '!';

            console.log(notPermissionFlag)
            if(notPermissionFlag) {
                value = value.slice(1).trim();
            }

            authService.userHasPermission(value,scope.project).then(function(haspermission){
                if(haspermission && !notPermissionFlag || !haspermission && notPermissionFlag) {
                            element[0].style.display = 'initial';
                } else {
                    element[0].style.display = 'none';
                    element[0].remove();
                }

            })
            //scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
        }
    };
}

angular
    .module('bioSpeak.userAuth')
    .directive('hasPermission',['authService',hasPermission]);