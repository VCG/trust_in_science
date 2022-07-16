class BarChart {
    constructor(data) {

        this.data = data;

        this.initVis();
    }


    initVis() {
        let vis = this;


        vis.margin = {top: 100, right: 210, bottom: 70, left: 70},
            vis.width = 1050 - vis.margin.left - vis.margin.right,
            vis.height = 330 - vis.margin.top - vis.margin.bottom;



        vis.svg = d3.select("#bar_chart")
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

                return "<b>" + "Week: "+ "</b>" + (d.Week) + "</b>" + "</br>" + "<b>" + "Year: "+  "</b>" + (d.Year) + "</br>" +  "<b>" + "Unvaccinated Rate: " + "</b>" + d.Age_adjusted_unvax_IR + " "+"per 100k"+ "<br />"

            });



        vis.svg.call(tip);


        // Bars
        vis.svg.selectAll("mybar")
            .data(vis.data)
            .join("rect")
            .attr("x", d => x(d.Week))
           // .tickFormat(d3.timeFormat("%Y-%U")))
            .attr("y", d => y(d.Age_adjusted_unvax_IR))
            .attr("width", x.bandwidth())
            .attr("height", d => vis.height - y(d.Age_adjusted_unvax_IR))
            .attr("fill", "orange")
            .on("mouseover", function(e, d) { tip.show(d, this); })
            .on("mouseout", tip.hide)


        //overall chart title
        vis.svg
            .append("text")
            .attr("x", 0)
            .attr("y", (vis.margin.top/3)-vis.margin.top)
            .attr("class", "title")
            .text("Weekly count of vaccinated & unvaccinated individuals who caught Covid-19")
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
            .text("Apr 2021-Feb 2022")
            .attr("fill","black")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "17")

        //y axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.width/10-10)
            .attr("y", 0-50)
            .attr("font-size", "14")
            .attr("font-family", "Segoe UI")
            .text("Case count per 100k people");

        //x axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", vis.width/2)
            .attr("y", vis.height+50)
            .attr("font-size", "14")
            .attr("font-family", "Segoe UI")
            .text("week number");


        // create a list of keys
        var keys = ["Rate of Unvaccinated", "Rate of Vaccinated"]

        // Usually you have a color scale in your chart already
        var color = d3.scaleOrdinal()
            .domain(keys)
            .range(["orange","blue"]);

        // Add one dot in the legend for each name.
        var size = 10

        vis.svg.selectAll("mydots")
            .data(keys)
            .enter()
            .append("rect")
            .attr("x", vis.width+50)
            .attr("y", function(d,i){ return 0 + i*(size+8)})
            .attr("width", size)
            .attr("height", size)
            .style("fill", function(d){ return color(d)})

        // Add one dot in the legend for each name.
        vis.svg.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", vis.width+60 + size*1.2)
            .attr("y", function(d,i){ return 0 + i*(size+8) + (size/2)})
            .style("fill", "black")
            .style("font-size", "14px")
            .attr("font-family", "Segoe UI")
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        //add year labels to x axis (year 2022)
        vis.svg
            .append("text")
            .attr("x", vis.width-110)
            .attr("y", vis.height+40)
            .attr("class", "title")
            .text("2022")
            .attr("fill","black")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "12")

        //add year labels to x axis (year 2021)
        vis.svg
            .append("text")
            .attr("x", vis.margin.width+50)
            .attr("y", vis.height+40)
            .attr("class", "title")
            .text("2021")
            .attr("fill","black")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "12")


    }
}