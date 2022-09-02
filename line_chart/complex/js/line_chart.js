class LineChartComplex {
    constructor(data) {

        this.data = data;

        this.initVis();
    }


    initVis() {
        let vis = this;


        vis.margin = {top: 100, right: 350, bottom: 70, left: 70},
            vis.width = 1150 - vis.margin.left - vis.margin.right,
            vis.height = 600 - vis.margin.top - vis.margin.bottom;



        vis.svg = d3.select("#chart")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");





        const groups = vis.data.map(d => (d.Week1))
        console.log(groups)

        const Week_format1 = d3.timeFormat("%U");
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
            //  .domain([0, d3.max(vis.data, function(d) { return +d.Unvax_50_79; })])
            .domain([0, d3.max(vis.data, function(d) { return +d.Unvax_50_79; })+500])
            .range([ vis.height, 0 ]);
        vis.svg.append("g")
            .call(d3.axisLeft(y))
            .style("font-size", '12');

        //grey y gridlines
        vis.make_x_gridlines= function() {
            return d3.axisLeft(y)
                .ticks(10)
        }
        vis.svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + 0 + ",0)")
            .style("stroke-dasharray", "3 3")
            .call(vis.make_x_gridlines()
                .tickSize(-vis.width)
                .tickFormat("")
            )
            .style("pointer-events", "none")

        // Add the unvaccinated line 18-49
        vis.svg.append("path")
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "#f4d166")
            .attr("stroke-width", 3.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.Week1) })
                .y(function(d) { return y(d.Unvax_18_49) })
                        )
            .style("pointer-events", "none")

        // Add the unvaccinated line 50-79
        vis.svg.append("path")
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "#ef701b")
            .attr("stroke-width", 3.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.Week1) })
                .y(function(d) { return y(d.Unvax_50_79) })
            )
            .style("pointer-events", "none")

        // Add the unvaccinated line 80+
        vis.svg.append("path")
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "#9e3a26")
            .attr("stroke-width", 3.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.Week1) })
                .y(function(d) { return y(d.Unvax_80) })
            )
            .style("pointer-events", "none")

        // Add the vaccinated line 18-49
        vis.svg.append("path")
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "#7dc9f5")
            .attr("stroke-width", 3.5)
            .attr("stroke-dasharray", ("4, 4"))

            .attr("d", d3.line()
                .x(function(d) { return x(d.Week1) })
                .y(function(d) { return y(d.Vax_18_49) })
            )
            .style("pointer-events", "none")

        // Add the vaccinated line 50-79
        vis.svg.append("path")
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "#0984ea")
            .attr("stroke-width", 3.5)
            .attr("stroke-dasharray", ("4, 4"))
            .attr("d", d3.line()
                .x(function(d) { return x(d.Week1) })
                .y(function(d) { return y(d.Vax_50_79) })
            )
            .style("pointer-events", "none")

        // Add the vaccinated line 80
        vis.svg.append("path")
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "#04386b")

            .attr("stroke-width", 3.5)
            .attr("stroke-dasharray", ("4, 4"))
            .attr("d", d3.line()
                .x(function(d) { return x(d.Week1) })
                .y(function(d) { return y(d.Vax_80) })
            )
            .style("pointer-events", "none")


        //overall chart title
        vis.svg
            .append("text")
            .attr("x", 0)
            .attr("y", (vis.margin.top/5)-vis.margin.top)
            .attr("class", "title")
            .text("Weekly count of vaccinated & unvaccinated individuals who caught Covid-19, split by age")
            .attr("fill","black")
            .attr("font-size", "20")
            .attr("font-family", "Segoe UI")
            .attr("font-weight","bold")

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



        //x axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size","12")
            .attr("x", vis.width/2)
            .attr("y", vis.height+60)
            .attr("font-size", "16")
            .attr("font-family", "Segoe UI")
            .text("Week");


        // create a list of keys
        var keys = [ "Ages 80+","Ages 50-79","Ages 18-49"]
        //

        // // Usually you have a color scale in your chart already
        var color1 = d3.scaleOrdinal()
            .domain(keys)
            .range(['#9e3a26', '#ef701b', '#f4d166']);
        //
        var color2 = d3.scaleOrdinal()
            .domain(keys)
            .range(['#04386b','#0984ea','#7dc9f5']);


        //unvaccinated legend
        var legend = vis.svg.selectAll(".legend")
            .data(keys)//data set for legends
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })


        // //vaccinated legend
        var legend2 = vis.svg.selectAll(".legend2")
            .data(keys)//data set for legends
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        //
        // // //vaccinated legend
        legend.append("line")//making a line for legend
            .attr("x1", vis.width + 70)
            .attr("x2", vis.width+40)
            .attr("y1", 35)
            .attr("y2", 35)
            .style("stroke", function(d){ return color1(d)})
            .attr("stroke-width", 3.5)


        // //unvaccinated legend
        legend2.append("line")//making a line for legend
            .attr("x1", vis.width + 70)
            .attr("x2", vis.width+40)
            .attr("y1", 155)
            .attr("y2", 155)
            .style("stroke", function(d){ return color2(d)})
            .attr("stroke-width", 3.5)
            .attr("stroke-dasharray", ("4, 4"))


        const size = 10
        // Add one dot in the legend for each name.
        vis.svg.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", vis.width+65 + size*1.2)
            .attr("y", function(d,i){ return 32 + i*(size+8) + (size/2)})
            .style("fill", "black")
            .style("font-size", "12px")
            .attr("font-family", "Segoe UI")
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")


        // Add one dot in the legend for each name.
        vis.svg.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", vis.width+65 + size*1.2)
            .attr("y", function(d,i){ return 152 + i*(size+8) + (size/2)})
            .style("fill", "black")
            .style("font-size", "12px")
            .attr("font-family", "Segoe UI")
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")


        //y axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.width/4)
            .attr("y", 0-50)
            .attr("font-size", "16")
            .attr("font-family", "Segoe UI")
            .text("Case count per 100k people");


        //share of non vaccination title
        vis.svg
            .append("text")
            .attr("x", vis.width+50)
            .attr("y", (vis.margin.top/3)-vis.margin.top+80)
            .attr("class", "title")
            .text("Rate of Unvaccinated")
            .attr("fill","black")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "15")

        //share of vaccination title
        vis.svg
            .append("text")
            .attr("x", vis.width+50)
            .attr("y", (vis.margin.top/3)-vis.margin.top+200)
            .attr("class", "title")
            .text("Rate of Vaccinated")
            .attr("fill","black")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "15")


        let tooltip = vis.svg.append("g")
            .attr("display", "none")
            .attr("class", "tooltip-group")


        tooltip.append("rect")
            .attr("width", 200)
            .attr("height", vis.height-190)
            .attr("x", 0)
            .attr("y", 0)
            .style("fill", "white")
            // .style("filter", "url(#md-shadow)")
            .attr("class","tool-rect-background-r")

        tooltip.append("rect")
            .attr("width", 200)
            .attr("height", vis.height-190)
            .attr("x", -200)
            .attr("y", 0)
            .style("fill", "white")
            // .style("filter", "url(#md-shadow)")
            .attr("class","tool-rect-background-l")


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
            .attr("y", 20)
            .attr('font-weight','bold')
            .attr("font-family", "Segoe UI")
            .style("fill", "black");

        let text2 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 20)
            .attr('font-weight','bold')
            .attr("font-family", "Segoe UI")
            .style("fill", "black");

        let text3 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 50)
            .style("fill", "black")
            .attr("font-family", "Segoe UI")
            .attr('font-weight','bold')
            .style("font-size", '14');

        let text4 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 70)
            .style("fill", "#9e3a26")
            .attr("font-family", "Segoe UI")
            .style("font-size", '14');

        let text5 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 90)
            .style("fill", "#ef701b")
            .attr("font-family", "Segoe UI")
            .style("font-size", '14');

        let text6 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 110)
            .style("fill", "#f4d166")
            .attr("font-family", "Segoe UI")
            .style("font-size", '14');

        let text7 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 150)
            .style("fill", "black")
            .attr('font-weight','bold')
            .attr("font-family", "Segoe UI")
            .style("font-size", '14');


        let text8 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 170)
            .style("fill", "#04386b")
            .attr("font-family", "Segoe UI")
            .style("font-size", '14');

        let text9 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 190)
            .style("fill", "#0984ea")
            .attr("font-family", "Segoe UI")
            .style("font-size", '14');

        let text10 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 210)
            .style("fill", "#7dc9f5")
            .attr("font-family", "Segoe UI")
            .style("font-size", '14');


        let overlay = vis.svg.append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr("x", 0)
            .attr("y", 0)
            .style("border-radius", "2px")
            .style("padding", "12px")
            .style("color", "#0c0c0c")
            .style('font-size', '14px')
            .style("position", "absolute")
            .style("box-shadow", "2px 2px 4px lightgrey")
            .style("padding", "10px")
            .attr("fill", "transparent")
            //  .attr("fill", "white")
            .on("mouseover", function (event, d) {
                tooltip.attr("display", "null");

            })
            .on("mouseout", function (event, d) {
                tooltip.attr("display", "none");
            })
            .on("mousemove", mousemove);



        // let overlay = vis.svg.append("rect")
        //     .attr("width", vis.width)
        //     .attr("height", vis.height)
        //     .attr("x", 0)
        //     .attr("y", 0)
        //     //.style("background-color", "white")
        //     .style("border-radius", "2px")
        //     .style("padding", "12px")
        //     .style("color", "#0c0c0c")
        //     .style('font-size', '14px')
        //     .style("position", "absolute")
        //     .style("box-shadow", "2px 2px 4px lightgrey")
        //     .style("padding", "10px")
        //     .attr("fill", "transparent")
        //     .on("mouseover", function (event, d) {
        //         tooltip.attr("display", "null");
        //     })
        //     .on("mouseout", function (event, d) {
        //         tooltip.attr("display", "none");
        //     })
        //     .on("mousemove", mousemove);





        let bisectDate = d3.bisector(d=>d.date).left;
        let formatTime = d3.timeFormat("%Y-%m-%d");

        const yearFormat = d3.timeFormat("%Y");
        // const year = yearFormat(d.data.Max_Week_Date);




        function mousemove(event) {


            let x_coordinate = d3.pointer(event)[0];
            let x_date = x_time.invert(x_coordinate);
            let index = bisectDate(vis.data, x_date);
            // let closest = vis.data[index];

            let hang_right = false

            let closest = null;
            let right = vis.data[index];
            let x_right = x_time(right.date);
            if (Math.abs(x_right - x_coordinate) < 10) {
                closest = right;
                hang_right = true

            } else if (index) {
                let left = vis.data[index-1];
                let x_left = x_time(left.date);
                if (Math.abs(x_left - x_coordinate) < 10) {
                    closest = left;

                }
            }

            console.log(hang_right)

            if (x_coordinate > (vis.width / 2)) {
                // $("#tool-rect-background-2")
                vis.svg.select(".tool-rect-background-r")
                    .attr("visibility", "hidden")
                vis.svg.select(".tool-rect-background-l")
                    .attr("visibility", "visible")


            }

            else {

                vis.svg.select(".tool-rect-background-r")
                    .attr("visibility", "visible")
                vis.svg.select(".tool-rect-background-l")
                    .attr("visibility", "hidden")


            }


            let anchor = (x_coordinate > (vis.width / 2)) ? "end" : "start";
            let x_text = (x_coordinate > (vis.width / 2)) ? -20 : 20;

            text.attr("text-anchor", anchor).attr("x", x_text);
            // text1.attr("text-anchor", anchor).attr("x", x_text);
            // text2.attr("text-anchor", anchor).attr("x", x_text);
            text3.attr("text-anchor", anchor).attr("x", x_text);
            text4.attr("text-anchor", anchor).attr("x", x_text);
            text5.attr("text-anchor", anchor).attr("x", x_text);
            text6.attr("text-anchor", anchor).attr("x", x_text);
            text7.attr("text-anchor", anchor).attr("x", x_text);
            text8.attr("text-anchor", anchor).attr("x", x_text);
            text9.attr("text-anchor", anchor).attr("x", x_text);
            text10.attr("text-anchor", anchor).attr("x", x_text);




            tooltip.attr("transform", "translate(" + x_coordinate + ")")
            text.text("Week: " + (closest.Max_Week_Date1));
            // text2.text("Year: " + yearFormat(closest.date));

            text3.text("Rate of Unvaccinated: ");
            text4.text("Ages 80+: " + (closest.Unvax_80) + " per 100k");
            text5.text("Ages 50-79: " + (closest.Unvax_50_79) + " per 100k");
            text6.text("Ages 18-49: " + (closest.Unvax_18_49) + " per 100k");

            text7.text("Rate of Vaccinated: ");

            text8.text("Ages 80+: " + (closest.Vax_80) + " per 100k");
            text9.text("Ages 50-79: " + (closest.Vax_50_79) + " per 100k");
            text10.text("Ages 18-49: " + (closest.Vax_18_49) + " per 100k");


            //

            // function mousemove(event) {
            //     let x_coordinate = d3.pointer(event)[0];
            //     let x_date = x_time.invert(x_coordinate);
            //     let index = bisectDate(vis.data, x_date);

            // tooltip.attr("transform", "translate(" + x_coordinate + ")");








            // text.text("Week: " + (closest.Max_Week_Date2));
            // // text2.text("Year: " + yearFormat(closest.date));
            // text3.text("Rate of Unvaccinated: " + (closest.Age_adjusted_unvax_IR) + " per 100k");
            // text4.text("Rate of Vaccinated: " + (closest.Age_adjusted_vax_IR) + " per 100k");


            // }

            //


        }




        // const tooltip = vis.svg
        //     .append("div")
        //     .style("opacity", 0)
        //     .attr("class", "tooltip")
        //     .style("background-color", "white")
        //     .style("border-radius", "2px")
        //     .style("padding", "12px")
        //     .style("color", "#0c0c0c")
        //     .style('font-size', '14px')
        //     .style("position", "absolute")
        //     .style("box-shadow", "2px 2px 4px lightgrey")
        //     .style("padding", "10px");










        // tooltip.append("rect")
        //     .attr("width", 180)
        //     .attr("height", vis.height-200)
        //     .attr("x", 0)
        //     .attr("y", -5)
        //     .style("fill", "white")
        //     .attr("class","tool-rect-background")






        // //add year labels to x axis (year 2022)
        // vis.svg
        //     .append("text")
        //     .attr("x", vis.width-120)
        //     .attr("y", vis.height+40)
        //     .attr("class", "title")
        //     .text("2022")
        //     .attr("font-family", "Segoe UI")
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
        //     .attr("font-family", "Segoe UI")
        //     .attr("fill","black")
        //     .attr("font-size", "12")



    }
}