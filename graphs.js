let windowWidth = document.documentElement["clientWidth"];

window.onresize = function() {
    location.reload();
}

queue()
    .defer(d3.csv, "gendergap2.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

    let chartWidth = 300;

    if (windowWidth < 768) {
        chartWidth = windowWidth;
    }
    else {
        chartWidth = windowWidth / 5;
    }


equalityIndexFunction(ndx, "#indexScore")
EducationFunction(ndx, "#educationByGenderRank")


    // --------------------EQUALITY INDEX AS BAR CHART------------------------

    function equalityIndexFunction(ndx, banana) {



        let countryDimEqualityIndex = ndx.dimension(dc.pluck("country"));

        let indexScore = countryDimEqualityIndex.group().reduceSum(dc.pluck("equality_index"));

        let equalityIndex = dc.barChart(banana);

        let equalityIndexcolors = d3.scale.ordinal().range(["cyan", "lightpink", "lightgreen", "yellow", "lightblue"]);


        equalityIndex
            .width(chartWidth * 4)
            .height(500)
            .margins({ top: 10, right: 20, bottom: 50, left: 50 })
            .colors(equalityIndexcolors)
            .colorAccessor(function(d) {
                return d.key
            })
            .dimension(countryDimEqualityIndex)
            .group(indexScore)
            .yAxisLabel("Gender Equality Index Score")
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .elasticY(true)
            .yAxis().ticks(10)

    }
    // ---------------GENDER PAY GAP------------------------



    var countryDim = ndx.dimension(dc.pluck('country'));
    var femalePayGap = countryDim.group().reduceSum(dc.pluck('pay_gap'));
    var genderPayGap = dc.rowChart("#femalePayGap");

    genderPayGap
        .width(chartWidth * 4)
        .height(500)
        .dimension(countryDim)
        .group(femalePayGap)
        .xAxis().ticks(4);






    // ----------------------EDUCATION------------------------------


    function EducationFunction(ndx, banana) {

        let countryDimEducation = ndx.dimension(dc.pluck("country"));

        let femaleTertiary = countryDimEducation.group().reduceSum(dc.pluck("tertiary_f"));

        let maleTertiary = countryDimEducation.group().reduceSum(dc.pluck("tertiary_m"));

        let educationChart = dc.compositeChart(banana);

        educationChart
            .width(chartWidth * 4)
            .height(200)
            .margins({ top: 10, right: 20, bottom: 50, left: 20 })
            .dimension(countryDimEducation)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .group(femaleTertiary)
            .yAxisLabel("% with Tertiary Level Education")
            .legend(dc.legend().x(40).y(40).itemHeight(13).gap(5))
            .compose([
                dc.barChart(educationChart)
                .colors("pink")
                .group(femaleTertiary, "tertiary_f"),
                dc.barChart(educationChart)
                .colors("blue")
                .group(maleTertiary, "tertiary_m")
            ])



            .yAxis().ticks(4);


    }


    // --------------------MANAGEMENT---------------------------------


    let countryDimManagement = ndx.dimension(dc.pluck("country"));

    let femaleCEOs = countryDimManagement.group().reduceSum(dc.pluck("ceo_f"));

    let maleCEOs = countryDimManagement.group().reduceSum(dc.pluck("ceo_m"));

    let managementChart = dc.compositeChart("#managementByGenderRank");

    managementChart
        .width(chartWidth * 4)
        .height(500)
        .margins({ top: 10, right: 20, bottom: 50, left: 20 })
        .dimension(countryDimManagement)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .group(maleCEOs)
        .yAxisLabel("% of CEOs")
        .legend(dc.legend().x(40).y(40).itemHeight(13).gap(5))
        .compose([
            dc.barChart(managementChart)
            .colors("blue")
            .group(maleCEOs, "ceo_m"),
            dc.barChart(managementChart)
            .colors("pink")
            .group(femaleCEOs, "ceo_f")
        ])

        .yAxis().ticks(4);








    dc.renderAll();
}
