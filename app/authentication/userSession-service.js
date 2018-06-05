/**
 * Created by iemam on 13/06/2016.
 */

'use strict';
function sessionService(localStorageService) {

    var _userData = null;
    var _accessToken;
    // Instantiate data when service is loaded
    _userData = localStorageService.get('ptmSession.userData');
    _accessToken = localStorageService.get('ptmSession.accessToken');

    var _roles = [];
    var _claims = [];


    this.create = function (userData, token, claims) {
        console.log('Creating new user',userData)
        this.setAccessToken(token);
        this.setUser(userData,['can-manage-95','can-view-drive-95', 'can-load-95', 'can-upload-95']);

        //this.setUserClaims(['admin']);
    };

    this.getAccessToken = function () {
        var data = localStorageService.get('ptmSession.accessToken');
        if (data != null)
            return data.token;
    };

    this.setAccessToken = function (token) {
        localStorageService.set('ptmSession.accessToken', {token: token});
    };

    this.getUser = function () {
        return _userData;
    };

    this.setUser = function (userData,claims) {
        _userData = {};
        _userData.username = userData.username;
        _userData.firstName = userData.firstName;
        _userData.email = userData.name;
        _userData.claims = claims;
        localStorageService.set('ptmSession.userData', {data:_userData});

        return _userData;
    };

    this.setUserClaims = function (claims) {
        _userData.claims = claims;
        localStorageService.set('ptmSession.userClaims', _userData);
    };

    this.getUserClaims = function () {
        _userData = localStorageService.get('ptmSession.userData');
        if(_userData.data)
            return _userData.data.claims;
        return [];
    };

    this.getUsername = function () {
        return _userData.userName;
    };

    this.getUserEmail = function () {
        return _userData.email
    };

    this.getFirstName = function () {
        return _userData.firstName;
    };

    this.destroy = function destroy() {
        localStorageService.remove('ptmSession.accessToken');
        localStorageService.remove('ptmSession.userClaims');
        localStorageService.remove('ptmSession.userData');
        _userData = null;
        _accessToken = null;
    };
}



angular
    .module('bioSpeak.userAuth')
    .service('userSession',['localStorageService', sessionService]);