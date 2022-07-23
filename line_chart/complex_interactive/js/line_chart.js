class LineChartComplexInt {
    constructor(data) {
        this.data = data;

        // create a list of keys
        this.keys = [ "Ages 80+","Ages 50-79","Ages 18-49"]

        this.color1 = d3.scaleOrdinal()
            .domain(this.keys)
            .range(['#9e3a26', '#ef701b', '#f4d166']);

        this.color2 = d3.scaleOrdinal()
            .domain(this.keys)
            .range(['#04386b','#0984ea','#7dc9f5']);

        this.initVis();
    }


    initVis() {
        let vis = this;


        // set the dimensions and margins of the graph
        vis.margin = {top: 20, right: 160, bottom: 70, left: 70};
        vis.width = 950 - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;


        vis.svg = d3.select("#chart")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "x-axis")
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "0.25em")
            .attr("dy", "1em")
            .style("font-size", '12')
            .attr("transform", "rotate(0)");

        vis.svg.append("g").attr("class", "y-axis")
            .style("font-size", '12');

        vis.tooltip = vis.svg.append("g")
            .attr("display", "none")
            .attr("class", "tooltip-group");

        vis.tooltip.append("line")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("x1", 0)
            .attr("y1", vis.height)
            .attr("x2", 0)
            .attr("y2", 0);

        vis.text = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 10)
            .attr("font-weight", 'bold')
            .style("fill", "black");

        vis.text2 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 30)
            .attr("font-weight", 'bold')
            .style("fill", "black");

        vis.text3 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 60)
            .style("fill", "black")
            .attr("font-weight", 'bold')
            .style("font-size", '14');

        vis.text4 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 80)
            .style("fill", "#9e3a26")
            .style("font-size", '14');

        vis.text5 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 100)
            .style("fill", "#ef701b")
            .style("font-size", '14');

        vis.text6 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 120)
            .style("fill", "#f4d166")
            .style("font-size", '14');

        vis.text7 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 160)
            .attr("font-weight", 'bold')
            .style("fill", "black")
            .style("font-size", '14');

        vis.text8 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 180)
            .style("fill", "#04386b")
            .style("font-size", '14');

        vis.text9 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 200)
            .style("fill", "#0984ea")
            .style("font-size", '14');

        vis.text10 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 220)
            .style("fill", "#7dc9f5")
            .style("font-size", '14');

        vis.overlay = vis.svg.append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr("x", 0)
            .attr("y", 0)
            .attr("fill", "transparent")
            .on("mouseover", function (event, d) {
                vis.tooltip.attr("display", "null");
            })
            .on("mouseout", function (event, d) {
                vis.tooltip.attr("display", "none");
            })
            .on("mousemove", mousemove);

        let bisectDate = d3.bisector(d=>d.date).left;
        const yearFormat = d3.timeFormat("%Y");

        function mousemove(event) {
            let x_coordinate = d3.pointer(event)[0];
            let x_date = vis.x_time.invert(x_coordinate);
            let index = bisectDate(vis.data, x_date);
            let closest = vis.data[index];

            vis.tooltip.attr("transform", "translate(" + x_coordinate + ")")
            vis.text.text("Week: " + (closest.Week1));
            vis.text2.text("Year: " + yearFormat(closest.date));

            vis.text3.text("Rate of Unvaccinated: ");
            vis.text4.text("Ages 80+: " + (closest.Unvax_80) + " per 100k");
            vis.text5.text("Ages 50-79: " + (closest.Unvax_50_79) + " per 100k");
            vis.text6.text("Ages 18-49: " + (closest.Unvax_18_49) + " per 100k");

            vis.text7.text("Rate of Vaccinated: ");

            vis.text8.text("Ages 80+: " + (closest.Vax_80) + " per 100k");
            vis.text9.text("Ages 50-79: " + (closest.Vax_50_79) + " per 100k");
            vis.text10.text("Ages 18-49: " + (closest.Vax_18_49) + " per 100k");
        }

        //x axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size","12")
            .attr("x", vis.width/2)
            .attr("y", vis.height+60)
            .attr("font-size", "16")
            .text("week number");

        //unvaccinated legend
        var legend = vis.svg.selectAll(".legend")
            .data(vis.keys)//data set for legends
            .enter().append("g")
            .attr("class", "legend")
            .attr("font-size", "16")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // //vaccinated legend
        var legend2 = vis.svg.selectAll(".legend2")
            .data(vis.keys)//data set for legends
            .enter().append("g")
            .attr("class", "legend")
            .attr("font-size", "16")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        //y axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.width/4)
            .attr("y", 0-50)
            .attr("font-size", "16")
            .text("Case count per 100k people");

        //add year labels to x axis (year 2021)
        vis.svg
            .append("text")
            .attr("x", 0)
            .attr("y", vis.height+40)
            .attr("class", "title_legend")
            .text("2021")
            .attr("fill","black")
            .attr("font-size", "12")

        //add year labels to x axis (year 2022)
        vis.svg
            .append("text")
            .attr("x", vis.width-100)
            .attr("y", vis.height+40)
            .attr("class", "title_legend1")
            .text("2022")
            .attr("fill","black")
            .attr("font-size", "12")

        vis.initBrush();

        vis.wrangleData();
    }

    wrangleData(startDate, endDate) {
        let vis = this;

        if (startDate && endDate) {
            vis.displayData = vis.data.filter(row => row.Max_Week_Date >= startDate && row.Max_Week_Date <= endDate);
        }
        else {
            vis.displayData = [...vis.data];
        }

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.svg.selectAll(".line").remove();
        vis.svg.selectAll(".grid").remove();



        const groups = vis.displayData.map(d => (d.Week1))
        // const groups2 = vis.displayData.map(d => (d.Week2))

        vis.x = d3.scaleBand()
            .domain(groups)
            .range([0, vis.width])
            .padding([0.7]);


        vis.x_time = d3.scaleTime()
            .domain(d3.extent(vis.displayData, function(d) { return d.date; }))
            .range([0, vis.width]);

        // // Add Y axis
        vis.y = d3.scaleLinear()
            .domain([0, d3.max(vis.displayData, function(d) { return +d.Unvax_50_79; })+500])
            .range([ vis.height, 0 ]);

        vis.svg.selectAll(".x-axis").transition().duration(200).call(d3.axisBottom(vis.x)).style("font-size", '12');
        vis.svg.selectAll(".y-axis").transition().duration(200).call(d3.axisLeft(vis.y)).style("font-size", '12');

        //grey y gridlines
        vis.make_x_gridlines= function() { return d3.axisLeft(vis.y).ticks(10); };

        vis.svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + 0 + ",0)")
            .style("stroke-dasharray", "3 3")
            .call(vis.make_x_gridlines()
                .tickSize(-vis.width)
                .tickFormat("")
            );

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        // vis.groups = vis.displayData.map(d => (d.Week1));

        // Add the unvaccinated line 18-49
        vis.svg.append("path")
            .datum(vis.displayData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#f4d166")
            .attr("stroke-width", 3.5)
            .attr("d", d3.line()
                .x(function(d) { return vis.x(d.Week1) })
                .y(function(d) { return vis.y(d.Unvax_18_49) })
            )
            .style("pointer-events", "none");

        // Add the unvaccinated line 50-79
        vis.svg.append("path")
            .datum(vis.displayData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#ef701b")
            .attr("stroke-width", 3.5)
            .attr("d", d3.line()
                .x(function(d) { return vis.x(d.Week1) })
                .y(function(d) { return vis.y(d.Unvax_50_79) })
            )
            .style("pointer-events", "none");

        // Add the unvaccinated line 80+
        vis.svg.append("path")
            .datum(vis.displayData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#9e3a26")
            .attr("stroke-width", 3.5)
            .attr("d", d3.line()
                .x(function(d) { return vis.x(d.Week1) })
                .y(function(d) { return vis.y(d.Unvax_80) })
            )
            .style("pointer-events", "none");

        // Add the vaccinated line 18-49
        vis.svg.append("path")
            .datum(vis.displayData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#7dc9f5")
            .attr("stroke-width", 3.5)
            .attr("stroke-dasharray", ("4, 4"))
            .attr("d", d3.line()
                .x(function(d) { return vis.x(d.Week1) })
                .y(function(d) { return vis.y(d.Vax_18_49) })
            )
            .style("pointer-events", "none");

        // Add the vaccinated line 50-79
        vis.svg.append("path")
            .datum(vis.displayData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#0984ea")
            .attr("stroke-width", 3.5)
            .attr("stroke-dasharray", ("4, 4"))
            .attr("d", d3.line()
                .x(function(d) { return vis.x(d.Week1) })
                .y(function(d) { return vis.y(d.Vax_50_79) })
            )
            .style("pointer-events", "none");

        // Add the vaccinated line 80
        vis.svg.append("path")
            .datum(vis.displayData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#04386b")
            .attr("stroke-width", 3.5)
            .attr("stroke-dasharray", ("4, 4"))
            .attr("d", d3.line()
                .x(function(d) { return vis.x(d.Week1) })
                .y(function(d) { return vis.y(d.Vax_80) })
            )
            .style("pointer-events", "none");


    }

    initBrush() {
        let vis = this;

        const height = 20;
        const width = 180;



        const groups2 = vis.data.map(d => (d.Week1));

        let x = d3.scaleBand()
            .domain(groups2)
            .range([0, width])
            .padding([1.5]);

        let xAxis = d3.axisBottom()
            .scale(x)
            .tickFormat((interval,i) => { return i%5 !== 0 ? " ": interval; })
            .ticks(5)
            .tickSize([10]);

        let xTime = d3.scaleTime()
            .domain(d3.extent(vis.data, d => d.Max_Week_Date))
            .range([0, width]);

        let brush = d3.brushX()
            .extent([[0,0], [width, height]])
            .on("brush", brushed)
            .on("brush end", function(e) {
                let startDate = xTime.invert(e.selection[0]);
                let endDate = xTime.invert(e.selection[1]);
                vis.wrangleData(startDate, endDate)

                vis.svg.select(".title_legend").remove();
                vis.svg.select(".title_legend1").remove();
            });

        let svg = d3.select("#brush-chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(xAxis);

        let brushg = svg.append("g")
            .attr("class", "brush")
            .attr("width", width)
            .attr("height", height)
            .call(brush);

        svg.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', width)
            .attr('y2', 0)


        function brushed() {
            let range = d3.brushSelection(this);

            d3.selectAll("span")
                .text(function(d, i) { return Math.round(range[i]); });
        }


    }
}