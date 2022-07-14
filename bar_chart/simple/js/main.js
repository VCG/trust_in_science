
let parseDate = d3.timeParse("%Y-%m-%d");

numbers_format = d3.format(".2d")

let bar_chart_simple_data;

// d3.csv("data/bar_chart_simple.csv", (row,i) => {


d3.csv("https://raw.githubusercontent.com/VCG/trust_in_science/barbara_branch/bar_chart/simple/data/bar_chart_simple.csv", (row,i) => {


    row.Age_adjusted_unvax_IR = numbers_format(+row.Age_adjusted_unvax_IR);
    row.Age_adjusted_vax_IR = numbers_format(+row.Age_adjusted_vax_IR);
    row.Max_Week_Date = parseDate(row.Max_Week_Date);
    row.Week = +row.Week;
    return row;


})


    // .then(data => {
    //     new BarChart(data);
    //     new BarChart2(data);
    // });

    .then(loadData => {
        bar_chart_simple_data = loadData
//      //console.log(new LineChart(data))
        new BarChartSimple(loadData)
        new BarChartSimple2(loadData)
    });