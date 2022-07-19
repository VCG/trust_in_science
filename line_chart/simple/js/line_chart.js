class LineChartSimple {
    constructor(data) {

        this.data = data;

        this.initVis();
    }


    initVis() {
        let vis = this;


        vis.margin = {top: 100, right: 210, bottom: 70, left: 70},
            vis.width = 1000 - vis.margin.left - vis.margin.right,
            vis.height = 600 - vis.margin.top - vis.margin.bottom;


        vis.svg = d3.select("#chart")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        const groups = vis.data.map(d => (d.Week_no))
        console.log(groups)

        const Week_format1 = d3.timeFormat("%V");
        const Year_format1 = d3.timeFormat("%Y");



        const month_groups = vis.data.map(d => (d.month))
        console.log(month_groups)


        // Add X axis
        const x = d3.scaleBand()
            .domain(groups)
            .range([0, vis.width])
            .padding([0.2])

        var x2 = d3.scaleBand()
            .domain(month_groups)
            .range([0, vis.width])
            .padding([0.2])


        let xAxisGenerator = d3.axisBottom(x)
            .tickSize(10)
        // .tickPadding(5)


        //show major axis lines
        let xAxisGenerator2 = d3.axisBottom(x2)
            .tickSize(30)
            .tickValues([2,6,11,15,19,24,28,32,37,41,46])


        //set axis labels
        let xAxisGenerator3 = d3.axisBottom(x)
            .tickSize(13)
            .tickValues([16,,25,29,,38,42,,51,,])

        //set axis labels
        let xAxisGenerator4 = d3.axisBottom(x)
            .tickSize(13)
            .tickValues([,20,,,,,,45,,,])


        //set axis labels
        let xAxisGenerator5 = d3.axisBottom(x)
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




        const x_time = d3.scaleTime()
            .domain(d3.extent(vis.data, function(d) { return d.date; }))
            .range([0, vis.width]);



        // // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(vis.data, function(d) { return +d.Age_adjusted_unvax_IR; })])
            .range([ vis.height, 0 ]);
        vis.svg.append("g")
            .call(d3.axisLeft(y))
            .style("font-size", '12');

        //grey y gridlines
        vis.make_x_gridlines= function() {
            return d3.axisLeft(y)
                .ticks(5)
        }
        vis.svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + 0 + ",0)")
            .style("stroke-dasharray", "3 3")
            .call(vis.make_x_gridlines()
                .tickSize(-vis.width)
                .tickFormat("")
            )


        // Add the unvaccinated line
        vis.svg.append("path")
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 3.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.Week_no) })
                .y(function(d) { return y(d.Age_adjusted_unvax_IR) })

            )


        // // tooltip
        const tooltip2 = vis.svg
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




        // Add the vaccinated line
        vis.svg.append("path")
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 3.5)
            .attr("stroke-dasharray", ("4, 4"))
            .attr("d", d3.line()
                .x(function(d) { return x(d.Week_no) })
                .y(function(d) { return y(d.Age_adjusted_vax_IR) })
            )


        //overall chart title
        vis.svg
            .append("text")
            .attr("x", 0)
            .attr("y", (vis.margin.top/5)-vis.margin.top)
            .attr("class", "title")
            .text("Weekly count of vaccinated & unvaccinated individuals who caught Covid-19")
            .attr("fill","black")
            .attr("font-size", "20")
            .attr("font-weight","bold")
            .attr("font-family", "Segoe UI");

        //overall chart subtitle
        vis.svg
            .append("text")
            .attr("x", 0)
            .attr("y", (vis.margin.top/5)-vis.margin.top+30)
            .attr("class", "title")
            .text("Apr 2021-Feb 2022")
            .attr("fill","black")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "17")

        //add instructions
        vis.svg
            .append("text")
            .attr("x", 0)
            .attr("y", (vis.margin.top/5)-vis.margin.top+60)
            .attr("class", "title")
            .text("*Hover over the lines to explore further")
            .attr("fill", "black")
            .attr("font-size", "12")
            .attr("font-family", "Segoe UI")
            .attr("font-style", "italic")



        //y axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.width/3)
            .attr("y", 0-50)
            .attr("font-size", "16")
            .attr("font-family", "Segoe UI")
            .text("Case count per 100k people");

        //x axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size","12")
            .attr("x", vis.width/2)
            .attr("y", vis.height+70)
            .attr("font-size", "16")
            .attr("font-family", "Segoe UI")
            .text("week number");



        // create a list of keys
        var keys = [" "]



        var legend = vis.svg.selectAll(".legend")
            .data(keys)//data set for legends
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


        legend.append("line")//making a line for legend
            .attr("x1", vis.width + 70)
            .attr("x2", vis.width+40)
            .attr("y1", 35)
            .attr("y2", 35)
            .attr("stroke", "blue")
            .attr("stroke-width", 3.5)
            .attr("stroke-dasharray", ("4, 4"))


        legend.append("line")//making a line for legend
            .attr("x1", vis.width + 70)
            .attr("x2", vis.width+40)
            .attr("y1", 10)
            .attr("y2", 10)
            .attr("stroke", "orange")
            .attr("stroke-width", 3.5)


        legend.append("text")
            .attr("x", vis.width +80)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "left")
            .text("Rate of Unvaccinated")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "14");

        legend.append("text")
            .attr("x", vis.width +80)
            .attr("y", 34)
            .attr("dy", ".35em")
            .style("text-anchor", "left")
            .text("Rate of Vaccinated")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "14");


        let tooltip = vis.svg.append("g")
            .attr("display", "none")
            .attr("class", "tooltip-group");


        tooltip
            .append("div")
            .style("opacity", 0)
            // .attr("class", "tooltip")
            .style("background-color", "red")
            .style("border-radius", "2px")
            .style("padding", "12px")
            .style("color", "#0c0c0c")
            .style('font-size', '14px')
            .style("position", "absolute")
            .style("box-shadow", "2px 2px 4px lightgrey")
            .style("padding", "10px");


        tooltip.append("rect")
            .attr("width", 250)
            .attr("height", vis.height-350)
            .attr("x", 0)
            .attr("y", 50)
            .style("fill", "white")
            .attr("class","tool-rect-background")


        tooltip.append("line")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("x1", 0)
            .attr("y1", vis.height)
            .attr("x2", 0)
            .attr("y2", 0);


        let text = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 70)
            .attr('font-weight','bold')
            .style("fill", "black");

        // let text2 = tooltip.append("text")
        //     .attr("class", "tooltip-text")
        //     .attr("x", 10)
        //     .attr("y", 30)
        //     .attr('font-weight','bold')
        //     .style("fill", "black");

        let text3 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 90)
            .style("fill", "orange")
            .style("font-size", '15');

        let text4 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 110)
            .style("fill", "blue")
            .style("font-size", '15');


        let overlay = vis.svg.append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr("x", 0)
            .attr("y", 0)
            //.style("background-color", "white")
            .style("border-radius", "2px")
            .style("padding", "12px")
            .style("color", "#0c0c0c")
            .style('font-size', '14px')
            .style("position", "absolute")
            .style("box-shadow", "2px 2px 4px lightgrey")
            .style("padding", "10px")
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
        // const year = yearFormat(d.data.Max_Week_Date);

        function mousemove(event) {
            let x_coordinate = d3.pointer(event)[0];
            let x_date = x_time.invert(x_coordinate);
            let index = bisectDate(vis.data, x_date);
            let closest = vis.data[index];


            let formatDate = d3.timeFormat("%V");


            tooltip.attr("transform", "translate(" + x_coordinate + ")")
            //    text.text("Week: " + console.log(formatDate(closest.date)));
            text.text("Week: " + (closest.Max_Week_Date2));
            // text2.text("Year: " + yearFormat(closest.date));
            text3.text("Rate of Unvaccinated: " + (closest.Age_adjusted_unvax_IR) + " per 100k");
            text4.text("Rate of Vaccinated: " + (closest.Age_adjusted_vax_IR) + " per 100k");


        }


        // //add year labels to x axis (year 2022)
        // vis.svg
        //     .append("text")
        //     .attr("x", vis.width-110)
        //     .attr("y", vis.height+40)
        //     .attr("class", "title")
        //     .text("2022")
        //     .attr("fill","black")
        //     .attr("font-size", "12")
        //
        // //add year labels to x axis (year 2021)
        // vis.svg
        //     .append("text")
        //     .attr("x", vis.margin.width+50)
        //     .attr("y", vis.height+40)
        //     .attr("class", "title")
        //     .text("2021")
        //     .attr("fill","black")
        //     .attr("font-size", "12")


    }
}