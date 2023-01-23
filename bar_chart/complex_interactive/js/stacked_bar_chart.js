 class StackedBarChart {

    constructor(data, selector) {
        this.data = data;
        this.displayData = [];
        this.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        this.num_days = [31,28,31,30,31,30,31,31,30,31,30,31];
        this.weeks = { 14: 'Apr', 18: 'May', 23: 'Jun', 27: 'Jul', 31: 'Aug', 36: 'Sep', 40: 'Oct', 44: 'Nov', 49: 'Dec', 1: 'Jan', 6: 'Feb'}

        // List of subgroups = header of the csv files = soil condition here
        this.subgroups = this.data.columns.slice(4);

        // color palette = one color per subgroup
        this.color = d3.scaleOrdinal()
            .domain(this.subgroups)
            .range(['#0984ea','#0984ea','#0984ea', '#ef701b','#ef701b','#ef701b'])
            //.range(['#7dc9f5','#0984ea','#04386b', '#f4d166','#ef701b','#9e3a26'])

        this.buildHtml(selector);
        this.initVis();

        // this.initBrush()
    }

    buildHtml(selector) {
        console.log('building html')
        let container = selector 
                    ? $(`#${selector.questionId}`).find('.QuestionText')
                    : $('#main-container').find('.QuestionText')
        
        let mc = $('<div>', {class: 'col-8 main-content'}),
            lc = $('<div>', {class: 'col-4 legend-content'})

        mc.append($('<div>', {class: 'title'}).append($('<h3>', {id: 'chart-title', html: 'Weekly count of vaccinated & unvaccinated individuals who caught Covid-19, split by age'})))
          .append($('<br>'))
          .append($('<div>', {class: 'helper', html: '*Hover over the bars to explore further and brush the timeline on the right to filter the data'}))
          .append($('<br>'))
          .append($('<div>', {id: 'chart'}))
          .append($('<div>', {class: 'source', html: 'Source: Centers for Disease Control and Prevention'}))
            
        let time = $('<div>', {id: 'time_filter_div'}), 
            leg = $('<div>', {id: 'leg', class: 'legend'}),
            vac = $('<div>', {id: 'vax-leg', class: 'legend'}), 
            unv = $('<div>', {id: 'unvax-leg', class: 'legend'})
        
        time.append($('<div>', {class: 'brush-label', html: 'Filter by a Week Range'}))
            .append($('<div>', {id: 'left-date', class: 'legend-row', html: ''}))
            .append($('<div>', {id: 'right-date', class: 'legend-row3', html: ''}))
            .append($('<div>', {id: 'brush-chart'}))
            .append($('<div>', {class: 'legend-row', html: '2021'}))
            .append($('<div>', {class: 'legend-row2', html: '2022'}))
        
        let leg_row1 = $('<div>', {class: 'legend_row'}),
            leg_row2 = $('<div>', {class: 'legend_row'}),
            leg_svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            leg_svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        
        leg_svg1.setAttribute('id','lsvg1')
        leg_svg2.setAttribute('id','lsvg2')

        leg_row1.append($('<div>', {class: 'legend-value'}).append(leg_svg1))
                .append($('<div>', {class: 'legend-label', html: 'Rate of Unvaccinated'}))
        
        leg_row2.append($('<div>', {class: 'legend-value'}).append(leg_svg2))
                .append($('<div>', {class: 'legend-label', html: 'Rate of Vaccinated'}))
        
        leg.append(leg_row1).append(leg_row2)

        let vac_row1 = $('<div>', {class: 'legend_row'}), 
            vac_row2 = $('<div>', {class: 'legend_row'}), 
            vac_row3 = $('<div>', {class: 'legend_row'}),
            vac_svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            vac_svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            vac_svg3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        
        vac_svg1.setAttribute('id','vsvg1')
        vac_svg2.setAttribute('id','vsvg2')
        vac_svg3.setAttribute('id','vsvg3')
        
        vac_row1.append($('<div>', {class: 'legend-value'}).append(vac_svg1))
                .append($('<div>', {class: 'legend-label', html: 'Ages 80+'}))
        
        vac_row2.append($('<div>', {class: 'legend-value'}).append(vac_svg2))
                .append($('<div>', {class: 'legend-label', html: 'Ages 50-79'}))

        vac_row3.append($('<div>', {class: 'legend-value'}).append(vac_svg3))
                .append($('<div>', {class: 'legend-label', html: 'Ages 18-49'}))

        vac.append($('<div>', {class: 'legend-title', html: 'Rate of Vaccinated'}))
           .append(vac_row1).append(vac_row2).append(vac_row3)
            
        
        let unv_row1 = $('<div>', {class: 'legend_row'}), 
            unv_row2 = $('<div>', {class: 'legend_row'}), 
            unv_row3 = $('<div>', {class: 'legend_row'}),
            unv_svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            unv_svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            unv_svg3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        
        unv_svg1.setAttribute('id','usvg1')
        unv_svg2.setAttribute('id','usvg2')
        unv_svg3.setAttribute('id','usvg3')

        unv_row1.append($('<div>', {class: 'legend-value'}).append(unv_svg1))
                .append($('<div>', {class: 'legend-label', html: 'Ages 80+'}))
        
        unv_row2.append($('<div>', {class: 'legend-value'}).append(unv_svg2))
                .append($('<div>', {class: 'legend-label', html: 'Ages 50-79'}))

        unv_row3.append($('<div>', {class: 'legend-value'}).append(unv_svg3))
                .append($('<div>', {class: 'legend-label', html: 'Ages 18-49'}))

        unv.append($('<div>', {class: 'legend-title', html: 'Rate of Unvaccinated'}))
           .append(unv_row1).append(unv_row2).append(unv_row3)
        
        lc.append(time).append(leg).append(unv).append(vac)

        if(selector) container.append($('<div>', {class: 'row'}).append(mc).append(lc))
        else container.append(mc).append(lc)

        d3.select('#lsvg1').append('rect').style('fill', '#ef701b')
        d3.select('#lsvg2').append('rect').style('fill', '#0984ea')

        d3.select('#usvg1').append('rect').style('fill', '#9e3a26')
        d3.select('#usvg2').append('rect').style('fill', '#ef701b')
        d3.select('#usvg3').append('rect').style('fill', '#f4d166')

        d3.select('#vsvg1').append('rect').style('fill', '#04386b')
        d3.select('#vsvg2').append('rect').style('fill', '#0984ea')
        d3.select('#vsvg3').append('rect').style('fill', '#7dc9f5')

        leg.hide()
    }

    initVis() {
        let vis = this;


       // set the dimensions and margins of the graph
        vis.margin = {top: 20, right: 20, bottom: 100, left: 70};
        vis.totalWidth = d3.select('#chart').node().getBoundingClientRect().width
        if(vis.totalWidth < 0) console.log(vis.totalWidth)
        vis.width = vis.totalWidth - vis.margin.left - vis.margin.right;
        if(vis.width < 0) console.log(vis.width)
        vis.height = vis.totalWidth/2 - vis.margin.top - vis.margin.bottom;
        if(vis.height < 0) console.log(vis.height)

        vis.svg = d3.select('#chart')
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);


        // Add X axis
        vis.x_scale = d3.scaleBand()
            .range([0, vis.width])
            .padding([0.2]);

        vis.x_axis = d3.axisBottom().scale(vis.x_scale).tickFormat(
            (d,i) => {
                let [_,mo,day] = d.toISOString().split('T')[0].split('-')
                return `${vis.months[+mo-1]} ${day}`
            }
        );

        vis.x_axis2 = d3.axisBottom().scale(vis.x_scale).tickFormat(
            (d,i) => {
                let [_,mo,da] = d.toISOString().split('T')[0].split('-').map(d => +d)
                return (i===0) ? '2021' : ((mo === 1 && da-7 < 0) ? '2022' : '')
            });

        // Add Y axis
        vis.y_scale = d3.scaleLinear().range([vis.height, 0]);

        vis.y_axis = d3.axisLeft().scale(vis.y_scale);


        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "x-axis")
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "0.5em")
            .attr("dy", "1em")
            .style('font-size', '12px');
        
        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "x-axis2")
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "0.5em")
            .attr("dy", "1em")
            .style('font-size', '12px');

        vis.svg.append("g").attr("class", "y-axis");


        // tooltip
        vis.tooltip = d3.select("body")
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
            .style("padding", "10px")
            .style("display", "none")

        vis.initBrush();

        vis.wrangleData();
    }

    wrangleData(startDate, endDate) {
        let vis = this;

        if (startDate && endDate) {
            vis.displayData = vis.data.filter(row => row.Max_Week_Date >= startDate && row.Max_Week_Date <= endDate);
        }
        else {
            vis.displayData = [...vis.data];
        }

        vis.updateVis();
    }

    updateVis() {
        let vis = this;


        // List of groups = species here = value of the first column called group -> I show them on the X axis
        vis.groups = vis.displayData.map(d => (d.Max_Week_Date));

        //stack the data? --> stack per subgroup
        const stackedData = d3.stack()
            .keys(vis.subgroups)
            (vis.displayData);

        vis.x_scale.domain(vis.groups);
        vis.y_scale.domain([0, d3.max(stackedData, d => d3.max(d, function (d) { return d[1]; }))]);

        vis.svg.selectAll(".x-axis").transition().duration(200).call(vis.x_axis).style('font-size', '12px');
        vis.svg.selectAll(".x-axis2").transition().duration(200).call(vis.x_axis2).style('font-size', '12px');
        vis.svg.selectAll(".y-axis").transition().duration(200).call(vis.y_axis).style('font-size', '12px');

        vis.svg.select('.x-axis').selectAll('text').attr('transform','translate(-20,20) rotate(-45)')
        vis.svg.select('.x-axis2').selectAll('text').attr('transform','translate(-20,40)')

        vis.svg.selectAll(".stacked").remove();

        // Show the bars
        vis.svg.append("g")
            .attr("class", "stacked")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .join("g")
            .attr("fill", d => vis.color(d.key))
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(d => d)
            .join("rect")
            .attr("class", d => "main-rect rect-bar-" + d.data.Max_Week_Date2)
            .attr("x", d => vis.x_scale(d.data.Max_Week_Date))
            .attr("y", d => vis.y_scale(d[1]))
            .attr("height", d => {
                let ret = vis.y_scale(d[0]) - vis.y_scale(d[1])
                if(ret < 0){
                    ret = -ret
                    console.log(ret)
                }
                if(isNaN(ret)){
                    console.log(d)
                }
                return ret
            })
            .attr("width", vis.x_scale.bandwidth());




        //grey y gridlines
        const make_x_gridlines = function() {
            return d3.axisLeft(vis.y_scale).ticks(5);
        }

        vis.svg.selectAll(".grid").remove();

        vis.svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + 0 + ",0)")
            .style("stroke-dasharray", "3 3")
            .call(make_x_gridlines()
                .tickSize(-vis.width)
                .tickFormat("")
            );

        const yearFormat = d3.timeFormat("%Y");
        const number_format = d3.format(',');
        const color = d3.scaleOrdinal()
            .domain(vis.subgroups)
            .range(['#7dc9f5','#0984ea','#04386b', '#f4d166','#ef701b','#9e3a26']);

        // Three function that change the tooltip when user hover / move / leave a cell
        vis.mouseover = function(e, d) {
            const date = d.data.group;
            const year = yearFormat(d.data.Max_Week_Date);
            const week = d.data.Max_Week_Date2;
            let dataForDate = d.data;
            let total = 0;
            vis.subgroups.forEach(sg => total += parseInt(dataForDate[sg]));

            vis.tooltip
                .html(`
                    <b>Week:</b> ${week}<br>
                    <b>Year:</b> ${year}<br>
                    <br>
                    <b>Rate of Unvaccinated (per 100k):</b>
                    <br>
                    <span style="font-size:11px;color: ${color('Unvax_80')}"> <b>Ages 80+:</b></span>
                    <span style="font-size:11px;color: ${color('Unvax_80')}"> ${number_format(dataForDate['Unvax_80'])}</span>
                    <br>
                    <span style="font-size:11px;color: ${color('Unvax_50_79')}"> <b>Ages 50-79:</b></span>
                    <span style="font-size:11px;color: ${color('Unvax_50_79')}"> ${number_format(dataForDate['Unvax_50_79'])}</span>
                    <br>
                    <span style="font-size:11px;color: ${color('Unvax_18_49')}"> <b>Ages 18-49:</b></span>
                    <span style="font-size:11px;color: ${color('Unvax_18_49')}"> ${number_format(dataForDate['Unvax_18_49'])}</span>
                    <br><br>
                    <b>Rate of Vaccinated (per 100k):</b>
                    <br>
                    <span style="font-size:11px;color: ${color('Vax_80')}"> <b>Ages 80+:</b></span>
                    <span style="font-size:11px;color: ${color('Vax_80')}"> ${number_format(dataForDate['Vax_80'])}</span>
                    <br>
                    <span style="font-size:11px;color: ${color('Vax_50_79')}"> <b>Ages 50-79:</b></span>
                    <span style="font-size:11px;color: ${color('Vax_50_79')}"> ${number_format(dataForDate['Vax_50_79'])}</span>
                    <br>
                    <span style="font-size:11px;color: ${color('Vax_18_49')}"> <b>Ages 18-49:</b></span>
                    <span style="font-size:11px;color: ${color('Vax_18_49')}"> ${number_format(dataForDate['Vax_18_49'])}</span>
                    <br><br>
                `)
                .style("opacity", 1)
                .style("font-size", "11px")
                .style("display", "block")
                .style("left", ((event.x) +10) + "px")
                .style("top", ((event.y) -70) + "px");


            // change opacity to all non-highlighted bars
            vis.svg.selectAll(".main-rect").style("opacity", 0.3);

            // reference this particular, highlighted bars with 1 opacity
            vis.svg.selectAll(".rect-bar-" + d.data.Max_Week_Date2).style("opacity", 1);
        };

        vis.mouseleave = function(event, d) {
            vis.tooltip.style("opacity", 0)
                .style("display", "none")
            vis.svg.selectAll(".main-rect").style("opacity", 1)


        }

        vis.svg.selectAll(".overlay").remove();

        vis.svg.append("g")
            .selectAll(".overlay")
            .data(stackedData[5])
            .join("rect")
            .attr("class", "overlay")
            // .attr("stroke", "black")
            .attr("x", d => {
                let ret = vis.x_scale(d.data.Max_Week_Date)
                if(ret < 0) ret = -ret;
                if(isNaN(ret)) console.log('ret',ret)
                return ret;
            })
            .attr("y", d => vis.y_scale(d[1])-500)
            .attr("height", d => {
                let ret = vis.y_scale(0) - vis.y_scale(d[1])+500
                if(ret < 0) ret = -ret;
                return ret
            })
            .attr("width", vis.x_scale.bandwidth())
           .style("fill", "transparent")
            .on("mouseover", vis.mouseover)
            .on("mouseleave", vis.mouseleave)



    }

    initBrush() {
        let vis = this;

        const height = 25;
        const width = 220;

        let x = d3.scaleTime()
            .domain([new Date(2021,3,5), new Date(2022,1,7)])
            .range([0, width]);

        let xAxis = d3.axisBottom()
            .scale(x)
            .ticks(21)
            .tickSize([10])
            .tickFormat(d3.timeFormat('%b'));


        


        let brush = d3.brushX()
            .extent([[0,0], [width, height]])
            .on("brush", brushed)
            .on("brush end", function(e) {
                
                if(!e.selection || e.selection[1] - e.selection[0] < 5 ){
                    $('#vax-leg').hide()
                    $('#unvax-leg').hide()
                    $('#leg').show()
                    $('#chart-title').html('Weekly count of vaccinated & unvaccinated individuals who caught Covid-19')
                } 
                else{
                    $('#leg').hide()
                    $('#vax-leg').show()
                    $('#unvax-leg').show()
                    $('#chart-title').html('Weekly count of vaccinated & unvaccinated individuals who caught Covid-19, split by age')
                }
                
                let startDate = e.selection ? e.selection[1] - e.selection[0] >= 5 ? x.invert(e.selection[0]) : x.invert(0) : x.invert(0);
                let endDate = e.selection ? e.selection[1] - e.selection[0] >= 5 ? x.invert(e.selection[1]) : x.invert(width) : x.invert(width);

                console.log(startDate, endDate)
                console.log(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0])

                $('#left-date').html(startDate.toISOString().split('T')[0])
                $('#right-date').html(endDate.toISOString().split('T')[0])

                let twoColors = ['#0984ea','#0984ea','#0984ea', '#ef701b','#ef701b','#ef701b'],
                    sixColors = ['#7dc9f5','#0984ea','#04386b', '#f4d166','#ef701b','#9e3a26']

                vis.color.range(e.selection ? ((e.selection[1] - e.selection[0] < 5) ? twoColors : sixColors) : twoColors)

                vis.wrangleData(startDate, endDate);
            });

        let svg = d3.select("#brush-chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(xAxis);



        let brushg = svg.append("g")
            .attr("class", "brush")
            .attr("width", width)
            .attr("height", height)
            .call(brush);


        svg.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', width)
            .attr('y2', 0)


        function brushed() {
            let range = d3.brushSelection(this);

            console.log(range)
            console.log(range[i])

            d3.selectAll("span")
                .text(function(d, i) { return Math.round(range[i]); });


        }

        // // v3:  brushed();
        brush.move(brushg, [14, 14].map(x));

        //y axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.width/4)
            .attr("y", 0-50)
            .attr("font-size", "16")
            .text("Case count per 100k people");

        //add x label
        vis.svg
            .append("text")
            .attr("text-anchor", "middle")
            .attr("x", vis.width/2)
            .attr("y", vis.height+80)
            .attr("class", "title")
            .text("Week")
            .attr("fill","black")
            .attr("font-size", "16")

    }
}
