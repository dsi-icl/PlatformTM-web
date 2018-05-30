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

            console.log('here',scope)
            var value = scope.hasPermission.trim();

            var notPermissionFlag = value[0] === '!';

            console.log(value[0],notPermissionFlag)
            if(notPermissionFlag) {
                value = value.slice(1).trim();
            }

            function toggleVisibilityBasedOnPermission() {
                var hasPermission = authService.userHasPermission(value,scope.project);
                console.log(hasPermission)
                if(hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
                    element[0].style.display = 'block';
                }
                else {
                    element[0].style.display = 'none';
                }
            }

            toggleVisibilityBasedOnPermission();
            scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
        }
    };
}

angular
    .module('bioSpeak.userAuth')
    .directive('hasPermission',['authService',hasPermission]);