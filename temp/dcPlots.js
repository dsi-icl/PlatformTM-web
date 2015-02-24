/**
 * Created by iemam on 23/02/2015.
 */
/*        d3.csv("../data/quakes.csv", function (data) {

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


 *//******************************************************
 * Step1: Create the dc.js chart objects & ling to div *
 ******************************************************//*

 var magnitudeChart = dc.barChart("#dc-magnitude-chart");
 var depthChart = dc.barChart("#dc-depth-chart");
 var dayOfWeekChart = dc.rowChart("#dc-dayweek-chart");
 var islandChart = dc.pieChart("#dc-island-chart");
 var timeChart = dc.lineChart("#dc-time-chart");
 var dataTable = dc.dataTable("#dc-table-graph");

 *//****************************************
 * 	Run the data through crossfilter    *
 ****************************************//*

 var facts = crossfilter(data);  // Gets our 'facts' into crossfilter

 *//******************************************************
 * Create the Dimensions                               *
 * A dimension is something to group or filter by.     *
 * Crossfilter can filter by exact value, or by range. *
 ******************************************************//*

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

 dc.renderAll();

 });*/