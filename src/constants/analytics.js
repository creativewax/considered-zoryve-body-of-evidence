// RAMP analytics event taxonomy
// Deliberately decoupled from EventSystem.EVENTS: RAMP is an external host and
// its event names must not be tied to internal event naming or renaming.

export const ANALYTICS_EVENTS = {
  GET_STARTED: 'getStarted',
  FILTER_SELECTED: 'filterSelected',
  FILTER_DESELECTED: 'filterDeselected',
  FILTERS_RESET: 'filtersReset',
  CAROUSEL_NAVIGATION: 'carouselNavigation',
  PATIENT_SELECTED: 'patientSelected',
  PATIENT_DESELECTED: 'patientDeselected',
  PATIENT_IMAGE_SELECTED: 'patientImageSelected',
  PATIENT_IMAGE_NAVIGATION: 'patientImageNavigation',
  PATIENT_IMAGE_CLOSED: 'patientImageClosed',
  REFERENCES_OPENED: 'referencesOpened',
  REFERENCES_CLOSED: 'referencesClosed',
  ISI_OPENED: 'isiOpened',
  ISI_CLOSED: 'isiClosed',
  APP_CLOSED: 'appClosed',
}
