class StackedBarChartComplex {
    constructor(data) {

        this.data = data;

        this.initVis();
    }


    initVis() {
        let vis = this;

        // set the dimensions and margins of the graph
        vis.margin = {top: 110, right: 300, bottom: 70, left: 70},
            vis.width = 1200 - vis.margin.left - vis.margin.right,
            vis.height = 600 - vis.margin.top - vis.margin.bottom;


        vis.svg = d3.select("#chart")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);


        // List of subgroups = header of the csv files = soil condition here
        const subgroups = vis.data.columns.slice(4)
        console.log(subgroups)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        const groups = vis.data.map(d => (d.group))
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


        var x3 = d3.scaleLinear()
            .domain(month_groups)
            .range([0, vis.width])



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



        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 13000])
            .range([vis.height, 0]);
        vis.svg.append("g")
            .call(d3.axisLeft(y))
            .attr("font-size", "12")

        // color palette = one color per subgroup
        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#7dc9f5', '#0984ea', '#04386b',
                '#f4d166', '#ef701b', '#9e3a26'])


        //stack the data? --> stack per subgroup
        const stackedData = d3.stack()
            .keys(subgroups)
            (vis.data)


        // tooltip
        const tooltip = d3.select("body")
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


        const yearFormat = d3.timeFormat("%Y");


        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function (event, d) {
            console.log(event, d);
            const subgroupName = d3.select(this.parentNode).datum().key;
            const subgroupValue = d.data[subgroupName];
            const date = d.data.group;
            // const year = parseDate(d.data.Max_Week_Date);
            const week = d.data.Week;
            const week2 = d.data.Max_Week_Date;

            let dataForDate = vis.data.filter(f => f.group === date)[0];
            let total = 0;
            subgroups.forEach(sg => total += parseInt(dataForDate[sg]));


            const number_format = d3.format(',');

            const color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#7dc9f5', '#0984ea', '#04386b',
                    '#f4d166', '#ef701b', '#9e3a26'])

            tooltip
                .html(`
                  <span style="font-size:14px;font-family:Segoe UI"><b>Week: </b>${week2}<br></span><br>
               
                        <span style="font-size:12px;font-family:Segoe UI"><b>Rate of Unvaccinated (per 100k):</b></span>  
                        <br>
                       
                       <span style="font-size:12px;font-family:Segoe UI;color: ${color('Unvax_80')}"> <b>Ages 80+:</b></span>
                       <span style="font-size:12px;font-family:Segoe UI;color: ${color('Unvax_80')}"> ${number_format(dataForDate['Unvax_80'])}</span><br>
                       
                 
                       <span style="font-size:12px;font-family:Segoe UI;color: ${color('Unvax_50_79')}"> <b>Ages 50-79:</b></span>
                       <span style="font-size:15px;color: ${color('Unvax_50_79')}"> ${number_format(dataForDate['Unvax_50_79'])}</span><br>
                    
                        
                       <span style="font-size:12px;font-family:Segoe UI;color: ${color('Unvax_18_49')}"> <b>Ages 18-49:</b></span>
                       <span style="font-size:12px;font-family:Segoe UI;color: ${color('Unvax_18_49')}"> ${number_format(dataForDate['Unvax_18_49'])}</span><br>
                    
                        <br>
                        <span style="font-size:12px;font-family:Segoe UI"><b>Rate of Vaccinated (per 100k):</b></span> 
                         <br>
                      
                       <span style="font-size:12px;font-family:Segoe UI;color: ${color('Vax_80')}"> <b>Ages 80+:</b></span>
                       <span style="font-size:12px;font-family:Segoe UI;color: ${color('Vax_80')}"> ${number_format(dataForDate['Vax_80'])}</span><br>
                    
                        
                       <span style="font-size:12px;font-family:Segoe UI;color: ${color('Vax_50_79')}"> <b>Ages 50-79:</b></span>
                       <span style="font-size:12px;font-family:Segoe UI;color: ${color('Vax_50_79')}"> ${number_format(dataForDate['Vax_50_79'])}</span><br>
                    
                          
                       <span style="font-size:12px;font-family:Segoe UI;color: ${color('Vax_18_49')}"> <b>Ages 18-49:</b></span>
                       <span style="font-size:12px;font-family:Segoe UI;color: ${color('Vax_18_49')}"> ${number_format(dataForDate['Vax_18_49'])}</span><br>
                    
                       
                  
                      <br>`)

                .style("opacity", 1)
                .style("font-size", "12px")
                .style("left", ((event.x) + 10) + "px")
                .style("top", ((event.y) + 10) + "px");



        }


        const mouseleave = function (event, d) {
            console.log("mouseleave");
            tooltip
                .style("opacity", 0)

            vis.svg.selectAll("rect.main-rect").style("opacity", 1)
        }


        // Show the bars
        vis.svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .join("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(d => d)
            .join("rect")
            .attr("class", d => "main-rect rect-bar-" + d.data.Week)
            .attr("x", d => x(d.data.Week))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave)


        //overall chart title
        vis.svg
            .append("text")
            .attr("x", 0)
            .attr("y", (vis.margin.top / 5) - vis.margin.top)
            .attr("class", "title")
            .text("Weekly count of vaccinated & unvaccinated individuals who caught Covid-19, split by age")
            .attr("fill", "black")
            .attr("font-size", "20")
            .attr("font-family", "Segoe UI")
            .attr("font-weight", "bold")

        //overall chart subtitle
        vis.svg
            .append("text")
            .attr("x", 0)
            .attr("y", (vis.margin.top / 5) - vis.margin.top + 30)
            .attr("class", "title")
            .text("Apr 2021-Feb 2022")
            .attr("fill", "black")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "17")

        //add instructions
        vis.svg
            .append("text")
            .attr("x", 0)
            .attr("y", (vis.margin.top / 5) - vis.margin.top + 55)
            .attr("class", "title")
            .text("*Hover over the bars to explore further")
            .attr("fill", "black")
            .attr("font-size", "12")
            .attr("font-family", "Segoe UI")
            .attr("font-style", "italic")


        //grey y gridlines
        vis.make_x_gridlines = function () {
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


        // create a list of keys
        var keys = ["Ages 18-49", "Ages 50-79", "Ages 80+"].reverse()


        // Usually you have a color scale in your chart already
        var color3 = d3.scaleOrdinal()
            .domain(keys)
            .range(['#04386b', '#0984ea', '#7dc9f5'])

        var color2 = d3.scaleOrdinal()
            .domain(keys)
            .range(['#9e3a26', '#ef701b', '#f4d166'])

        // Add one dot in the legend for each name.
        var size = 10

        vis.svg.selectAll("mydots")
            .data(keys)
            .enter()
            .append("rect")
            .attr("class", "rect")
            .attr("x", vis.width + 50)
            .attr("y", function (d, i) {
                return 30 + i * (size + 8)
            })
            .attr("width", size)
            .attr("height", size)
            .style("fill", function (d) {
                return color2(d)
            })


        vis.svg.selectAll("mydots")
            .data(keys)
            .enter()
            .append("rect")
            .attr("class", "rect")
            .attr("x", vis.width + 50)
            .attr("y", function (d, i) {
                return 150 + i * (size + 8)
            })
            .attr("width", size)
            .attr("height", size)
            .style("fill", function (d) {
                return color3(d)
            })

        // Add one dot in the legend for each name.
        vis.svg.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", vis.width + 60 + size * 1.2)
            .attr("y", function (d, i) {
                return 30 + i * (size + 8) + (size / 2)
            })
            .style("fill", "black")
            .attr("font-family", "Segoe UI")
            .style("font-size", "14px")
            .text(function (d) {
                return d
            })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")


        // Add one dot in the legend for each name.
        vis.svg.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", vis.width + 60 + size * 1.2)
            .attr("y", function (d, i) {
                return 150 + i * (size + 8) + (size / 2)
            })
            // .style("fill", function(d){ return color2(d)})
            .style("fill", "black")
            .attr("font-family", "Segoe UI")
            .style("font-size", "14px")
            .text(function (d) {
                return d
            })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        //y axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.width / 4)
            .attr("y", 0 - 50)
            .attr("font-size", "16")
            .attr("font-family", "Segoe UI")
            .text("Case count per 100k people");


        //share of non vaccination title
        vis.svg
            .append("text")
            .attr("x", vis.width + 50)
            .attr("y", (vis.margin.top / 3) - vis.margin.top + 80)
            .attr("class", "title")
            .text("Rate of Unvaccinated")
            .attr("fill", "black")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "16")

        //share of vaccination title
        vis.svg
            .append("text")
            .attr("x", vis.width + 50)
            .attr("y", (vis.margin.top / 3) - vis.margin.top + 200)
            .attr("class", "title")
            .text("Rate of Vaccinated")
            .attr("fill", "black")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "16")

        //add year labels to x axis (year 2022)
        // vis.svg
        //     .append("text")
        //     .attr("x", vis.width - 125)
        //     .attr("y", vis.height + 70)
        //     .attr("class", "title")
        //     .text("2022")
        //     .attr("fill", "black")
        //     .attr("font-family", "Segoe UI")
        //     .attr("font-size", "12")
        //
        // //add year labels to x axis (year 2021)
        // vis.svg
        //     .append("text")
        //     .attr("x", vis.margin.width + 50)
        //     .attr("y", vis.height + 70)
        //     .attr("class", "title")
        //     .text("2021")
        //     .attr("fill", "black")
        //     .attr("font-family", "Segoe UI")
        //     .attr("font-size", "12")
        //

        //add x label
        vis.svg
            .append("text")
            .attr("text-anchor", "middle")
            .attr("x", vis.width / 2)
            .attr("y", vis.height + 70)
            .attr("class", "title")
            .text("Week")
            .attr("fill", "black")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "16")
    }




}