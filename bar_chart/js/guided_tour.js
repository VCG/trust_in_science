function createTour(type){
  if(!(['complex','moderate','simple'].includes(type))) return;

  let steps=[], tour = new Shepherd.Tour({
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
    }
  });

  switch(type){
    case "complex": 
      steps.push([null, '','Bar Chart Tour','Before we show you the interactive bar chart, we will first guide you through the main components of the visualization.']);
      steps.push(['#chart', 'bottom','Bar Chart Visualization','This is the main visualization. Once you filter the data, all changes will directly show up here.<br> <b>Your turn:</b> Hover over a bar to see details about that bar.']);
      steps.push(['#time_filter_div', 'left','This is a time filter!','You can use this filter to brush and select a subset of weeks. Only the data of the selected weeks will be shown in the visualization.\
          <br> <b>Your turn:</b> Try creating a filter by clicking and dragging over a set of weeks.']);
      steps.push(['.legend', 'left', 'This is the legend.', 'You can use this legend to highlight different age groups!\
          <br> <b>Your turn:</b> Try hovering over an age group to highlight that group.<br><br> That\'s it, have fun exploring the data!']);
      startTour(tour,steps); 
      break;
    case "moderate":
      steps.push(['', '','Bar Chart Tour','Before we show you the interactive bar chart, we will first guide you through the main components of the visualization.']);
      steps.push(['#chart', 'bottom','Bar Chart Visualization','This is the main visualization.<br> <b>Your turn:</b> Hover over a bar to see details about that bar.']);
      steps.push(['.legend', 'left', 'This is the legend.', 'You can use this legend to highlight different age groups!\
          <br> <b>Your turn:</b> Try hovering over an age group to highlight that group.<br><br> That\'s it, have fun exploring the data!']);
      startTour(tour,steps); 
      break;
    default:
      steps.push(['', '','Bar Chart Tour','Before we show you the interactive bar chart, we will first guide you through the main components of the visualization.']);
      steps.push(['#chart', 'bottom','Bar Chart Visualization','This is the first of the two main visualizations.<br> <b>Your turn:</b> Hover over a bar to see details about that bar.']);
      steps.push(['#chart2', 'top','Bar Chart Visualization','This is the second of the two main visualizations.<br> <b>Your turn:</b> Hover over a bar to see details about that bar.']);
      steps.push(['.legend', 'left', 'This is the legend.', 'You can use this legend to highlight different age groups!\
          <br> <b>Your turn:</b> Try hovering over an age group to highlight that group.<br><br> That\'s it, have fun exploring the data!']);
      startTour(tour,steps); 
      break;
  }

  tour.start();
}


function startTour(tour,steps){
  for (i = 0; i < steps.length; i++) {
    btns = [];
    // no back button at the start
    if (i > 0) {
      btns.push({
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: function () {
          return tour.back();
        }
      });
    }
    // no next button on last step
    if (i != (steps.length - 1)) {
      btns.push({
        text: 'Next',
        classes: 'shepherd-button-primary',
        action: function () {
          return tour.next();
        }
      });
    } else {
      btns.push({
        text: 'Close',
        classes: 'shepherd-button-primary',
        action: function () {
          return tour.hide();
        }
      });
    }

    let step = {
      text: steps[i][3],
      title: steps[i][2],
      buttons: btns
    }

    if(steps[i][0]) step.attachTo = {
      element: steps[i][0],
      on: steps[i][1]
    }

    tour.addStep(step);
  }
}



/*
tour.addStep({
  title: 'Bar Chart Tour',
  text: 'Before we show you the interactive bar chart, we will first guide you through the main components of the visualization.',
  buttons: [
        {
          action() {
            return this.back();
          },
          classes: 'shepherd-button-secondary',
          text: 'Back'
        },
        {
          action() {
            return this.next();
          },
          text: 'Next'
        }
      ]
    });


  tour.addStep({
    title: 'This is a time filter!',
    text: `You can use this filter to brush and select a subset of weeks. Only the data of the selected weeks will be shown in the visualization.\
    Try creating a filter by clicking and dragging over a set of weeks. `,
    attachTo: {
      element: '#time_filter_div',
      on: 'left'
    },
    modalOverlayOpeningPadding:'20',
    popperOptions: {
        modifiers: [{ name: 'offset', options: { offset: [0,  52] } }]
      },
    buttons: [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        action() {
          return this.next();
        },
        text: 'Next'
      }
    ]
  });



  tour.addStep({
    title: 'This is the legend.',
    text: `You can use this legend to highlight different age groups!\
    Try hovering over an age group to highlight that group.`,
    attachTo: {
      element: '.legend',
      on: 'left'
    },
    //modalOverlayOpeningPadding:'20',
    //popperOptions: {
    //    modifiers: [{ name: 'offset', options: { offset: [0,  52] } }]
    //  },
    buttons: [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        action() {
          return this.next();
        },
        text: 'Next'
      }
    ]
  });
*/


  // tour.start();