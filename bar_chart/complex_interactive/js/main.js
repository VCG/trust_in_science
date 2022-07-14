let chart;
let parseDate = d3.timeParse("%Y-%m-%d");

numbers_format = d3.format(".4r")

d3.csv("data/bar_chart_complex2.csv", (row,i) => {

    row.Index = i;
    row.Vax_18_49 = numbers_format(+row.Vax_18_49);
    row.Vax_50_79 = numbers_format(+row.Vax_50_79);
    row.Vax_80 = numbers_format(+row.Vax_80);
    row.Unvax_18_49 = numbers_format(+row.Unvax_18_49);
    row.Unvax_50_79 = numbers_format(+row.Unvax_50_79);
    row.Unvax_80 = numbers_format(+row.Unvax_80);

    row.group= row.Week;
    row.Max_Week_Date = parseDate(row.Max_Week_Date);

    return row;
})
.then(data => {
    chart = new StackedBarChart(data);
});