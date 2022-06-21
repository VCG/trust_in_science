class Legend {
    constructor(data) {

        this.data = data;

        this.initVis();

    }


    initVis() {
        let vis = this;


        vis.margin = {top: 120, right: 120, bottom: 70, left: 30},
            vis.width = 80 ,
            vis.height = 350 - vis.margin.top - vis.margin.bottom ;


        vis.svg = d3.select("#Legend_Div")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        const xCircle = 50
        const xLabel = 50
        const yCircle = 0

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([1, 100])
            .range([ vis.height, 0]);
        // vis.svg.append("g")
        //     .call(d3.axisLeft(y));


        // Add a scale for bubble size
        const z = d3.scalePow()
            .exponent(2)
            .domain([1, 100])
            .range([ 0, 20]);

        let myColor = d3.scaleLinear()
            .domain([1, 100])
            .range(["lightblue", "darkblue"]);

        // Add dots
        vis.svg.append('g')
            .selectAll("legend")
            .data(this.data)
            .join("circle")
            .attr("cx", xCircle)
            .attr("cy", d => y(d.size))
           .attr("r", d => z(d.size))
            .style("fill", d => myColor(d.size))
            .style("opacity", "0.7");


        // legend bubbles
        vis.svg
            .selectAll("legend")
            .data(this.data)
            .join("line")
            .attr('x1', d => xCircle +35)
            .attr('x2', d => xCircle)
            .attr('y1', d => y(d.size))
            .attr('y2', d => y(d.size))
            .attr('stroke', 'darkgrey')
            .style('stroke-dasharray', ('2,2'))



        // legend labels
        vis.svg
            .selectAll("legend")
            .data(this.data)
            .join("text")
            .attr('x', 90)
            .attr('y', d => yCircle + y(d.size))
            .text( d => d.size +"%")
            .style("font-size", 12)
            .attr('alignment-baseline', 'middle')

        //share of vaccination title
        vis.svg
            .append("text")
            .attr("x", 15)
            .attr("y", (vis.margin.top/3)-vis.margin.top+30)
            .attr("class", "title")
            .text("Vaccination Rate")
            .attr("fill","black")
            .attr("font-size", "14")


    }
}