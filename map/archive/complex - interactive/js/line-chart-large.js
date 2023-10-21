class LineChartLarge {
    constructor(parentElement, data, state) {
        this.data = data.filter(d => d.State == state);
        this.state = state;
        this.parentElement = parentElement;

        this.initVis();
    }

    initVis() {
        let vis = this;

        let margin = { top: 50, right: 120, bottom: 50, left: 120 },
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

        // Tooltip - vaccinated
        let tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([30, 0])
            .html(function(d) {
                let chartType = d3.select(vis.parentElement).node().value;
                // return "<b>"+ "Date: "+ "</b>" + (vis.data, d => d.date) + "<br>" + "<b>" + "Number of New Cases: " + "</b>" + (d.value);
                return "date:" + d.value;
            });


        svg.call(tip);

        svg.append("path")
            .data([vis.data])
            .attr("class", "line")
            .on("mouseover", function(e, d) { tip.show(d, this); })
            .on("mouseout", tip.hide)
            .attr("d", valueline);


        svg.append("path")
            .data([vis.data])
            .attr("class", "line2")
            .attr("d", valueline2);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));



        let tooltip = svg.append("g")
            .attr("display", "none")
            .attr("class", "tooltip-group");

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
            .attr("y", 40)
            .style("font-size", '10')
            .style("fill", "black");

        let text2 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .style("font-size", '10')
            .attr("x", 5)
            .attr("y", 60)
            .style("fill", "black");

        let text3 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .style("font-size", '10')
            .attr("x", 5)
            .attr("y", 80)
            .style("fill", "red");

        let overlay = svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0)
            .attr("fill", "transparent")
            .on("mouseover", function (event, d) {
                tooltip.attr("display", "null");
            })
            .on("mouseout", function (event, d) {
                tooltip.attr("display", "none");
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
            text.text("Date: " + formatTime(closest.date));
            text2.text("New Cases: " + closest.value);
            text3.text("7-Day New Cases Avg: " + (closest.value2.toFixed(0)));


        }



    }
}
