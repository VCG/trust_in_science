class BarChart2 {
    constructor(data) {

        this.data = data;

        this.initVis();
    }


    initVis() {
        let vis = this;

        vis.margin = {top: 10, right: 210, bottom: 100, left: 70},
            vis.width = 1050 - vis.margin.left - vis.margin.right,
            vis.height = 280 - vis.margin.top - vis.margin.bottom;


        vis.svg = d3.select("#bar_chart2")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");



        const groups = vis.data.map(d => (d.Week))
        console.log(groups)


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
                return "<b>" + "Week: "+ "</b>" + (d.Max_Week_Date2) + "</b>" + "</br>" + "<b>" + "Year: "+  "</b>" + (d.Year) + "</br>" +  "<b>" + "Vaccinated Rate: " + "</b>" + d.Age_adjusted_vax_IR + " "+"per 100k"+ "<br />"

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
            .attr("x", -vis.width/10-20)
            .attr("y", 0-50)
            .attr("font-size", "14")
            .attr("font-family", "Segoe UI")
            .text("Case count per 100k people");


        //x axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", vis.width/2)
            .attr("y", vis.height+60)
            .attr("font-size", "13")
            .attr("font-family", "Segoe UI")
            .text("Week");

        // //add year labels to x axis (year 2022)
        // vis.svg
        //     .append("text")
        //     .attr("x", vis.width-110)
        //     .attr("y", vis.height+40)
        //     .attr("class", "title")
        //     .text("2022")
        //     .attr("fill","black")
        //     .attr("font-family", "Segoe UI")
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
        //     .attr("font-family", "Segoe UI")
        //     .attr("font-size", "12")

    }
}