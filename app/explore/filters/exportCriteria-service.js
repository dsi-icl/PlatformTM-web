/**
 * Created by iemam on 21/10/2014.
 */
angular.module('eTRIKSdata.exporter',[])
    .factory('ExportCriteria',function($rootScope){

        var criteriaService = {}

        var criteria = {
            showSubjSection: true,
            showClinicalSection: true,
            showAssaySection: true,
            subjCriteria:[],
            clinicCriteria: [],
            assayGrps:{}
        }

        criteriaService.criteria = criteria
        var x=5

        criteriaService.addAssayGrp = function(assayType){

            var assayGroup = {}
            assayGroup.name = assayType
            assayGroup.assayCriteria = {}

            criteria.assayGrps[assayType] = assayGroup;
        }

        criteriaService.addCriterion = function(item,assayGroup){
            var cr = {}
            cr.value = item
            cr.filter = '(All values)'
            criteria.assayGrps[assayGroup].assayCriteria[item] = cr;
        }

        criteriaService.addFilter = function(filter,item,assayGroup){
            var cr = {}
            cr.value = item
            cr.filter = 'ibrrr'

            //console.log(criteria.assayGrps[assayGroup])
            //console.log(cr)
                criteria.showSubjSection=false
            delete criteria.assayGrps[assayGroup]
            x++
            $rootScope.$broadcast('filterApplied', x);
        }

        return criteriaService;

    })
