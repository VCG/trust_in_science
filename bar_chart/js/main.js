var chart
// var vlatPrompts
// d3.json(`https://vcg.github.io/trust_in_science/bar_chart/data/VLAT_questions.json`)
//     .then(data => {
//         vlatPrompts = data;
//     })

/* props : {
    complexity: string (simple, moderate, complex),
    doTour: boolean,
    changes: boolean,
    showSource: boolean,
    showCovidData: boolean,
    allowInteraction: boolean,
    selector: object
} */
function getBarChartData(props) {
    // return d3.json(`data/${props.showCovidData ? "covid" : "non_covid"}_toursteps.json`)
    return d3.json(`https://vcg.github.io/trust_in_science/bar_chart/data/${props.showCovidData ? "covid" : "non_covid"}_toursteps.json`)
        .then(toursteps => {
            d3.csv("https://vcg.github.io/trust_in_science/bar_chart/data/bar_chart_complex2.csv", (row, i) => {
                row.Index = i;
                row.Vax_18_49 = numbers_format(+row.Vax_18_49);
                row.Vax_50_79 = numbers_format(+row.Vax_50_79);
                row.Vax_80 = numbers_format(+row.Vax_80);
                row.Unvax_18_49 = numbers_format(+row.Unvax_18_49);
                row.Unvax_50_79 = numbers_format(+row.Unvax_50_79);
                row.Unvax_80 = numbers_format(+row.Unvax_80);

                row.Age_adjusted_unvax_IR = (+row.Unvax_18_49) + (+row.Unvax_50_79) + (+row.Unvax_80);
                row.Age_adjusted_vax_IR = (+row.Vax_18_49) + (+row.Vax_50_79) + (+row.Vax_80);

                row.group = row.Week;
                row.Max_Week_Date2 = row.Max_Week_Date
                row.Max_Week_Date = parseDate(row.Max_Week_Date);

                return row;
            })
                .then(data => {
                    chart = new StackedBarChart({
                        data: data,
                        complexity: props.complexity,
                        source: props.showSource,
                        selector: props.selector,
                        changes: props.changes,
                        allowInteraction: props.allowInteraction,
                        showCovidData: props.showCovidData,
                        chart_title: props.showCovidData
                            ? {
                                complex: 'Weekly count of vaccinated & unvaccinated individuals who caught Covid-19, split by age',
                                default: 'Weekly count of vaccinated & unvaccinated individuals who caught Covid-19'
                            }
                            : {
                                complex: 'Weekly count of insect-related and fungi-related crop diseases in Kumrovec, Croatia, split by type',
                                default: 'Weekly count of insect-related and fungi-related crop diseases in Kumrovec, Croatia'
                            },
                        chart_axis_labels: props.showCovidData
                            ? {
                                y: 'Cases per 100k people'
                            }
                            : {
                                y: 'Pests per 100 acres'
                            },
                        chart_legend_labels: props.showCovidData
                            ? [
                                'Unvaccinated',
                                'Vaccinated',
                                'Ages 80+',
                                'Ages 50-79',
                                'Ages 18-49',
                                'Ages 80+',
                                'Ages 50-79',
                                'Ages 18-49'
                            ]
                            : [
                                'Insect-Related Crop Diseases',
                                'Fungi-Related Crop Diseases',
                                'Mealybug',
                                'Bollworm',
                                'Aphid',
                                'Black root rot',
                                'Clubfoot',
                                'Sclerotinia rots'
                            ]
                    });
                    chart.initVis('chart', true)
                    if (props.complexity === 'simple') chart.initVis('chart2', false)
                    if (props.doTour) createTour(props.complexity, toursteps, chart.provData)
                    trackFocus(chart.provData)
                });
        })
}


// // //
// let props = {
//     complexity: 'moderate',
//     doTour: true,
//     showSource: true,
//     changes: true,
//     showCovidData: true,
//     allowInteraction: true
// }
// getBarChartData(props)
