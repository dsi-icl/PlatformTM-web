/**
 * Created by iemam on 17/10/2014.
 */

'use strict'
function XFlinker(ClinicalXF,SubjectXF,AssayXF,$injector){

    var XFilterLinker = {}

    var subjectSubjectIds, subjectXFisFiltered;
    var clinicalSubjectIds, clinicalXFsubjIsFiltered;

    var _subjectFilters = {}

    _subjectFilters['subjectXF'] = [];
    _subjectFilters['clinicalXF'] = [];
    _subjectFilters['assayXF'] = [];

    var _removeFilterHandler = function (filters, chartName) {
        //console.log('removing filter by chart',chartName)
        for (var i = 0; i < filters.length; i++) {
            if (filters[i].chart <= chartName && filters[i].chart >= chartName) {
                filters.splice(i, 1);
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

        for(var i=1; i<filters.length; i++){
            intersect = intersect.filter(function(n){
                return filters[i].filter.indexOf(n) !== -1
            })
        }

        return intersect;
    }

    XFilterLinker.reApplySubjectFilter = function(xfFiltered){

        console.debug("===REAPPLYING PREVIOUS SUBJECT FILTERS===")

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
            // console.log('CLINICAL AND ASSAY TO SUBJECT')

            var filteredIds = _retainAll(_subjectFilters['subjectXF']);
            SubjectXF.resetSubjectFilter();
            SubjectXF.filterBySubjects(filteredIds);

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

        // console.debug("====PROPAGATING FILTER====")

        var subjectIds;

        if(xfFiltered.getXFname() === 'SubjCf'){

            subjectIds = xfFiltered.getCurrentSubjectIds();
            if(subjectIds.length === 0)return;

            console.debug("SUBJECT TO CLINICAL AND ASSAY");
            ClinicalXF.resetSubjectFilter();
            AssayXF.resetSubjectFilter();

            if(filter === null){
                _subjectFilters['clinicalXF'] = _removeFilterHandler(_subjectFilters['clinicalXF'],chartName)
                _subjectFilters['assayXF'] = _removeFilterHandler(_subjectFilters['assayXF'],chartName)
            }

            else{
                _addFilterHandler(_subjectFilters['clinicalXF'],chartName,subjectIds);
                _addFilterHandler(_subjectFilters['assayXF'],chartName,subjectIds);
            }

            if(_subjectFilters['clinicalXF'].length > 0){
                subjectIds  = _retainAll(_subjectFilters['clinicalXF']);
                //console.log('Filters to propagate to subjects', subjectIds.length);
                ClinicalXF.filterBySubjects(subjectIds);
            }

            if(_subjectFilters['assayXF'].length > 0){
                subjectIds = _retainAll(_subjectFilters['assayXF'])
                // console.log('Filters to propagate to assays', subjectIds.length)
                AssayXF.filterBySubjects(subjectIds);
            }

        }

        else if(xfFiltered.getXFname()  === 'ClinicalCf'){

            ClinicalXF.resetSubjectFilter();
            subjectIds = xfFiltered.getCurrentSubjectIds();

            if(subjectIds.length === 0)return;

            console.debug("CLINICAL TO SUBJECT AND ASSAY");
            //console.log("filtered subjected ids",subjectIds)
            SubjectXF.resetSubjectFilter();
            AssayXF.resetSubjectFilter();


            if(filter === null){
                _subjectFilters['subjectXF'] = _removeFilterHandler(_subjectFilters['subjectXF'],chartName)
                _subjectFilters['assayXF'] = _removeFilterHandler(_subjectFilters['assayXF'],chartName)
            }

            else{
                _addFilterHandler(_subjectFilters['subjectXF'],chartName,subjectIds);
                _addFilterHandler(_subjectFilters['assayXF'],chartName,subjectIds);
            }


            if(_subjectFilters['subjectXF'].length > 0){
                subjectIds  = _retainAll(_subjectFilters['subjectXF']);
                //console.log('Filters to propagate to subjects', subjectIds.length);
                SubjectXF.filterBySubjects(subjectIds);
            }

            if(_subjectFilters['assayXF'].length > 0){
                subjectIds = _retainAll(_subjectFilters['assayXF'])
                //console.log('Filters to propagate to assays', subjectIds.length)
                AssayXF.filterBySubjects(subjectIds);
            }

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
    }

    return XFilterLinker;
}

angular.module('biospeak.dcPlots')
    .factory('XFilterLinker',['ClinicalXF','SubjectXF','AssayXF','$injector',XFlinker])