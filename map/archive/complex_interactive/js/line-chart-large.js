class LineChartLarge {
    constructor(parentElement, data, state) {
        this.data = data.filter(d => d.State == state);
        this.state = state;
        this.parentElement = parentElement;

        this.initVis();
    }

    initVis() {
        let vis = this;

        let margin = { top: 50, right: 130, bottom: 50, left: 50 },
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
            .text("7-Day New Cases Avg")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "9");



        let tooltip = svg.append("g")
            .attr("display", "none")
            .attr("class", "tooltip-group");



        // tooltip.append("rect")
        //     .attr("width", 140)
        //     .attr("height", height-230)
        //     .attr("x", 0)
        //     .attr("y", 30)
        //     .style("fill", "white")
        // //    .style("filter", "url(#md-shadow)")
        //     .attr("class","tool-rect-background")


        tooltip.append("rect")
            .attr("width", 120)
            .attr("height", height-220)
            .attr("x", 0)
            .attr("y", 0)
            .style("fill", "transparent")
            //.style("filter", "url(#md-shadow)")
            .attr("class","tool-rect-background-r")

        tooltip.append("rect")
            .attr("width", 120)
            .attr("height", height-220)
            .attr("x", -120)
            .attr("y", 0)
            .style("fill", "transparent")
           // .style("filter", "url(#md-shadow)")
            .attr("class","tool-rect-background-l")


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
            .attr("y", 10)
            .style("font-size", '10')
            .style("fill", "black");

        let text2 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .style("font-size", '10')
            .attr("x", 5)
            .attr("y", 30)
            .style("fill", "black");

        let text3 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .style("font-size", '10')
            .attr("x", 5)
            .attr("y", 50)
            .style("fill", "black");

        let text4 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .style("font-size", '10')
            .attr("x", 5)
            .attr("y", 70)
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

        // function mousemove(event) {
        //     let x_coordinate = d3.pointer(event)[0];
        //     let x_date = x_time.invert(x_coordinate);
        //     let index = bisectDate(vis.data, x_date);
        //     let closest = vis.data[index];
        //
        //
        //     tooltip.attr("transform", "translate(" + x_coordinate + ")")
        //     text.text("State: " + (closest.State2));
        //     text2.text("Date: " + formatTime(closest.date));
        //     text3.text("New Cases: " + closest.value);
        //     text4.text("7-Day New Cases Avg: " + (closest.value2.toFixed(0)));
        //
        //
        // }

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

            if (x_coordinate > (width / 2)) {
                // $("#tool-rect-background-2")
                svg.select(".tool-rect-background-r")
                    .attr("visibility", "hidden")
                svg.select(".tool-rect-background-l")
                    .attr("visibility", "visible")


            }

            else {

               svg.select(".tool-rect-background-r")
                    .attr("visibility", "visible")
               svg.select(".tool-rect-background-l")
                    .attr("visibility", "hidden")


            }


            let anchor = (x_coordinate > (width / 2)) ? "end" : "start";
            let x_text = (x_coordinate > (width / 2)) ? -20 : 20;

            text.attr("text-anchor", anchor).attr("x", x_text);
            //text1.attr("text-anchor", anchor).attr("x", x_text);
            text2.attr("text-anchor", anchor).attr("x", x_text);
            text3.attr("text-anchor", anchor).attr("x", x_text);
            text4.attr("text-anchor", anchor).attr("x", x_text);



            tooltip.attr("transform", "translate(" + x_coordinate + ")")
            text.text("State: " + (closest.State2));
            text2.text("Date: " + formatTime(closest.date));
            text3.text("New Cases: " + closest.value);
            text4.text("7-Day New Cases Avg: " + (closest.value2.toFixed(0)));

            // tooltip.attr("transform", "translate(" + x_coordinate + ")")
            // text.text("Week: " + (closest.Max_Week_Date1));
            // // text2.text("Year: " + yearFormat(closest.date));
            //
            // text3.text("Rate of Unvaccinated: ");
            // text4.text("Ages 80+: " + (closest.Unvax_80) + " per 100k");
            // text5.text("Ages 50-79: " + (closest.Unvax_50_79) + " per 100k");
            // text6.text("Ages 18-49: " + (closest.Unvax_18_49) + " per 100k");
            //
            // text7.text("Rate of Vaccinated: ");
            //
            // text8.text("Ages 80+: " + (closest.Vax_80) + " per 100k");
            // text9.text("Ages 50-79: " + (closest.Vax_50_79) + " per 100k");
            // text10.text("Ages 18-49: " + (closest.Vax_18_49) + " per 100k");


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



    }
}
