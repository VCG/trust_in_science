class ProvenanceData {
    constructor(visType, complexity){
        this.startTime = Date.now();
        this.visType = visType;
        this.complexity = complexity;
        this.provenance = [];
    }

    logEvent(eventData){
        if(eventData.time) eventData.time -= this.startTime;
        this.provenance.push(eventData);
    }

    getProvenance(){
        return {
            startTime: this.startTime,
            visType: this.visType,
            complexity: this.complexity,
            provenance: this.provenance
        };
    }
}

function trackFocus(provData){
    window.onfocus = function(){
        provData.logEvent({
            label: 'window_focused',
            time: Date.now()
        })
    }

    window.onblur = function(){
        provData.logEvent({
            label: 'window_blurred',
            time: Date.now()
        })
    }
}