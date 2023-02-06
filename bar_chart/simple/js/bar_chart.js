class BarChart {
    constructor(data) {
        this.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        this.data = data;
    }

    buildHtml(selector){
        let container = selector 
                    ? d3.select(`#${selector.questionId}`).select('.QuestionText')
                        .insert('div',':first-child')
                        .attr('class','row')
                    : d3.select('#main-container').select('.QuestionText')
        
        let mc = container.append('div').attr('class','col-8 main-content'),
            lc = container.append('div').attr('class','col-4 legend-content')
        
        mc.append('div').attr('class', 'title')
            .append('h3').attr('id','chart-title').text('Weekly count of vaccinated & unvaccinated individuals who caught Covid-19, split by age');
        mc.append('br');
        mc.append('div').attr('class','helper').text('*Hover over the bars to explore further');
        mc.append('br');
        mc.append('div').attr('id','chart');
        mc.append('div').attr('id','chart2');
        mc.append('div').attr('class', 'source').text('Source: Centers for Disease Control and Prevention');

        let leg = lc.append('div').attr('id','leg').attr('class','legend')
        let leg_row1 = leg.append('div'), leg_row2 = leg.append('div')

        let rows = [leg_row1,leg_row2].map(d => d.attr('class','legend-row')),
            rids = ['lsvg1', 'lsvg2'],
            rcolors = ['#ef701b','#0984ea'],
            rlabels = ['Rate of Unvaccinated','Rate of Vaccinated']
        
        rows.forEach((d,i) => {
            d.append('div').attr('class','legend-value').append('svg').attr('id',rids[i]).append('rect').style('fill',rcolors[i])
            d.append('div').attr('class','legend-label').text(rlabels[i])
        })
    }

    initVis(isOne) {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 100, left: 70};
        vis.totalWidth = d3.select('#chart').node().getBoundingClientRect().width
        if(vis.totalWidth < 0) console.log(vis.totalWidth)
        vis.width = vis.totalWidth - vis.margin.left - vis.margin.right;
        if(vis.width < 0) console.log(vis.width)
        vis.height = vis.totalWidth/3 - vis.margin.top - vis.margin.bottom;
        if(vis.height < 0) console.log(vis.height)          

        vis.svg = d3.select(isOne ? `#chart` : '#chart2')
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        const groups = vis.data.map(d => (d.Week))

        // Add X axis
        const x = d3.scaleBand()
            .domain(groups)
            .range([0, vis.width])
            .padding([0.2])

        //x axis dates
        let xAxisGenerator = d3.axisBottom(x)
            .tickSize(10)
            .tickFormat((d,i) => {
                let [_,mo,day] = vis.data[i].Max_Week_Date2.split('-')
                return `${vis.months[+mo-1]} ${day}`
            });

        //x axis years
        let xAxisGenerator2 = d3.axisBottom(x)
            .tickSize(10)
            .tickFormat((d,i) => {
                let [_,mo,da] = vis.data[i].Max_Week_Date2.split('-').map(d => +d)
                return (i===0) ? '2021' : ((mo === 1 && da-7 < 0) ? '2022' : '')
            });

        //Draw x axis dates
        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(xAxisGenerator)
            .selectAll("text")
            .attr("font-size", "10")
            .style("text-anchor", "end")
            .attr("dx", "0.5em")
            .attr("dy", "1em")
            .attr("transform", "translate(-15,8)rotate(-45)");

        //Draw x axis years
        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "axisMonths2")
            .call(xAxisGenerator2)
            .selectAll("text").attr("id", "xAxis2")
            .attr("font-size", "12")
            .style("text-anchor", "end")
            .attr("dx", "0.5em")
            .attr("dy", "1em")
            .attr("transform", "translate(0,30) rotate(0)");


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
                return "<b>" + "Week: "+ "</b>" + (d.Max_Week_Date2) + "</b>" + "</br>" + "<b>" + "Year: "+  "</b>" + (d.Year) + "</br>" +  "<b>" + (isOne ? "Unvaccinated Rate: " : "Vaccinated Rate: ") + "</b>" + d.Age_adjusted_unvax_IR + " "+"per 100k"+ "<br />"
            });
        vis.svg.call(tip);

        // Bars
        vis.svg.selectAll("mybar")
            .data(vis.data)
            .join("rect")
            .attr("x", d => x(d.Week))
           // .tickFormat(d3.timeFormat("%Y-%U")))
            .attr("y", d => y(isOne ? d.Age_adjusted_unvax_IR : d.Age_adjusted_vax_IR))
            .attr("width", x.bandwidth())
            .attr("height", d => vis.height - y(isOne ? d.Age_adjusted_unvax_IR : d.Age_adjusted_vax_IR))
            .attr("fill", isOne ? "#ef701b" : "#0984ea")
            .on("mouseover", function(e, d) { tip.show(d, this); })
            .on("mouseout", tip.hide)

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
            .attr("y", vis.height+70)
            .attr("font-size", "13")
            .attr("font-family", "Segoe UI")
            .attr('transform','translate(0,0)')
            .text("Week Start Date");
    }

    buildLegend(){
        let vis = this;
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
        
        // create a list of keys
        var keys = ["Rate of Unvaccinated", "Rate of Vaccinated"]

        // Usually you have a color scale in your chart already
        var color = d3.scaleOrdinal()
            .domain(keys)
            .range(["#ef701b","#0984ea"]);

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
    }
}