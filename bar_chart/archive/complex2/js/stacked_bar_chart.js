 class StackedBarChart {

    constructor(data) {
        this.data = data;
        this.displayData = [];
        // console.log(data);

        // List of subgroups = header of the csv files = soil condition here
        this.subgroups = this.data.columns.slice(4);
        // console.log(this.subgroups);

        // color palette = one color per subgroup
        this.color = d3.scaleOrdinal()
            .domain(this.subgroups)
            .range(['#7dc9f5','#0984ea','#04386b', '#f4d166','#ef701b','#9e3a26'])

        this.initVis();

        // this.initBrush()
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



       vis.groups = vis.data.map(d => (d.Week))
        console.log(vis.groups)


        vis.month_groups = vis.data.map(d => (d.month))
        console.log(vis.month_groups)


        // Add X axis
        vis.x = d3.scaleBand()
            .domain(vis.groups)
            .range([0, vis.width])
            .padding([0.2])

        vis.x2 = d3.scaleBand()
            .domain(vis.month_groups)
            .range([0, vis.width])
            .padding([0.2])


        let xAxisGenerator = d3.axisBottom(vis.x)
            .tickSize(10)
        // .tickPadding(5)


        //show major axis lines
        let xAxisGenerator2 = d3.axisBottom(vis.x2)
            .tickSize(30)
            .tickValues([2,6,11,15,19,24,28,32,37,41,46])


        //set axis labels
        let xAxisGenerator3 = d3.axisBottom(vis.x)
            .tickSize(13)
            .tickValues([16,,25,29,,38,42,,51,,])

        //set axis labels
        let xAxisGenerator4 = d3.axisBottom(vis.x)
            .tickSize(13)
            .tickValues([,20,,,,,,45,,,])


        //set axis labels
        let xAxisGenerator5 = d3.axisBottom(vis.x)
            .tickSize(13)
            .tickValues([,,,,33,,,,,3,])


        let tickLabels = [];
        xAxisGenerator.tickFormat((d,i) => tickLabels[i]);


        let tickLabels2 = [];
        xAxisGenerator2.tickFormat((d,i) => tickLabels2[i]);


        let tickLabels3 = ['April', '','June', 'July' , '', 'September', 'October', '', 'December', '','February']
        xAxisGenerator3.tickFormat((d,i) => tickLabels3[i]);

        let tickLabels4 = ['', 'May','', '' , '', '', '', 'November', '', '','']
        xAxisGenerator4.tickFormat((d,i) => tickLabels4[i]);

        let tickLabels5 = ['', '','', '' , 'August', '', '', '', '', 'January','']
        xAxisGenerator5.tickFormat((d,i) => tickLabels5[i]);



        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(xAxisGenerator)
            .selectAll("text")
            .attr("font-size", "12")
            .style("text-anchor", "end")
            .attr("dx", "0.5em")
            .attr("dy", "1em")
            .attr("transform", "rotate(0)");

        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "axisMonths2")
            .call(xAxisGenerator2)
            .selectAll("text").attr("id", "xAxis2")
            .attr("font-size", "12")
            .style("text-anchor", "end")
            .attr("dx", "0.5em")
            .attr("dy", "1em")
            .attr("transform", "rotate(0)");

        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "axisMonths")
            .call(xAxisGenerator3)
            .selectAll("text")
            .attr("font-size", "12")
            .style("text-anchor", "middle")
            .attr("dx", "0em")
            .attr("dy", "1em")
            .attr("transform", "rotate(0)")

        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "axisMonths")
            .call(xAxisGenerator4)
            .selectAll("text")
            .attr("font-size", "12")
            .style("text-anchor", "start")
            .attr("dx", "0em")
            .attr("dy", "1em")
            .attr("transform", "rotate(0)")

        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "axisMonths")
            .call(xAxisGenerator5)
            .selectAll("text")
            .attr("font-size", "12")
            .style("text-anchor", "start")
            .attr("dx", "-0.5em")
            .attr("dy", "1em")
            .attr("transform", "rotate(0)")


        //



        // Add Y axis
        vis.y_scale = d3.scaleLinear().range([vis.height, 0]);

        vis.y_axis = d3.axisLeft().scale(vis.y_scale);

        vis.svg.append("g").attr("class", "y-axis");


        // tooltip
        vis.tooltip = d3.select("body")
            .append("div")
            // .style("opacity", 0)
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

        //stack the data? --> stack per subgroup
        const stackedData = d3.stack()
            .keys(vis.subgroups)
            (vis.displayData);

        // vis.x_scale.domain(vis.groups);
        vis.y_scale.domain([0, d3.max(stackedData, d => d3.max(d, function (d) { return d[1]; }))]);

       // vis.svg.selectAll(".x-axis").transition().duration(200).call(vis.x_axis).style('font-size', '12px');
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
            .attr("x", d => vis.x(d.data.Week))
            .attr("y", d => vis.y_scale(d[1]))
            .attr("height", d => vis.y_scale(d[0]) - vis.y_scale(d[1]))
            .attr("width", vis.x.bandwidth())
            .style("pointer-events", "none");

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

        const yearFormat = d3.timeFormat("%Y");
        const number_format = d3.format(',');
        const color = d3.scaleOrdinal()
            .domain(vis.subgroups)
            .range(['#7dc9f5','#0984ea','#04386b', '#f4d166','#ef701b','#9e3a26']);

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function(e, d) {
            const date = d.data.group;
            const year = yearFormat(d.data.Max_Week_Date);
            const week = d.data.Week;
            let dataForDate = d.data;
            let total = 0;
            vis.subgroups.forEach(sg => total += parseInt(dataForDate[sg]));

            vis.tooltip
                .html(`
                    <b>Week:</b> ${week}<br>
                    <b>Year:</b> ${year}<br>
                    <br>
                    <b>Rate of Unvaccinated (per 100k):</b>
                    <br>
                    <span style="font-size:11px;color: ${color('Unvax_80')}"> <b>Ages 80+:</b></span>
                    <span style="font-size:11px;color: ${color('Unvax_80')}"> ${number_format(dataForDate['Unvax_80'])}</span>
                    <br>
                    <span style="font-size:11px;color: ${color('Unvax_50_79')}"> <b>Ages 50-79:</b></span>
                    <span style="font-size:11px;color: ${color('Unvax_50_79')}"> ${number_format(dataForDate['Unvax_50_79'])}</span>
                    <br>
                    <span style="font-size:11px;color: ${color('Unvax_18_49')}"> <b>Ages 18-49:</b></span>
                    <span style="font-size:11px;color: ${color('Unvax_18_49')}"> ${number_format(dataForDate['Unvax_18_49'])}</span>
                    <br><br>
                    <b>Rate of Vaccinated (per 100k):</b>
                    <br>
                    <span style="font-size:11px;color: ${color('Vax_80')}"> <b>Ages 80+:</b></span>
                    <span style="font-size:11px;color: ${color('Vax_80')}"> ${number_format(dataForDate['Vax_80'])}</span>
                    <br>
                    <span style="font-size:11px;color: ${color('Vax_50_79')}"> <b>Ages 50-79:</b></span>
                    <span style="font-size:11px;color: ${color('Vax_50_79')}"> ${number_format(dataForDate['Vax_50_79'])}</span>
                    <br>
                    <span style="font-size:11px;color: ${color('Vax_18_49')}"> <b>Ages 18-49:</b></span>
                    <span style="font-size:11px;color: ${color('Vax_18_49')}"> ${number_format(dataForDate['Vax_18_49'])}</span>
                    <br><br>
                `)
                .style("opacity", 1)
                .style("font-size", "11px")
                .style("display", "block")
                .style("left", ((event.x) +10) + "px")
                .style("top", ((event.y - 70) ) + "px");

            // change opacity to all non-highlighted bars
            vis.svg.selectAll(".main-rect").style("opacity", 0.3);

            // reference this particular, highlighted bars with 1 opacity
            vis.svg.selectAll(".rect-bar-" + d.data.Week).style("opacity", 1);
        };

        const mouseleave = function(event, d) {
            vis.tooltip.style("opacity", 0)
                .style("display", "none")
            vis.svg.selectAll(".main-rect").style("opacity", 1);
        }

        vis.svg.selectAll(".overlay").remove();

        vis.svg.append("g")
            .selectAll(".overlay")
            .data(stackedData[5])
            .join("rect")
            .attr("class", "overlay")
            .attr("x", d => vis.x(d.data.Week))
            .attr("y", d => vis.y_scale(d[1]))
            .attr("height", d => vis.y_scale(0) - vis.y_scale(d[1]))
            .attr("width", vis.x.bandwidth())
            .style("fill", "transparent")
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave);
    }

}
