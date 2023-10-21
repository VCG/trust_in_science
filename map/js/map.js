class MapChart {
    constructor(props) {
        this.complex = props.complexity === "moderate" || props.complexity === "complex";
        this.interactive = props.isInteractive;
        this.source = props.source;
        this.geoData = props.data[0];
        this.covidData = props.data[1];
        this.states = props.data[2][0];
        this.complexData = props.data[2][1];
        this.allowInteraction = props.allowInteraction;
        this.colorScale = d3.scaleSequential(d3.interpolateBlues);
        this.buildHtml(props.selector);
    }

    buildHtml(selector = null) {
        console.log('building html');
        let vis = this;
        let container = selector
            ? d3.select(`#${selector.questionId}`).select('.QuestionText')
                .insert('div', ':first-child')
                .attr('class', 'row')
            : d3.select('#main-container').select('.QuestionText');

        let mc = container.append('div').attr('class', 'col-8 main-content');
        mc.append('div').attr('class', 'title')
            .append('h3').attr('id', 'chart-title').text('Cumulative Covid-19 cases across the US states as per week 4, 2022');
        mc.append('br');
        mc.append('div').attr('class', 'helper').text('*Hover over the states to explore further');
        mc.append('br');
        let chart = mc.append('div').attr('id', 'chart');

        if (vis.complex) {
            document.getElementById("chart").innerHTML =
                '    <div id="chart-overlay">\n' +
                '        <div class="title"></div>\n' +
                '        <button type="button" class="close" aria-label="Close" title="Close">\n' +
                '            <span aria-hidden="true">&times;</span>\n' +
                '        </button>\n' +
                '    </div>\n' +
                '    <div class="grid-map">\n' +
                '        <div class="grid-row">\n' +
                '            <div class = "legend_title" id = "legend">Legend</div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell state state-ak"><div class="state-label">AK</div></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell state state-me"><div class="state-label">ME</div></div>\n' +
                '\n' +
                '        </div>\n' +
                '        <div class="grid-row">\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell state state-wi"><div class="state-label">WI</div></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell state state-vt"><div class="state-label">VT</div></div>\n' +
                '            <div class="grid-cell state state-nh"><div class="state-label">NH</div></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell state state-state"><div class="state-label">State</div></div>\n' +
                '            <!--                <div class="legend_title_year3">New Case</div>-->\n' +
                '\n' +
                '            <!--    <div class ="legend_background">Colour indicates total volume of new cases</div>-->\n' +
                '\n' +
                '            <div class ="legend_background">Background color intensity scales according to the total volume of new cases</div>\n' +
                '            <hr class="line_background">\n' +
                '        </div>\n' +
                '        <div class="grid-row">\n' +
                '            <div class="grid-cell state state-wa"><div class="state-label">WA</div></div>\n' +
                '            <div class="grid-cell state state-id"><div class="state-label">ID</div></div>\n' +
                '            <div class="grid-cell state state-mt"><div class="state-label">MT</div></div>\n' +
                '            <div class="grid-cell state state-nd"><div class="state-label">ND</div></div>\n' +
                '            <div class="grid-cell state state-mn"><div class="state-label">MN</div></div>\n' +
                '            <div class="grid-cell state state-il"><div class="state-label">IL</div></div>\n' +
                '            <div class="grid-cell state state-mi"><div class="state-label">MI</div></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell state state-ny"><div class="state-label">NY</div></div>\n' +
                '            <div class="grid-cell state state-ma"><div class="state-label">MA</div></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class ="legend_title_year1">2020</div>\n' +
                '            <div class ="legend_title_year2">2022</div>\n' +
                '            <br>\n' +
                '            <div class="legend_title_year3">New Cases</div>\n' +
                '            <hr class="line">\n' +
                '            <br>\n' +
                '\n' +
                '        </div>\n' +
                '        <div class="grid-row">\n' +
                '            <div class="grid-cell state state-or"><div class="state-label">OR</div></div>\n' +
                '            <div class="grid-cell state state-nv"><div class="state-label">NV</div></div>\n' +
                '            <div class="grid-cell state state-wy"><div class="state-label">WY</div></div>\n' +
                '            <div class="grid-cell state state-sd"><div class="state-label">SD</div></div>\n' +
                '            <div class="grid-cell state state-ia"><div class="state-label">IA</div></div>\n' +
                '            <div class="grid-cell state state-in"><div class="state-label">IN</div></div>\n' +
                '            <div class="grid-cell state state-oh"><div class="state-label">OH</div></div>\n' +
                '            <div class="grid-cell state state-pa"><div class="state-label">PA</div></div>\n' +
                '            <div class="grid-cell state state-nj"><div class="state-label">NJ</div></div>\n' +
                '            <div class="grid-cell state state-ct"><div class="state-label">CT</div></div>\n' +
                '            <div class="grid-cell state state-ri"><div class="state-label">RI</div></div>\n' +
                '        </div>\n' +
                '        <div class="grid-row">\n' +
                '            <div class="grid-cell state state-ca"><div class="state-label">CA</div></div>\n' +
                '            <div class="grid-cell state state-ut"><div class="state-label">UT</div></div>\n' +
                '            <div class="grid-cell state state-co"><div class="state-label">CO</div></div>\n' +
                '            <div class="grid-cell state state-ne"><div class="state-label">NE</div></div>\n' +
                '            <div class="grid-cell state state-mo"><div class="state-label">MO</div></div>\n' +
                '            <div class="grid-cell state state-ky"><div class="state-label">KY</div></div>\n' +
                '            <div class="grid-cell state state-wv"><div class="state-label">WV</div></div>\n' +
                '            <div class="grid-cell state state-va"><div class="state-label">VA</div></div>\n' +
                '            <div class="grid-cell state state-md"><div class="state-label">MD</div></div>\n' +
                '            <div class="grid-cell state state-de"><div class="state-label">DE</div></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '        </div>\n' +
                '        <div class="grid-row">\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell state state-az"><div class="state-label">AZ</div></div>\n' +
                '            <div class="grid-cell state state-nm"><div class="state-label">NM</div></div>\n' +
                '            <div class="grid-cell state state-ks"><div class="state-label">KS</div></div>\n' +
                '            <div class="grid-cell state state-ar"><div class="state-label">AR</div></div>\n' +
                '            <div class="grid-cell state state-tn"><div class="state-label">TN</div></div>\n' +
                '            <div class="grid-cell state state-nc"><div class="state-label">NC</div></div>\n' +
                '            <div class="grid-cell state state-sc"><div class="state-label">SC</div></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '        </div>\n' +
                '        <div class="grid-row">\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell state state-ok"><div class="state-label">OK</div></div>\n' +
                '            <div class="grid-cell state state-la"><div class="state-label">LA</div></div>\n' +
                '            <div class="grid-cell state state-ms"><div class="state-label">MS</div></div>\n' +
                '            <div class="grid-cell state state-al"><div class="state-label">AL</div></div>\n' +
                '            <div class="grid-cell state state-ga"><div class="state-label">GA</div></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '        </div>\n' +
                '        <div class="grid-row">\n' +
                '            <div class="grid-cell state state-hi"><div class="state-label">HI</div></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell state state-tx"><div class="state-label">TX</div></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell state state-fl"><div class="state-label">FL</div></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '            <div class="grid-cell empty"></div>\n' +
                '        </div>\n' +
                '        <br>';

            $("#chart-overlay").hide();
            $("#chart-overlay .close").click(() => $("#chart-overlay").hide());
        }

        if (vis.source) mc.append('div').append('a').attr('target', '_')
            .attr('href', 'https://data.cdc.gov/Public-Health-Surveillance/Rates-of-COVID-19-Cases-or-Deaths-by-Age-Group-and/3rge-nu2a/data')
            .attr('class', 'source').text('Source: Centers for Disease Control and Prevention');
    }

    initVis(id) {
        let vis = this;
        vis.complex = this.complex;
        vis.interactive = this.interactive;
        if (!vis.complex) {
            this.initVisSimple(id);
        } else {
            let maxNewCases = d3.max(vis.complexData, d => d.value);
            vis.states.forEach(state => {
                this.lineChartSmall(`.state-${state.code.toLowerCase()}`, vis.complexData, state, maxNewCases);
                //only if interactive
                if (vis.interactive && vis.allowInteraction) {
                    $(`.state-${state.code.toLowerCase()}`).click(() => {
                        this.lineChartLarge("#chart-overlay", vis.complexData, state.code);
                        $("#chart-overlay .title").text(state.name);
                        $("#chart-overlay").show();
                    });
                }
            });
        }
    }

    lineChartSmall(parentElement, dataIn, state, maxValue) {
        let vis = this;
        let data = dataIn.filter(d => d.State === state.code);

        let margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 50 - margin.left - margin.right,
            height = 50 - margin.top - margin.bottom;

        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);
        let colorScale = d3.scaleSequential().interpolator(d3.interpolateBlues);

        let valueline = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value));

        let svg = d3.select(parentElement).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        x.domain(d3.extent(data, d => d.date));
        y.domain(d3.extent(data, d => d.value));
        colorScale.domain([0, maxValue * 2]);


        let tooltip = svg.append("g")
            .attr("display", "none")
            .attr("class", "tooltip-group");

        tooltip.append("line")
            .attr("stroke", "yellow")
            .attr("stroke-width", 2)
            .attr("x1", 0)
            .attr("y1", height)
            .attr("x2", 0)
            .attr("y2", 0);

        // Tooltip - vaccinated
        const stateName = state.name;
        const dateFormatter = d3.timeFormat("%d/%m/%Y");

        let tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([5, 0])
            .html(function (e, d) {
                tooltip.attr("transform", `translate(${e.layerX})`);

                let date = x.invert(e.layerX);
                let value = y.invert(e.layerY);
                return `<div style="text-align:center;font-weight:bold;margin-bottom: 10px;">${stateName}</div><div><b> Date: </b> ${dateFormatter(date)}<br /><b>Number of New Cases: ${Math.floor(value)}</b></div>`;
            });

        if (vis.allowInteraction) {
            svg.call(tip)
                .on("mouseover", function () {
                    tooltip.attr("display", "null");
                })
                .on("mousemove", function (e, d) {
                    tip.show(e, d, this);
                })
                .on("mouseout", function () {
                    tooltip.attr("display", "none");
                    tip.hide();
                });
        }

        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        $(parentElement).css("background-color", colorScale(d3.max(data, d => d.value)));
    }

    lineChartLarge(parentElement, dataIn, state) {
        let vis = this;
        let data = dataIn.filter(d => d.State === state)
        let margin = {top: 50, right: 130, bottom: 50, left: 50},
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

        let valueline = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value));

        let valueline2 = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value2));

        d3.select(parentElement).select("svg").remove();

        let svg = d3.select(parentElement).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, d => d.date));
        y.domain(d3.extent(data, d => d.value));

        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline)
            .style("pointer-events", "none");

        svg.append("path")
            .data([data])
            .attr("class", "line2")
            .attr("d", valueline2)
            .style("pointer-events", "none");

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("path")
            .data([data])
            .attr("class", "line2")
            .attr("d", valueline2);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        var id = "md-shadow";
        var deviation = 2;
        var offset = 2;
        var slope = 0.25;

        // create filter and assign provided id
        var filter = svg.append("filter")
            .attr("height", "125%")    // adjust this if shadow is clipped
            .attr("id", id);

        // ambient shadow into ambientBlur
        //   may be able to offset and reuse this for cast, unless modified
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", deviation)
            .attr("result", "ambientBlur");

        // cast shadow into castBlur
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", deviation)
            .attr("result", "castBlur");

        // offsetting cast shadow into offsetBlur
        filter.append("feOffset")
            .attr("in", "castBlur")
            .attr("dx", offset - 1)
            .attr("dy", offset)
            .attr("result", "offsetBlur");

        // combining ambient and cast shadows
        filter.append("feComposite")
            .attr("in", "ambientBlur")
            .attr("in2", "offsetBlur")
            .attr("result", "compositeShadow");

        // applying alpha and transferring shadow
        filter.append("feComponentTransfer")
            .append("feFuncA")
            .attr("type", "linear")
            .attr("slope", slope);

        // merging and outputting results
        var feMerge = filter.append("feMerge");
        feMerge.append('feMergeNode')
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        var keys = [" "]

        var legend = svg.selectAll(".legend")
            .data(keys)//data set for legends
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("line")//making a line for legend
            .attr("x1", width + 40)
            .attr("x2", width + 20)
            .attr("y1", 25)
            .attr("y2", 25)
            .attr("stroke", "red")
            .attr("stroke-width", 2)

        legend.append("line")//making a line for legend
            .attr("x1", width + 40)
            .attr("x2", width + 20)
            .attr("y1", 5)
            .attr("y2", 5)
            .attr("stroke", "black")
            .attr("stroke-width", 2)

        legend.append("text")
            .attr("x", width + 42)
            .attr("y", 5)
            .attr("dy", ".35em")
            .style("text-anchor", "left")
            .text("New Cases")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "9");

        legend.append("text")
            .attr("x", width + 42)
            .attr("y", 25)
            .attr("dy", ".35em")
            .style("text-anchor", "left")
            .text("7-Day New Cases Avg")
            .attr("font-family", "Segoe UI")
            .attr("font-size", "9");

        let tooltip = svg.append("g")
            .attr("display", "none")
            .attr("class", "tooltip-group");

        tooltip.append("rect")
            .attr("width", 120)
            .attr("height", height - 220)
            .attr("x", 0)
            .attr("y", 0)
            .style("fill", "transparent")
            //.style("filter", "url(#md-shadow)")
            .attr("class", "tool-rect-background-r")

        tooltip.append("rect")
            .attr("width", 120)
            .attr("height", height - 220)
            .attr("x", -120)
            .attr("y", 0)
            .style("fill", "transparent")
            // .style("filter", "url(#md-shadow)")
            .attr("class", "tool-rect-background-l")


        tooltip.append("line")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("x1", 0)
            .attr("y1", height)
            .attr("x2", 0)
            .attr("y2", 0);


        let text = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 5)
            .attr("y", 10)
            .style("font-size", '10')
            .style("fill", "black");

        let text2 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .style("font-size", '10')
            .attr("x", 5)
            .attr("y", 30)
            .style("fill", "black");

        let text3 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .style("font-size", '10')
            .attr("x", 5)
            .attr("y", 50)
            .style("fill", "black");

        let text4 = tooltip.append("text")
            .attr("class", "tooltip-text")
            .style("font-size", '10')
            .attr("x", 5)
            .attr("y", 70)
            .style("fill", "red");

        if (vis.allowInteraction) {
            let overlay = svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .attr("x", 0)
                .attr("y", 0)
                .style("position", "absolute")
                .style("box-shadow", "2px 2px 4px lightgrey")
                .style("padding", "10px")
                .attr("fill", "transparent")
                .on("mouseover", function (event, d) {
                    tooltip.attr("display", "null");
                })
                .on("mouseout", function (event, d) {
                    tooltip.attr("display", "none")
                        .style("opacity", 0)
                })
                .on("mousemove", mousemove);
        }

        let bisectDate = d3.bisector(d => d.date).left;
        let formatTime = d3.timeFormat("%Y-%m-%d");
        const x_time = d3.scaleTime()
            .domain(d3.extent(data, function (d) {
                return d.date;
            }))
            .range([0, width]);

        function mousemove(event) {
            let x_coordinate = d3.pointer(event)[0];
            let x_date = x_time.invert(x_coordinate);
            let index = bisectDate(data, x_date);
            let hang_right = false
            let closest = null;
            let right = data[index];
            let x_right = x_time(right.date);
            if (Math.abs(x_right - x_coordinate) < 10) {
                closest = right;
                hang_right = true
            } else if (index) {
                let left = data[index - 1];
                let x_left = x_time(left.date);
                if (Math.abs(x_left - x_coordinate) < 10) {
                    closest = left;
                }
            }

            if (x_coordinate > (width / 2)) {
                // $("#tool-rect-background-2")
                svg.select(".tool-rect-background-r")
                    .attr("visibility", "hidden")
                svg.select(".tool-rect-background-l")
                    .attr("visibility", "visible")
            } else {
                svg.select(".tool-rect-background-r")
                    .attr("visibility", "visible")
                svg.select(".tool-rect-background-l")
                    .attr("visibility", "hidden")
            }

            let anchor = (x_coordinate > (width / 2)) ? "end" : "start";
            let x_text = (x_coordinate > (width / 2)) ? -20 : 20;

            text.attr("text-anchor", anchor).attr("x", x_text);
            //text1.attr("text-anchor", anchor).attr("x", x_text);
            text2.attr("text-anchor", anchor).attr("x", x_text);
            text3.attr("text-anchor", anchor).attr("x", x_text);
            text4.attr("text-anchor", anchor).attr("x", x_text);

            tooltip.attr("transform", "translate(" + x_coordinate + ")")
            text.text("State: " + (closest.State2));
            text2.text("Date: " + formatTime(closest.date));
            text3.text("New Cases: " + closest.value);
            text4.text("7-Day New Cases Avg: " + (closest.value2.toFixed(0)));
        }
    }

    initVisSimple(id) {
        let vis = this;
        vis.margin = {top: 0, right: 20, bottom: 100, left: 0};
        vis.totalWidth = d3.select("#" + id).node().getBoundingClientRect().width
        if (vis.totalWidth < 0) console.log(vis.totalWidth)
        vis.width = vis.totalWidth * 1.4 - vis.margin.left - vis.margin.right;
        if (vis.width < 0) console.log(vis.width)
        vis.height = vis.totalWidth / 1.2 - vis.margin.top - vis.margin.bottom;
        if (vis.height < 0) console.log(vis.height)

        // init drawing area
        vis.svg = d3.select("#" + id)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .attr("transform", `translate (${vis.margin.left}, ${vis.margin.top})`);

        // set the viewpoint and zoom
        vis.viewpoint = {"width": 975, "height": 610};
        vis.zoom = vis.width / vis.viewpoint.width;

        // adjust map position
        vis.map = vis.svg.append("g") // group will contain all state paths
            .attr("class", "states")
            .attr('transform', `scale(${vis.zoom} ${vis.zoom})`);

        // create a projection
        vis.projection = d3.geoAlbersUsa();

        // define a geo generator and pass in projection
        vis.path = d3.geoPath().projection(vis.projection);

        // convert TopoJSON data to GeoJSON data structure
        let states = topojson.feature(vis.geoData, vis.geoData.objects.states).features;

        vis.displayData = {};
        vis.covidData.forEach(s => vis.displayData[s.State] = s);

        // set up color scale
        let min = d3.min(vis.covidData, d => d.Tot_Cases);
        let max = d3.max(vis.covidData, d => d.Tot_Cases);
        vis.colorScale.domain([min, max]);

        // draw the states
        vis.map.selectAll(".state")
            .data(states)
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("d", vis.path)
            .style("fill", d => {
                let state = vis.displayData[d.properties.name];
                //    console.log(d.properties.name, state);
                return state ? vis.colorScale(state.Tot_Cases) : "red";
            })
            .style("stroke", "#000")
            .style("stroke-width", "0.5px")
            .style("cursor", "pointer")
            .on("mouseover", vis.allowInteraction ? mouseover : () => {
            })
            .on("mouseout", vis.allowInteraction ? mouseout : () => {
            })
            .on("mousemove", vis.allowInteraction ? mousemove : () => {
            });
        if (vis.allowInteraction) {
            // append tooltip
            vis.tooltip = d3.select("body").append("div").attr("class", "tooltip");
        }

        // // tooltip mouse functions
        function mouseover(_, d) {
            let state = vis.displayData[d.properties.name];
            vis.tooltip
                .html(`
                    <h4>${state.State}</h4>
                    <p>Total Cumulative Cases: ${state.Tot_Cases2}</p>`);
            d3.select(this).style("stroke-width", "2px").style("fill-opacity", 0.5);
        }

        //
        function mouseout() {
            d3.select(this).style("stroke-width", "0.5px").style("fill-opacity", 1);
            vis.tooltip.style("opacity", 0);
        }

        //
        function mousemove(event) {
            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px");
        }

        vis.initLegend()
    }

