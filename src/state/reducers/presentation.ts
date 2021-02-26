import { FeathersError } from '@feathersjs/errors';
import { DemoPresentationDto, DemoNoPresentationDto } from '@unumid/demo-types';

import { PresentationAction } from '../actions/presentation';
import { PresentationActionType } from '../actionTypes/presentation';

export interface PresentationState {
  sharedPresentation: DemoPresentationDto | null;
  sharedNoPresentation: DemoNoPresentationDto | null;
  error: FeathersError | null;
}

export const initialState:PresentationState = {
  sharedPresentation: null,
  sharedNoPresentation: null,
  error: null
};

const reducer = (
  state: PresentationState = initialState,
  action: PresentationAction
): PresentationState => {
  switch (action.type) {
    case PresentationActionType.PRESENTATION_SHARED_SUCCESS:
      return { sharedPresentation: action.payload, sharedNoPresentation: null, error: null };
    case PresentationActionType.NOPRESENTATION_SHARED_SUCCESS:
      return { sharedPresentation: null, sharedNoPresentation: action.payload, error: null };
    case PresentationActionType.PRESENTATION_SHARED_ERROR:
      return { sharedPresentation: null, sharedNoPresentation: null, error: action.payload };
    default: return state;
  }
};

export default reducer;
