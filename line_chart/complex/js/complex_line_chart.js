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



        let tooltip = vis.svg.append("g")
            .attr("display", "none")
            .attr("class", "tooltip-group");

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
            .attr("y", 10)
            .attr('font-weight','bold')
            .style("fill", "black");

        let text2 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 30)
            .attr('font-weight','bold')
            .style("fill", "black");

        let text3 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 60)
            .style("fill", "black")
            .attr('font-weight','bold')
            .style("font-size", '14');

        let text4 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 80)
            .style("fill", "#9e3a26")
            .style("font-size", '14');

        let text5 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 100)
            .style("fill", "#ef701b")
            .style("font-size", '14');

        let text6 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 120)
            .style("fill", "#f4d166")
            .style("font-size", '14');

        let text7 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 160)
            .style("fill", "black")
            .attr('font-weight','bold')
            .style("font-size", '14');


        let text8 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 180)
            .style("fill", "#04386b")
            .style("font-size", '14');

        let text9 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 200)
            .style("fill", "#0984ea")
            .style("font-size", '14');

        let text10 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 220)
            .style("fill", "#7dc9f5")
            .style("font-size", '14');


        let overlay = vis.svg.append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height)
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
        // const year = yearFormat(d.data.Max_Week_Date);

        function mousemove(event) {
            let x_coordinate = d3.pointer(event)[0];
            let x_date = x_time.invert(x_coordinate);
            let index = bisectDate(vis.data, x_date);
            let closest = vis.data[index];


            tooltip.attr("transform", "translate(" + x_coordinate + ")")
            text.text("Week: " + (closest.Week1));
            text2.text("Year: " + yearFormat(closest.date));

            text3.text("Rate of Unvaccinated: ");
            text4.text("Ages 80+: " + (closest.Unvax_80) + " per 100k");
            text5.text("Ages 50-79: " + (closest.Unvax_50_79) + " per 100k");
            text6.text("Ages 18-49: " + (closest.Unvax_18_49) + " per 100k");

            text7.text("Rate of Vaccinated: ");

            text8.text("Ages 80+: " + (closest.Vax_80) + " per 100k");
            text9.text("Ages 50-79: " + (closest.Vax_50_79) + " per 100k");
            text10.text("Ages 18-49: " + (closest.Vax_18_49) + " per 100k");


        }




        const groups = vis.data.map(d => (d.Week1))
        console.log(groups)

        const Week_format1 = d3.timeFormat("%U");
        const Year_format1 = d3.timeFormat("%Y");


        const x = d3.scaleBand()
            .domain(groups)
            .range([0, vis.width])
            .padding([0.7])
        console.log(x)
        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "0.25em")
            .attr("dy", "1em")
            .style("font-size", '12')
            .attr("transform", "rotate(0)");


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

        let dots0 = vis.svg.selectAll("circle1").data(vis.data);
        dots0
            .enter()
            .append("circle")
            .attr("class", "dot")
            // .attr("fill", "#9e3a26")
            .attr("fill", "transparent")
            // .attr("fill", "")
            .merge(dots0)
            // .on("mouseover", function(e, d) { tip_unvax_80.show(d, this); })
            // .on("mouseout", tip_unvax_80.hide)
            .attr("cx", d => x(d.Week1))
            .attr("cy", d => y(d.Unvax_80))
            .attr("r", 3);

        let dots1 = vis.svg.selectAll("circle2").data(vis.data);
        dots1
            .enter()
            .append("circle")
            .attr("class", "dot")
            // .attr("fill", "#ef701b")
            .attr("fill", "transparent")
            // .attr("fill", "")
            .merge(dots1)
            // .on("mouseover", function(e, d) { tip_unvax_50.show(d, this); })
            // .on("mouseout", tip_unvax_50.hide)
            .attr("cx", d => x(d.Week1))
            .attr("cy", d => y(d.Unvax_50_79))
            .attr("r", 3);


        let dots2 = vis.svg.selectAll("circle3").data(vis.data);
        dots2
            .enter()
            .append("circle")
            .attr("class", "dot")
            // .attr("fill", "#f4d166")
            .attr("fill", "transparent")
            // .attr("stroke", "darkblue")
            .merge(dots2)
            // .on("mouseover", function(e, d) { tip_unvax_18.show(d, this); })
            // .on("mouseout", tip_unvax_18.hide)
            .attr("cx", d => x(d.Week1))
            .attr("cy", d => y(d.Unvax_18_49))
            .attr("r", 3);

        let dots3 = vis.svg.selectAll("circle4").data(vis.data);
        dots3
            .enter()
            .append("circle")
            .attr("class", "dot")
            // .attr("fill", "#7dc9f5")
            .attr("fill", "transparent")
            // .attr("stroke", "darkblue")
            .merge(dots3)
            // .on("mouseover", function(e, d) { tip_vax_18.show(d, this); })
            // .on("mouseout", tip_vax_18.hide)
            .attr("cx", d => x(d.Week1))
            .attr("cy", d => y(d.Vax_18_49))
            .attr("r", 3);

        let dots4 = vis.svg.selectAll("circle5").data(vis.data);
        dots4
            .enter()
            .append("circle")
            .attr("class", "dot")
            // .attr("fill", "#0984ea")
            .attr("fill", "transparent")
            // .attr("stroke", "darkblue")
            .merge(dots4)
            // .on("mouseover", function(e, d) { tip_vax_50.show(d, this); })
            // .on("mouseout", tip_vax_50.hide)
            .attr("cx", d => x(d.Week1))
            .attr("cy", d => y(d.Vax_50_79))
            .attr("r", 3);

        let dots5 = vis.svg.selectAll("circle6").data(vis.data);
        dots5
            .enter()
            .append("circle")
            .attr("class", "dot")
            // .attr("fill", "#04386b")
            .attr("fill", "transparent")
            // .attr("stroke", "darkblue")
            .merge(dots5)
            // .on("mouseover", function(e, d) { tip_vax_80.show(d, this); })
            // .on("mouseout", tip_vax_80.hide)
            .attr("cx", d => x(d.Week1))
            .attr("cy", d => y(d.Vax_80))
            .attr("r", 3);


        //overall chart title
        vis.svg
            .append("text")
            .attr("x", 0)
            .attr("y", (vis.margin.top/3)-vis.margin.top)
            .attr("class", "title")
            .text("Weekly count of vaccinated & unvaccinated individuals who caught Covid-19, split by age")
            .attr("fill","black")
            .attr("font-size", "20")
            .attr("font-weight","bold")

        //overall chart subtitle
        vis.svg
            .append("text")
            .attr("x", 0)
            .attr("y", (vis.margin.top/3)-vis.margin.top+30)
            .attr("class", "title")
            .text("Apr 2021-Feb 2022")
            .attr("fill","black")
            .attr("font-size", "17")



        //x axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size","12")
            .attr("x", vis.width/2)
            .attr("y", vis.height+70)
            .attr("font-size", "16")
            .text("week number");


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
            .style("font-size", "15px")
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
            .style("font-size", "15px")
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
            .text("Case count per 100k people");


        //share of non vaccination title
        vis.svg
            .append("text")
            .attr("x", vis.width+50)
            .attr("y", (vis.margin.top/3)-vis.margin.top+80)
            .attr("class", "title")
            .text("Rate of Unvaccinated")
            .attr("fill","black")
            .attr("font-size", "15")

        //share of vaccination title
        vis.svg
            .append("text")
            .attr("x", vis.width+50)
            .attr("y", (vis.margin.top/3)-vis.margin.top+200)
            .attr("class", "title")
            .text("Rate of Vaccinated")
            .attr("fill","black")
            .attr("font-size", "15")


        //add year labels to x axis (year 2022)
        vis.svg
            .append("text")
            .attr("x", vis.width-120)
            .attr("y", vis.height+40)
            .attr("class", "title")
            .text("2022")
            .attr("fill","black")
            .attr("font-size", "12")

        //add year labels to x axis (year 2021)
        vis.svg
            .append("text")
            .attr("x", vis.margin.width+50)
            .attr("y", vis.height+40)
            .attr("class", "title")
            .text("2021")
            .attr("fill","black")
            .attr("font-size", "12")



    }
}