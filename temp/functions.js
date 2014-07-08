$(".option-list ul li").click(function () {

    var splitContents = this.id.split("_");
    var chartId = splitContents[0] + "-" + splitContents[1] + "-plot";

    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
        $("#" + chartId + "-container").remove();
    } else {
        $(this).addClass("selected");
        etriks.function.addChartContainer(splitContents[0], splitContents[1], chartId);
        etriks.function.addGraph(chartId, "data/data.json", "pie");
    }

});

$(".section-block-content-option ul li").click(function () {


    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
    } else {
        $(this).addClass("selected");
    }

});

$(".section-block-header").click(function () {
    var id = this.id;
    $("#" + id + "-block").toggleClass("hidden")
});


var etriks = {};

etriks.colors = ["#39C2D7", "#2c3e50", "#e57e25", "#d25627"];
etriks.myColors = function () {
    return d3.scale.ordinal().range(etriks.colors);
};

etriks.function = {

    addChartContainer: function (section, chartType, chartId) {
        $("#" + section + "-plots").append(
                '<div ng-if="scSelected" id="' + chartId + "-container" + '" class="pull-left subject-chart">' +
                '<h2>' + chartType.replace("-", " ") + '</h2>' +
                '<div id="' + chartId + '">' +
                '<svg></svg>' +
                '</div>' +
                '</div>');
    },

    addGraph: function (position, data_url, type) {
        d3.json(data_url, function (data) {

            nv.addGraph(function () {

                if (type == "bar") {
                    var chart = nv.models.discreteBarChart()
                        .x(function (d) {
                            return d.label;
                        })
                        .y(function (d) {
                            return d.value;
                        }).color(etriks.myColors().range());

                } else if (type == "pie") {
                    var chart = nv.models.pieChart()
                        .x(function (d) {
                            return d.label + " (" + d.value + ")"
                        })
                        .y(function (d) {
                            return d.value
                        })
                        .showLabels(false).color(etriks.myColors().range());
                }
                d3.select("#" + position + " svg")
                    .datum(data)
                    .transition().duration(350)
                    .call(chart);


                return chart;
            });
        });
    },

    toggleSectionOptions: function (section) {
        $('#' + section + '-content').toggleClass('hidden');
        $('#' + section + '-options').toggleClass('hidden');
    }
};

