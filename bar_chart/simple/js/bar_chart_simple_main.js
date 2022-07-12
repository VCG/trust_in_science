
let parseDate = d3.timeParse("%Y-%m-%d");

numbers_format = d3.format(".2d")

d3.csv("bar_chart_simple_data/bar_chart_simple.csv", (row,i) => {

    row.Age_adjusted_unvax_IR = numbers_format(+row.Age_adjusted_unvax_IR);
    row.Age_adjusted_vax_IR = numbers_format(+row.Age_adjusted_vax_IR);
    row.Max_Week_Date = parseDate(row.Max_Week_Date);
    row.Week = +row.Week;
    return row;


})


    .then(data => {
        new BarChart(data);
        new BarChart2(data);
    });