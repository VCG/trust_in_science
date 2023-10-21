const fs = require('fs');
const csv = require('fast-csv');
const ObjectsToCsv = require('objects-to-csv');
const data = []
const patch_data = []
const tag_data = []

fs.createReadStream('./full_Study/data_patch.csv')
    .pipe(csv.parse({ headers: false }))
    .on('error', error => console.error(error))
    .on('data', row => patch_data.push(row))

fs.createReadStream('./full_Study/tags.csv')
    .pipe(csv.parse({ headers: false }))
    .on('error', error => console.error(error))
    .on('data', row => tag_data.push(row))


fs.createReadStream('./full_Study/complete_study_mar16.csv')
    .pipe(csv.parse({ headers: false }))
    .on('error', error => console.error(error))
    .on('data', row => data.push(row))
    .on('end', () => {


        //Create objects for patch data
        let patchData = []
        let headers_patch = patch_data[0];

        patch_data.map((d, i) => {
            let obj = {}
            if (i > 0) {
                d.map((dd, i) => {
                    obj[headers_patch[i]] = dd
                })
            }
            patchData.push(obj)
        })

        //create objects for qual data
        let qualData = []
        //remove header
        tag_data.shift();

        console.log(tag_data[1])
       
        //Only look at rows that have at least one tag
        tag_data.filter(d=>d[1]).map((d, i) => {            
            //assumes the codes are in the second column; 
            let codes = d[1].split(',');
            codes.map(c=>{
                let obj = {}
                obj['PROLIFIC_ID'] = d[0];
                obj ['code'] = c ;
                obj ['valence'] = d[2] ;
                qualData.push(obj)
            })
        })


        let objData = []
        data.splice(1, 2)// remove rows 2 and 3
        let headers = data[0];

        // console.log('header', headers.filter(h=>h.includes('PROLIFIC')), 'qualHeaders', qual_headers)
        // console.log('headers', headers)
        data.map((d, i) => {
            let obj = {}
            if (i > 0) {
                // if (i ==1 ) console.log('d',d)
                d.map((dd, i) => {
                    obj[headers[i]] = dd
                })
                objData.push(obj)
            }

        })

        // console.log('missing data for ' , (objData.filter(d=>d.complexity == undefined).length))

        let patchDictionary = {
            "complexity": 'bar-complexity',
            "provenance-vis": "provenance-bar-vis",
            "provenance-explore": "provenance-bar-explore",
            "provenance-data": "provenance-bar-data",
            "provenance-tour": "provenance-bar-tour",
            "simple-vlat-1": "simple-bar-vlat-1",
            "simple-vlat-2": "simple-bar-vlat-2",
            "moderate-vlat-1": "moderate-bar-vlat-1",
            "moderate-vlat-2": "moderate-bar-vlat-2",
            "complex-vlat-1": "complex-bar-vlat-1"
        }
        //patch data with old file; 
        objData.map(d => {
            if (!d.complexity) { //participant took earlier version of the survey
                let oldEntry = patchData.filter(p => p['PROLIFIC_PID'] == d['PROLIFIC_PID'])[0];

                if (oldEntry) {
                    Object.keys(patchDictionary).map(field => {
                        d[field] = oldEntry[patchDictionary[field]];
                    })
                    d['chartType'] = 'bar'
                }
            }

        })

            ; //filter out participants who I don't have complexity for, who failed the attention check, and for two specific cases.

        let cleanData = objData.filter(d => d.complexity).filter(d => (d['attention-check_1'] == '2' && d['attention-check_7'] == '6' && d['PROLIFIC_PID'] !== "5fd8ca40697e370870a312e8" && d['PROLIFIC_PID'] !== "5610c4ea7ffc8a0005811504"))
       
        // add metadata to tag data; 


        // add column for tag in the trust explanation
        qualData.map(d=>{
            //find person in tagged data based on prolific id. 
            // console.log(d)
            let dataEntry = cleanData.filter(q=>q['PROLIFIC_PID'] == d['PROLIFIC_ID'])[0];

            if (dataEntry) {
                d['complexity']= dataEntry['complexity'];
                d['chartType'] = dataEntry['chartType'];
                d['isCovidData'] = dataEntry['isCovidData']
                d['trust'] = dataEntry['vis-trust_6']
                d['trust_type'] = d['code'].includes('Cog')? 'Cognitive' : 'Affective'
            } else{
                console.log(d)
            }
           
        })

        qualData = qualData.filter(q=>q.complexity)
        const qcsv = new ObjectsToCsv(qualData);

        // Save to file:
        qcsv.toDisk('./full_Study/tagData.csv');

        cleanData.map(d => {

            d['affective_tags']=0;
            d['cognitive_tags']=0;
            d['individual_characteristics']=0;
            //add count for cognitive and affective tags in trust explanation
            let tagData = tag_data.filter(t=>t[0] == d['PROLIFIC_PID']);
            if (tagData.length >0){
                d['tag_valence']=tagData[0][2];
                let tags = tagData[0][1].split(',');
                // console.log(tags)
                d['affective_tags']=tags.filter(t=>t.includes('Aff')).length;
                d['cognitive_tags']=tags.filter(t=>t.includes('Cog')).length;
                d['individual_characteristics']=tags.filter(t=>t.includes('Individual')).length;

                // console.log(d['affective_tags'],d['cognitive_tags'])
            } 



            //calculate NEED FOR COGNITION SCORE 
            //reverse cognition_3 scale

            // console.log( Math.abs(d['cognition_3']-6),d['cognition_3'])
            d['cognition_3'] = Math.abs(d['cognition_3'] - 6);

            let cognitions_questions = ['cognition_1', 'cognition_2', 'cognition_3', 'cognition_4', 'cognition_5', 'cognition_6']
            let sumCognition = cognitions_questions.reduce((acc, curr) => {
                return parseInt(d[curr]) + acc
            }, 0)
            d['need_for_cognition'] = Math.round(10 * sumCognition / cognitions_questions.length) / 10
            //  console.log(d['need_for_cognition'])


            // console.log(d)
            Object.keys(d).map(key => {
                // console.log(d)
                if (key.includes('provenance')) {
                    if (d[key]) {
                        d[key] = JSON.parse(d[key]) //rehydrate from string
                    }

                }

                //remove 'recipient' cols. 
                if (key.includes('Recipient')) delete d[key]
                if (key.includes('External')) delete d[key]
                if (key.includes('Distribution')) delete d[key]
                if (key.includes('IPAddress')) delete d[key]
                if (key.includes('Click')) delete d[key]
            })

            // console.log('heeere', d)


            //computer interaction metrics:
            let validInteractions = d['provenance-explore'].provenance.filter(e => !e.label.includes('window'));
            let hoverInteractions = d['provenance-explore'].provenance.filter(e => e.label=='hovered');




            //interacted with brush filter
            d.brushed = validInteractions.filter(e => e.label == 'started_brush').length > 0 ? '1' : '0'

            //number of interactions during explore phase
            d['explore_interactions'] = validInteractions.length;
            d['hover_interactions'] = hoverInteractions.length;

            //computer average hover length
            let hover_events = d['provenance-explore'].provenance.filter(p=>p.label == 'hovered');
            d['total_hover_time']= hover_events.reduce((acc,curr)=>acc+curr.timeHovered,0)/1000;
            d['avg_hover_time']= d['total_hover_time']/hover_events.length || 0;

            //compute time on page: 
            let timeOnPage;
            let window_events = d['provenance-explore'].provenance.filter(p=>p.label == 'window_blurred' || p.label == 'window_focused');

            if (window_events.length == 0){
                timeOnPage = 15000;
            } else {
                timeOnPage = 0;
                let lastFocused = 0

                window_events.forEach((l,i)=>{
                    if (l.label == 'window_blurred'){
                        let sessionTime = l.time - lastFocused;
                        timeOnPage = timeOnPage + sessionTime;
                    } else {
                        lastFocused = l.time;
                    }
                   
                })
            }
            
            
            // console.log(validInteractions)
            d['explore_time'] = validInteractions.length > 1 ? validInteractions.slice(-1)[0].time - validInteractions[0].time : 0;
            d['explore_active_time'] =timeOnPage/1000;


        })

        // console.log(Object.keys(cleanData[0]).filter(k=>k.includes('science')))


        //compute vlat scores
        let vlatQuestions = [{ 'complexity': 'simple', 'question': 'simple-vlat-1' },
        { 'complexity': 'simple', 'question': 'simple-vlat-2' },
        { 'complexity': 'moderate', 'question': 'moderate-vlat-1' },
        { 'complexity': 'moderate', 'question': 'moderate-vlat-2' },
        { 'complexity': 'complex', 'question': 'complex-vlat-1' }];

        ['simple', 'moderate', 'complex'].map(c => {
            let vlatSubset = vlatQuestions.filter(v => v.complexity == c);
            // console.log(vlatSubset)
            let numQuestions = vlatSubset.length;
            cleanData.map(d => {
                // CS=R−W/C−1

                let R = vlatSubset.reduce((acc, curr) => {
                    let right = d[curr.question] == 1;
                    return right ? acc + 1 : acc
                }, 0)

                // let W = vlatSubset.length - R;
                //normalizing to positive values   
                d['vlat_' + c] = R / numQuestions;
            })
        })


        //add vlat_assigned
        cleanData.map(d => {
            d['assigned_vlat'] = d['vlat_' + d['complexity']]
            d['ordinal_complexity'] = d['complexity'] == 'simple' ? 1 : (d['complexity'] == 'moderate' ? 2 : 3);

        })




        // const csv = new ObjectsToCsv(cleanData);

        // Save to file:
        // csv.toDisk('./full_Study/data_clean.csv');

        //    console.log(Object.keys(filteredData[0]))

        //    let vlatKeys = Object.keys(filteredData[0]).filter(k=>k.includes('vlat') && !k.includes('time'));


        //    const pick = (obj, keys) => Object.keys(obj).filter(k => keys.includes(k)).reduce((res, k) => Object.assign(res, {[k]: obj[k]}), {});

        //     filteredData.map(d=>{
        //         console.log(pick(d,vlatKeys))
        //     })


        const csv = new ObjectsToCsv(cleanData);

        // Save to file:
        csv.toDisk('./full_Study/data_clean.csv');


    });
