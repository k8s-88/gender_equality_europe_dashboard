let windowWidth = document.documentElement["clientWidth"];

window.onresize = function() {
    location.reload();
}

queue()
    .defer(d3.csv, "gendergap2.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

    let chartWidth = windowWidth / 5;
    let height = 400;


    // -----------------------QUESTION 1------------------------------------


    countryDimAgreement = ndx.dimension(dc.pluck('country'));

    let Disagree = countryDimAgreement.group().reduceSum(dc.pluck("q1_disagree"));

    var Agree = countryDimAgreement.group().reduceSum(
        function(d) {
            return 100 - d['q1_disagree'];
        }
    );

    var question1Chart = dc.barChart("#question1Rank");

    question1Chart
        .width(chartWidth * 4)
        .height(height)
        .margins({ top: 0, right: 0, bottom: 0, left: 50 })
        .dimension(countryDimAgreement)
        .group(Disagree)
        .yAxisLabel("Responses as a Percentage")
        .stack(Agree)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal);



    // -----------------------QUESTION 2------------------------------------



    countryDimAgreement2 = ndx.dimension(dc.pluck('country'));

    let Disagree2 = countryDimAgreement2.group().reduceSum(dc.pluck("q2_disagree"));

    var Agree2 = countryDimAgreement2.group().reduceSum(
        function(d) {
            return 100 - d['q2_disagree'];
        }
    );

    var question2Chart = dc.barChart("#question2Rank");

    question2Chart
        .width(chartWidth * 4)
        .height(height)
        .margins({ top:0, right: 0, bottom: 0, left: 50 })
        .dimension(countryDimAgreement2)
        .group(Disagree2)
        .yAxisLabel("Responses as a Percentage")
        .stack(Agree2)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal);






    // -----------------------QUESTION 3------------------------------------


    countryDimAgreement3 = ndx.dimension(dc.pluck('country'));

    let Disagree3 = countryDimAgreement3.group().reduceSum(dc.pluck("q3_disagree"));

    var Agree3 = countryDimAgreement3.group().reduceSum(
        function(d) {
            return 100 - d['q3_disagree'];
        }
    );

    var question3Chart = dc.barChart("#question3Rank");

    question3Chart
        .width(chartWidth * 4)
        .height(height)
        .margins({ top:10, right: 0, bottom: 0, left: 50 })
        .dimension(countryDimAgreement3)
        .group(Disagree3)
        .yAxisLabel("Responses as a Percentage")
        .stack(Agree3)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal);



    // ---------------------------countryselect --------------------------------------------



    var countryNames = ndx.dimension(function(d) {
        return d["country"];
    });
    var numCountryNames = countryNames.group();

    selectField = dc.selectMenu('#country-select')
        .dimension(countryNames)
        .group(numCountryNames);





    dc.renderAll();
}
