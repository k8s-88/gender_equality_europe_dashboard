
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





    dc.renderAll();
}
