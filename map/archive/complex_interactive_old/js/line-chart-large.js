class LineChartLarge {
    constructor(parentElement, data, state) {
        this.data = data.filter(d => d.State == state);
        this.state = state;
        this.parentElement = parentElement;

        this.initVis();
    }

    initVis() {
        let vis = this;

        let margin = { top: 50, right: 148, bottom: 50, left: 50 },
            width = 700 - margin.left - margin.right,
            height = 440 - margin.top - margin.bottom;

        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

        let valueline = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value));

        let valueline2 = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value2));

        d3.select(vis.parentElement).select("svg").remove();

        let svg = d3.select(vis.parentElement).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(vis.data, d => d.date));
        y.domain(d3.extent(vis.data, d => d.value));

        const dateFormatter = d3.timeFormat("%d/%m/%Y");


        svg.append("path")
            .data([vis.data])
            .attr("class", "line")
            .attr("d", valueline)
            .style("pointer-events", "none");


        svg.append("path")
            .data([vis.data])
            .attr("class", "line2")
            .attr("d", valueline2)
            .style("pointer-events", "none");

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));



        svg.append("g")
            .call(d3.axisLeft(y));




        svg.append("path")
            .data([vis.data])
            .attr("class", "line2")
            .attr("d", valueline2);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));



        var id = "md-shadow";
        var deviation = 2;
        var offset = 2;
        var slope = 0.25;



// create filter and assign provided id
        var filter = svg.append("filter")
            .attr("height", "125%")    // adjust this if shadow is clipped
            .attr("id", id);

// ambient shadow into ambientBlur
//   may be able to offset and reuse this for cast, unless modified
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", deviation)
            .attr("result", "ambientBlur");

// cast shadow into castBlur
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", deviation)
            .attr("result", "castBlur");

// offsetting cast shadow into offsetBlur
        filter.append("feOffset")
            .attr("in", "castBlur")
            .attr("dx", offset - 1)
            .attr("dy", offset)
            .attr("result", "offsetBlur");

// combining ambient and cast shadows
        filter.append("feComposite")
            .attr("in", "ambientBlur")
            .attr("in2", "offsetBlur")
            .attr("result", "compositeShadow");

// applying alpha and transferring shadow
        filter.append("feComponentTransfer")
            .append("feFuncA")
            .attr("type", "linear")
            .attr("slope", slope);

// merging and outputting results
        var feMerge = filter.append("feMerge");
        feMerge.append('feMergeNode')
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");






        var keys = [" "]


        var legend = svg.selectAll(".legend")
            .data(keys)//data set for legends
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


        legend.append("line")//making a line for legend
            .attr("x1", width + 40)
            .attr("x2", width+20)
            .attr("y1", 25)
            .attr("y2", 25)
            .attr("stroke", "red")
            .attr("stroke-width", 2)


        legend.append("line")//making a line for legend
            .attr("x1", width + 40)
            .attr("x2", width+20)
            .attr("y1", 5)
            .attr("y2", 5)
            .attr("stroke", "black")
            .attr("stroke-width", 2)


        legend.append("text")
            .attr("x", width +42)
            .attr("y", 5)
            .attr("dy", ".35em")
            .style("text-anchor", "left")
            .text("New Cases")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "9");

        legend.append("text")
            .attr("x", width +42)
            .attr("y", 25)
            .attr("dy", ".35em")
            .style("text-anchor", "left")
            .text("7-Day New Cases Average")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "9");



        let tooltip = svg.append("g")
            .attr("display", "none")
            .attr("class", "tooltip-group");



        tooltip.append("rect")
            .attr("width", 140)
            .attr("height", height-230)
            .attr("x", 0)
            .attr("y", 30)
            .style("fill", "white")
        //    .style("filter", "url(#md-shadow)")
            .attr("class","tool-rect-background")




        tooltip.append("line")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("x1", 0)
            .attr("y1", height)
            .attr("x2", 0)
            .attr("y2", 0);


        let text = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 5)
            .attr("y", 60)
            .style("font-size", '10')
            .style("fill", "black");

        let text2 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .style("font-size", '10')
            .attr("x", 5)
            .attr("y", 80)
            .style("fill", "black");

        let text3 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .style("font-size", '10')
            .attr("x", 5)
            .attr("y", 100)
            .style("fill", "black");

        let text4 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .style("font-size", '10')
            .attr("x", 5)
            .attr("y", 120)
            .style("fill", "red");

        let overlay = svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0)
            .style("position", "absolute")
            .style("box-shadow", "2px 2px 4px lightgrey")
            .style("padding", "10px")
            .attr("fill", "transparent")
            .on("mouseover", function (event, d) {
                tooltip.attr("display", "null");
            })
            .on("mouseout", function (event, d) {
                tooltip.attr("display", "none")
                    .style("opacity", 0)
            })
            .on("mousemove", mousemove);

        let bisectDate = d3.bisector(d=>d.date).left;
        let formatTime = d3.timeFormat("%Y-%m-%d");

        const yearFormat = d3.timeFormat("%Y");

        const x_time = d3.scaleTime()
            .domain(d3.extent(vis.data, function(d) { return d.date; }))
            .range([0, width]);

        function mousemove(event) {
            let x_coordinate = d3.pointer(event)[0];
            let x_date = x_time.invert(x_coordinate);
            let index = bisectDate(vis.data, x_date);
            let closest = vis.data[index];


            tooltip.attr("transform", "translate(" + x_coordinate + ")")
            text.text("State: " + (closest.State2));
            text2.text("Date: " + formatTime(closest.date));
            text3.text("New Cases: " + closest.value);
            text4.text("7-Day New Cases Avg: " + (closest.value2.toFixed(0)));


        }



    }
}
