'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
    .factory('StudyService',function($http, $q) {

        var loadStudy = function() {
            var deferred = $q.defer();

            $http({method:"GET", url:"../json/studyPlan.json"}).success(function(result){
                deferred.resolve(result);
            });

            return deferred.promise;
        };
        var loadData = function() {
            var deferred = $q.defer();

            $http({method:"GET", url:"../json/baselineData.json"}).success(function(result){
                deferred.resolve(result);
            });

            return deferred.promise;
        };
        return { loadStudy: loadStudy, loadData: loadData };

    })


    .factory('cf',function(){
        var setup = function(sc){

            d3.csv("data/quakes.csv", function (data) {

                //Preprocess data
                var dtgFormat = d3.time.format("%Y-%m-%dT%H:%M:%S");
                data.forEach(function(d) {
                    d.dtg   = dtgFormat.parse(d.origintime.substr(0,19));
                    d.lat   = +d.latitude;
                    d.long  = +d.longitude;
                    d.mag   = d3.round(+d.magnitude,1);
                    d.depth = d3.round(+d.depth,0);
                });

                var facts = crossfilter(data);  // Gets our 'facts' into crossfilter

                //ADD dimension and group
                var magValue = facts.dimension(function (d) {
                    return d.mag;       // group or filter by magnitude
                });
                var magValueGroupSum = magValue.group()
                    .reduceSum(function(d) { return d.mag; });	// sums the magnitudes per magnitude
            })
        }

        return{

        }
    })

    .value('version', '0.1');
