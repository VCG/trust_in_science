class BarChart {
    constructor(data, selector) {

        this.data = data;

        this.initVis(selector);
    }


    initVis(selector) {
        let vis = this;


        vis.margin = {top: 100, right: 210, bottom: 150, left: 70},
            vis.width = 1050 - vis.margin.left - vis.margin.right,
            vis.height = 380 - vis.margin.top - vis.margin.bottom;


        let currQuestion = selector ? d3.select(`#${selector.questionId}`)
                            .select('.QuestionText')
                            .insert('div',':first-child')
                            : d3.select('#bar_chart')
                                

        vis.svg = currQuestion
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

        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        let num_days = [31,28,31,30,31,30,31,31,30,31,30,31]
        
        vis.formatWeekDateRange = function(max_week_date){
            let [yr,mo,day] = max_week_date.split('-')
            let yr2 = yr, mo2 = mo, day2 = +day+7
            if(day2 > num_days[mo-1]){
                day2 -= num_days[mo-1]
                mo2 = +mo+1
                if(+mo2 > 12){
                    mo2 = 1
                    yr2 = +yr2+1
                }
            }
            
            return yr2 == yr 
                ? `${months[mo-1]} ${day} - ${months[mo2-1]} ${day2}, ${yr}`
                : `${months[mo-1]} ${day}, ${yr} - ${months[mo2-1]} ${day2}, ${yr2}`
        }

        //let tickLabels = ['','January','','','','','','','','',''];
        xAxisGenerator.tickFormat((d,i) => {
            return this.formatWeekDateRange(vis.data[i].Max_Week_Date2)
        });


        let tickLabels2 = [];
        xAxisGenerator2.tickFormat((d,i) => tickLabels2[i]);


        let tickLabels3 = ['April', '','June', 'July' , '', 'September', 'October', '', 'December', '','February']
        xAxisGenerator3.tickFormat((d,i) => tickLabels3[i]);

        let tickLabels4 = ['', 'May','', '' , '', '', '', 'November', '', '','']
        xAxisGenerator4.tickFormat((d,i) => tickLabels4[i]);

        let tickLabels5 = ['', '','', '' , 'August', '', '', '', '', 'January','']
        xAxisGenerator5.tickFormat((d,i) => tickLabels5[i]);



        //Draw x axis
        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(xAxisGenerator)
            .selectAll("text")
            .attr("font-size", "10")
            .style("text-anchor", "end")
            .attr("dx", "0.5em")
            .attr("dy", "1em")
            .attr("transform", "translate(-15,6)rotate(-45)");

        /*vis.svg.append("g")
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


        */


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

                return "<b>" + "Week: "+ "</b>" + (d.Max_Week_Date2) + "</b>" + "</br>" + "<b>" + "Year: "+  "</b>" + (d.Year) + "</br>" +  "<b>" + "Unvaccinated Rate: " + "</b>" + d.Age_adjusted_unvax_IR + " "+"per 100k"+ "<br />"

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
            .attr("y", (vis.margin.top/5)-vis.margin.top)
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
            .attr("y", (vis.margin.top/5)-vis.margin.top+30)
            .attr("class", "title")
            .text("Apr 2021-Feb 2022")
            .attr("fill","black")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "17")

        //overall chart subtitle
        vis.svg
            .append("text")
            .attr("x", 0)
            .attr("y", (vis.margin.top/5)-vis.margin.top+55)
            .attr("class", "title")
            .text("*Hover over the bars to explore further")
            .attr("fill","black")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "12")
            .attr("font-style", "italic")


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
            .attr("y", vis.height+110)
            .attr("font-size", "13")
            .attr("font-family", "Segoe UI")
            .attr('transform','translate(0,10)')
            .text("Week");
            


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