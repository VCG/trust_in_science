let parseDate = d3.timeParse("%Y-%m-%d");
let formatDate = d3.timeFormat("%V");
let formatDate2 = d3.timeParse("%Y-%m-%d")
let formatTime = d3.timeFormat("%Y-%m-%d");
const yearFormat = d3.timeFormat("%Y");
number_format = d3.format(".2d")


function getLineChartData() {
    return d3.csv("data/line_chart_complex.csv", (row, i) => {
        row.Vax_18_49 = number_format(+row.Vax_18_49);
        row.Vax_50_79 = number_format(+row.Vax_50_79);
        row.Vax_80 = number_format(+row.Vax_80);
        row.Unvax_18_49 = number_format(+row.Unvax_18_49);
        row.Unvax_50_79 = number_format(+row.Unvax_50_79);
        row.Unvax_80 = number_format(+row.Unvax_80);

        row.Age_adjusted_unvax_IR = number_format(+row.Age_adjusted_unvax_IR);
        row.Age_adjusted_vax_IR = number_format(+row.Age_adjusted_vax_IR);

        row.Week = formatDate(+row.Max_Week_Date)
        row.date = (row.Max_Week_Date);

        row.Max_Week_Date = parseDate(row.Max_Week_Date);
        row.Week_no = +row.Week_no;
        row.Week = formatDate(+row.Max_Week_Date)
        row.date = row.Max_Week_Date;
        row.month = +row.Index;
        return row;
    });
}

getLineChartData()
    .then(data => {
        let chart = new LineChart({
            data: data,
            isComplex: true,
            isInteractive: true,
        });
        chart.initVis('chart')
    });