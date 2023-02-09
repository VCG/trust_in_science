class LineChart {
    constructor(data, selector) {
        this.data = data;
        // create a list of keys
        this.keys = ["Ages 80+", "Ages 50-79", "Ages 18-49"]
        this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.num_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.weeks = {
            14: 'Apr',
            18: 'May',
            23: 'Jun',
            27: 'Jul',
            31: 'Aug',
            36: 'Sep',
            40: 'Oct',
            44: 'Nov',
            49: 'Dec',
            1: 'Jan',
            6: 'Feb'
        }

        this.color1 = d3.scaleOrdinal()
            .domain(this.keys)
            .range(['#9e3a26', '#ef701b', '#f4d166']);

        this.color2 = d3.scaleOrdinal()
            .domain(this.keys)
            .range(['#04386b', '#0984ea', '#7dc9f5']);

        this.buildHtml(selector);
        this.initVis();
    }

    buildHtml(selector) {
        console.log('building html')
        let container = selector
            ? d3.select(`#${selector.questionId}`).select('.QuestionText')
                .insert('div', ':first-child')
                .attr('class', 'row')
            : d3.select('#main-container').select('.QuestionText')


        let mc = container.append('div').attr('class', 'col-8 main-content'),
            lc = container.append('div').attr('class', 'col-4 legend-content')

        mc.append('div').attr('class', 'title')
            .append('h3').attr('id', 'chart-title').text('Weekly count of vaccinated & unvaccinated individuals who caught Covid-19, split by age');
        mc.append('br');
        mc.append('div').attr('class', 'helper').text('*Hover over the bars to explore further and brush the timeline on the right to filter the data');
        mc.append('br');
        mc.append('div').attr('id', 'chart');
        mc.append('div').attr('class', 'source').text('Source: Centers for Disease Control and Prevention');

        let time = lc.append('div').attr('id', 'time_filter_div'),
            leg = lc.append('div').attr('id', 'leg').attr('class', 'legend'),
            vac = lc.append('div').attr('id', 'vax-leg').attr('class', 'legend'),
            unv = lc.append('div').attr('id', 'unvax-leg').attr('class', 'legend')

        time.append('div').attr('class', 'brush-label').text('Filter by Month Range')

        let dates = time.append('div').attr('class', 'legend-row')
        dates.append('p').attr('id', 'left-date').attr('class', 'alignLeft').text('')
        dates.append('p').attr('id', 'right-date').attr('class', 'alignRight ').text('')

        time.append('div').attr('id', 'brush-chart')

        let years = time.append('div').attr('class', 'legend-row')
        years.append('p').attr('class', 'alignLeft').text('2021')
        years.append('p').attr('class', 'alignRight ').text('2022')

        vac.append('div').attr('class', 'legend-title').text('Rate of Vaccinated')
        unv.append('div').attr('class', 'legend-title').text('Rate of Unvaccinated')

        let leg_row1 = leg.append('div'), leg_row2 = leg.append('div'),
            vac_row1 = vac.append('div'), vac_row2 = vac.append('div'), vac_row3 = vac.append('div'),
            unv_row1 = unv.append('div'), unv_row2 = unv.append('div'), unv_row3 = unv.append('div')

        let rows = [leg_row1, leg_row2, vac_row1, vac_row2, vac_row3, unv_row1, unv_row2, unv_row3].map(d => d.attr('class', 'legend-row')),
            rids = ['lsvg1', 'lsvg2', 'vsvg1', 'vsvg2', 'vsvg3', 'usvg1', 'usvg2', 'usvg3'],
            rcolors = ['#ef701b', '#0984ea', '#9e3a26', '#ef701b', '#f4d166', '#04386b', '#0984ea', '#7dc9f5'],
            rlabels = ['Rate of Unvaccinated', 'Rate of Vaccinated', 'Ages 80+', 'Ages 50-79', 'Ages 18-49', 'Ages 80+', 'Ages 50-79', 'Ages 18-49']

        rows.forEach((d, i) => {
            d.append('div').attr('class', 'legend-value').append('svg').attr('id', rids[i]).append('rect').style('fill', rcolors[i])
            d.append('div').attr('class', 'legend-label').text(rlabels[i])
        })

        leg.style('display', 'none')
    }


    initVis() {
        let vis = this;

        // set the dimensions and margins of the graph
        vis.margin = {top: 20, right: 20, bottom: 100, left: 70};
        vis.totalWidth = d3.select('#chart').node().getBoundingClientRect().width
        if (vis.totalWidth < 0) console.log(vis.totalWidth)
        vis.width = vis.totalWidth - vis.margin.left - vis.margin.right;
        if (vis.width < 0) console.log(vis.width)
        vis.height = vis.totalWidth / 1.5 - vis.margin.top - vis.margin.bottom;
        if (vis.height < 0) console.log(vis.height)

        vis.svg = d3.select("#chart")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "x-axis")
            // .attr("class", "axisRed")
            .selectAll("text")
            .style("text-anchor", "end")
            // .attr("dx", "2em")
            .attr("dy", "20px")
            .style("font-size", '12')
            .attr("font-family", "Segoe UI")
            .attr("transform", "rotate(0)");

        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "x-axis2 axisTwo")
            .selectAll("text")
            .style("text-anchor", "end")
            // .attr("dx", "0.25em")
            .attr("dy", "20px")
            .style("font-size", '12')
            .attr("font-family", "Segoe UI")
            .attr("transform", "rotate(0)");


        vis.svg.append("g").attr("class", "y-axis");

        let fontsize = Math.max(11, vis.width / 36)

        //x axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", "12")
            .attr("x", vis.width / 2)
            .attr("y", vis.height + 70)
            .attr("font-size", fontsize)
            .text("Week");

        //unvaccinated legend
        var legend = vis.svg.selectAll(".legend")
            .data(vis.keys)//data set for legends
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        // //vaccinated legend
        var legend2 = vis.svg.selectAll(".legend2")
            .data(vis.keys)//data set for legends
            .enter().append("g")
            .attr("class", "legend")
            .attr("font-family", "Segoe UI")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        //y axis label
        vis.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -vis.width / 6)
            .attr("y", 0 - 55)
            .attr("font-size", fontsize)
            .text("Cases per 100k people");

        vis.initBrush();
        vis.wrangleData();
    }

    wrangleData(startDate, endDate) {
        let vis = this;

        if (startDate && endDate) {
            vis.displayData = vis.data.filter(row => row.Max_Week_Date >= startDate && row.Max_Week_Date <= endDate);
        } else {
            vis.displayData = [...vis.data];
        }

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.svg.selectAll(".line").remove();
        vis.svg.selectAll(".grid").remove();

        vis.x_time = d3.scaleTime()
            .domain(d3.extent(vis.displayData, function (d) {
                return d.Max_Week_Date;
            }))
            .range([0, vis.width])

        // // Add Y axis
        vis.y = d3.scaleLinear()
            .domain([0, d3.max(vis.displayData, function (d) {
                return +d.Unvax_50_79;
            }) + 500])
            .range([vis.height, 0]);

        vis.test = vis.svg.selectAll(".x-axis").transition().call(d3.axisBottom(vis.x_time).ticks(d3.timeWeek));

        vis.test.selectAll("text").remove();

        vis.svg.selectAll(".x-axis2")
            .transition()
            .call(d3.axisBottom(vis.x_time).tickSize(10));

        vis.svg.selectAll(".y-axis").transition().call(d3.axisLeft(vis.y));

        //grey y gridlines
        vis.make_x_gridlines = function () {
            return d3.axisLeft(vis.y).ticks(10);
        };

        vis.svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + 0 + ",0)")
            .style("stroke-dasharray", "3 3")
            .call(vis.make_x_gridlines()
                .tickSize(-vis.width)
                .tickFormat("")
            );

        // Add the unvaccinated line 18-49
        vis.svg.append("path")
            .datum(vis.displayData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#f4d166")
            .attr("stroke-width", 3.5)
            .attr("d", d3.line()
                .x(function (d) {
                    return vis.x_time(d.Max_Week_Date)
                })
                .y(function (d) {
                    return vis.y(d.Unvax_18_49)
                })
            )
            .style("pointer-events", "none");

        // Add the unvaccinated line 50-79
        vis.svg.append("path")
            .datum(vis.displayData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#ef701b")
            .attr("stroke-width", 3.5)
            .attr("d", d3.line()
                .x(function (d) {
                    return vis.x_time(d.Max_Week_Date)
                })
                .y(function (d) {
                    return vis.y(d.Unvax_50_79)
                })
            )
            .style("pointer-events", "none");


        // Add the unvaccinated line 80+
        vis.svg.append("path")
            .datum(vis.displayData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#9e3a26")
            .attr("stroke-width", 3.5)
            .attr("d", d3.line()
                .x(function (d) {
                    return vis.x_time(d.Max_Week_Date)
                })
                .y(function (d) {
                    return vis.y(d.Unvax_80)
                })
            )
            .style("pointer-events", "none");

        // Add the vaccinated line 18-49
        vis.svg.append("path")
            .datum(vis.displayData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#7dc9f5")
            .attr("stroke-width", 3.5)
            .attr("stroke-dasharray", ("4, 4"))
            .attr("d", d3.line()
                .x(function (d) {
                    return vis.x_time(d.Max_Week_Date)
                })
                .y(function (d) {
                    return vis.y(d.Vax_18_49)
                })
            )
            .style("pointer-events", "none");

        // Add the vaccinated line 50-79
        vis.svg.append("path")
            .datum(vis.displayData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#0984ea")
            .attr("stroke-width", 3.5)
            .attr("stroke-dasharray", ("4, 4"))
            .attr("d", d3.line()
                .x(function (d) {
                    return vis.x_time(d.Max_Week_Date)
                })
                .y(function (d) {
                    return vis.y(d.Vax_50_79)
                })
            )
            .style("pointer-events", "none");

        // Add the vaccinated line 80
        vis.svg.append("path")
            .datum(vis.displayData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#04386b")
            .attr("stroke-width", 3.5)
            .attr("stroke-dasharray", ("4, 4"))
            .attr("d", d3.line()
                .x(function (d) {
                    return vis.x_time(d.Max_Week_Date)
                })
                .y(function (d) {
                    return vis.y(d.Vax_80)
                })
            )
            .style("pointer-events", "none");

        // Add tooltip here to draw on top of the chart
        vis.initTooltip();

        vis.overlay = vis.svg.append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr("x", 0)
            .attr("y", 0)
            .style("border-radius", "2px")
            .style("padding", "12px")
            .style("color", "#0c0c0c")
            .style('font-size', '14px')
            .style("position", "absolute")
            .style("box-shadow", "2px 2px 4px lightgrey")
            .style("padding", "10px")
            .attr("fill", "transparent")
            //  .attr("fill", "white")
            .on("mouseover", function (event, d) {
                vis.tooltip.attr("display", "null");
            })
            .on("mouseout", function (event, d) {
                vis.tooltip.attr("display", "none");
            })
            .on("mousemove", mousemove);

        let bisectDate = d3.bisector(d => d.Max_Week_Date).left;

        function mousemove(event) {
            let x_coordinate = d3.pointer(event)[0];
            let x_date = vis.x_time.invert(x_coordinate);
            let index = bisectDate(vis.data, x_date);
            // let closest = vis.data[index];

            let hang_right = false
            let right = vis.data[index];
            let closest = right;
            let x_right = vis.x_time(right.date);
            if (Math.abs(x_right - x_coordinate) < 10) {
                closest = right;
                hang_right = true
            } else if (index) {
                let left = vis.data[index - 1];
                let x_left = vis.x_time(left.date);
                if (Math.abs(x_left - x_coordinate) < 10) {
                    closest = left;

                }
            }

            // Flip the tooltip info from left to right and the other way around
            if (x_coordinate > (vis.width / 2)) {
                vis.tooltip.select(".tool-rect-background-r")
                    .attr("visibility", "hidden");
                vis.tooltip.select(".tool-rect-background-l")
                    .attr("visibility", "visible");
            } else {
                vis.tooltip.select(".tool-rect-background-r")
                    .attr("visibility", "visible");
                vis.tooltip.select(".tool-rect-background-l")
                    .attr("visibility", "hidden");
            }

            let anchor = (x_coordinate > (vis.width / 2)) ? "end" : "start";
            let x_text = (x_coordinate > (vis.width / 2)) ? -20 : 20;

            vis.text.attr("text-anchor", anchor).attr("x", x_text);
            vis.text3.attr("text-anchor", anchor).attr("x", x_text);
            vis.text4.attr("text-anchor", anchor).attr("x", x_text);
            vis.text5.attr("text-anchor", anchor).attr("x", x_text);
            vis.text6.attr("text-anchor", anchor).attr("x", x_text);
            vis.text7.attr("text-anchor", anchor).attr("x", x_text);
            vis.text8.attr("text-anchor", anchor).attr("x", x_text);
            vis.text9.attr("text-anchor", anchor).attr("x", x_text);
            vis.text10.attr("text-anchor", anchor).attr("x", x_text);

            vis.tooltip.attr("transform", "translate(" + x_coordinate + ")")
            vis.text.text("Week: " + (closest.Max_Week_Date1));

            vis.text3.text("Rate of Unvaccinated: ");
            vis.text4.text("Ages 80+: " + (closest.Unvax_80) + " per 100k");
            vis.text5.text("Ages 50-79: " + (closest.Unvax_50_79) + " per 100k");
            vis.text6.text("Ages 18-49: " + (closest.Unvax_18_49) + " per 100k");

            vis.text7.text("Rate of Vaccinated: ");

            vis.text8.text("Ages 80+: " + (closest.Vax_80) + " per 100k");
            vis.text9.text("Ages 50-79: " + (closest.Vax_50_79) + " per 100k");
            vis.text10.text("Ages 18-49: " + (closest.Vax_18_49) + " per 100k");
        }

    }

    initBrush() {
        let vis = this;
        const width = d3.select('#brush-chart').node().getBoundingClientRect().width;
        const height = width / 8.8;

        let x = d3.scaleTime()
            .domain([new Date(2021, 3, 5), new Date(2022, 1, 7)])
            .range([0, width]);

        let xAxis = d3.axisBottom()
            .scale(x)
            .ticks(21)
            .tickSize([10])
            .tickFormat(d3.timeFormat('%b'));

        let xTime = d3.scaleTime()
            .domain(d3.extent(vis.data, d => d.Max_Week_Date))
            .range([0, width]);

        let brush = d3.brushX()
            .extent([[0, 0], [width, height]])
            .on("brush", brushed)
            .on("brush end", function (e) {
                let startDate = xTime.invert(0)
                let endDate = xTime.invert(width)
                if (e.selection) { //if the user cancels selection back to whole range
                    startDate = xTime.invert(e.selection[0]);
                    endDate = xTime.invert(e.selection[1]);
                }
                //update the date values on the brush scale
                d3.select('#left-date').text(startDate.toISOString().split('T')[0])
                d3.select('#right-date').text(endDate.toISOString().split('T')[0])
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

            d3.selectAll("span")
                .text(function (d, i) {
                    return Math.round(range[i]);
                });
        }

        //Init Brush Dates
        d3.select('#left-date').text(xTime.invert(0).toISOString().split('T')[0])
        d3.select('#right-date').text(xTime.invert(width).toISOString().split('T')[0])
    }

    initTooltip() {
        let vis = this;

        vis.tooltip = vis.svg.append("g")
            .attr("display", "none")
            .attr("class", "tooltip-group");

        vis.tooltip.append("rect")
            .attr("width", 200)
            .attr("height", vis.height - 100)
            .attr("x", 0)
            .attr("y", 0)
            .style("fill", "white")
            .style("background-color", "white")
            .attr("class", "tool-rect-background-r");

        vis.tooltip.append("rect")
            .attr("width", 200)
            .attr("height", vis.height - 100)
            .attr("x", -200)
            .attr("y", 0)
            .style("fill", "white")
            .attr("class", "tool-rect-background-l");

        vis.tooltip.append("line")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("x1", 0)
            .attr("y1", vis.height)
            .attr("x2", 0)
            .attr("y2", 0);

        vis.text = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 10)
            .attr("font-family", "Segoe UI")
            .attr('font-weight', 'bold')
            .style("fill", "black");

        vis.text2 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 30)
            .attr("font-family", "Segoe UI")
            .attr('font-weight', 'bold')
            .style("fill", "black");

        vis.text3 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 60)
            .attr("font-family", "Segoe UI")
            .style("fill", "black")
            .attr('font-weight', 'bold')
            .style("font-size", '14');

        vis.text4 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 80)
            .style("fill", "#9e3a26")
            .attr("font-family", "Segoe UI")
            .style("font-size", '13');

        vis.text5 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 100)
            .style("fill", "#ef701b")
            .attr("font-family", "Segoe UI")
            .style("font-size", '13');

        vis.text6 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 120)
            .style("fill", "#f4d166")
            .attr("font-family", "Segoe UI")
            .style("font-size", '13');

        vis.text7 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 160)
            .style("fill", "black")
            .attr('font-weight', 'bold')
            .attr("font-family", "Segoe UI")
            .style("font-size", '14');

        vis.text8 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 180)
            .style("fill", "#04386b")
            .attr("font-family", "Segoe UI")
            .style("font-size", '13');

        vis.text9 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 200)
            .style("fill", "#0984ea")
            .attr("font-family", "Segoe UI")
            .style("font-size", '13');

        vis.text10 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", 220)
            .style("fill", "#7dc9f5")
            .attr("font-family", "Segoe UI")
            .style("font-size", '13');
    }

}
