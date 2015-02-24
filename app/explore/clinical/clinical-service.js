/**
 * Created by iemam on 19/02/2015.
 */
angular.module('biospeak.clinical',[])
    .factory('ClinicalDataResource',function($resource){
        /*return $resource('/api/datasets/:datasetId')*/
        return $resource('../data/domain-tree.json');
    })