/**
 * Created by iemam on 13/06/2016.
 */
(function (angular) {

    function sessionService($log){

        // Instantiate data when service
        // is loaded
        //this._user = JSON.parse(localStorage.getItem('session.user'));
        //this._accessToken = JSON.parse(localStorage.getItem('session.accessToken'));


        this.create = function (token, userId, userName, userRole) {

            this.token = token;
            this.userId = userId;
            this.userRole = userRole;
            this.userName = userName
        };
        /*this.destroy = function () {
            this.id = null;
            this.userId = null;
            this.userRole = null;
        };*/

        this.getUser = function(){
            return this._user;
        };

        this.setUser = function(user){
            this._user = user;
           // localStorage.setItem('session.user', JSON.stringify(user));
            return this;
        };

        this.getAccessToken = function(){
            return this._accessToken;
        };

        this.setAccessToken = function(token){
            this._accessToken = token;
         //   localStorage.setItem('session.accessToken', token);
            return this;
        };

        /**
         * Destroy session
         */
        this.destroy = function destroy(){
            this.setUser(null);
            this.setAccessToken(null);
        };

    }

    // Inject dependencies
    //sessionService.$inject = ['$log', 'localStorage'];

    // Export
    angular
        .module('bioSpeak.userAuth')
        .service('userSession', sessionService);

})(angular);