class BubbleChartComplexInt {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis();
    }

    initVis() {
        let vis = this;

        // set the dimensions and margins of the graph
        vis.margin = {top: 20, right: 20, bottom: 70, left: 70};
        vis.width = 900 - vis.margin.left - vis.margin.right;
        vis.height = 600 - vis.margin.top - vis.margin.bottom;

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

        // // Add Y axis
        vis.y = d3.scaleLinear()
            .domain([-0.35, 9])
          //  .domain(d3.extent(vis.data, function(d) { return +d.New_Case_per_100 }))
            .range([vis.height, 0]);

        // Add a scale for bubble size
        vis.z = d3.scalePow()
            .exponent(2)
            .domain([0, 100])
            .range([ 0, 20]);

        //grey x gridlines
        vis.make_x_gridlines= function() { return d3.axisLeft(vis.y).ticks(5) };

        vis.svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(" + 0 + ",0)")
                .style("stroke-dasharray", "3 3")
                .call(vis.make_x_gridlines()
                    .tickSize(-vis.width)
                    .tickFormat(""));

        // Tooltip
            vis.tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-15, 0])
                .html(function(d) {
                    let chartType = d3.select("body").node().value;
                    return "<b>" + "Year " + d.Year +"</b>" + "<br />" + "<b>" + "Week " +d.Week +"</b>" + "<br />" + "<b>" + d.State +"</b>" + "<br />" + "New Cases: " + d.New_Case_per_100 + " per 100k" + "<br />" + "New Deaths: "+d.New_Death_per_100 + " per 100k" + "<br />" + "Vaccination Rate: "+d.Share_Vaccination +"%"

                });


            vis.svg.call(vis.tip);



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

        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "x-axis")
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "0.25em")
            .attr("dy", "1em")
            .style("font-size", '12')
            .attr("transform", "rotate(0)");

        vis.svg.append("g").attr("class", "y-axis");

        vis.svg.selectAll(".x-axis").transition().duration(200).call(d3.axisBottom(vis.x)).style("font-size", '12');
        vis.svg.selectAll(".y-axis").transition().duration(200).call(d3.axisLeft(vis.y)).style("font-size", '12');

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


        //Add dots
        vis.svg.append('g')
            .selectAll(".dot")
            .data(vis.displayData)
            .join("circle")
            .attr("class", "dot")
            .attr("cx", d => vis.x(d.New_Death_per_100))
            .attr("cy", d => vis.y(d.New_Case_per_100))
            .attr("r", d => vis.z(d.Share_Vaccination))
            .style("fill", "#02254a")
            .style("fill", d => vis.myColor(d.Share_Vaccination))
            .attr("stroke", "white")
            .on("mouseover", function(e, d) { vis.tip.show(d, this); })
            .on("mouseout", vis.tip.hide)



        var zoom = d3.zoom()
            .scaleExtent([0,4])
            .on('zoom', function(event) {
                vis.svg.selectAll('.dot')
                    .attr('transform', event.transform)

            });



        vis.svg.call(zoom);



        $("#Reset").click(() => {
            vis.svg.transition()
                .duration(750)
                .call(zoom.transform, d3.zoomIdentity);
        });



    }

    // initBrush() {
    //     let vis = this;
    //
    //     const height = 20;
    //     const width = 180;
    //
    //     const groups2 = vis.data.map(d => (d.Week));
    //
    //     let x = d3.scaleBand()
    //         .domain(groups2)
    //         .range([0, width])
    //         .padding([1.5]);
    //
    //     let xAxis = d3.axisBottom()
    //         .scale(x)
    //         .tickFormat((interval,i) => { return i%5 !== 0 ? " ": interval; })
    //         .ticks(5)
    //         .tickSize([10]);
    //
    //     let xTime = d3.scaleTime()
    //         .domain(d3.extent(vis.data, d => d.Max_Week_Date))
    //         .range([0, width]);
    //
    //     let brush = d3.brushX()
    //         .extent([[0,0], [width, height]])
    //         .on("brush", brushed)
    //         .on("brush end", function(e) {
    //             let startDate = xTime.invert(e.selection[0]);
    //             let endDate = xTime.invert(e.selection[1]);
    //             vis.wrangleData(startDate, endDate);
    //         });
    //
    //     let svg = d3.select("#brush-chart").append("svg")
    //         .attr("width", width)
    //         .attr("height", height)
    //         .call(xAxis);
    //
    //     let brushg = svg.append("g")
    //         .attr("class", "brush")
    //         .attr("width", width)
    //         .attr("height", height)
    //         .call(brush);
    //
    //     svg.append('line')
    //         .attr('x1', 0)
    //         .attr('y1', 0)
    //         .attr('x2', width)
    //         .attr('y2', 0);
    //
    //     function brushed() {
    //         let range = d3.brushSelection(this);
    //
    //         d3.selectAll("span")
    //             .text(function(d, i) { return Math.round(range[i]); });
    //     }
    // }
}
