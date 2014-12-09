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
etriks.colors1 = ["#03899C","#1F6B75","#015965","#36BBCE",//blue
                  "#FF7A00","#BF7530","#A65000","#FF9B40",//oranges
                  "#F3FD00","#B8BE2F","#9EA400","#F7FE40",//greens
                  "#7908AA","#64247F","#4E026E","#A63CD4", //purple
                  ]

etriks.colors2 = ["#39C2D7", "#2c3e50", "#e57e25", "#d25627","#0776A0","#024C68","#3AA6D0","#226078",
                  "#FF8500","#BF7A30","#A65600","#FFA340", //oranges
                  "#E2FA00","#AEBC2F","#93A300","#EAFD3F", //yelloegreen
                  "#8805A8","#6C227E","#58026D","#B53AD4"] //purples
etriks.myColors = function () {
    return d3.scale.ordinal().range(etriks.colors2);
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

