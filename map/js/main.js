// let parseDate = d3.timeParse("%Y-%m-%d");
// let number_format = d3.format(",")

// load data using promises
let promises = [
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"), // not projected -> you need to do it
    d3.csv("data/cumulative_cases_simple_map.csv", (row, _) => {
        row.Tot_Cases = +row.Tot_Cases;
        row.Tot_Cases2 = number_format(+row.Tot_Cases);
        return row;
    }),
    d3.csv("data/data_fin.csv").then(function (data) {
        data.forEach(d => {
            d.date = parseDate(d.SubmissionDate);
            d.value = +d.NewCasesAdj;
            d.value2 = +d.SevenDayAvgAdj;
        });
        return [_.chain(data).groupBy("State").map((v, k) => ({code: k, name: v[0].State2})).value(), data];
    })
];

function getMapChartData(props) {
    Promise.all(promises)
        .then(function (data) {
            // TODO: Adapt tourstep to map
            return d3.json(`data/${props.showCovidData ? "covid" : "non_covid"}_toursteps.json`)
            // return d3.json(`https://vcg.github.io/trust_in_science/map/data/${props.showCovidData ? "covid" : "non_covid"}_toursteps.json`)
                .then(toursteps => {
                    let chart = new MapChart({ // ADAPT to Props
                        data: data,
                        complexity: props.complexity,
                        isInteractive: props.complexity === 'complex',
                        source: props.showSource,
                        allowInteraction: props.allowInteraction,
                    });
                    chart.initVis('chart');
                    if (props.doTour) createTour(props.complexity, toursteps, chart.provData);
                    trackFocus(chart.provData)
                });
        })
        .catch(function (err) {
            console.log(err)
        });
}

// let props = {
//     complexity: 'complex',
//     doTour: false,
//     showSource: true,
//     changes: true,
//     showCovidData: true,
//     allowInteraction: true
// };
// getMapChartData(props);

