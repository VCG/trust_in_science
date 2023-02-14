$("#chart-overlay").hide();
$("#chart-overlay .close").click(() => $("#chart-overlay").hide());

let parseDate = d3.timeParse("%Y-%m-%d");


// let commaFormat = d3.format(',');

d3.csv("data/complex_7day_avg.csv").then(function(data) {
    data.forEach(d => {
        d.date = parseDate(d.week_start);
        d.value = +d.Week_Avg;
        // d.value2 = +d.SevenDayAvgAdj;
    });

    const maxNewCases = d3.max(data, d => d.value);
    let states = _.chain(data).groupBy("State").map((v, k) => ({ code: k, name: v[0].State2 })).value();
    states.forEach(state => {
        new LineChartSmall(`.state-${state.code.toLowerCase()}`, data, state, maxNewCases);
    });
});
