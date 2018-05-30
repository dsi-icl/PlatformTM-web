/**
 * Created by iemam on 17/10/2014.
 */

'use strict'
function XFlinker(ClinicalXF,SubjectXF,AssayXF){

    var XFilterLinker = {};

    var _currSubjectIds = {};
    _currSubjectIds['subject'] = [];
    _currSubjectIds['clinical'] = [];
    _currSubjectIds['assay'] = [];

    var _subjectFilters = {};
    _subjectFilters['subjectXF'] = [];
    _subjectFilters['clinicalXF'] = [];
    _subjectFilters['assayXF'] = [];


    XFilterLinker.reApplySubjectFilter = function(XFname){

        console.debug("===REAPPLYING PREVIOUS SUBJECT FILTERS===");
        var _filteredSubjIds;

        //ADDING A CHART TO SUBJECT, APPLY IDS FROM CLINICAL (ASSAY filters are not currently propagated)
        if(XFname === SubjectXF.getXFname() && _subjectFilters['clinicalXF'].length > 0){

            console.debug('FILTERS EXIST IN CLINICAL PANEL', _subjectFilters['clinicalXF']);
            console.debug('APPLYING FILTER TO A SUBJECT CHART');

            _filteredSubjIds = _retainAll(_currSubjectIds['clinical'],[]);
            SubjectXF.resetSubjectFilter();
            SubjectXF.filterBySubjects(_filteredSubjIds);
            console.debug('filteredIds',_filteredSubjIds)
            //TODO: AssayCF.getCurrentSubjectIds and APPLY to SubjCf.filterBySubjects
        }

        //ADDING A CHART TO CLINICAL, APPLY IDS FROM SUBJECT (ASSAY filters are not currently propagated)
        if(XFname  === ClinicalXF.getXFname() && _subjectFilters['subjectXF'].length > 0){

            console.debug('FILTERS EXIST IN SUBJECT PANEL', _subjectFilters['subjectXF']);
            console.debug('APPLYING FILTER TO A SUBJECT CHART');

            _filteredSubjIds = _retainAll(_currSubjectIds['subject'],[]);
            ClinicalXF.resetSubjectFilter();
            ClinicalXF.filterBySubjects(_filteredSubjIds);
            //TODO: AssayCF.getCurrentSubjectIds and APPLY to ClinicalCf.filterBySubjects
        }

        //ADDING A CHART TO ASSAY, APPLY IDS FROM SUBJECT AND CLINICAL
        if(XFname === AssayXF.getXFname() && (_subjectFilters['subjectXF'].length > 0 || _subjectFilters['clinicalXF'].length > 0)){

            console.debug('FILTERS EXIST IN SUBJECT PANEL', _subjectFilters['subjectXF'], 'OR IN CLINICAL PANEL', _subjectFilters['clinicalXF']);
            console.debug('APPLYING FILTER TO A ASSAY CHART');

            _filteredSubjIds = _retainAll(_currSubjectIds['subject'],_currSubjectIds['clinical']);
            AssayXF.resetSubjectFilter();
            AssayXF.filterBySubjects(_filteredSubjIds);
        }

         console.debug("===END OF REAPPLYING PREVIOUS SUBJECT FILTERS===")
    };

    XFilterLinker.propagateFilter = function(xfFiltered, chartName, filter){

        console.debug("====PROPAGATING FILTER====")
        console.debug('FILTER BEFORE:',_subjectFilters)

        var subjectIds;

        if(xfFiltered.getXFname() === 'SubjCf'){

            //RESET current Filtered Subject Ids
            _currSubjectIds['subject'] = [];

            if(filter === null)
                _subjectFilters['subjectXF'] = _removeFilterHandler(_subjectFilters['subjectXF'],chartName)
            else
                _addFilterHandler(_subjectFilters['subjectXF'],chartName,filter);

            //GET FILTERED SUBJECTS IDS AS A RESULT OF FILTERS APPLIED TO CLINICAL CHARTS (I.E. CLINICAL XF)
            subjectIds = xfFiltered.getCurrentSubjectIds();
            if(subjectIds.length === 0)return;

            //SubjectXF.resetSubjectFilter();
            AssayXF.resetSubjectFilter();
            ClinicalXF.resetSubjectFilter();

            //NO filters so no application of subject filters
            if(_subjectFilters['subjectXF'].length === 0 && _subjectFilters['clinicalXF'].length === 0)
                return;

            if(_subjectFilters['subjectXF'].length > 0){
                _currSubjectIds['subject'] = subjectIds;
                //subject charts filters --> clinical charts
                ClinicalXF.filterBySubjects(_currSubjectIds['subject']);
            }




            //subj charts filter AND clinical charts filters --> assay charts
            var combinedIds = _retainAll(_currSubjectIds['subject'],_currSubjectIds['clinical']);
            AssayXF.filterBySubjects(combinedIds);

            console.debug("_subjectFilters after propagation",_subjectFilters)
        }

        else if(xfFiltered.getXFname()  === 'ClinicalCf'){

            //RESET current Filtered Subject Ids
            _currSubjectIds['clinical'] = [];


            //UPDATING current list of filters applied to all clinical charts
            // console.log('filter is', filter)
            if(filter === null)
                _subjectFilters['clinicalXF'] = _removeFilterHandler(_subjectFilters['clinicalXF'],chartName);
            else
                _addFilterHandler(_subjectFilters['clinicalXF'],chartName,filter);


            //GET FILTERED SUBJECTS IDS AS A RESULT OF FILTERS APPLIED TO CLINICAL CHARTS (I.E. CLINICAL XF)
            subjectIds = xfFiltered.getCurrentSubjectIds();
             console.log('subjectIds after filter',subjectIds.length);
            if(subjectIds.length === 0)return;

            SubjectXF.resetSubjectFilter();
            AssayXF.resetSubjectFilter();
            ClinicalXF.resetSubjectFilter();

            //NO filters so no application of subject filters
            if(_subjectFilters['clinicalXF'].length === 0 && _subjectFilters['subjectXF'].length === 0)
                return;


            if(_subjectFilters['clinicalXF'].length > 0) {
                _currSubjectIds['clinical'] = subjectIds;
                //propagate to subject (assay filters are not propagated so intersection needed)
                SubjectXF.filterBySubjects(_currSubjectIds['clinical']);
            }


            //Filters in clinical AND subject panels are propagated to AssayXF
            var combinedIds = _retainAll(_currSubjectIds['clinical'],_currSubjectIds['subject']);
            AssayXF.filterBySubjects(combinedIds);

            //ClinicalXF.resetSubjectFilter();
            //ClinicalXF.syncFilters(combinedIds,chartName);

            return;
        }

        /*       else if(xfFiltered.getXFname() == 'AssayCf'){
                //console.log("assays filtered");
                SubjCf.resetSubjectFilter();
                ClinicalCf.resetSubjectFilter();

                if(filteredIds.length == 0)return;

                SubjCf.filterBySubjects(filteredIds);
                ClinicalCf.filterBySubjects(filteredIds);
                }*/

        console.debug('FILTER AFTER:',_subjectFilters)
        console.debug("====END OF PROPAGATING FILTER====")
    };

    XFilterLinker.resetAll = function(){
        _subjectFilters['subjectXF'] = [];
        _subjectFilters['clinicalXF'] = [];
        _subjectFilters['assayXF'] = [];

        SubjectXF.resetAll();
        ClinicalXF.resetAll();
        AssayXF.resetAll();
    };

    XFilterLinker.initAll = function(){
        SubjectXF.init();
        ClinicalXF.init();
        //AssayXF.init();

        _subjectFilters['subjectXF'] = [];
        _subjectFilters['clinicalXF'] = [];
        _subjectFilters['assayXF'] = [];
    }


    /**
     * PRIVATE METHODS
     */

    var _removeFilterHandler = function (filters, chartName) {
        console.debug('removing filter by chart',chartName)
        console.debug('filters before', filters[0])
        for (var i = 0; i < filters.length; i++) {
            if (filters[i].chart <= chartName && filters[i].chart >= chartName) {
                filters.splice(i, 1);
                console.debug('filters after', filters[i])
                break;
            }

        }

        return filters;
    };

    var _hasFilterHandler = function (filters, chartName, filter) {
        //if (filter === null || typeof(filter) === 'undefined') {
        //    return filters.length > 0;
        //}
        return filters.some(function (f) {
            /* console.log(f.filter, filter)
             console.log(f.filter.some(function(i){return filter.indexOf(i) == -1}));*/

            return chartName <= f.chart && chartName >= f.chart  //TODO: add check on filteredIds
        });
    };

    var _addFilterHandler = function (filters, chartName, filter) {
        if(_hasFilterHandler(filters,chartName, filter))
            _removeFilterHandler(filters,chartName)
        console.log('ADDING FILTER BY CHART', chartName, filter)
        filters.push({chart:chartName,filter:filter});
        //else console.log('FILTER BY CHART ALREADY ADDED')
        return filters;
    };

    var _retainAll = function(set1,set2){
        //console.log(set1,set2);

        if(set1.length ===0 && set2.length ===0)
            return [];

        // if(set1.length !==0)
        //     return set1;
        //
        // if(set2.length !==0)
        //     return set2;

        if(set1.length ===0)
            return set2;

        if(set2.length ===0)
            return set1;

        var intersect = set1;
        intersect = intersect.filter(function(n){
            return set2.indexOf(n) !== -1
        });
        console.log('intersect',intersect);
        return intersect;
    };

    var _retailAll__ = function (arr1,arr2){
        console.log('new retailall')
        var array3 = [];
        console.log(arr1,arr2);
        angular.forEach(arr2, function(value,index){
            angular.forEach(arr3, function(object,index1){
                if(value === object){
                    array3.push(object)
                }
            })
        });
        console.log(array3);
        return array3
    }

    function getIntersect(arr1, arr2) {
        console.log('getIntersect')
        console.log(arr1,arr2);
        var r = [], o = {}, l = arr2.length, i, v;
        for (i = 0; i < l; i++) {
            o[arr2[i]] = true;
        }
        l = arr1.length;
        for (i = 0; i < l; i++) {
            v = arr1[i];
            if (v in o) {
                r.push(v);
            }
        }
        return r;
    }

    var _retainAll_ = function(filters){

        var intersect = filters[0].filter;
        console.debug(intersect)

        for(var i=1; i<filters.length; i++){
            intersect = intersect.filter(function(n){
                return filters[i].filter.indexOf(n) !== -1
            })
        }
        return intersect;
    }

    return XFilterLinker;
}

angular.module('biospeak.dcPlots')
    .factory('XFilterLinker',['ClinicalXF','SubjectXF','AssayXF','$injector',XFlinker])