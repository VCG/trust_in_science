let parseDate = d3.timeParse("%Y-%m-%d");

d3.csv("data/data.csv").then(function(data) {
    data.forEach(function(d) {
        d.date = parseDate(d.SubmissionDate);
        d.value = +d.NewCases;
    });

    const maxNewCases = d3.max(data, d => d.value);
    let states = Object.keys(_.groupBy(data, d => d.State));
    states.forEach(state => {
        new LineChart(`.state-${state.toLowerCase()}`, data, state, maxNewCases);
    });
});