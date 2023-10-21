class LineChart {

    constructor(props) {
        // global metadata
        this.complexity = props.complexity;
        this.source = props.source;
        this.brush_exists = false;
        this.legend_changes = props.changes;
        this.allow_interaction = props.allowInteraction;
        this.is_covid = props.showCovidData;
        

        // create a list of keys
        this.keys = ["Ages 80+", "Ages 50-79", "Ages 18-49"];

        this.data = props.data;
        this.displayData = props.data;
        this.rids = ['lsvg1', 'lsvg2', 'vsvg1', 'vsvg2', 'vsvg3', 'usvg1', 'usvg2', 'usvg3'];
        this.rcolors = ['#ef701b', '#0984ea', '#9e3a26', '#ef701b', '#f4d166', '#04386b', '#0984ea', '#7dc9f5'];

        // visualization labels
        this.title = props.chart_title;
        this.ylabel = props.chart_axis_labels.y;
        this.rlabels = props.chart_legend_labels;
        this.legendLabel = props.chart_legend_label;

        this.buildHtml(props.selector);

        // provenance metadata
        this.trigger = null;
        this.hover_start = null;
        this.provData = new ProvenanceData('line chart', props.complexity);
        // set the dimensions and margins of the graph
        this.margin = {top: 20, right: 20, bottom: 100, left: 70};
        this.totalWidth = d3.select('#chart').node().getBoundingClientRect().width
        this.width = this.totalWidth - this.margin.left - this.margin.right;
        this.height = this.totalWidth / 1.5 - this.margin.top - this.margin.bottom;

        
    }

    getProvenance() {
        return this.provData.getProvenance()
    }

    buildHtml(selector) {
        console.log('building html');
        let vis = this;
        let container = selector
            ? d3.select(`#${selector.questionId}`).select('.QuestionText')
                .insert('div', ':first-child')
                .attr('class', 'row')
            : d3.select('#main-container').select('.QuestionText');

        let mc = container.append('div').attr('class', 'col-8 main-content'),
            lc = container.append('div').attr('class', 'col-4 legend-content-line').attr('id', 'legend')

        mc.append('div').attr('class', 'title')
            .append('h3').attr('id', 'chart-title')
            .text(!vis.legend_changes && vis.complexity == 'complex' ? vis.title.complex : vis.title.default);
        mc.append('div').attr('class', 'helper')
            .text(vis.allow_interaction ? '*Hover over the bars to explore further' + (vis.complexity == 'complex' ? ' and brush the timeline on the right to filter the data' : '') : '');
        mc.append('div').attr('id', 'chart');
        if (vis.source) mc.append('div').append('a').attr('target', '_')
            .attr('href', vis.is_covid ? 'https://data.cdc.gov/Public-Health-Surveillance/Rates-of-COVID-19-Cases-or-Deaths-by-Age-Group-and/3rge-nu2a/data' : 'https://komora.hr/')
            .attr('class', 'source')
            .text('Source: ' + (vis.is_covid ? 'Centers for Disease Control and Prevention (CDC)' : 'Croatian Chamber of Agriculture (CCA)'))
            .on('click', function () {
                vis.provData.logEvent({
                    time: Date.now(),
                    label: 'source_clicked'
                })
            });

        if (vis.complexity == 'complex' && vis.allow_interaction) {
            let time = lc.append('div').attr('id', 'time_filter_div')
            time.append('div').attr('class', 'brush-label').text('Filter by Month Range')

            let dates = time.append('div').attr('class', 'legend-row')
            dates.append('p').attr('id', 'left-date').attr('class', 'alignLeft').text('')
            dates.append('p').attr('id', 'right-date').attr('class', 'alignRight ').text('')

            time.append('div').attr('id', 'brush-chart')


            let years = time.append('div').attr('class', 'legend-row');
            years.append('p').attr('class', 'alignLeft').text('2021');
            years.append('p').attr('class', 'alignRight ').text('2022')
        }
        let leg = lc.append('div').attr('id', 'leg').attr('class', 'legend'),
            vac = lc.append('div').attr('id', 'vax-leg').attr('class', 'legend'),
            unv = lc.append('div').attr('id', 'unvax-leg').attr('class', 'legend');

        if (vis.complexity == 'complex') {
            vac.append('div').attr('class', 'legend-title').text(vis.rlabels[0]);
            unv.append('div').attr('class', 'legend-title').text(vis.rlabels[1]);

            let leg_row1 = leg.append('div'), leg_row2 = leg.append('div'),
                vac_row1 = vac.append('div'), vac_row2 = vac.append('div'), vac_row3 = vac.append('div'),
                unv_row1 = unv.append('div'), unv_row2 = unv.append('div'), unv_row3 = unv.append('div')
            let rows = [leg_row1, leg_row2, vac_row1, vac_row2, vac_row3, unv_row1, unv_row2, unv_row3].map(d => d.attr('class', 'legend-row'))

            rows.forEach((d, i) => {
                d.append('div').attr('class', 'legend-value').append('svg').attr('id', vis.rids[i]).append('rect').style('fill', vis.rcolors[i])
                d.append('div').attr('class', 'legend-label').text(vis.rlabels[i])
            })
        } else {
            vac.append('div').attr('class', 'legend-value').append('svg').attr('id', "vacced").append('rect').style('fill', "#ef701b")
            vac.append('div').attr('class', 'legend-label').text(vis.rlabels[0]);
            unv.append('div').attr('class', 'legend-value').append('svg').attr('id', "vacced").append('rect').style('fill', "#0984ea")
            unv.append('div').attr('class', 'legend-label').text(vis.rlabels[1])
        }

        leg.style('display', 'none')
    }


    initVis(id) {
        let vis = this;

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

        let fontsize = Math.max(11, vis.width / 36)

        //unvaccinated legend
        vis.svg.selectAll(".legend")
            .data(vis.keys)//data set for legends
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        // //vaccinated legend
        vis.svg.selectAll(".legend2")
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
            .attr("x", -vis.width / 4)
            .attr("y", 0 - 55)
            .attr("font-size", fontsize)
            .text(vis.ylabel);

        if (this.complexity == 'complex' && this.allow_interaction) {
            vis.initBrush();
        }
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

        this.x_time = d3.scaleTime()
            .domain(d3.extent(this.displayData, function (d) {
                return d.Max_Week_Date;
            }))
            .range([0, this.width])

        this.x_axis = d3.axisBottom(this.x_time).tickFormat(
            (d) => {
                return `${parseMonthDay(d)}`
            }
        );
        this.x_axis2 = d3.axisBottom(this.x_time).tickFormat(
            (d, i) => {
                let [_, mo, da] = d.toISOString().split('T')[0].split('-').map(d => +d)
                return (i === 0) ? '2021' : ((mo === 1 && da - 7 < 0) ? '2022' : '')
            });

        vis.svg.selectAll(".line").remove();
        vis.svg.selectAll(".grid").remove();

        // // Add Y axis
        vis.y = d3.scaleLinear()
            .domain([0, d3.max(vis.displayData, function (d) {
                return +d.Unvax_50_79;
            }) + 500])
            .range([vis.height, 0]);

        vis.svg.selectAll(".y-axis").transition().call(d3.axisLeft(vis.y));
        vis.svg.selectAll(".x-axis").transition().duration(100).call(vis.x_axis);
        vis.svg.selectAll(".x-axis2").transition().duration(100).call(vis.x_axis2);
        vis.svg.select('.x-axis').selectAll('text').attr('transform', 'translate(-20,20) rotate(-45)')
        vis.svg.select('.x-axis2').selectAll('text').attr('transform', 'translate(-20,40)')

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

        if (this.complexity == 'complex') {
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
        } else {
            if (this.complexity == 'moderate') {
                // Show confidence interval
                vis.svg.append("path")
                    .datum(vis.data)
                    .attr("fill", "#ffd8b5")
                    .attr("stroke", "none")
                    .attr("d", d3.area()
                        .x(function (d) {
                            return vis.x_time(d.Max_Week_Date)
                        })
                        .y0(function(d) { return  vis.y(d.Unvax_18_49) })
                        .y1(function(d) { return  vis.y(d.Unvax_80) })
                    );

                // Show confidence interval
                vis.svg.append("path")
                    .datum(vis.data)
                    .attr("fill", "#beeaff")
                    .attr("stroke", "none")
                    .attr("d", d3.area()
                        .x(function (d) {
                            return vis.x_time(d.Max_Week_Date)
                        })
                        .y0(function(d) { return  vis.y(d.Vax_18_49) })
                        .y1(function(d) { return  vis.y(d.Vax_80) })
                    );

                // Add the unvaccinated line
                vis.svg.append("path")
                    .datum(vis.data)
                    .attr("fill", "none")
                    .attr("stroke", "#ef701b")
                    .attr("stroke-width", 3.5)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return vis.x_time(d.Max_Week_Date)
                        })
                        .y(function (d) {
                            return vis.y(d.Average_Unvaxxed)
                        })
                    );

                // Add the vaccinated line
                vis.svg.append("path")
                    .datum(vis.data)
                    .attr("fill", "none")
                    .attr("stroke", "#0984ea")
                    .attr("stroke-width", 3.5)
                    .attr("stroke-dasharray", ("4, 4"))
                    .attr("d", d3.line()
                        .x(function (d) {
                            return vis.x_time(d.Max_Week_Date)
                        })
                        .y(function (d) {
                            return vis.y(d.Average_Vaxxed)
                        })
                    );

            }else{
                // Add the unvaccinated line
                vis.svg.append("path")
                    .datum(vis.data)
                    .attr("fill", "none")
                    .attr("stroke", "#ef701b")
                    .attr("stroke-width", 3.5)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return vis.x_time(d.Max_Week_Date)
                        })
                        .y(function (d) {
                            return vis.y(d.Age_adjusted_unvax_IR)
                        })
                    )

                // Add the vaccinated line
                vis.svg.append("path")
                    .datum(vis.data)
                    .attr("fill", "none")
                    .attr("stroke", "#0984ea")
                    .attr("stroke-width", 3.5)
                    .attr("stroke-dasharray", ("4, 4"))
                    .attr("d", d3.line()
                        .x(function (d) {
                            return vis.x_time(d.Max_Week_Date)
                        })
                        .y(function (d) {
                            return vis.y(d.Age_adjusted_vax_IR)
                        })
                    );

            }
        }
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
            .style('font-size', '11px')
            .style("position", "absolute")
            .style("box-shadow", "2px 2px 4px lightgrey")
            .style("padding", "10px")
            .attr("fill", "transparent")
            //  .attr("fill", "white")
            .on("mouseover", function (event, d) {
                if(vis.allow_interaction) vis.tooltip.attr("display", "null");
            })
            .on("mouseout", function (event, d) {
                if(vis.allow_interaction) {
                    clearTimeout(vis.trigger)
                    vis.tooltip.attr("display", "none");
                }
            })
            .on("mousemove", function(event){
                if(vis.allow_interaction) mousemove(event)
            });

        let bisectDate = d3.bisector(d => d.Max_Week_Date).left;

        function mousemove(event) {
            let x_coordinate = d3.pointer(event)[0];
            let x_date = vis.x_time.invert(x_coordinate);
            let index = bisectDate(vis.data, x_date);
            // let closest = vis.data[index];

            let hang_right = false
            let right = vis.data[index];
            let closest = right;

            // Provenance:
            if (vis.hover_start) {
                vis.provData.logEvent({
                    time: vis.hover_start,
                    label: 'hovered',
                    timeHovered: Date.now() - vis.hover_start,
                    week: closest.Max_Week_Date1
                })
                vis.hover_start = null;
            }
            clearTimeout(vis.trigger)
            vis.trigger = setTimeout(() => {
                vis.hover_start = Date.now() - 1000
            }, 1000);


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
            if (vis.complexity == 'complex' && vis.allow_interaction) {
                vis.text5.attr("text-anchor", anchor).attr("x", x_text);
                vis.text6.attr("text-anchor", anchor).attr("x", x_text);
                vis.text9.attr("text-anchor", anchor).attr("x", x_text);
                vis.text10.attr("text-anchor", anchor).attr("x", x_text);
            }
            vis.text3.attr("text-anchor", anchor).attr("x", x_text);
            vis.text4.attr("text-anchor", anchor).attr("x", x_text);
            vis.text7.attr("text-anchor", anchor).attr("x", x_text);
            vis.text8.attr("text-anchor", anchor).attr("x", x_text);

            vis.tooltip.attr("transform", "translate(" + x_coordinate + ")");
            vis.text.text("Week: " + (closest.Max_Week_Date1));

            if (vis.complexity == 'complex' && vis.allow_interaction) {
                vis.text3.text(vis.rlabels[0]);
                vis.text4.text(vis.rlabels[2] + ": " + (closest.Unvax_80) + vis.legendLabel);
                vis.text5.text(vis.rlabels[3] + ": " + (closest.Unvax_50_79) + vis.legendLabel);
                vis.text6.text(vis.rlabels[4] + ": " + (closest.Unvax_18_49) + vis.legendLabel);

                vis.text7.text(vis.rlabels[1]);
                vis.text8.text(vis.rlabels[5] + ": " + (closest.Vax_80) + vis.legendLabel);
                vis.text9.text(vis.rlabels[6] + ": " + (closest.Vax_50_79) + vis.legendLabel);
                vis.text10.text(vis.rlabels[7] + ": " + (closest.Vax_18_49) + vis.legendLabel);
            } else {
                vis.text3.text(vis.rlabels[0]);
                vis.text4.text((closest.Age_adjusted_unvax_IR) + vis.legendLabel);
                vis.text7.text(vis.rlabels[1]);
                vis.text8.text((closest.Age_adjusted_vax_IR) + vis.legendLabel);

            }
        }

    }

    initBrush() {
        let vis = this;
        const width = d3.select('#brush-chart').node().getBoundingClientRect().width, height = 32;

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

        vis.clear_brush_func = function (method) {
            vis.provData.logEvent({
                time: Date.now(),
                label: 'cleared_brush',
                using: method
            })
            d3.select('.clear-step').property('disabled', false).classed('disabled-button', false)
        }

        vis.adjust_brush = function (e) {
            let startDate = xTime.invert(0)
            let endDate = xTime.invert(width)
            if (e !== null && e.selection) {
                startDate = xTime.invert(e.selection[0]);
                endDate = xTime.invert(e.selection[1]);
            }
            //update the date values on the brush scale
            d3.select('#left-date').text(startDate.toISOString().split('T')[0])
            d3.select('#right-date').text(endDate.toISOString().split('T')[0])

            vis.wrangleData(startDate, endDate);

            return [startDate, endDate];
        }

        let brush = d3.brushX()
            .extent([[0, 0], [width, height]])
            .on('start', function (e) {
                vis.curr_brush = e.selection !== null ? e.selection[0] : null;
            })
            .on("brush", function (e) {
                vis.adjust_brush(e)
            })
            .on("end", function (e) {
                let [startDate, endDate] = vis.adjust_brush(e)
                if (startDate < endDate) {
                    vis.brush_exists = vis.curr_brush === vis.last_brush;
                    if (e.selection) {
                        vis.provData.logEvent({
                            time: Date.now(),
                            label: vis.brush_exists ? 'moved_brush' : 'started_brush',
                            startDate: startDate.toISOString().split('T')[0],
                            endDate: endDate.toISOString().split('T')[0]
                        })
                        d3.select(vis.brush_exists ? '.move-step' : '.brush-step').property('disabled', false).classed('disabled-button', false)
                        vis.brush_exists = true;
                    } else {
                        vis.clear_brush_func('click')
                    }
                }
                vis.last_brush = e.selection !== null ? e.selection[0] : null;
            });

        let svg = d3.select("#brush-chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr('class', 'brush-axis')
            .call(xAxis)

        let brushg = svg.append("g")
            .attr("class", "brush")
            .attr("width", width)
            .attr("height", height)
            .call(brush)

        document.addEventListener('keydown', function (e) {
            if (e.key === "Escape") {
                brush.move(brushg, null)
                vis.adjust_brush(null)
                vis.clear_brush_func('Escape')
            }
        })

        svg.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', width)
            .attr('y2', 0)

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
            .attr("height", !(this.complexity == 'complex' && this.allow_interaction) ? 100 : 250)
            .attr("x", 0)
            .attr("y", 0)
            .style("fill", "white")
            .style("background-color", "white")
            .attr("class", "tool-rect-background-r");

        vis.tooltip.append("rect")
            .attr("width", 200)
            .attr("height", !(this.complexity == 'complex' && this.allow_interaction) ? 100 : 250)
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
            .style("font-size", '14px')
            .style("fill", "black");

        if (this.complexity == 'complex' && this.allow_interaction) {
            vis.text2 = vis.tooltip.append("text")
                .attr("class", "tooltip-text")
                .attr("x", 10)
                .attr("y", 30)
                .attr("font-family", "Segoe UI")
                .attr('font-weight', 'bold')
                .style("font-size", '12px')
                .style("fill", "black");
        }

        vis.text3 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", (this.complexity == 'complex' && this.allow_interaction) ? 60 : 30)
            .attr("font-family", "Segoe UI")
            .attr('font-size', '14px')
            .style("fill", this.complexity == 'complex' ? 'black' : "#ef701b")
            .attr('font-weight', 'bold')
            .style("font-size", '12px');

        vis.text4 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", (this.complexity == 'complex' && this.allow_interaction) ? 80 : 45)
            .style("fill", (this.complexity == 'complex' && this.allow_interaction) ? "#9e3a26" : "#ef701b")
            .attr("font-family", "Segoe UI")
            .style("font-size", '11px');

        if (this.complexity == 'complex' && this.allow_interaction) {
            vis.text5 = vis.tooltip.append("text")
                .attr("class", "tooltip-text")
                .attr("x", 10)
                .attr("y", 100)
                .style("fill", "#ef701b")
                .attr("font-family", "Segoe UI")
                .style("font-size", '11px');

            vis.text6 = vis.tooltip.append("text")
                .attr("class", "tooltip-text")
                .attr("x", 10)
                .attr("y", 120)
                .style("fill", "#f4d166")
                .attr("font-family", "Segoe UI")
                .style("font-size", '11px');
        }
        vis.text7 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", (this.complexity == 'complex' && this.allow_interaction) ? 160 : 70)
            .style("fill", this.complexity == 'complex' ? 'black' : "#0984ea")
            .attr('font-weight', 'bold')
            .attr("font-family", "Segoe UI")
            .style("font-size", '11px');

        vis.text8 = vis.tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 10)
            .attr("y", (this.complexity == 'complex' && this.allow_interaction) ? 180 : 85)
            .style("fill", (this.complexity == 'complex' && this.allow_interaction) ? "#04386b" : "#0984ea")
            .attr("font-family", "Segoe UI")
            .style("font-size", '11px');

        if (this.complexity == 'complex' && this.allow_interaction) {
            vis.text9 = vis.tooltip.append("text")
                .attr("class", "tooltip-text")
                .attr("x", 10)
                .attr("y", 200)
                .style("fill", "#0984ea")
                .attr("font-family", "Segoe UI")
                .style("font-size", '11px');

            vis.text10 = vis.tooltip.append("text")
                .attr("class", "tooltip-text")
                .attr("x", 10)
                .attr("y", 220)
                .style("fill", "#7dc9f5")
                .attr("font-family", "Segoe UI")
                .style("font-size", '11px');
        }
    }

}
