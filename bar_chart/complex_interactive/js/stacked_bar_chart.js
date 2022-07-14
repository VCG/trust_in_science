 class BarChartComplexInt {

    constructor(data) {
        this.data = data;
        this.displayData = [];
        // console.log(data);

        // List of subgroups = header of the csv files = soil condition here
        this.subgroups = this.data.columns.slice(4);

        // color palette = one color per subgroup
        this.color = d3.scaleOrdinal()
            .domain(this.subgroups)
            .range(['#7dc9f5','#0984ea','#04386b', '#f4d166','#ef701b','#9e3a26'])

        this.initVis();
    }

    initVis() {
        let vis = this;


        // set the dimensions and margins of the graph
        vis.margin = {top: 20, right: 20, bottom: 70, left: 70};
        vis.width = 900 - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;


        vis.svg = d3.select("#chart")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);


        // Add X axis
        vis.x_scale = d3.scaleBand()
            .range([0, vis.width])
            .padding([0.2]);

        vis.x_axis = d3.axisBottom().scale(vis.x_scale);

        // Add Y axis
        vis.y_scale = d3.scaleLinear().range([vis.height, 0]);

        vis.y_axis = d3.axisLeft().scale(vis.y_scale);


        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "x-axis")
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "0.5em")
            .attr("dy", "1em")
            .style('font-size', '12px')
            .attr("transform", "rotate(0)");

        vis.svg.append("g").attr("class", "y-axis");


        // tooltip
        vis.tooltip = d3.select("body")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border-radius", "2px")
            .style("padding", "12px")
            .style("color", "#0c0c0c")
            .style('font-size', '14px')
            .style("position", "absolute")
            .style("box-shadow", "2px 2px 4px lightgrey")
            .style("padding", "10px");

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

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        vis.groups = vis.displayData.map(d => (d.Week));


        const yearFormat = d3.timeFormat("%Y");

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function(event, d) {
            console.log(event, d);
            const subgroupName = d3.select(this.parentNode).datum().key;
            const subgroupValue = d.data[subgroupName];
            const date = d.data.group;
            const year = yearFormat(d.data.Max_Week_Date);
            console.log(year)
            const week = d.data.Week;

            let dataForDate = vis.data.filter(f => f.group === date)[0];
            let total = 0;
            vis.subgroups.forEach(sg => total += parseInt(dataForDate[sg]));

            const number_format = d3.format(',');


            const color = d3.scaleOrdinal()
                .domain(vis.subgroups)
                .range(['#7dc9f5','#0984ea','#04386b',
                    '#f4d166','#ef701b','#9e3a26'])

            vis.tooltip
                .html(`
                  <b>Week:</b> ${week}<br>
                      <b>Year:</b> ${year}<br>
                       <br>

                        <b>Rate of Unvaccinated (per 100k):</b>
                        <br>

                       <span style="font-size:11px;color: ${color('Unvax_80')}"> <b>Ages 80+:</b></span>
                       <span style="font-size:11px;color: ${color('Unvax_80')}"> ${number_format(dataForDate['Unvax_80'])}</span><br>


                       <span style="font-size:11px;color: ${color('Unvax_50_79')}"> <b>Ages 50-79:</b></span>
                       <span style="font-size:11px;color: ${color('Unvax_50_79')}"> ${number_format(dataForDate['Unvax_50_79'])}</span><br>


                       <span style="font-size:11px;color: ${color('Unvax_18_49')}"> <b>Ages 18-49:</b></span>
                       <span style="font-size:11px;color: ${color('Unvax_18_49')}"> ${number_format(dataForDate['Unvax_18_49'])}</span><br>

                        <br>
                        <b>Rate of Vaccinated (per 100k):</b>
                         <br>

                       <span style="font-size:11px;color: ${color('Vax_80')}"> <b>Ages 80+:</b></span>
                       <span style="font-size:11px;color: ${color('Vax_80')}"> ${number_format(dataForDate['Vax_80'])}</span><br>


                       <span style="font-size:11px;color: ${color('Vax_50_79')}"> <b>Ages 50-79:</b></span>
                       <span style="font-size:11px;color: ${color('Vax_50_79')}"> ${number_format(dataForDate['Vax_50_79'])}</span><br>


                       <span style="font-size:11px;color: ${color('Vax_18_49')}"> <b>Ages 18-49:</b></span>
                       <span style="font-size:11px;color: ${color('Vax_18_49')}"> ${number_format(dataForDate['Vax_18_49'])}</span><br>

                      <br>`)

                .style("opacity", 1)
                .style("font-size", "11px")
                .style("left", ((event.x) +10) + "px")
                .style("top", ((event.y) +10) + "px");

            //change opacity to all non-highlighted bars
            vis.svg.selectAll(".main-rect").style("opacity", 0.1);

            // //reference this particular, highlighted bars with 1 opacity
            vis.svg.selectAll(".rect-bar-" + d.data.Week).style("opacity", 1);
        }


        const mouseleave = function(event, d) {
            vis.tooltip.style("opacity", 0);

            vis.svg.selectAll(".main-rect").style("opacity", 1);
        }

        //stack the data? --> stack per subgroup
        const stackedData = d3.stack()
            .keys(vis.subgroups)
            (vis.displayData);

        vis.x_scale.domain(vis.groups);
        vis.y_scale.domain([0, d3.max(stackedData, d => d3.max(d, function (d) { return d[1]; }))]);

        vis.svg.selectAll(".x-axis").transition().duration(200).call(vis.x_axis).style('font-size', '12px');
        vis.svg.selectAll(".y-axis").transition().duration(200).call(vis.y_axis).style('font-size', '12px');

        vis.svg.selectAll(".stacked").remove();

        // Show the bars
        vis.svg.append("g")
            .attr("class", "stacked")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .join("g")
            .attr("fill", d => vis.color(d.key))
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(d => d)
            .join("rect")
            .attr("class", d => "main-rect rect-bar-" + d.data.Week)
            .attr("x", d => vis.x_scale(d.data.Week))
            .attr("y", d => vis.y_scale(d[1]))
            .attr("height", d => vis.y_scale(d[0]) - vis.y_scale(d[1]))
            .attr("width", vis.x_scale.bandwidth())
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave);


        //grey y gridlines
        const make_x_gridlines = function() {
            return d3.axisLeft(vis.y_scale).ticks(5);
        }

        vis.svg.selectAll(".grid").remove();

        vis.svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + 0 + ",0)")
            .style("stroke-dasharray", "3 3")
            .call(make_x_gridlines()
                .tickSize(-vis.width)
                .tickFormat("")
            );
    }

    initBrush() {
        let vis = this;

        const height = 20;
        const width = 180;

        const groups2 = vis.data.map(d => (d.Week));

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
                vis.wrangleData(startDate, endDate);

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

        //y axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.width/4)
            .attr("y", 0-50)
            .attr("font-size", "16")
            .text("Case count per 100k people");

        //add x label
        vis.svg
            .append("text")
            .attr("text-anchor", "middle")
            .attr("x", vis.width/2)
            .attr("y", vis.height+60)
            .attr("class", "title")
            .text("Week Number")
            .attr("fill","black")
            .attr("font-size", "16")

    }
}
