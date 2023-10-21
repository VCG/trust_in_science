function createTour(type, steps, provData=null){
  if(!(['complex','moderate','simple'].includes(type))) return;

  let tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: {
        enabled: true
      },
      classes: 'class-1 class-2',
      scrollTo: {behavior: 'smooth', block: 'center'},
      modalOverlayOpeningPadding:'20', // padding around highlighted element
      popperOptions: { // moves tutorial box to the left
        modifiers: [{ name: 'offset', options: { offset: [0,  52] } }]
      }
    },
    exitOnEsc: false
  })

  startTour(tour, steps[type], provData)
}


function startTour(tour,steps, provData){
  for (i = 0; i < steps.length; i++) {
    btns = [];
    // no back button at the start
    if (i > 0) {
      btns.push({
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: function () {
          if(provData) provData.logEvent({
            time: Date.now(),
            label: 'tour_back',
            step: i
          })
          return tour.back();
        }
      });
    }
    // no next button on last step
    if (i != (steps.length - 1)) {
      btns.push({
        text: 'Next',
        classes: 'shepherd-button-primary '+steps[i].class+(steps[i].disabled ? ' disabled-button': ''),
        disabled: steps[i].disabled,
        action: function () {
          if(provData) provData.logEvent({
            time: Date.now(),
            label: 'tour_next',
            step: i
          })
          return tour.next();
        }
      });
    } else {
      btns.push({
        text: 'Close',
        classes: 'shepherd-button-primary',
        action: function () {
          if(provData) provData.logEvent({
            time: Date.now(),
            label: 'tour_end',
            step: i
          })
          return tour.hide();
        }
      });
    }

    let step = {
      id: 'step-'+i,
      attachTo: {
        element: steps[i].id,
        on: steps[i].location
      },
      text: steps[i].text,
      title: steps[i].title,
      buttons: btns,
      cancelIcon: {
        enabled: false
      }
    }

    tour.addStep(step);
  }

  if(provData) provData.logEvent({
    time: Date.now(),
    label: 'tour_started'
  })

  tour.start();
}