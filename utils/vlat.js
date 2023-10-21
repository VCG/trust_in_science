
function getVLATprompts(qid, showCovidData) {
    let out = vlatPrompts[qid];
    out.prompt = vlatPrompts[qid].prompt[(showCovidData ? 'covid' : 'nonCovid')];
    
    //Only output relevant options
    if (out.options.constructor == Object){
        out.options = vlatPrompts[qid].options[(showCovidData ? 'covid' : 'nonCovid')]
    }
    
    return out
}

let vlatPrompts = 
{
    "simple-bar-vlat-1":{
        "prompt":{
            "covid": "How many weeks had higher unvaccinated Covid-19 case counts than the week of Dec 13, 2021?",  
            "nonCovid": "How many weeks had higher insect-related pests than the week of Dec 13, 2021?"  
        },
        "answer":6,
        "options":[5,6,8]
    },
    "simple-bar-vlat-2":{
        "prompt":{
            "covid": "What is the max number of case counts (per 100K) of vaccinated people who caught Covid-19?",  
            "nonCovid": "What is the max number of fungi-related pests (per 100 acres)?"  
        },
        "answer":3300,
        "options":[3300, 8000, 8600]
    },
    "moderate-bar-vlat-1":{
        "prompt":{
            "covid": "By approximately how much did the number of cases in unvaccinated people increase from the week of December 13, 2021 to the week of December 20, 2021 (per 100K people)?",  
            "nonCovid": "By approximately how much did the number of insect-related pests increase from the week of December 13, 2021 to the week of December 20, 2021 (per 100 acres)?"  
        },
        "answer":3442 ,
        "options":["less than 2000", "between 2000 and 4000", "more than 4000"]
    },
    "moderate-bar-vlat-2":{
        "prompt":{
            "covid": "Approximately how many unvaccinated people caught Covid-19 (per 100K people) during the week of January 10, 2022?",  
            "nonCovid": "Approximately how many insect-related pests (per 100 acres) were there during the week of January 10, 2022?"  
        },
        "answer":6478,
        "options":[6500,7500,8500]
    },
    "complex-bar-vlat-1":{
        "prompt":{
            "covid": "Among vaccinated people, which age group sees the largest increase in case count between November 2021 and January 2022?",  
            "nonCovid": "Among fungi-related diseases, which specimen sees the largest increase in pests between November 2021 and January 2022?"  
        },
        "answer":"18-49 / Sclerotinia rots",
        "options":{"covid":["Ages 80+","Ages 50-79","Ages 18-49"],"nonCovid":["Black root rot", "Clubfoot","Sclerotinia rots"]}
    },
        "simple-line-vlat-1":{
            "prompt":{
                "covid": "How many covid cases were registered (per 100k people) in January 2022 for unvaccinated people?",  
                "nonCovid": "How many insect-related pests were registered (per 100 acres) in January 2022?"
            },
            "answer":3101,
            "options":[1400,3100,2200]
        },
        "simple-line-vlat-2":{
            "prompt":{
                "covid": "About how much did the number of covid cases in vaccinated people fall from January to February of 2022?",  
                "nonCovid": "About how much did the number of fungi-related pests fall from January to February of 2022?",  
            },
            "answer":1200,
            "options":[1200,2500,700]
        },
        "moderate-line-vlat-1":{
            "prompt":{
                "covid": "What was the range (max - min) of cases reported for unvaccinated individuals on Jan 15 2022?",  
                "nonCovid":"What was the range (max - min) of insect-related pest counts on Jan 15 2022?"  
            },
            "answer":1500,
            "options":[3500,1500, 2000]
        },
        "moderate-line-vlat-2":{
            "prompt":{
                "covid": "Which population had the most variability in case counts in August of 2021?",  
                "nonCovid": "Which disease type had the most variability in their pest counts in August of 2021?"  
            },
            "answer":"Unvaccinated / Insect-Related",
            "options":{"covid":["Unvaccinated","Vaccinated","Both were the same"],"nonCovid":["Insect-Related", "Fungi-Related","Both were the same"]}
        },
        "complex-line-vlat-1":{
            "prompt":{
                "covid": "In late December 2021, what age group of vaccinated people report a higher case count than unvaccinated people Ages 80+?",  
                "nonCovid":  "In late December 2022, what type of fungi-related disease had a higher pest count than the insect-related Mealybug?" 
            },
            "answer":"18-49 / Sclerotinia rots",
            "options":{"covid":["Ages 80+","Ages 50-79","Ages 18-49"],"nonCovid":["Black root rot", "Clubfoot","Sclerotinia rots"]}
        }
        
        }



// console.log(getVLATprompts('complex-line-vlat-1',true))