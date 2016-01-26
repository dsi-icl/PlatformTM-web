/**
 * Created by iemam on 15/09/2015.
 */
'use strict';

function treeService(){

    var treeService = {}

    var data = [
        { id : 'ajson1', parent : '#', text : 'Simple root node', state: { opened: true} },
        { id : 'ajson2', parent : '#', text : 'Root node 2', state: { opened: true} },
        { id : 'ajson3', parent : 'ajson2', text : 'Child 1', state: { opened: true} },
        { id : 'ajson4', parent : 'ajson2', text : 'Child 2' , state: { opened: true}}
    ]

    treeService.getData = function(){
        return data
    }

    return treeService
}

angular
    .module('eTRIKSdata.export')
    .factory('treeService',treeService)



