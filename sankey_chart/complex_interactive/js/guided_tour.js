const tour = new Shepherd.Tour({
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


var steps =[];

steps.push(['', '','Sankey Chart Tour','Before we show you the interactive Sankey chart, we will first guide you through the main components of the visualization.']);
steps.push(['#chart', '','Sankey Chart Visualization','This is the main visualization. You can see how vaccine hesitancy changed over time. Once you filter the data, all changes will directly show up here. <br> <b>Your turn:</b> Hover over the visualization to see details about a certain categories.']);
steps.push(['#chart', '','Sankey Chart Visualization!','If you click on a bar, you can see how this group split up in the next time step.\
   <br> <b>Your turn:</b> Try clicking on a bar to see details. Once you are done, click the bar again to reset the visualization.']);
steps.push(['#sankey_legend', 'left', 'This is the legend.', 'You can use this legend to highlight different vaccine hesitance groups!\
    <br> <b>Your turn:</b> Try hovering over a group to highlight that group in the visualization.<br><br> That\'s it, have fun exploring the data!']);



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

  tour.addStep({
    text: steps[i][3],
    title: steps[i][2],
    attachTo: {
      element: steps[i][0],
      on: steps[i][1],
    },
    //classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
    buttons: btns,
  });
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


  tour.start();