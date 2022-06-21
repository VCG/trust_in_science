

// set the dimensions and margins of the graph
var margin = {top: 20, right: 300, bottom: 70, left: 70},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// format variables
var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function(d) { return formatNumber(d); },
    color = d3.scaleOrdinal(d3.schemeCategory10);



// append the svg object to the body of the page
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(10)
    .nodePadding(20)
    // .nodeId(d => d.id)
    // // .nodeAlign(nodeAlignment)
    .nodeSort(null)
    .size([width, height]);


// const sankey = d3.sankey()
//     .size(graphSize)
//     .nodeId(d => d.id)
//     // .nodeWidth(nodeWidth)
//     // .nodePadding(0.5)
//     .nodeAlign(nodeAlignment)
//     .nodeSort(null) //creates sankey nodes as ordered in the data

var path = sankey.links();

// load the data
d3.json("data/sankey2.json").then(function(sankeydata) {

    graph = sankey(sankeydata);
    console.log(graph)


// add in the links
    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function(d) { return d.width; })
        .style("stroke", function(d) {
            return "grey"});

// add the link titles
    link.append("title")
        .text(function(d) {
            return d.source.name + " → " +
                d.target.name + "\n" + "Number of participants: " + format(d.value); });

// add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node");

// add the rectangles for the nodes
    node.append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("width", sankey.nodeWidth())
       //  .attr("width", 1)
        .style("fill", function(d) {
            return d.color = color(d.name.replace(/ .*/, "")); })
        .style("stroke", function(d) {
            return d3.rgb(d.color).darker(2); })

        .append("title")
        .text(function(d) {
            return d.name + "\n" + "Number of participants: " + format(d.value); });

// add in the title for the nodes
    node.append("text")
        .attr("x", function(d) { return d.x0 + 15; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text(function(d) { return d.name; })
        .attr("font-weight",'bold');
        // .filter(function(d) { return d.x0 < width / 2; })
        // .attr("font-weight",'bold')
        // .attr("x", function(d) { return d.x1 + 6; })
        // .attr("text-anchor", "start");

    svg.selectAll(".link")
        .style('stroke', function(d){
            return d.source.color;
        })


    svg
        .append("text")
        .attr("x", -30)
        .attr("y", height+40)
        .attr("class", "title")
        .text("Oct 2020")
        .attr("fill","black")
        .attr("font-size", "15")
        .attr("font-weight",'bold')

    svg
        .append("text")
        .attr("x", 70)
        .attr("y", height+40)
        .attr("class", "title")
        .text("Nov 2020")
        .attr("fill","black")
        .attr("font-size", "15")
        .attr("font-weight",'bold')

    svg
        .append("text")
        .attr("x", 180)
        .attr("y", height+40)
        .attr("class", "title")
        .text("Dec 2020")
        .attr("fill","black")
        .attr("font-size", "15")
        .attr("font-weight",'bold')

    svg
        .append("text")
        .attr("x", 280)
        .attr("y", height+40)
        .attr("class", "title")
        .text("Jan 2021")
        .attr("fill","black")
        .attr("font-size", "15")
        .attr("font-weight",'bold')

    svg
        .append("text")
        .attr("x", 380)
        .attr("y", height+40)
        .attr("class", "title")
        .text("Feb 2021")
        .attr("fill","black")
        .attr("font-size", "15")
        .attr("font-weight",'bold')

    svg
        .append("text")
        .attr("x", 480)
        .attr("y", height+40)
        .attr("class", "title")
        .text("Mar 2021")
        .attr("fill","black")
        .attr("font-size", "15")
        .attr("font-weight",'bold')

    svg
        .append("text")
        .attr("x", 580)
        .attr("y", height+40)
        .attr("class", "title")
        .text("Apr 2021")
        .attr("fill","black")
        .attr("font-size", "15")
        .attr("font-weight",'bold')

    svg
        .append("text")
        .attr("x", 690)
        .attr("y", height+40)
        .attr("class", "title")
        .text("May 2021")
        .attr("fill","black")
        .attr("font-size", "15")
        .attr("font-weight",'bold')

    svg
        .append("text")
        .attr("x", width-40)
        .attr("y", height+40)
        .attr("class", "title")
        .text("June 2021")
        .attr("fill","black")
        .attr("font-size", "15")
        .attr("font-weight",'bold')

    //legend
    // create a list of keys
    var keys = [ "Vaccinated","Immediately","Delay","Never","Missing"]


    var color_legend = d3.scaleOrdinal()
        .domain(keys)
        .range(['rgb(148, 103, 189)','rgb(31, 119, 180)','rgb(255, 127, 14)', 'rgb(44, 160, 44)', 'rgb(214, 39, 40)'])


    // Add one dot in the legend for each name.
    var size = 10

    svg.selectAll("mydots")
        .data(keys)
        .enter()
        .append("rect")
        .attr("x", width+70)
        .attr("y", function(d,i){ return 10 + i*(size+8)})
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color_legend(d)})

    svg.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", width+80 + size*1.2)
        .attr("y", function(d,i){ return 10 + i*(size+8) + (size/2)})
        .style("fill", "black")
        .style("font-size", "13px")
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")




});