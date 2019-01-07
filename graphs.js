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

    let height = 400;


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
            .height(height)
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
        .xAxis().ticks(5);






    // ----------------------EDUCATION------------------------------


    function EducationFunction(ndx, banana) {

        let countryDimEducation = ndx.dimension(dc.pluck("country"));

        let femaleTertiary = countryDimEducation.group().reduceSum(dc.pluck("tertiary_f"));

        let maleTertiary = countryDimEducation.group().reduceSum(dc.pluck("tertiary_m"));

        let educationChart = dc.compositeChart(banana);

        educationChart
            .width(chartWidth * 4)
            .height(height)
            .margins({ top: 10, right: 20, bottom: 50, left: 50 })
            .dimension(countryDimEducation)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .group(femaleTertiary)
            .yAxisLabel("% with Tertiary Level Education")
            .legend(dc.legend().x(70).y(10).itemHeight(13).gap(5))
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


    countryDimManagement = ndx.dimension(dc.pluck("country"));

    let femaleCEOs = countryDimManagement.group().reduceSum(dc.pluck("ceo_f"));

    var maleCEOs = countryDimManagement.group().reduceSum(
        function(d) {
            return 100 - d['ceo_f'];
        }
    );

    var managementChart = dc.barChart("#managementByGenderRank");

    managementChart
        .width(chartWidth * 4)
        .height(height)
        .dimension(countryDimManagement)
        .group(femaleCEOs)
        .stack(maleCEOs)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal);


    // ---------------------------select country box---------------------------------

    var countryNames = ndx.dimension(function(d) {
        return d["country"];
    });
    var numCountryNames = countryNames.group();

    selectField = dc.selectMenu('#country-select')
        .dimension(countryNames)
        .group(numCountryNames);






    dc.renderAll();
}
