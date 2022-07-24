class BubbleChartComplexInt {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis();
    }

    initVis() {
        let vis = this;

        // set the dimensions and margins of the graph
        vis.margin = {top: 20, right: 20, bottom: 110, left: 40};
        vis.margin2 = {top: 430, right: 20, bottom: 30, left: 40};
        vis.width = 900 - vis.margin.left - vis.margin.right;
        vis.height = 600 - vis.margin.top - vis.margin.bottom;
        vis.height2 = 600 - vis.margin2.top - vis.margin2.bottom;


        vis.svg = d3.select(this.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.myColor = d3.scaleLinear()
            .domain([54, 95])
            .range(["lightblue", "darkblue"]);

        vis.x = d3.scaleLinear()
            .domain([-0.0004, 0.016])
            //.domain(d3.extent(vis.data, function(d) { return +d.New_Death_per_100 }))
            .range([0, vis.width]);

        vis.x2 = d3.scaleLinear()
            .domain([-0.0004, 0.016])
            //.domain(d3.extent(vis.data, function(d) { return +d.New_Death_per_100 }))
            .range([0, vis.width]);

        // // Add Y axis
        vis.y = d3.scaleLinear()
            .domain([-0.35, 9])
          //  .domain(d3.extent(vis.data, function(d) { return +d.New_Case_per_100 }))
            .range([vis.height, 0]);

        vis.y2 = d3.scaleLinear()
            .domain([-0.35, 9])
            //  .domain(d3.extent(vis.data, function(d) { return +d.New_Case_per_100 }))
            .range([vis.height2, 0]);

        // Add a scale for bubble size
        vis.z = d3.scalePow()
            .exponent(2)
            .domain([0, 100])
            .range([ 0, 20]);

        // vis.xAxis = d3.axisBottom(vis.x),
        // vis.xAxis2 = d3.axisBottom(vis.x2),
        // vis.yAxis = d3.axisLeft(vis.y);


        vis.xAxis = vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(d3.axisBottom(vis.x))
            .attr("font-size", "12");

        vis.xAxis2 = vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(d3.axisBottom(vis.x2))
            .attr("font-size", "12");


        vis.yAxis = vis.svg.append("g")
            .attr("transform", `translate(0, ${0})`)
            .call(d3.axisLeft(vis.y))
            .attr("font-size", "12");
        //grey x gridlines
        vis.make_x_gridlines= function() { return d3.axisLeft(vis.y).ticks(5) };

        vis.svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(" + 0 + ",0)")
                .style("stroke-dasharray", "3 3")
                .call(vis.make_x_gridlines()
                    .tickSize(-vis.width)
                    .tickFormat(""));



        //y axis label
            vis.svg.append("text")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -vis.width/4)
                .attr("y", 0-50)
                .attr("font-size", "16")
                .text("New Cases per 100k people");

             //x axis label
            vis.svg.append("text")
                .attr("text-anchor", "middle")
                .attr("font-size","12")
                .attr("x", vis.width/2)
                .attr("y", vis.height+60)
                .attr("font-size", "16")
                .text("New Deaths per 100k people");





        // vis.xAxis = vis.svg.selectAll(".x-axis").transition().duration(200).call(d3.axisBottom(vis.x)).style("font-size", '12');
        // vis.yAxis = vis.svg.selectAll(".y-axis").transition().duration(200).call(d3.axisLeft(vis.y)).style("font-size", '12');

        const weeks = [...new Set(vis.data.map(d => (d.Week)))];

        weeks.forEach((week, i) => {
            let link = $(`<a href="#">${week}</a>`);
            link.mouseover(() => {
                vis.wrangleData(week);
                $(".selected").removeClass("selected");
                link.addClass("selected");
            });
            $("#filter-bar").append(link);
        });

        // $(this.parentElement).mouseover(() => )

        // vis.initBrush();

        vis.wrangleData();
    }

    wrangleData(week) {
        let vis = this;

        if (week) {
            vis.displayData = vis.data.filter(row => row.Week == week);
        }
        else {
            vis.displayData = [...vis.data];
        }

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.svg.selectAll("circle").remove();



        // // Tooltip
            vis.tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-15, 0])
                .html(function(d) {
                    let chartType = d3.select("body").node().value;
                    return "<b>" + "Year " + d.Year +"</b>" + "<br />" + "<b>" + "Week " +d.Week +"</b>" + "<br />" + "<b>" + d.State +"</b>" + "<br />" + "New Cases: " + d.New_Case_per_100 + " per 100k" + "<br />" + "New Deaths: "+d.New_Death_per_100 + " per 100k" + "<br />" + "Vaccination Rate: "+d.Share_Vaccination +"%"

                });


           vis.svg.call(vis.tip);
            //console.log(vis.tip)




        vis.scatter = vis.svg.append('g')
            .attr("clip-path", "url(#clip)")


        vis.scatter
            .selectAll("circle")
            .data(vis.displayData)
            .enter()
            .append("circle")
            .attr("class","circles")
            .attr("cx", d => vis.x(d.New_Death_per_100))
            .attr("cy", d => vis.y(d.New_Case_per_100))
            .attr("r", d => vis.z(d.Share_Vaccination))
            .style("fill", "#02254a")
            .style("fill", d => vis.myColor(d.Share_Vaccination))
            //.style("opacity", "0.7")
            .attr("stroke", "white")
            // .on("mouseover", function(e, d) { vis.tip.show(d, this); })
            // .on("mouseout", vis.tip.hide)



        var zoom = d3.zoom()
            .scaleExtent([1, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
            .extent([[0, 0], [vis.width, vis.height]])
            .on("zoom", updateChart);


        vis.scatter2 = vis.svg.append('g')
            .attr("clip-path", "url(#clip)")


        vis.scatter2
            .selectAll("circle")
            .data(vis.displayData)
            .enter()
            .append("circle")
            .attr("class","circles2")
            .attr("cx", d => vis.x2(d.New_Death_per_100))
            .attr("cy", d => vis.y2(d.New_Case_per_100))
            .attr("r", d => vis.z(d.Share_Vaccination))
            // .style("fill", "#02254a")
            .style("fill", "transparent")
            //.style("opacity", "0.7")
            .attr("stroke", "transparent")
            .on("mouseover", function(e, d) { vis.tip.show(d, this); })
            .on("mouseout", vis.tip.hide)



        function updateChart(event) {

            // recover the new scale
            var newX = event.transform.rescaleX(vis.x2);
            var newY = event.transform.rescaleY(vis.y);

            // update axes with these new boundaries
            vis.xAxis.call(d3.axisBottom(newX))
            vis.yAxis.call(d3.axisLeft(newY))


            // update circle position
            vis.scatter.selectAll(".circles2")
                .attr("cx", d => newX(d.New_Death_per_100))
                .attr("cy", d => newY(d.New_Case_per_100))



        }


        vis.svg.append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('transform', 'translate(' + 0 + ',' +0 + ')')
            .call(zoom)




        $("#Reset").click(() => {
            vis.svg.transition()
                .duration(750)
                .call(zoom.transform, d3.zoomIdentity);
        });



    }


}
