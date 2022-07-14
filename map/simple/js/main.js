
// init global variables & switches
let myMapVis;

number_format = d3.format(",")

// load data using promises
let promises = [
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"), // not projected -> you need to do it
    // d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), // already projected -> you can just scale it to fit your browser window
    //d3.csv("data/cumulative_cases_simple_map.csv", (row, _) => {

    d3.csv("https://raw.githubusercontent.com/VCG/trust_in_science/barbara_branch/map/simple/data/cumulative_cases_simple_map.csv", (row,i) => {




        row.Tot_Cases = +row.Tot_Cases;
        row.Tot_Cases2 = number_format(+row.Tot_Cases);
        return row;
    })
];

Promise.all(promises)
    .then(function(data) { initMainPage(data) })
    .catch(function(err) { console.log(err) });

// initMainPage
function initMainPage(dataArray) {
    // log data
    console.debug("check out the data", dataArray);

    // init map
    myMapVis = new MapVis("mapDiv", dataArray[0], dataArray[1]);
}
