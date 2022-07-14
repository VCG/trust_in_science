class BarChartSimple2 {
    constructor(data) {

        this.data = data;

        this.initVis();
    }


    initVis() {
        let vis = this;

        vis.margin = {top: 10, right: 200, bottom: 100, left: 70},
            vis.width = 1050 - vis.margin.left - vis.margin.right,
            vis.height = 300 - vis.margin.top - vis.margin.bottom;


        vis.svg = d3.select("#bar_chart2")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");



        const groups = vis.data.map(d => (d.Week))
        console.log(groups)



        // Add X axis
        const x = d3.scaleBand()
            .domain(groups)
            .range([0, vis.width])
            .padding([0.2])
        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("font-size", "12")
            .style("text-anchor", "end")
            .attr("dx", "0.5em")
            .attr("dy", "1em")
            .attr("transform", "rotate(0)");



        // Add y axis
        const y = d3.scaleLinear()
            .domain([0, 3500])
            .range([ vis.height, 0]);
        vis.svg.append("g")
            .call(d3.axisLeft(y));


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

        // Tooltip
        let tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-15, 0])
            .html(function(d) {
                let chartType = d3.select("body").node().value;
                return "<b>" + "Week: "+ "</b>" + (d.Week) + "</b>" + "</br>" + "<b>" + "Year: "+  "</b>" + (d.Year) + "</br>" +  "<b>" + "Vaccinated Rate: " + "</b>" + d.Age_adjusted_vax_IR + " "+"per 100k"+ "<br />"

            });




        vis.svg.call(tip);

        // Bars
        vis.svg.selectAll("mybar")
            .data(vis.data)
            .join("rect")
            .attr("x", d => x(d.Week))
           // .tickFormat(d3.timeFormat("%Y-%U")))
            .attr("y", d => y(d.Age_adjusted_vax_IR))
            .attr("width", x.bandwidth())
            .attr("height", d => vis.height - y(d.Age_adjusted_vax_IR))
            .attr("fill", "blue")
            .on("mouseover", function(e, d) { tip.show(d, this); })
            .on("mouseout", tip.hide)

        //y axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.width/10)
            .attr("y", 0-50)
            .attr("font-size", "16")
            .text("Case count per 100k people");


        //x axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", vis.width/2)
            .attr("y", vis.height+60)
            .attr("font-size", "16")
            .text("week number");

        //add year labels to x axis (year 2022)
        vis.svg
            .append("text")
            .attr("x", vis.width-110)
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