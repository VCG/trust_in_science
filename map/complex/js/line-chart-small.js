class LineChartSmallComplex {
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

        let margin = { top: 1, right: 1, bottom: 1, left: 1 },
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

        // svg.append("path")
        //     .data([vis.data])
        //     .attr("class", "line")
        //     .attr("d", valueline);

        const dateFormatter = d3.timeFormat("%d/%m/%Y");


     //   Tooltip - vaccinated
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


        //

        // let tooltip = svg.append("g")
        //     .attr("display", "none")
        //     .attr("class", "tooltip-group");
        //
        // tooltip.append("line")
        //     .attr("stroke", "black")
        //     .attr("stroke-width", 1)
        //     .attr("x1", 0)
        //     .attr("y1", height)
        //     .attr("x2", 0)
        //     .attr("y2", 0);
        //
        //
        // let text = tooltip.append("text")
        //     .attr("class", "tooltip-text")
        //     .attr("x", 5)
        //     .attr("y", 22)
        //     .style("font-size", '9')
        //     .style("fill", "black");
        //
        // let text2 = tooltip.append("text")
        //     .attr("class", "tooltip-text")
        //     .style("font-size", '9')
        //     .attr("x", 5)
        //     .attr("y", 32)
        //     .style("fill", "black");

        // let overlay = svg.append("rect")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .attr("x", 0)
        //     .attr("y", 0)
        //     .attr("fill", "transparent")
        //     .on("mouseover", function (event, d) {
        //         tooltip.attr("display", "null");
        //     })
        //     .on("mouseout", function (event, d) {
        //         tooltip.attr("display", "none");
        //     })
        //     .on("mousemove", mousemove);
        //
        // let bisectDate = d3.bisector(d=>d.date).left;
        // let formatTime = d3.timeFormat("%Y-%m-%d");
        //
        // const yearFormat = d3.timeFormat("%Y");
        //
        // const x_time = d3.scaleTime()
        //     .domain(d3.extent(vis.data, function(d) { return d.date; }))
        //     .range([0, width]);
        //
        // function mousemove(event) {
        //     let x_coordinate = d3.pointer(event)[0];
        //     let x_date = x_time.invert(x_coordinate);
        //     let index = bisectDate(vis.data, x_date);
        //     let closest = vis.data[index];
        //
        //
        //     tooltip.attr("transform", "translate(" + x_coordinate + ")")
        //         // text.text(formatTime(closest.date));
        //         // text2.text("Cases: " + closest.value);


        // }

        $(vis.parentElement).css("background-color", colorScale(d3.max(vis.data, d => d.value)));


    }


}
