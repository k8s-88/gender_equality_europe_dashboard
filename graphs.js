
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


equalityIndexFunction (ndx, "#indexScore")



    // --------------------EQUALITY INDEX AS BAR CHART------------------------

    function equalityIndexFunction (ndx, banana) {
        
    
        
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
        // .xAxisLabel("country")
        .elasticY(true)
        .yAxis().ticks(10)

}
        



   



    dc.renderAll();
}
