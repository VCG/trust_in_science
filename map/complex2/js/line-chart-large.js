class LineChartLarge {
    constructor(parentElement, data, state) {
        this.data = data.filter(d => d.State == state);
        this.state = state;
        this.parentElement = parentElement;

        this.initVis();
    }

    initVis() {
        let vis = this;

        let margin = { top: 10, right: 10, bottom: 30, left: 50 },
            width = 600 - margin.left - margin.right,
            height = 440 - margin.top - margin.bottom;

        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

        let valueline = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value));

        let valueline2 = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value2));

        d3.select(vis.parentElement).select("svg").remove();

        let svg = d3.select(vis.parentElement).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(vis.data, d => d.date));
        y.domain(d3.extent(vis.data, d => d.value));

        const dateFormatter = d3.timeFormat("%d/%m/%Y");

        let tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([100, 0])
            .html(function(e, d) {
                let date = x.invert(e.layerX);
                let value = y.invert(e.layerY);
                return `<b> Date: </b> ${dateFormatter(date)}<br /><b>Number of New Cases: ${Math.floor(value)}</b>`;
            });

        svg.call(tip);

        svg.append("path")
            .data([vis.data])
            .attr("class", "line")
            .attr("d", valueline)
            .on("mousemove", function(e, d) { tip.show(e, d, this); })
            .on("mouseout", tip.hide);


        svg.append("path")
            .data([vis.data])
            .attr("class", "line2")
            .attr("d", valueline2);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));



        svg.append("g")
            .call(d3.axisLeft(y));

    }
}
