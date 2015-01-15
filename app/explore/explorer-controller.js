/**
 * Created by iemam on 08/07/2014.
 */
'use strict';

/* Controllers */

angular.module('eTRIKSdata.explorer')


    .controller('SubjectsCtrl', ['$scope','SubjCf',function($scope, SubjCf) {
        $scope.title = "Subjects";
        /*$scope.subjChars =*/
            /*['Age','Gender','Race','Marital Status','Education','Occupation','Paternal Ethnicity','Maternal Ethnicity'];*/
        $scope.subjChars =    ['Cohort','Age','Gender','Race','Status']
        //MOVE CF services to controllers instead of in the directive

        $scope.subjChartContainerId = 'subject-plots';
        $scope.section="Subjects";


        SubjCf.setup($scope)
        $scope.cf = SubjCf;

    }])

    .controller('ExportCtrl',['$scope','ExportCriteria',function($scope,ExportCriteria) {
        $scope.criteria = ExportCriteria.criteria;
        //console.log($scope.criteria.showClinicalSection)
        $scope.number = 4;

        $scope.$on('filterApplied', function(event, ExportCriteria) {

            console.log("boradcast ok")
            console.log(ExportCriteria)
            $scope.number = ExportCriteria;
        });



    }])

    .controller('ClinicalCtrl', [function() {

        d3.csv("../data/quakes.csv", function (data) {

            // format our data
            var dtgFormat = d3.time.format("%Y-%m-%dT%H:%M:%S");

            data.forEach(function(d) {
                d.dtg   = dtgFormat.parse(d.origintime.substr(0,19));
                d.lat   = +d.latitude;
                d.long  = +d.longitude;
                d.mag   = d3.round(+d.magnitude,1);
                d.depth = d3.round(+d.depth,0);
            });

            var etriks = {};

            etriks.colors = ["#39C2D7", "#2c3e50", "#e57e25", "#d25627"];
            etriks.myColors = function () {
                return d3.scale.ordinal().range(etriks.colors);
            };


            /******************************************************
             * Step1: Create the dc.js chart objects & ling to div *
             ******************************************************/

            var magnitudeChart = dc.barChart("#dc-magnitude-chart");
            var depthChart = dc.barChart("#dc-depth-chart");
            var dayOfWeekChart = dc.rowChart("#dc-dayweek-chart");
            var islandChart = dc.pieChart("#dc-island-chart");
            var timeChart = dc.lineChart("#dc-time-chart");
            var dataTable = dc.dataTable("#dc-table-graph");

            /****************************************
             * 	Run the data through crossfilter    *
             ****************************************/

            var facts = crossfilter(data);  // Gets our 'facts' into crossfilter

            /******************************************************
             * Create the Dimensions                               *
             * A dimension is something to group or filter by.     *
             * Crossfilter can filter by exact value, or by range. *
             ******************************************************/

            // for Magnitude
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



            /***************************************
             * 	Step4: Create the Visualisations   *
             ***************************************/

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

            /****************************
             * Step6: Render the Charts  *
             ****************************/

            dc.renderAll();

        });

    }])

    .controller('AssayCtrl', ['$scope','AssayCf','ExportCriteria',function($scope,AssayCf,ExportCriteria) {

        $scope.isSamplesCollapsed = true;
        $scope.isFactorsCollapsed = true;
        $scope.sampleCharacteristics = ['SourceType','Localisation','SampleType'];//['Sample Origin', 'Material Type', 'Organism Part'];
        $scope.expFactors = ['Treatment', 'TreatementResponse[TC]', 'TreatementResponse[RTV]',
                          'TreatementResponse[RECIST]', 'TreatementResponse[IC50]'];

        $scope.assayChartContainerId = "assayPlots";
        $scope.sampleChartContainerId = "samplePlots";

        $scope.TP = "Transcription Profiling";


        AssayCf.setup($scope)
        $scope.cf = AssayCf;

        $scope.criteria = ExportCriteria

        $scope.addAssayGrp = function(assayType){
            ExportCriteria.addAssayGrp(assayType)
        }

        $scope.addCriterion = function(sc,assayType){
            console.log(sc)
            ExportCriteria.addCriterion(sc,assayType)

        }


        /*$scope.resetChart = function(chartId){
            $(chartId).filterAll();
            dc.redrawAll();
        }*/



        /*d3.tsv("../data/methylation_merged.txt", function (data) {

            data.forEach(function(d) {
                //d.dtg   = dtgFormat.parse(d.origintime.substr(0,19));
                //d.lat   = +d.latitude;
                d.TC  = +d.TC;
                //d.TC   = d3.round(+d.TC,1);
                //d.depth = d3.round(+d.depth,0);
            });

            //These should be generated dynamically from Characteristics and Factors

            //Sample Characteristics
            *//*var sampleOriginChart = dc.pieChart("#dc-sampleOrigin-chart");
            $scope.sampleOriginChart = sampleOriginChart;*//*

            var organismPartChart = dc.rowChart("#dc-organimsPart-chart");
            var sampleTypeChart = dc.rowChart("#dc-sampleType-chart");

            //Factors
           // var TreatmentCompoundChart = dc.rowChart("#dc-EF-Treatment-chart");
            var ResponseTC = dc.barChart("#dc-EF-TC-chart");
            //var ResponseRTV = dc.barChart("#dc-EF-RTV-chart");
            //var ResponseRECIST = dc.barChart("#dc-EF-RECIST-chart");
            //var ResponseIC50 = dc.barChart("#dc-EF-IC50-chart");


            var cfdata = crossfilter(data);
            *//*var all = cfdata.groupAll();*//*

            console.log(d3.extent(data, function(d) { return d.TC; }))

            //sampleOrigin
            var sampleOriDim = cfdata.dimension(function (d) {
                return d.Sourcetype;
            });
            var sampleOriGrp = sampleOriDim.group();



            //Tissue
            var sampleTissueDim = cfdata.dimension(function (d) {
                return d.Localisation;
            });
            var sampleTissueGrp = sampleTissueDim.group();


            //sampleType
            var sampleTypeDim = cfdata.dimension(function (d) {
                return d.sampleType;
            });
            var sampleTypeGrp = sampleTypeDim.group();

            //TC
            var efTreatmentDim = cfdata.dimension(function (d) {
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
            //var efTCGrpF = efTCGrp.all().filter(function(d) { return +d.key > 0; });
            console.log(efTCGrp);
            console.log(efTCGrpF);



            var efRTVDim = cfdata.dimension(function (d) {
                return d.RTV;
            })
            var efRTVGrp = efRTVDim.group();


            var efRECISTDim = cfdata.dimension(function (d) {
                return d.RECIST;
            })
            var efRECISTGrp = efRECISTDim.group();


            var efIC50Dim = cfdata.dimension(function (d) {
                return d.IC50;
            })
            var efIC50Grp = efIC50Dim.group();

            *//**
             * CHARTS
             *//*

            *//**
             * Pie chart for sample Origin
             *//*
            sampleOriginChart.width(180)
                .height(180)
                .radius(80)
                //.innerRadius(10)
                .dimension(sampleOriDim)
                .group(sampleOriGrp)
                //.colors(etriks.myColors())
                .title(function(d){return d.value;});

            *//*sampleOriginChart2.width(160)
                .height(160)
                .radius(60)
                //.innerRadius(20)
                .dimension(sampleOriDim)
                .group(sampleOriGrp)
                //.colors(etriks.myColors())
                .title(function(d){return d.value;});*//*

            *//**
             * Row chart for Tissue
             *//*
            organismPartChart.width(300)
                .height(400)
                .margins({top: 15, left: 10, right: 10, bottom: 20})
                .dimension(sampleTissueDim)
                .group(sampleTissueGrp)
                //.colors(etriks.myColors())
                .title(function(d){return d.value;})
                .elasticX(true)
                .xAxis().ticks(4);

            *//**
             * Row chart for Sample Type
             *//*
            sampleTypeChart.width(300)
                .height(220)
                .margins({top: 15, left: 20, right: 10, bottom: 0})
                .dimension(sampleTypeDim)
                .group(sampleTypeGrp)
//                .colors(etriks.myColors())
                .title(function(d){return d.value;}) .elasticX(true)
                .xAxis().ticks(4);


            //EF CHARTS
            ResponseTC
                .width(216)
                .height(170)
                .margins({top: 10, right: 20, bottom: 40, left: 20})
                .dimension(efTCDim)								// the values across the x axis
                .group(efTCGrpF)							// the values on the y axis
                .transitionDuration(500)
                .centerBar(true)
                .colors(etriks.myColors())
                .gap(2)                                            // bar width Keep increasing to get right then back off.
                .x(d3.scale.linear()
                    .domain(d3.extent(data, function(d) { return d.TC; }))
                   )
                //.y(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.close; })]))
                .elasticY(true)
                .xAxis().tickFormat(function(v) {return v;});



            *//*
            ResponseRTV.width(400)
                .height(250)
                .margins({top: 50, right: 50, bottom: 30, left: 50})
                .dimension(efRTVDim)								// the values across the x axis
                .group(efRTVGrp)							// the values on the y axis
                .transitionDuration(500)
                .centerBar(true)
                .colors(etriks.myColors())
                .gap(1)                                            // bar width Keep increasing to get right then back off.
                .x(d3.scale.linear())
                .elasticX(true)
                .xAxis().tickFormat(function(v) {return v;});*//*

            *//*ResponseIC50.width(400)
                .height(400)
                .margins({top: 10, right: 10, bottom: 10, left: 10})
                .dimension(allAssaysDim)								// the values across the x axis
                .group(allAssaysGrp)							// the values on the y axis
                .transitionDuration(500)
                .centerBar(false)
                .colors(etriks.myColors())
                .gap(1)                                            // bar width Keep increasing to get right then back off.
                .x(d3.scale.linear())
                .elasticY(true)
                .xAxis().tickFormat(function(v) {return v;});*//*

            dc.renderAll();
            $scope.dc = dc;
        })*/

    }])


    .controller('subjPlotsCtrl',['$scope', function($scope){

    }]);