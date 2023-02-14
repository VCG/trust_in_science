class MapChart {
    constructor(props) {
        this.complex = props.isComplex;
        this.interactive = !this.complex ? false : props.isInteractive;
        this.source = props.source;
        this.geoData = props.data[0];
        this.covidData = props.data[1];
        this.complexData = props.data[2];
        this.colorScale = d3.scaleSequential(d3.interpolateBlues);
        this.buildHtml(props.selector);
    }

    buildHtml(selector = null) {
        console.log('building html')
        let vis = this;
        let container = selector
            ? d3.select(`#${selector.questionId}`).select('.QuestionText')
                .insert('div', ':first-child')
                .attr('class', 'row')
            : d3.select('#main-container').select('.QuestionText')

        let mc = container.append('div').attr('class', 'col-8 main-content');
        mc.append('div').attr('class', 'title')
            .append('h3').attr('id', 'chart-title').text('Cumulative Covid-19 cases across the US states as per week 4, 2022');
        mc.append('br');
        mc.append('div').attr('class', 'helper').text('*Hover over the states to explore further');
        mc.append('br');
        mc.append('div').attr('id', 'chart');
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
        }
    }

    initVisSimple(id) {
        let vis = this;
        vis.margin = {top: 0, right: 20, bottom: 100, left: 0};
        vis.totalWidth = d3.select('#chart').node().getBoundingClientRect().width
        if (vis.totalWidth < 0) console.log(vis.totalWidth)
        vis.width = vis.totalWidth * 1.4 - vis.margin.left - vis.margin.right;
        if (vis.width < 0) console.log(vis.width)
        vis.height = vis.totalWidth / 1.2 - vis.margin.top - vis.margin.bottom;
        if (vis.height < 0) console.log(vis.height)

        // init drawing area
        vis.svg = d3.select("#chart")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .attr("transform", `translate (${vis.margin.left}, ${vis.margin.top})`);

        // set the viewpoint and zoom
        vis.viewpoint = { "width": 975, "height": 610 };
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
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove);

        // append tooltip
        vis.tooltip = d3.select("body").append("div").attr("class", "tooltip");


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


        vis.axisScale = d3.scaleLinear().range([vis.margin.left, vis.width/2]);

        vis.barHeight = 15;
        let defs = vis.svg.append("defs");

        let linearGradient = defs.append("linearGradient").attr("id", "linear-gradient");

        linearGradient.selectAll("stop")
            .data(vis.colorScale.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: vis.colorScale(t) })))
            .enter()
            .append("stop")
            .attr("offset", d => d.offset)
            .attr("stop-color", d => d.color);

        vis.svg.append("g")
            .attr("transform", `translate(0,${vis.height - vis.barHeight + 50})`)
            .append("rect")
            .attr('transform', `translate(${vis.width/4}, 0)`)
            .attr("width", vis.width/2-vis.margin.left)
            .attr("height", vis.barHeight)
            .style("fill", "url(#linear-gradient)");

        vis.legendAxis = vis.svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(${vis.width/4-vis.margin.left}, ${vis.height+50})`);

        vis.axisScale.domain(vis.colorScale.domain());
        vis.legendAxis.call(d3.axisBottom(vis.axisScale).ticks(vis.width / 120).tickSize(-vis.barHeight));


    }

}