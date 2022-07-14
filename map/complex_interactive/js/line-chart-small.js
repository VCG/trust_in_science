class LineChartSmallComplexInt {
    constructor(parentElement, data, state, maxValue) {
        this.data = data.filter(d => d.State == state);
        this.state = state;
        this.maxValue = maxValue;
        this.parentElement = parentElement;

        this.colorScale = d3.scaleSequential(d3.interpolateBlues);

        this.initVis();
    }

    initVis() {
        let vis = this;

        let margin = { top: 0, right: 0, bottom: 0, left: 0 },
            width = 60 - margin.left - margin.right,
            height = 60 - margin.top - margin.bottom;

        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);
        let colorScale = d3.scaleSequential().interpolator(d3.interpolateBlues);

        let valueline = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value));

        let svg = d3.select(vis.parentElement).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        x.domain(d3.extent(vis.data, d => d.date));
        y.domain(d3.extent(vis.data, d => d.value));
        colorScale.domain([0, vis.maxValue * 2]);

        const dateFormatter = d3.timeFormat("%d/%m/%Y");

        // Tooltip - vaccinated
        let tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([30, 0])
            .html(function(e, d) {
                let date = x.invert(e.layerX);
                let value = y.invert(e.layerY);
                return `<b> Date: </b> ${dateFormatter(date)}<br /><b>Number of New Cases: ${Math.floor(value)}</b> `;
            });

        svg.call(tip);


        svg.selectAll("dot")
            .data(vis.data)
            .join("circle")
            .attr("cx", d => x(d.date))
            .attr("cy", d => y(d.value))
            .attr("r", 7)
            .attr("fill", "transparent")
            .on("mouseover", function(){d3.select(this).style("fill", "yellow");})
            .on("mouseout", function(){d3.select(this).style("fill", "transparent");})


        svg.append("path")
            .data([vis.data])
            .attr("class", "line")
            .on("mousemove", function(e, d) { tip.show(e, d, this); })
            .on("mouseout", tip.hide)
            .attr("d", valueline);


        $(vis.parentElement).css("background-color", colorScale(d3.max(vis.data, d => d.value)));

    }
}
