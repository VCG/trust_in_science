class LineChartSmall {
    constructor(parentElement, data, state, maxValue) {
        this.data = data.filter(d => d.State == state.code);
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


        let tooltip = svg.append("g")
            .attr("display", "none")
            .attr("class", "tooltip-group");

        tooltip.append("line")
            .attr("stroke", "yellow")
            .attr("stroke-width", 2)
            .attr("x1", 0)
            .attr("y1", height)
            .attr("x2", 0)
            .attr("y2", 0);

        // Tooltip - vaccinated
        const stateName = this.state.name;
        const dateFormatter = d3.timeFormat("%d/%m/%Y");

        let tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([5, 0])
            .html(function(e, d) {
                tooltip.attr("transform", `translate(${e.layerX})`);

                let date = x.invert(e.layerX);
                let value = y.invert(e.layerY);
                return `<div style="text-align:center;font-weight:bold;margin-bottom: 10px;">${stateName}</div><div><b> Date: </b> ${dateFormatter(date)}<br /><b>Number of New Cases: ${Math.floor(value)}</b></div>`;
            });

        svg.call(tip)
            .on("mouseover", function() { tooltip.attr("display", "null"); })
            .on("mousemove", function(e, d) { tip.show(e, d, this); })
            .on("mouseout", function() { tooltip.attr("display", "none"); tip.hide(); } );

        svg.append("path")
            .data([vis.data])
            .attr("class", "line")
            .attr("d", valueline);

        $(vis.parentElement).css("background-color", colorScale(d3.max(vis.data, d => d.value)));
    }
}
