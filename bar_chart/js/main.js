var chart
function getBarChartData(){
    let parseDate = d3.timeParse("%Y-%m-%d");

    numbers_format = d3.format(".4r")

    return d3.csv("https://hamza-elhamdadi.github.io/trust_in_science/bar_chart/data/bar_chart_complex2.csv", (row,i) => {

        row.Index = i;
        row.Vax_18_49 = numbers_format(+row.Vax_18_49);
        row.Vax_50_79 = numbers_format(+row.Vax_50_79);
        row.Vax_80 = numbers_format(+row.Vax_80);
        row.Unvax_18_49 = numbers_format(+row.Unvax_18_49);
        row.Unvax_50_79 = numbers_format(+row.Unvax_50_79);
        row.Unvax_80 = numbers_format(+row.Unvax_80);

        row.Age_adjusted_unvax_IR = (+row.Unvax_18_49)+(+row.Unvax_50_79)+(+row.Unvax_80);
        row.Age_adjusted_vax_IR = (+row.Vax_18_49)+(+row.Vax_50_79)+(+row.Vax_80);

        row.group= row.Week;
        row.Max_Week_Date2 = row.Max_Week_Date
        row.Max_Week_Date = parseDate(row.Max_Week_Date);

        return row;
    })
}

getBarChartData()
// .then(data => {
//     chart = new StackedBarChart({
//         data: data,
//         stacked: true,
//         interactive: true
//     });
//     chart.initVis('chart')
// });
// .then(data => {
//     chart = new StackedBarChart({
//         data: data,
//         stacked: true,
//         interactive: false
//     });
//     chart.initVis('chart')
//     chart.updateVis('chart')
// });
.then(data => {
    chart = new StackedBarChart({
        data: data,
        stacked: false,
        interactive: false
    });
    chart.initVis('chart',true)
    chart.initVis('chart2',false)
});