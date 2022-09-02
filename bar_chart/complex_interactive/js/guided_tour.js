const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: {
        enabled: true
      },
      classes: 'class-1 class-2',
      scrollTo: { behavior: 'smooth', block: 'center' }
    }
  });
  
  tour.addStep({
    title: 'This is a time filter',
    text: `You can use this filter to brush and select a subset of weeks.\
    Try creating a filter by click and dragging over a set of weeks. `,
    attachTo: {
      element: '.brush-label',
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
    ],
    id: 'creating'
  });

  tour.addStep({
    title: 'This is the Legend',
    text: `You can use this legend to highlight different age groups!\
    Try hovering over an age group to highlight that group.`,
    attachTo: {
      element: '.legend',
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
    ],
    id: 'creating'
  });
  
  tour.start();