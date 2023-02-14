$("#chart-overlay").hide();
$("#chart-overlay .close").click(() => $("#chart-overlay").hide());

let parseDate = d3.timeParse("%Y-%m-%d");
let number_format = d3.format(",")

// load data using promises
let promises = [
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"), // not projected -> you need to do it
    d3.csv("data/cumulative_cases_simple_map.csv", (row, _) => {
        row.Tot_Cases = +row.Tot_Cases;
        row.Tot_Cases2 = number_format(+row.Tot_Cases);
        return row;
    }),
    d3.csv("data/data_fin.csv").then(function(data) {
        data.forEach(d => {
            d.date = parseDate(d.SubmissionDate);
            d.value = +d.NewCasesAdj;
            d.value2 = +d.SevenDayAvgAdj;
        });
        //const maxNewCases = d3.max(data, d => d.value);
        // states.forEach(state => {
        //     new LineChartSmall(`.state-${state.code.toLowerCase()}`, data, state, maxNewCases);
        //     $(`.state-${state.code.toLowerCase()}`).click(() => {
        //         new LineChartLarge("#chart-overlay", data, state.code);
        //         new LineChartLarge("#chart-overlay", data, state.code);
        //         $("#chart-overlay .title").text(state.name);
        //         $("#chart-overlay").show();
        //     });
        // });
        return _.chain(data).groupBy("State").map((v, k) => ({code: k, name: v[0].State2})).value();
    })
];

function getMapChartData() {
    return Promise.all(promises)
        .then(function (data) {
            return data;
        })
        .catch(function (err) {
            console.log(err)
        });
}

getMapChartData()
    .then(data => {
      //  console.log(data)
        let chart = new MapChart({
            data: data,
            isComplex: false,
            isInteractive: false,
            source: true
        });
        chart.initVis('chart')
    })