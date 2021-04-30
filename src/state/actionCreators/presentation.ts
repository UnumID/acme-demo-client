import { FeathersError } from '@feathersjs/errors';
import { DemoPresentationDto, DemoNoPresentationDto } from '@unumid/demo-types';
import { Dispatch } from 'redux';

import {
  NoPresentationSharedSuccessAction,
  PresentationSharedErrorAction,
  ResetPresentationStateAction
} from '../actions/presentation';
import { PresentationActionType } from '../actionTypes/presentation';
import { login } from './auth';

export const handlePresentationShared = (dto: DemoPresentationDto) => async (dispatch: Dispatch): Promise<void> => {
  const email = dto.presentation.verifiableCredentials[0].credentialSubject.userEmail;
  await login({ email, password: 'password' })(dispatch);
  dispatch({ type: PresentationActionType.PRESENTATION_SHARED_SUCCESS, payload: dto });
};

export const handleNoPresentationShared = (dto: DemoNoPresentationDto): NoPresentationSharedSuccessAction =>
  ({ type: PresentationActionType.NOPRESENTATION_SHARED_SUCCESS, payload: dto });

export const handlePresentationSharedError = (err: FeathersError): PresentationSharedErrorAction =>
  ({ type: PresentationActionType.PRESENTATION_SHARED_ERROR, payload: err });

export const resetPresentationState = (): ResetPresentationStateAction =>
  ({ type: PresentationActionType.RESET_PRESENTATION_STATE });