// creates a gradient legend with an x-axis
    initLegend() {
        let vis = this;
        vis.axisScale = d3.scaleLinear().range([vis.margin.left, vis.width / 2]);

        vis.barHeight = 15;
        let defs = vis.svg.append("defs");

        let linearGradient = defs.append("linearGradient").attr("id", "linear-gradient");

        linearGradient.selectAll("stop")
            .data(vis.colorScale.ticks().map((t, i, n) => ({
                offset: `${100 * i / n.length}%`,
                color: vis.colorScale(t)
            })))
            .enter()
            .append("stop")
            .attr("offset", d => d.offset)
            .attr("stop-color", d => d.color);

        vis.svg.append("g")
            .attr("transform", `translate(0,${vis.height - vis.barHeight + 50})`)
            .append("rect")
            .attr('transform', `translate(${vis.width / 4}, 0)`)
            .attr("width", vis.width / 2 - vis.margin.left)
            .attr("height", vis.barHeight)
            .style("fill", "url(#linear-gradient)");

        vis.legendAxis = vis.svg.append("g")
            .attr("class", "x-axis")
            .attr("id", "legend")
            .attr("transform", `translate(${vis.width / 4 - vis.margin.left}, ${vis.height + 50})`);

        vis.axisScale.domain(vis.colorScale.domain());
        vis.legendAxis.call(d3.axisBottom(vis.axisScale).ticks(vis.width / 120).tickSize(-vis.barHeight));


    }

}
