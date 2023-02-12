 class StackedBarChart {

    constructor(props) {
        // global metadata
        this.isInteractive = props.interactive;
        this.isStacked = props.stacked;
        this.source = props.source;
        this.whole_data = true;
        this.setup_complete = false;

        // formatting functions
        this.yearFormat = d3.timeFormat("%Y");
        this.number_format = d3.format(',');
        
        // global data
        this.data = props.data;
        this.displayData = props.data;
        this.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        this.num_days = [31,28,31,30,31,30,31,31,30,31,30,31];
        this.weeks = { 14: 'Apr', 18: 'May', 23: 'Jun', 27: 'Jul', 31: 'Aug', 36: 'Sep', 40: 'Oct', 44: 'Nov', 49: 'Dec', 1: 'Jan', 6: 'Feb'};
        this.rids = ['lsvg1','lsvg2','vsvg1','vsvg2','vsvg3','usvg1','usvg2','usvg3'];
        this.rcolors = ['#ef701b','#0984ea','#9e3a26','#ef701b','#f4d166','#04386b','#0984ea','#7dc9f5'];
        this.rlabels = ['Rate of Unvaccinated','Rate of Vaccinated','Ages 80+','Ages 50-79','Ages 18-49','Ages 80+','Ages 50-79','Ages 18-49'];
        this.svgs = {};

        // provenance metadata
        this.trigger = null;
        this.provenance = [];
        this.staging_hover = {
            start: null,
            end: null
        }

        // tooltip
        this.tooltip = d3.select("body")
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

        // List of subgroups = header of the csv files
        this.groups = this.displayData.map(d => (d.Max_Week_Date))
        this.subgroups = this.data.columns.slice(4);

        this.buildHtml(props.selector)

        // color palette = one color per subgroup
        this.color = d3.scaleOrdinal()
            .domain(this.subgroups)
            .range(['#0984ea','#0984ea','#0984ea', '#ef701b','#ef701b','#ef701b'])  

        // set the dimensions and margins of the graph
        this.margin = {top: 20, right: 20, bottom: 100, left: 70};
        this.totalWidth = d3.select('#chart').node().getBoundingClientRect().width
        this.width = this.totalWidth - this.margin.left - this.margin.right;
        this.height = this.totalWidth/(2-this.isStacked/2) - this.margin.top - this.margin.bottom;

        this.x_scale = d3.scaleBand()
            .range([0, this.width])
            .padding([0.2]);
            
        this.x_axis = d3.axisBottom(this.x_scale).tickFormat(
            (d,i) => {
                let [_,mo,day] = d.toISOString().split('T')[0].split('-')
                return (this.whole_data && i%2==1) ? '' : `${this.months[+mo-1]} ${day}`
            }
        );

        this.x_axis2 = d3.axisBottom(this.x_scale).tickFormat(
            (d,i) => {
                let [_,mo,da] = d.toISOString().split('T')[0].split('-').map(d => +d)
                return (i===0) ? '2021' : ((mo === 1 && da-7 < 0) ? '2022' : '')
            });

        this.y_scale = d3.scaleLinear().range([this.height, 0]);
        this.y_axis = d3.axisLeft().scale(this.y_scale);

    }

    buildHtml(selector=null) {
        let vis = this;
        let container = selector 
                    ? d3.select(`#${selector.questionId}`).select('.QuestionText')
                        .insert('div',':first-child')
                        .attr('class','row')
                    : d3.select('#main-container').select('.QuestionText')


        let mc = container.append('div').attr('class','col-8 main-content'),
            lc = container.append('div').attr('class','col-4 legend-content'),
            rows, time, legend, leg, vac, unv, leg_row1, leg_row2, vac_row1, vac_row2, vac_row3, unv_row1, unv_row2, unv_row3
        
        mc.append('div').attr('class', 'title')
            .append('h3').attr('id','chart-title').text('Weekly count of vaccinated & unvaccinated individuals who caught Covid-19');
        //mc.append('br');
        mc.append('div').append('p').attr('class','helper').text(
            '*Hover over the bars to explore further' + (vis.isInteractive ? ' and brush the timeline on the right to filter the data' : '')
            );
        //mc.append('br');
        mc.append('div').attr('id','chart');
        if(!vis.isStacked) mc.append('div').attr('id','chart2');
        if(vis.source) mc.append('div').append('a').attr('target','_').attr('href','https://data.cdc.gov/Public-Health-Surveillance/Rates-of-COVID-19-Cases-or-Deaths-by-Age-Group-and/3rge-nu2a/data').attr('class', 'source').text('Source: Centers for Disease Control and Prevention');

        if(vis.isInteractive){
            time = lc.append('div').attr('id','time_filter_div')
            time.append('div').attr('class','brush-label').text('Filter by Month Range')

            let dates = time.append('div').attr('class','legend-row')
            
            dates.append('p').attr('id','left-date').attr('class','alignLeft').text(new Date(2021,3,5).toISOString().split('T')[0])
            dates.append('p').attr('id','right-date').attr('class','alignRight ').text(new Date(2022,1,7).toISOString().split('T')[0])

            time.append('div').attr('id','brush-chart')

            legend = lc.append('div').attr('class', 'legend')

            leg = legend.append('div').attr('id','leg')
            leg_row1 = leg.append('div')
            leg_row2 = leg.append('div')

            vac = legend.append('div').attr('id','vax-leg')
            vac.append('div').append('p').attr('class','legend-title').text('Rate of Vaccinated')
            vac_row1 = vac.append('div'); vac_row2 = vac.append('div'); vac_row3 = vac.append('div')

            unv = legend.append('div').attr('id','unvax-leg')
            unv.append('div').append('p').attr('class','legend-title').text('Rate of Unvaccinated')
            unv_row1 = unv.append('div'); unv_row2 = unv.append('div'); unv_row3 = unv.append('div')

            let years = time.append('div').attr('class', 'legend-row')
            years.append('p').attr('class','alignLeft').text('2021')
            years.append('p').attr('class','alignRight ').text('2022')

            vac.style('display','none')
            unv.style('display', 'none')

        } else {
            leg = lc.append('div').attr('id','leg').attr('class','legend')
            leg_row1 = leg.append('div')
            leg_row2 = leg.append('div')
        }

        rows = vis.isInteractive ? [leg_row1, leg_row2,vac_row1,vac_row2,vac_row3,unv_row1,unv_row2,unv_row3] : [leg_row1,leg_row2]
        rows = rows.map(d => d.attr('class','legend-row'))

        rows.forEach((d,i) => {
            d.append('div').attr('class','legend-value').append('svg').attr('id',vis.rids[i]).append('rect').style('fill',vis.rcolors[i])
            d.append('div').append('p').attr('class','legend-label').text(vis.rlabels[i])
        })
        
    }

    mouse_over(e,d,id,isOne){
        let vis = this;

        vis.trigger = setTimeout(() => {
            vis.staging_hover.start = Date.now() - 1000
        }, 1000); 

        let tooltip_text = !vis.whole_data 
            ? `<b>Week:</b> ${d.data.Max_Week_Date2}<br>
               <b>Year:</b> ${vis.yearFormat(d.data.Max_Week_Date)}<br>
               <br>
               <b>Rate of Unvaccinated (per 100k):</b>
               <br>
               <span style="font-size:11px;color: ${vis.color('Unvax_80')}"> <b>Ages 80+:</b></span>
               <span style="font-size:11px;color: ${vis.color('Unvax_80')}"> ${vis.number_format(d.data['Unvax_80'])}</span>
               <br>
               <span style="font-size:11px;color: ${vis.color('Unvax_50_79')}"> <b>Ages 50-79:</b></span>
               <span style="font-size:11px;color: ${vis.color('Unvax_50_79')}"> ${vis.number_format(d.data['Unvax_50_79'])}</span>
               <br>
               <span style="font-size:11px;color: ${vis.color('Unvax_18_49')}"> <b>Ages 18-49:</b></span>
               <span style="font-size:11px;color: ${vis.color('Unvax_18_49')}"> ${vis.number_format(d.data['Unvax_18_49'])}</span>
               <br><br>
               <b>Rate of Vaccinated (per 100k):</b>
               <br>
               <span style="font-size:11px;color: ${vis.color('Vax_80')}"> <b>Ages 80+:</b></span>
               <span style="font-size:11px;color: ${vis.color('Vax_80')}"> ${vis.number_format(d.data['Vax_80'])}</span>
               <br>
               <span style="font-size:11px;color: ${vis.color('Vax_50_79')}"> <b>Ages 50-79:</b></span>
               <span style="font-size:11px;color: ${vis.color('Vax_50_79')}"> ${vis.number_format(d.data['Vax_50_79'])}</span>
               <br>
               <span style="font-size:11px;color: ${vis.color('Vax_18_49')}"> <b>Ages 18-49:</b></span>
               <span style="font-size:11px;color: ${vis.color('Vax_18_49')}"> ${vis.number_format(d.data['Vax_18_49'])}</span>
               <br><br>`
            : vis.isStacked 
                ? `<b>Week:</b> ${d.data.Max_Week_Date2}<br>
                <b>Year:</b> ${vis.yearFormat(d.data.Max_Week_Date)}
                <br>
                <span style="font-size:11px;color: ${vis.color('Unvax_80')}"> <b>Rate of Unvaccinated (per 100k):</b></span>
                <span style="font-size:11px;color: ${vis.color('Unvax_80')}"> ${vis.number_format(d.data.Age_adjusted_unvax_IR)}</span>
                <br>
                <span style="font-size:11px;color: ${vis.color('Vax_80')}"> <b>Rate of Vaccinated (per 100k):</b></span>
                <span style="font-size:11px;color: ${vis.color('Unvax_50_79')}"> ${vis.number_format(d.data.Age_adjusted_vax_IR)}</span>
                <br>`
                : `<b>Week:</b> ${d.Max_Week_Date2}<br>
                <b>Year:</b> ${vis.yearFormat(d.Max_Week_Date)}<br>
                <span style="font-size:11px;color: ${vis.color(isOne ? 'Unvax_80' : 'Vax_80')}"> <b>${(isOne ? "Rate of Unvaccinated (per 100k): " : "Rate of Vaccinated (per 100k): ")}</b></span>
                <span style="font-size:11px;color: ${vis.color(isOne ? 'Unvax_80' : 'Vax_80')}"> ${vis.number_format(isOne ? d.Age_adjusted_unvax_IR : d.Age_adjusted_vax_IR)}</span>
                <br>`

        let [x_coord, y_coord] = d3.pointer(e,this)

        vis.tooltip
            .html(tooltip_text)
            .style("opacity", 1)
            .style("font-size", "11px")
            .style("display", "block")
            .style("left", (x_coord+10) + "px")
            .style("top", (y_coord-70) + "px");

        // change opacity to all non-highlighted bars
        vis.svgs[id].selectAll(".main-rect").style("opacity", 0.3);

        // reference this particular, highlighted bars with 1 opacity
        vis.svgs[id].selectAll(".rect-bar-" + (vis.isStacked ? d.data.Max_Week_Date2 : d.Max_Week_Date2)).style("opacity", 1);

    }

    mouse_out(d,id){
        let vis = this;
        clearTimeout(vis.trigger)
        if(vis.staging_hover.start){
            vis.staging_hover.end = Date.now()
            vis.provenance.push({
                time: vis.staging_hover.start,
                label: 'hovered',
                timeHovered: vis.staging_hover.end-vis.staging_hover.start,
                data: vis.isStacked ? d.data : d
            })
            vis.staging_hover.start = null;
            vis.staging_hover.end = null;
        }
            
        vis.tooltip.style("opacity", 0)
            .style("display", "none")
        vis.svgs[id].selectAll(".main-rect").style("opacity", 1)
    }

    getProvenance(){
        return this.provenance
    }

    initVis(id,isOne){
        let vis = this;
        vis.svgs[id] = d3.select('#' + id)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);

        let fontsize = Math.max(11,vis.height/15)

        //y axis label
        vis.svgs[id].append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.height/2)
            .attr("y", 0-55)
            .attr("font-size", fontsize)
            .text("Cases per 100k people");

        //add x label
        vis.svgs[id]
            .append("text")
            .attr("text-anchor", "middle")
            .attr("x", vis.width/2)
            .attr("y", vis.height+80)
            .attr("class", "title")
            .text("Week Start Date")
            .attr("fill","black")
            .attr("font-size", fontsize)
        
        vis.svgs[id].append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "x-axis")
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "0.5em")
            .attr("dy", "1em")
            .style('font-size', '12px');
        
        vis.svgs[id].append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "x-axis2")
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "0.5em")
            .attr("dy", "1em")
            .style('font-size', '12px');

        vis.svgs[id].append("g").attr("class", "y-axis");

        if(vis.isInteractive) vis.initBrush(id)
        vis.updateVis(id,isOne)
    }

    wrangleData(startDate, endDate,id) {
        let vis = this;
        vis.whole_data = Math.abs(startDate-endDate) > 15033600000 || isNaN(Math.abs(startDate-endDate))
        vis.displayData = (startDate && endDate) 
            ? vis.data.filter(row => row.Max_Week_Date >= startDate && row.Max_Week_Date <= endDate)
            : [...vis.data];

        vis.updateVis(id);
    }

    updateVis(id,isOne) {
        let vis = this;

        vis.groups = vis.displayData.map(d => (d.Max_Week_Date))

        //stack the data? --> stack per subgroup
        let stackedData; if(vis.isStacked) stackedData = d3.stack().keys(vis.subgroups)(vis.displayData);

        vis.x_scale.domain(vis.groups);
        vis.y_scale.domain([0, vis.isStacked 
            ? d3.max(stackedData, d => d3.max(d, function (d) { return d[1]; })) 
            : d3.max(vis.data.map(d => d.Age_adjusted_unvax_IR))]);

        vis.svgs[id].selectAll(".x-axis").transition().duration(100).call(vis.x_axis);
        vis.svgs[id].selectAll(".x-axis2").transition().duration(100).call(vis.x_axis2);
        vis.svgs[id].selectAll(".y-axis").transition().duration(100).call(vis.y_axis);

        vis.svgs[id].select('.x-axis').selectAll('text').attr('transform','translate(-20,20) rotate(-45)')
        vis.svgs[id].select('.x-axis2').selectAll('text').attr('transform','translate(-20,40)')

        vis.svgs[id].selectAll(".stacked").remove();

        // Show the bars
        if(vis.isStacked){
            vis.svgs[id].append("g")
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
                        return (ret < 0) ? -ret : ret
                    })
                    .attr("width", vis.x_scale.bandwidth())
                    .on("mouseover", function(e,d){ vis.mouse_over(e,d,id) })
                    .on("mouseout", function(e,d){ vis.mouse_out(d,id) });
        } else {
            vis.svgs[id].selectAll("mybar")
                .data(vis.data)
                .join('rect')
                    .attr("class", d => "main-rect rect-bar-" + d.Max_Week_Date2)
                    .attr("x", d => vis.x_scale(d.Max_Week_Date))
                    .attr("y", d => vis.y_scale(isOne ? d.Age_adjusted_unvax_IR : d.Age_adjusted_vax_IR))
                    .attr("width", vis.x_scale.bandwidth())
                    .attr("height", d => vis.height - vis.y_scale(isOne ? d.Age_adjusted_unvax_IR : d.Age_adjusted_vax_IR))
                    .attr("fill", isOne ? "#ef701b" : "#0984ea")
                    .on("mouseover", function(e, d) { vis.mouse_over(e,d,id,isOne) })
                    .on("mouseout", function(e,d){ vis.mouse_out(d,id) })
        }

        //grey y gridlines
        const make_x_gridlines = function() {
            return d3.axisLeft(vis.y_scale).ticks(5);
        }

        vis.svgs[id].selectAll(".grid").remove();

        vis.svgs[id].append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + 0 + ",0)")
            .style("stroke-dasharray", "3 3")
            .call(make_x_gridlines()
                .tickSize(-vis.width)
                .tickFormat("")
            );
    }

    initBrush(id) {
        let vis = this;
        const width = d3.select('#brush-chart').node().getBoundingClientRect().width, height = 32;

        let x = d3.scaleTime()
            .domain([new Date(2021,3,5), new Date(2022,1,7)])
            .range([0, width]);

        let xAxis = d3.axisBottom()
            .scale(x)
            .ticks(21)
            .tickSize([10])
            .tickFormat(d3.timeFormat('%b'));

        vis.adjust_brush = function(e){
            let startDate = e.selection ? e.selection[1] - e.selection[0] >= 5 ? x.invert(e.selection[0]) : x.invert(0) : x.invert(0);
            let endDate = e.selection ? e.selection[1] - e.selection[0] >= 5 ? x.invert(e.selection[1]) : x.invert(width) : x.invert(width);

            if(!e.selection || e.selection[1] - e.selection[0] < 5 ){
                d3.select('#vax-leg').style('display','none')
                d3.select('#unvax-leg').style('display','none')
                d3.select('#leg').style('display','block')
                d3.select('#chart-title').text('Weekly count of vaccinated & unvaccinated individuals who caught Covid-19')
            } 
            else{
                d3.select('#vax-leg').style('display','block')
                d3.select('#unvax-leg').style('display','block')
                d3.select('#leg').style('display','none')
                d3.select('#chart-title').text('Weekly count of vaccinated & unvaccinated individuals who caught Covid-19, split by age')
            }

            d3.select('#left-date').text(startDate.toISOString().split('T')[0])
            d3.select('#right-date').text(endDate.toISOString().split('T')[0])

            let twoColors = ['#0984ea','#0984ea','#0984ea', '#ef701b','#ef701b','#ef701b'],
                sixColors = ['#7dc9f5','#0984ea','#04386b', '#f4d166','#ef701b','#9e3a26']

            vis.color.range(e.selection ? ((e.selection[1] - e.selection[0] < 5) ? twoColors : sixColors) : twoColors)

            vis.wrangleData(startDate, endDate, id);

            return [startDate, endDate]
        }

        let brush = d3.brushX()
            .extent([[0,0], [width, height]])
            .on("brush", function(e) {
                vis.adjust_brush(e)
            })
            .on('end', function(e){
                let [startDate,endDate] = vis.adjust_brush(e)
                if(startDate < endDate){
                    if(vis.whole_data) vis.provenance.push({
                        time: Date.now(),
                        label: 'cleared_brush'
                    })
                    else vis.provenance.push({
                        time: Date.now(),
                        label: 'brushed',
                        startDate: startDate,
                        endDate: endDate
                    })
                }
            });

        d3.select("#brush-chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr('class', 'brush-axis')
            .call(xAxis)
            .append("g")
                .attr("class", "brush")
                .attr("width", width)
                .attr("height", height)
                .call(brush)
        
        d3.select('.brush-axis').selectAll('text').attr('transform', 'translate(-17,8)rotate(-45)')
    }
}
