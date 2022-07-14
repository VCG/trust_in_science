let parseDate = d3.timeParse("%Y-%m-%d");

let formatDate = d3.timeFormat("%V");


let formatTime = d3.timeFormat("%Y-%m-%d");

const yearFormat = d3.timeFormat("%Y");

number_format = d3.format(".2d")

let line_chart_complex_int_data;

// d3.csv("data/line_chart_complex.csv", (row,i) => {

d3.csv("https://raw.githubusercontent.com/VCG/trust_in_science/barbara_branch/line_chart/complex_interactive/data/line_chart_complex.csv", (row,i) => {

    row.Vax_18_49 = number_format(+row.Vax_18_49);
    row.Vax_50_79 = number_format(+row.Vax_50_79);
    row.Vax_80 = number_format(+row.Vax_80);
    row.Unvax_18_49 = number_format(+row.Unvax_18_49);
    row.Unvax_50_79 = number_format(+row.Unvax_50_79);
    row.Unvax_80 = number_format(+row.Unvax_80);

 //  row.Max_Week_Date = row.Max_Week_Date;
   row.Week = formatDate(+row.Max_Week_Date)
   row.date = (row.Max_Week_Date);

    row.Max_Week_Date = parseDate(row.Max_Week_Date);
    //row.Max_Week_Date = formatDate(row.Max_Week_Date);
    row.Week_no = +row.Week_no;
    row.Week = formatDate(+row.Max_Week_Date)
    row.date = row.Max_Week_Date;
  //  row.Max_Week_Date = formatDate(row.Max_Week_Date);
    return row;


})


    // .then(data => {
    //   new LineChart(data);
    // });

    .then(loadData => {
        line_chart_complex_int_data = loadData
//      //console.log(new LineChart(data))
        new LineChartComplexInt(loadData)

    });