/**
 * Created by iemam on 17/10/2014.
 */

'use strict'
function XFlinker(ClinicalXF,SubjectXF,AssayXF,$injector){

    var XFilterLinker = {}

    var subjectSubjectIds, subjectXFisFiltered;
    var clinicalSubjectIds, clinicalXFsubjIsFiltered;

    var _currSubjectIds = {}
    _currSubjectIds['subject'] = [];
    _currSubjectIds['clinical'] = [];
    _currSubjectIds['assay'] = [];


    var _subjectFilters = {}

    _subjectFilters['subjectXF'] = [];
    _subjectFilters['clinicalXF'] = [];
    _subjectFilters['assayXF'] = [];

    var _removeFilterHandler = function (filters, chartName) {
        console.log('removing filter by chart',chartName)
        console.log('filters before', filters[0])
        for (var i = 0; i < filters.length; i++) {
            if (filters[i].chart <= chartName && filters[i].chart >= chartName) {
                filters.splice(i, 1);
                console.log('filters after', filters[i])
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
        //console.log('ADDING FILTER BY CHART', chartName)
        filters.push({chart:chartName,filter:filter});
        //else console.log('FILTER BY CHART ALREADY ADDED')
        return filters;
    };

    var _retainAll = function(filters){

        var intersect = filters[0].filter;
        console.log(intersect)

        for(var i=1; i<filters.length; i++){
            intersect = intersect.filter(function(n){
                return filters[i].filter.indexOf(n) !== -1
            })
        }
console.log(intersect)
        return intersect;
    }

    var _retainAll2 = function(set1,set2){

        if(set1.length ===0 && set2.length ===0)
            return [];

        if(set1.length !==0)
            return set1;

        if(set2.length !==0)
            return set2;

        var intersect = set1;
        intersect = intersect.filter(function(n){
            return set2.filter.indexOf(n) !== -1

        //for(var i=1; i<filters.length; i++){

         //   })
        })
        //console.log(intersect)
        return intersect;
    }

    XFilterLinker.reApplySubjectFilter = function(xfFiltered){

        console.debug("===REAPPLYING PREVIOUS SUBJECT FILTERS===",_subjectFilters['subjectXF'])

        //ADDING A CHART TO CLINICAL, APPLY IDS FROM SUBJECT AND ASSAY
        if(xfFiltered.getXFname()  === 'ClinicalCf' && _subjectFilters['clinicalXF'].length > 0){
            // console.log('SUBJECT AND ASSAY TO CLINICAL')
            //REAPPLY subjectFilteredIds and AssaySubjectFiltered Ids

            var filteredIds = _retainAll(_subjectFilters['clinicalXF']);
            ClinicalXF.resetSubjectFilter();
            ClinicalXF.filterBySubjects(filteredIds);

            //TODO: AssayCF.getCurrentSubjectIds and APPLY to ClinicalCf.filterBySubjects

        }

        //ADDING A CHART TO SUBJECT, APPLY IDS FROM CLINICAL AND ASSAY
        if(xfFiltered.getXFname()  === 'SubjCf' && _subjectFilters['subjectXF'].length > 0){
             console.log('CLINICAL AND ASSAY TO SUBJECT')

            var filteredIds = _retainAll(_subjectFilters['subjectXF']);
            SubjectXF.resetSubjectFilter();
            SubjectXF.filterBySubjects(filteredIds);
            console.log('filteredIds',filteredIds)

            //TODO: AssayCF.getCurrentSubjectIds and APPLY to SubjCf.filterBySubjects

        }

        //ADDING A CHART TO ASSAY, APPLY IDS FROM SUBJECT AND CLINICAL
        if(xfFiltered.getXFname()  === 'AssayCf' && _subjectFilters['assayXF'].length > 0){
            // console.log('CLINICAL AND SUBJECT TO ASSAY')
            var filteredIds = _retainAll(_subjectFilters['assayXF']);
            AssayXF.resetSubjectFilter();
            AssayXF.filterBySubjects(filteredIds);
        }

         console.debug("===END OF REAPPLYING PREVIOUS SUBJECT FILTERS===")
    }

    XFilterLinker.propagateFilter = function(xfFiltered, chartName, filter){

        console.debug("====PROPAGATING FILTER====")

        var subjectIds;

        if(xfFiltered.getXFname() === 'SubjCf'){

            //CHCK IF ANY SUBJECT PLOTS ARE FILTERED TO AVOID APPLYING A FAKE SUBJECT DIMENSIONS
            //FILTER WHICH WOULD BE JUST ALL SUBJECTS
            subjectIds = xfFiltered.getCurrentSubjectIds();
            if(subjectIds.length === 0)return;

            console.debug("SUBJECT TO CLINICAL AND ASSAY");
            console.debug("current subject ids",subjectIds);
            console.debug("_subjectFilters before propagation",_subjectFilters)
            ClinicalXF.resetSubjectFilter();
            AssayXF.resetSubjectFilter();

            _currSubjectIds['subject'] = subjectIds;

            //Only subject filters are propagated to clinical XF (NOT ASSAYS)
            ClinicalXF.filterBySubjects(subjectIds);

            //Filters in clinical AND subject panels are propagated to AssayXF
            var combinedIds = _retainAll2(subjectIds,_currSubjectIds['clinical']);
            // console.log('combinedIds',combinedIds);
            AssayXF.filterBySubjects(combinedIds);

            /*if(filter === null){
                _subjectFilters['clinicalXF'] = _removeFilterHandler(_subjectFilters['clinicalXF'],chartName)
                _subjectFilters['assayXF'] = _removeFilterHandler(_subjectFilters['assayXF'],chartName)
            }

            else{
                _addFilterHandler(_subjectFilters['clinicalXF'],chartName,subjectIds);
                _addFilterHandler(_subjectFilters['assayXF'],chartName,subjectIds);
            }*/
            // console.debug("_subjectFilters after propagation",_subjectFilters)


            /*if(_subjectFilters['clinicalXF'].length > 0){
                subjectIds  = _retainAll(_subjectFilters['clinicalXF']);
                console.log('Filters to propagate to clinical', subjectIds.length);
                ClinicalXF.filterBySubjects(subjectIds);
            }

            if(_subjectFilters['assayXF'].length > 0){
                subjectIds = _retainAll(_subjectFilters['assayXF'])
                 console.log('Filters to propagate to assays', subjectIds.length)
                AssayXF.filterBySubjects(subjectIds);
            }*/

            // console.log(_subjectFilters)

        }

        else if(xfFiltered.getXFname()  === 'ClinicalCf'){

            ClinicalXF.resetSubjectFilter();
            subjectIds = xfFiltered.getCurrentSubjectIds();

            if(subjectIds.length === 0)return;

            console.debug("CLINICAL TO SUBJECT AND ASSAY");
            //console.log("filtered subjected ids",subjectIds)
            SubjectXF.resetSubjectFilter();
            AssayXF.resetSubjectFilter();

            _currSubjectIds['clinical'] = subjectIds;

            //clinical filters are propagated only to subject XF (NOT ASSAYS)
            SubjectXF.filterBySubjects(subjectIds);

            //Filters in clinical AND subject panels are propagated to AssayXF
            var combinedIds = _retainAll2(subjectIds,_currSubjectIds['subject']);
            console.log('combinedIds',combinedIds);
            AssayXF.filterBySubjects(combinedIds);

            if(filter === null){
                _subjectFilters['subjectXF'] = _removeFilterHandler(_subjectFilters['subjectXF'],chartName)
                _subjectFilters['assayXF'] = _removeFilterHandler(_subjectFilters['assayXF'],chartName)
            }

            else{
                _addFilterHandler(_subjectFilters['subjectXF'],chartName,subjectIds);
                _addFilterHandler(_subjectFilters['assayXF'],chartName,subjectIds);
            }


            // if(_subjectFilters['subjectXF'].length > 0){
            //     subjectIds  = _retainAll(_subjectFilters['subjectXF']);
            //     //console.log('Filters to propagate to subjects', subjectIds.length);
            //     SubjectXF.filterBySubjects(subjectIds);
            // }
            //
            // if(_subjectFilters['assayXF'].length > 0){
            //     subjectIds = _retainAll(_subjectFilters['assayXF'])
            //     //console.log('Filters to propagate to assays', subjectIds.length)
            //     AssayXF.filterBySubjects(subjectIds);
            // }

            //USED AS A PROXY THAT A CLINICAL FILTER IS STILL ACTIVE
            if(_subjectFilters['subjectXF'].length > 0) {
                ClinicalXF.filterBySubjects(subjectIds);
            }
        }

        /*else if(xfFiltered.getXFname() == 'AssayCf'){
         //console.log("assays filtered");

         SubjCf.resetSubjectFilter();
         ClinicalCf.resetSubjectFilter();

         if(filteredIds.length == 0)return;

         SubjCf.filterBySubjects(filteredIds);
         ClinicalCf.filterBySubjects(filteredIds);
         }*/

        console.debug("====END OF PROPAGATING FILTER====")
    }

    XFilterLinker.removeFilter = function(chartGroup,obs){
        if(chartGroup === 'clinical'){
            //console.log("subjects filtered")
            ClinicalCf.removeFilters(obs);
            //AssayCf.filterBySubjects(filteredIds);
        }else if(chartGroup === 'subject'){
            //console.log("clinical filtered")
            SubjCf.removeFilters(obs);
            //AssayCf.filterBySubjects(filteredIds);
        }else if(chartGroup === 'AssayCf'){
            //console.log("assays filtered")
            //SubjCf.filterBySubjects(filteredIds);
            //ClinicalCf.filterBySubjects(filteredIds);
        }
    }

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


    return XFilterLinker;
}

angular.module('biospeak.dcPlots')
    .factory('XFilterLinker',['ClinicalXF','SubjectXF','AssayXF','$injector',XFlinker])