/**
 * Created by iemam on 17/10/2014.
 */

//Include a dependency service which will request the cfdata as well as list of SCs and EFs
angular.module('eTRIKSdata.dcPlots',['eTRIKSdata.exporter'])

    .factory('AssayCf',function(){

        var SCs = ['SourceType','Localisation','SampleType'];
        var EFs = ['Treatment','TreatementResponse[TC]','RTV','RECIST','IC50'];

        var dimensions = [], groups = [];

        var cfservice = {}

        cfservice.setup = function(scope){
            d3.tsv("../data/methylation_merged.txt", function (data) {

                //use property dataType to coerce string to numerals

                data.forEach(function(d) {
                    //d.dtg   = dtgFormat.parse(d.origintime.substr(0,19));
                    //d.lat   = +d.latitude;
                    d['TreatementResponse[TC]']  = +d['TreatementResponse[TC]'];
                    //d.TC   = d3.round(+d.TC,1);
                    //d.depth = d3.round(+d.depth,0);
                });


                var cfdata = crossfilter(data);

                /**
                 * ************Sample Plots****************************
                 */

                SCs.forEach(function(sc){
                    //console.log((sc.value))

                    var dim = cfdata.dimension(function (d) {
                        return d[sc];
                    });
                    dimensions[sc] = dim
                    var grp = dim.group();
                    groups[sc] = grp;

                })

                EFs.forEach(function(ef){
                   // console.log((ef))

                    var dim = cfdata.dimension(function (d) {
                        return d[ef];
                    });
                    dimensions[ef] = dim


                    var grp = dim.group().reduceCount();
                    var grpF = {
                        all: function () {
                            return grp.all().filter(function(d) { return +d.key > 0; })
                        },
                        size: function(){
                            return grp.all().filter(function(d) { return +d.key > 0; }).size()
                        }

                    }
                    groups[ef] = grpF;

                });

                /*console.log(dimensions)
                console.log(groups)*/
                /**
                 * *****************************************************
                 */


                //TC
                /*var efTreatmentDim = cfdata.dimension(function (d) {
                    return d.treatment;
                })
                var efTreatmentGrp = efTreatmentDim.group();


                var efTCDim = cfdata.dimension(function (d) {
                    return d.TC;
                })
                var efTCGrp = efTCDim.group().reduceCount();
                var efTCGrpF = {
                    all: function () {
                        return efTCGrp.all().filter(function(d) { return +d.key > 0; })
                        //return efTCGrp.top(Infinity).filter( function (d) { return d.value !== 0; } );
                    }
                }
                */
            })
        }

        cfservice.getDimension = function(key){

            return dimensions[key];
        }

        cfservice.getGroup = function(key){
//            console.log(key)
            return groups[key];
        }

        return cfservice
    })

    .factory('SubjCf',function(){

        var subjChars =
            ['Cohort','Age','Gender','Race','Status'];

        var dimensions = [], groups = [];
        var cfdata;
        var all;

        var subjCfService = {}

        subjCfService.setup = function(scope){
            d3.tsv("../data/subject-data2.txt", function (data) {

                //use property dataType to coerce string to numerals

                data.forEach(function(d) {
                    //d.dtg   = dtgFormat.parse(d.origintime.substr(0,19));
                    //d.lat   = +d.latitude;
                    d['Age']  = +d['Age'];
                    d.Race   = d.Race;
                    //d.depth = d3.round(+d.depth,0);
                });


                cfdata = crossfilter(data);
                all = cfdata.groupAll();

                /*dc.dataCount('.dc-data-count')
                    .dimension(ndx)
                    .group(all);*/

                /*var countDim = cfdata.dimension(function (d) {
                    return d["PatientID"];
                });
                subjCountGrp = countDim.group().reduceCount();*/
                //console.log('inside setup ',subjCountGrp)

                subjChars.forEach(function(sc){
                    //console.log((sc.value))

                    var dim = cfdata.dimension(function (d) {
                        return d[sc];
                    });
                    dimensions[sc] = dim
                    //var grp = dim.group();
                    var grp = dim.group().reduceCount();
                    /*var grpF = {
                        all: function () {
                            return grp.all().filter(function(d) { return +d.key > 0; })
                        },
                        size: function(){
                            return grp.all().filter(function(d) { return +d.key > 0; }).size()
                        }

                    }*/


                    groups[sc] = grp;

                })


            })
        }

        subjCfService.getDimension = function(key){

            return dimensions[key];
        }

        subjCfService.getGroup = function(key){
//            console.log(key)
            return groups[key];
        }

        subjCfService.getCountData = function(){
            return cfdata
        }
        subjCfService.getCountGroup = function(){
            return all
        }

        return subjCfService
    })

    .factory('ClinicalCf',function(){

        var Observations = ['BMI','Height','Weight'];

        var dimensions = [], groups = [];
        var clinicalData;

        var cfservice = {}


        cfservice.setup = function(scope){

            d3.tsv("../data/clinicalData.txt", function (data) {

                // format our data
                //var dtgFormat = d3.time.format("%Y-%m-%dT%H:%M:%S");

                data.forEach(function(d) {
                    //d.dtg   = dtgFormat.parse(d.origintime.substr(0,19));

                    d.bmi   = d3.round(+d.bmi,1);
                    d.height   = d3.round(+d.height,1);
                    d.weight = d3.round(+d.weight,0);
                });

                var etriks = {};

                etriks.colors = ["#39C2D7", "#2c3e50", "#e57e25", "#d25627"];
                etriks.myColors = function () {
                    return d3.scale.ordinal().range(etriks.colors);
                };



                clinicalData = crossfilter(data);  // Gets our 'facts' into crossfilter

                Observations.forEach(function(obs){
                    //console.log((sc.value))

                    var dim = clinicalData.dimension(function (d) {
                        return d[obs];
                    });
                    dimensions[obs] = dim
                    var grp = dim.group();
                    groups[obs] = grp;

                })


/*                // for Magnitude
                var magValue = facts.dimension(function (d) {
                    return d.mag;       // group or filter by magnitude
                });
                var magValueGroupSum = magValue.group()
                    .reduceSum(function(d) { return d.mag; });	// sums the magnitudes per magnitude
                var magValueGroupCount = magValue.group()
                    .reduceCount(function(d) { return d.mag; }) // counts the number of the facts by magnitude


                //For rowChart
                var dayOfWeek = facts.dimension(function (d) { var day = d.dtg.getDay();
                    switch (day) {
                        case 0:
                            return "0.Sun";
                        case 1:
                            return "1.Mon";
                        case 2:
                            return "2.Tue";
                        case 3:
                            return "3.Wed";
                        case 4:
                            return "4.Thu";
                        case 5:
                            return "5.Fri";
                        case 6:
                            return "6.Sat";
                    } });
                var dayOfWeekGroup = dayOfWeek.group();


                //For pieChart
                var islands = facts.dimension(function (d) {
                    if (d.lat <= -40.555907 && d.long <= 174.590607)
                        return "Yes"; else
                        return "No"; });
                var islandsGroup = islands.group();

                // For datatable
                var timeDimension = facts.dimension(function (d) {
                    return d.dtg;
                }); // group or filter by time

                // for Depth
                var depthValue = facts.dimension(function (d) {
                    return d.depth;
                });
                var depthValueGroup = depthValue.group();

                // define a daily volume Dimension
                var volumeByDay = facts.dimension(function(d) {
                    return d3.time.hour(d.dtg);
                });
                // map/reduce to group sum
                var volumeByDayGroup = volumeByDay.group()
                    .reduceCount(function(d) { return d.dtg; });



                *//***************************************
                 * 	Step4: Create the Visualisations   *
                 ***************************************//*

                    // Magnitide Bar Graph Summed
                magnitudeChart.width(480)
                    .height(150)
                    .margins({top: 10, right: 10, bottom: 20, left: 40})
                    .dimension(magValue)								// the values across the x axis
                    .group(magValueGroupSum)							// the values on the y axis
                    .transitionDuration(500)
                    .centerBar(true)
                    .colors(etriks.myColors())
                    .gap(56)                                            // bar width Keep increasing to get right then back off.
                    .x(d3.scale.linear().domain([0.5, 7.5]))
                    .elasticY(true)
                    .xAxis().tickFormat(function(v) {return v;});

                // Depth bar graph
                depthChart.width(480)
                    .height(150)
                    .margins({top: 10, right: 10, bottom: 20, left: 40})
                    .dimension(depthValue)
                    .group(depthValueGroup)
                    .transitionDuration(500)
                    .centerBar(true)
                    .colors(etriks.myColors())
                    .gap(1)                    // bar width Keep increasing to get right then back off.
                    .x(d3.scale.linear().domain([0, 100]))
                    .elasticY(true)
                    .xAxis().tickFormat(function(v) {return v;});

                // time graph
                timeChart.width(960)
                    .height(100)
                    .margins({top: 10, right: 10, bottom: 20, left: 40})
                    .dimension(volumeByDay)
                    .group(volumeByDayGroup)
                    .colors(etriks.myColors())
                    .transitionDuration(500)
                    .elasticY(true)
                    .x(d3.time.scale().domain([new Date(2013, 6, 18), new Date(2013, 6, 24)])) // scale and domain of the graph
                    .xAxis();

                // row chart day of week
                dayOfWeekChart.width(300)
                    .height(220)
                    .margins({top: 5, left: 10, right: 10, bottom: 20}) .dimension(dayOfWeek)
                    .group(dayOfWeekGroup)
                    .colors(etriks.myColors())
                    .label(function (d){
                        return d.key.split(".")[1]; })
                    .title(function(d){return d.value;}) .elasticX(true)
                    .xAxis().ticks(4);

                //PieChart
                islandChart.width(250)
                    .height(220)
                    .radius(100)
                    .innerRadius(30)
                    .dimension(islands)
                    .group(islandsGroup)
                    .colors(etriks.myColors())
                    .title(function(d){return d.value;});


                // Table of earthquake data
                dataTable.width(960).height(800)
                    .dimension(timeDimension)
                    .group(function(d) { return "List of all earthquakes corresponding to the filters"
                    })
                    .size(10)							// number of rows to return
                    .columns([
                        function(d) { return d.dtg; },
                        function(d) { return d.lat; },
                        function(d) { return d.long; },
                        function(d) { return d.depth; },
                        function(d) { return d.mag; },
                        function(d) { return '<a href=\"http://maps.google.com/maps?z=11&t=m&q=loc:' + d.lat + '+' + d.long +"\" target=\"_blank\">Google Map</a>"},
                        function(d) { return '<a href=\"http://www.openstreetmap.org/?mlat=' + d.lat + '&mlon=' + d.long +'&zoom=11'+ "\" target=\"_blank\"> OSM Map</a>"}
                    ])
                    .sortBy(function(d){ return d.dtg; })
                    .order(d3.ascending);

                *//****************************
                 * Step6: Render the Charts  *
                 ****************************//*

                dc.renderAll();*/

            });
        }

        cfservice.getDimension = function(key){

            return dimensions[key];
        }

        cfservice.getGroup = function(key){
//            console.log(key)
            return groups[key];
        }

        return cfservice

    })
