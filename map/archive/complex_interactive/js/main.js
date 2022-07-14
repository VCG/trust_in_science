$("#chart-overlay").hide();
$("#chart-overlay .close").click(() => $("#chart-overlay").hide());

let parseDate = d3.timeParse("%Y-%m-%d");

d3.csv("data/data_fin.csv").then(function(data) {
    data.forEach(d => {
        d.date = parseDate(d.SubmissionDate);
        d.value = +d.NewCasesAdj;
        d.value2 = +d.SevenDayAvgAdj;
        console.log(data)
    });

    const maxNewCases = d3.max(data, d => d.value);
    let states = _.chain(data).groupBy("State").map((v, k) => ({ code: k, name: v[0].State2 })).value();
    states.forEach(state => {
        new LineChartSmall(`.state-${state.code.toLowerCase()}`, data, state.code, maxNewCases);
        $(`.state-${state.code.toLowerCase()}`).click(() => {
            new LineChartLarge("#chart-overlay", data, state.code);
            $("#chart-overlay .title").text(state.name);
            $("#chart-overlay").show();
        });
    });
});
