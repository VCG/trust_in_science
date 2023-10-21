class LineChart {
    constructor(parentElement, data, state, maxValue) {
        this.data = data.filter(d => d.State == state);
        this.state = state;
        this.maxValue = maxValue;
        this.parentElement = parentElement;

        this.initVis();
    }

    initVis() {
        let vis = this;

        let margin = { top: 0, right: 0, bottom: 0, left: 0 },
            width = 60 - margin.left - margin.right,
            height = 60 - margin.top - margin.bottom;

        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

        let valueline = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); });

        let svg = d3.select(vis.parentElement).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        x.domain(d3.extent(vis.data, function(d) { return d.date; }));
        y.domain([0, vis.maxValue]);

        svg.append("path")
            .data([vis.data])
            .attr("class", "line")
            .attr("d", valueline);
    }
}