class BubbleChartSimple {
    constructor(data) {

        this.data = data;

        this.initVis();
    }


    initVis() {
        let vis = this;


        vis.margin = {top: 100, right: 100, bottom: 70, left: 70},
            vis.width = 900 - vis.margin.left - vis.margin.right,
            vis.height = 600 - vis.margin.top - vis.margin.bottom;


        vis.svg = d3.select("#chart")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Add X axis
        const x = d3.scaleLinear()
            .domain([-0.0003, 0.016])
            .range([ 0, vis.width ]);
        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(d3.axisBottom(x))
            .attr("font-size", "12");

        // Add Y axis
        const y = d3.scaleLinear()
          //  .domain([-0.034, 9])
            .domain([-0.13, 9])
            .range([ vis.height, 0]);
        vis.svg.append("g")
            .call(d3.axisLeft(y))
            .attr("font-size", "12");

        // Add a scale for bubble size
        const z = d3.scaleLinear()
            .domain([200000, 1310000000])
            .range([ 1, 40]);


        // Tooltip
        let tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-15, 0])
            .html(function(d) {
                let chartType = d3.select("body").node().value;
                return "<b>" + d.State +"</b>" + "<br />" + "New Cases: " + d.New_Case_per_100 + " per 100k"+ "<br />" + "New Deaths: "+d.New_Death_per_100 + " per 100k"

            });



        vis.svg.call(tip);


        // Add dots

        vis.svg.append('g')
            .selectAll("dot")
            .data(vis.data)
            .join("circle")
            .attr("cx", d => x(d.New_Death_per_100))
            .attr("cy", d => y(d.New_Case_per_100))
            .attr("r", d => 9)
            .style("fill", "#4e79a7")
            //.style("opacity", "0.5")
            .attr("stroke", "white")
            .on("mouseover", function(e, d) { tip.show(d, this); })
            .on("mouseout", tip.hide)



        //overall chart title
        vis.svg
            .append("text")
            .attr("x", 0)
            .attr("y", (vis.margin.top/3)-vis.margin.top)
            .attr("class", "title")
            .text("New Covid-19 case & death count per 100k people across the US states")
            .attr("fill","black")
            .attr("font-size", "20")
            .attr("font-family", "Segoe UI")
            .attr("font-weight","bold")

        //overall chart subtitle
        vis.svg
            .append("text")
            .attr("x", 0)
            .attr("y", (vis.margin.top/3)-vis.margin.top+30)
            .attr("class", "title")
            .text("Week 4, 2022")
            .attr("fill","black")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "17")


        //y axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.width/4)
            .attr("y", 0-50)
            .attr("font-size", "16")
            .attr("font-family", "Segoe UI")
            .text("New Cases per 100k people");

        //x axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size","12")
            .attr("x", vis.width/2)
            .attr("y", vis.height+60)
            .attr("font-size", "16")
            .attr("font-family", "Segoe UI")
            .text("New Deaths per 100k people");


        //Texas label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size","12")
            .attr("x", 426)
            .attr("y", 236)
            .attr("font-size", "12")
            .attr("font-family", "Segoe UI")
            .text("Texas");

        //California label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size","12")
            .attr("x", 400)
            .attr("y", 58)
            .attr("font-size", "12")
            .attr("font-family", "Segoe UI")
            .text("California");

        //Florida label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size","12")
            .attr("x", 716)
            .attr("y", 322)
            .attr("font-size", "12")
            .attr("font-family", "Segoe UI")
            .text("Florida");


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



    }
}