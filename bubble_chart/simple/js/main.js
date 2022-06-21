
let parseDate = d3.timeParse("%Y-%m-%d");
//let formatDate = d3.timeFormat("%Y-%M");

let formatDecimal = d3.format(",.2f");
let formatDecimal2 = d3.format(",.4f");

d3.csv("data/bubble_chart_simple.csv", (row,i) => {

    row.New_Case_per_100 = formatDecimal(+row.New_Case_per_100);
    row.New_Death_per_100 = formatDecimal2(+row.New_Death_per_100);
    row.State = row.State;
    return row;


})


    .then(data => {
     console.log(new BubbleChart(data))

    });