var chart

function getLineChartData(props) {
    // return d3.json(`data/${props.showCovidData ? "covid" : "non_covid"}_toursteps.json`)
    return d3.json(`https://vcg.github.io/trust_in_science/line_chart/data/${props.showCovidData ? "covid" : "non_covid"}_toursteps.json`)
    // return d3.json(`data/${props.showCovidData ? "covid" : "non_covid"}_toursteps.json`)

        .then(toursteps => {
            console.log(toursteps)
            d3.csv("https://vcg.github.io/trust_in_science/line_chart/data/line_chart_complex.csv", (row, i) => {
            // d3.csv("js/line_chart_complex.csv", (row, i) => {
                row.Vax_18_49 = number_format_line(+row.Vax_18_49);
                row.Vax_50_79 = number_format_line(+row.Vax_50_79);
                row.Vax_80 = number_format_line(+row.Vax_80);
                row.Unvax_18_49 = number_format_line(+row.Unvax_18_49);
                row.Unvax_50_79 = number_format_line(+row.Unvax_50_79);
                row.Unvax_80 = number_format_line(+row.Unvax_80);

                row.Age_adjusted_unvax_IR = number_format_line(+row.Age_adjusted_unvax_IR);
                row.Age_adjusted_vax_IR = number_format_line(+row.Age_adjusted_vax_IR);

                row.Average_Vaxxed = number_format_line(+row.Average_Vaxxed);
                row.Average_Unvaxxed = number_format_line(+row.Average_Unvaxxed);

                row.Week = formatDate(+row.Max_Week_Date);
                row.date = (row.Max_Week_Date);

                row.Max_Week_Date = parseDate(row.Max_Week_Date);
                row.Week_no = +row.Week_no;
                row.Week = formatDate(+row.Max_Week_Date);
                row.date = row.Max_Week_Date;
                row.month = +row.Index;
                return row;
            }).then(data => {
                chart = new LineChart({
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
                    chart_legend_label: props.showCovidData ? ' per 100k' : ' per 100 acres',
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
                chart.initVis('chart', true);
                if (props.doTour) createTour(props.complexity, toursteps, chart.provData)
                trackFocus(chart.provData)
            })
        });
}

// let props = {
//     complexity: 'simple',
//     doTour: false,
//     showSource: true,
//     changes: true,
//     showCovidData: false,
//     allowInteraction: true
// };
// getLineChartData(props);
