

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
    .nodeWidth(30)
    .nodePadding(20)
    // .nodeId(d => d.id)
    // // .nodeAlign(nodeAlignment)
    .nodeSort(null)
    .size([width, height]);


const hiddenNodes = [13, 14, 15, 16, 17, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]


var path = sankey.links();

// load the data
d3.json("https://raw.githubusercontent.com/VCG/trust_in_science/main/sankey_chart/complex_interactive/data/sankey2.json").then(function(sankeydata) {

    graph = sankey(sankeydata);



    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("id", (d, i) => {
            d.id = i;
            return "link-" + i;
        })
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function(d) { return d.width; })
        // .style("stroke", function(d) {
        //     return "grey"});
        .on("mouseover", mouseover_link)
        .on("mouseleave", mouseleave_link);



   tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border-radius", "2px")
        .style("padding", "12px")
        .style("color", "#0c0c0c")
        .style('font-size', '14px')
        .style("position", "absolute")
        .style("box-shadow", "2px 2px 4px lightgrey")
        .style("padding", "10px");

    tooltip2 = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border-radius", "2px")
        .style("padding", "12px")
        .style("color", "#0c0c0c")
        .style('font-size', '14px')
        .style("position", "absolute")
        .style("box-shadow", "2px 2px 4px lightgrey")
        .style("padding", "10px");



// add the link titles
//     link.append("title")
//         .text(function(d) {
//             return d.source.name + " → " +
//                 d.target.name + "\n" + "Number of participants: " + format(d.value); });

    // link.on("mouseover", mouseover_link)
    //     .on("mouseleave", mouseleave_link);

    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        //.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .on("click",highlight_node_links)

// add the rectangles for the nodes
    node.append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", sankey.nodeWidth())
        .style("fill", d => d.color = color(d.name.replace(/ .*/, "")))
        // .style("stroke", d => d3.rgb(d.color))
        .attr("class", d => hiddenNodes.includes(d.index) ? "hidden-node" : "visible-node")
        .attr("id", d => `node-${d.index}`)
        // .append("title")
        // .text(d => d.name + "\n" + "Number of participants: " + format(d.value) + "\n" + "% of participants: " + d.perc)
        .on("mouseover", mouseover_node)
        .on("mouseleave", mouseleave_node);


    let text = tooltip.append("text")
        .attr("class", "tooltip-text")
        .attr("x", 10)
        .attr("y", 20)
        .attr('font-weight','bold')
        .attr("font-family", "Segoe UI")
        .style("fill", "black");


    function mouseover_node(e,d) {
        const name = d.name;
        const value = format(d.value);
        const perc = d.perc;

        // console.log(value)

        tooltip
            .html(`
            <b>Status :</b> ${name}<br>
            <b>Number of participants: </b> ${value}<br> 
            <b>% of participants: </b> ${perc}<br> 
             `)
            .style("opacity", 1)
            .style("font-size", "11px")
            .style("left", ((event.x) +20) + "px")
            .style("top", ((event.y - 0) ) + "px");
    }


    function mouseleave_node(e, d) {
        tooltip.style("opacity", 0);
    }


    function mouseover_link(e,d) {

        const source = d.source.name;
        const target = d.target.name;
        const value = format(d.value);

        tooltip
            .html(`
            <b> ${source} -> ${target}</b><br>
            <b>Number of participants: </b> ${value}<br>
            `)
            .style("opacity", 1)
            .style("font-size", "11px")
            .style("left", ((event.x) +20) + "px")
            .style("top", ((event.y - 0) ) + "px");

    }


    function mouseleave_link(e, d) {
        tooltip.style("opacity", 0);
    }



    function highlight_node_links(e, node) {
        var remainingNodes=[],
            nextNodes=[];

        var stroke_opacity = 0;
        let showPercentage = true;

        if (d3.select(this).attr("data-clicked") == "1" ) {
            d3.select(this).attr("data-clicked","0");
            stroke_opacity = 0.2; //ligher
            showPercentage = false;
            d3.selectAll(".link")
                .style("stroke-opacity", 0.2)
                .style("stroke", d => d.source.color);
            d3.selectAll(".hidden-node")
                .style("fill-opacity", 0.2);
            d3.selectAll(".node > rect")
                .style("fill", d => d.color);
        }
        else {
            d3.select(this).attr("data-clicked","1");
            stroke_opacity = 0.5; ///darker
            showPercentage = true;

            mouseleave_node()

            d3.selectAll(".link")
                .style("stroke", "#aca9a9")
                .style("stroke-opacity", 0.1);
            d3.selectAll(".hidden-node")
                .style("fill", "#aca9a9")
                .style("fill-opacity", 0.1);
            d3.selectAll(".node > rect")
                .style("fill", "#aca9a9");
            d3.select(this)
                .selectAll("rect")
                .style("fill", d => d.color);
        }

        var traverse = [
            {
                linkType : "sourceLinks",
                nodeType : "target"
            },
            // {
            //     linkType : "targetLinks",
            //     nodeType : "source"
            // }
        ];

        // Config toggle
        const showDescendents = false;

        traverse.forEach(function(step) {
            node[step.linkType].forEach(function(link) {
                remainingNodes.push(link[step.nodeType]);
                highlight_link(link.id, link.source.index, stroke_opacity, showPercentage);
            });

            while (showDescendents && remainingNodes.length) {
                nextNodes = [];
                remainingNodes.forEach(function(node) {
                    node[step.linkType].forEach(function(link) {
                        nextNodes.push(link[step.nodeType]);
                        highlight_link(link.id, link.source.index, stroke_opacity, showPercentage);
                    });
                });
                remainingNodes = nextNodes;
            }
        });
    }

    function highlight_link(id, index, opacity, showPercentage) {
        d3.select(`#link-${id}`)
            .style("stroke", d => d.source.color)
            .style("stroke-opacity", opacity);
        d3.select(`#percentage-${index}`).style("visibility", (showPercentage ? "visible" : "hidden"));

        // HACK:
        if (id >= 41 && id <=60) {
            d3.select(`#node-${index+5}`)
                .style("fill-opacity", opacity);
            d3.selectAll(`.node > #node-${index+5}`)
                .style("fill", d => d.color);
            d3.select(`#link-${id+25}`)
                .style("stroke", d => d.source.color)
                .style("stroke-opacity", opacity);
        }
        else if (id >= 86 && id <=110) {
            d3.select(`#node-${index+5}`)
                .style("fill-opacity", opacity);
            d3.selectAll(`.node > #node-${index+5}`)
                .style("fill", d => d.color);
            d3.select(`#node-${index+10}`)
                .style("fill-opacity", opacity);
            d3.selectAll(`.node > #node-${index+10}`)
                .style("fill", d => d.color);
            d3.select(`#link-${id+25}`)
                .style("stroke", d => d.source.color)
                .style("stroke-opacity", opacity);
            d3.select(`#link-${id+50}`)
                .style("stroke", d => d.source.color)
                .style("stroke-opacity", opacity);
        }
    }




// add in the title for the nodes
    node.append("text")
        .attr("x", function(d) { return d.x0 + 35; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text(function(d) { return d.name; })
        .attr("font-weight",'bold')
        .style("visibility", d => hiddenNodes.includes(d.index) ? "hidden" : "visible");
        // .filter(function(d) { return d.x0 < width / 2; })
        // .attr("font-weight",'bold')
        // .attr("x", function(d) { return d.x1 + 6; })
        // .attr("text-anchor", "start");

    // add in the title for the nodes - %
    node.append("text")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("font-weight",'bold')
        .text(function(d) { return d.perc; })
        .attr("x", function(d) { return d.x1 -25; })
        .attr("text-anchor", "start")
        .attr("font-weight",'bold');

    //show values displayed upon a click
    node.append("text")
        .attr("x", function(d) { return d.x0 + 35; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2 + 15; })
        .attr("dy", "0.55em")
        .attr("text-anchor", "start")
        .text(function(d) { return d.value; })
        .attr("font-weight",'bold')
        .attr("id", d => `percentage-${d.index}`)
        .style("visibility", "hidden");


    svg.selectAll(".link").style('stroke', d => d.source.color);


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
        .attr("x", 80)
        .attr("y", height+40)
        .attr("class", "title")
        .text("Nov 2020")
        .attr("fill","black")
        .attr("font-size", "15")
        .attr("font-weight",'bold')

    svg
        .append("text")
        .attr("x", 200)
        .attr("y", height+40)
        .attr("class", "title")
        .text("Dec 2020")
        .attr("fill","black")
        .attr("font-size", "15")
        .attr("font-weight",'bold')

    svg
        .append("text")
        .attr("x", 320)
        .attr("y", height+40)
        .attr("class", "title")
        .text("Jan 2021")
        .attr("fill","black")
        .attr("font-size", "15")
        .attr("font-weight",'bold')

    svg
        .append("text")
        .attr("x", 440)
        .attr("y", height+40)
        .attr("class", "title")
        .text("Feb 2021")
        .attr("fill","black")
        .attr("font-size", "15")
        .attr("font-weight",'bold')


    svg
        .append("text")
        .attr("x", 580)
        .attr("y", height+40)
        .attr("class", "title")
        .text("Mar - May 2021")
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


    var g_legend = svg.append("g")
        .attr("id", "sankey_legend");


    g_legend
        .append("text")
        .attr("x", width+60)
        .attr("y", -7)
        .attr("class", "title")
        .text("Option on taking the vaccine:")
        .attr("fill","#212529")
        .attr("font-size", "14")
        .attr("font-family", "Segoe UI")
       //.attr("font-weight",'bold');


    //legend
    var keys = [ "Vaccinated","Immediately - would take it immediately","Delay - would delay it","Never- would never take it","Missing - mising responses"]



    var color_legend = d3.scaleOrdinal()
        .domain(keys)
        .range(['rgb(148, 103, 189)','rgb(31, 119, 180)','rgb(255, 127, 14)', 'rgb(44, 160, 44)', 'rgb(214, 39, 40)'])


    // Add one dot in the legend for each name.
    var size = 10

    g_legend.selectAll("mydots")
        .data(keys)
        .enter()
        .append("rect")
        .attr("class", "mydots")
        .attr("x", width+60)
        .attr("y", function(d,i){ return 10 + i*(size+8)})
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color_legend(d)})

    g_legend.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("class", "mylabels")
        .attr("x", width+70 + size*1.2)
        .attr("y", function(d,i){ return 10 + i*(size+8) + (size/2)})
        .style("fill", "black")
        .style("font-size", "12px")
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
});
