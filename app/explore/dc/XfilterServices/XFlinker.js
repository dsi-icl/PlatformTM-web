/**
 * Created by iemam on 17/10/2014.
 */

'use strict'
function XFlinker(ClinicalCf,SubjCf,AssayCf,$injector){

    var XFilterLinker = {}

    XFilterLinker.propagateFilter = function(xfFiltered){

        //var xfFiltered = $injector.get(xfilterServiceName);
        //console.log('filtered in ',xfFiltered);
        //var service = $injector.get(request);



        var filteredIds = xfFiltered.getCurrentSubjectIds();
        //console.log(filteredIds)
        // if(filteredIds.length == 0)return;

        if(xfFiltered.getXFname() == 'SubjCf'){
            console.log("subjects filtered");
            ClinicalCf.resetSubjectFilter();
            AssayCf.resetSubjectFilter();

            if(filteredIds.length == 0)return;

            ClinicalCf.filterBySubjects(filteredIds);
            AssayCf.filterBySubjects(filteredIds);

        }else if(xfFiltered.getXFname()  == 'ClinicalCf'){
            console.log("clinical filtered");

            SubjCf.resetSubjectFilter();
            AssayCf.resetSubjectFilter();

            if(filteredIds.length == 0)return;

            if(xfFiltered.isFiltered()){
                SubjCf.filterBySubjects(filteredIds);
                AssayCf.filterBySubjects(filteredIds);
            }

            ClinicalCf.syncfilters();
        }else if(xfFiltered.getXFname() == 'AssayCf'){
            console.log("assays filtered");

            SubjCf.resetSubjectFilter();
            ClinicalCf.resetSubjectFilter();

            if(filteredIds.length == 0)return;

            SubjCf.filterBySubjects(filteredIds);
            ClinicalCf.filterBySubjects(filteredIds);
        }

        //SubjCf.filterBySubjects(filteredIds);
        //ClinicalCf.filterBySubjects(filteredIds);
        //AssayCf.filterBySubjects(filteredIds);
    }

    XFilterLinker.removeFilter = function(chartGroup,obs){
        if(chartGroup == 'clinical'){
            //console.log("subjects filtered")
            ClinicalCf.removeFilters(obs);
            //AssayCf.filterBySubjects(filteredIds);
        }else if(chartGroup == 'subject'){
            //console.log("clinical filtered")
            SubjCf.removeFilters(obs);
            //AssayCf.filterBySubjects(filteredIds);
        }else if(chartGroup == 'AssayCf'){
            //console.log("assays filtered")
            //SubjCf.filterBySubjects(filteredIds);
            //ClinicalCf.filterBySubjects(filteredIds);
        }
    }

    return XFilterLinker;
}

angular.module('biospeak.dcPlots')
    .factory('XFilterLinker',['ClinicalCf','SubjCf','AssayCf','$injector',XFlinker])