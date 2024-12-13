import { createAction, props } from '@ngrx/store';
import { Hero as Superpower } from '../models/hero.models';

export const resetHeroState = createAction('[Hero] Reset Hero State');

export const initiateHeroGeneration = createAction(
  '[Hero Info Dialog] Initiate Hero Generation',
  props<{ bookId: number }>()
);

export const heroGenerationInitiated = createAction(
  '[Hero] Hero Generation Initiated',
  props<{ message: string }>()
);


export const heroGenerationFailed = createAction(
  '[Hero] Hero Generation Failed',
  props<{ error: any }>()
);

export const setErrorMessage = createAction(
  '[Hero] Set Error Message',
  props<{ errorMessage: string }>()
);

export const clearErrorMessage = createAction('[Hero] Clear Error Message');

export const setIsHeroLoading = createAction(
  '[Hero] Set Is Hero Loaded',
  props<{ isHeroLoading: boolean }>()
);

export const setHero = createAction(
  '[Hero] Set Hero',
  props<{ superPowers: Superpower[] }>()
);

export const fetchHero = createAction(
  '[Hero] Fetch Hero'
);

export const fetchHeroSuccess = createAction(
  '[Hero] Fetch Hero Success',
  props<{ superPowers: Superpower[] }>()
);

export const fetchHeroFailure = createAction(
  '[Hero] Fetch Hero Failure',
  props<{ error: any }>()
);

export const deleteSuperPower = createAction(
  '[Hero] Delete SuperPower',
  props<{ superPowerId: number }>()
);
export const deleteSuperPowerSuccess = createAction(
  '[Hero] Delete SuperPower Success',
  props<{ superPowerId: number }>()
);

export const deleteSuperPowerFailure = createAction(
  '[Hero] Delete SuperPower Failure',
  props<{ error: any }>()
);

export const emailHero = createAction('[Hero] Email Hero Results',
  props<{ bookId: number }>()
);

export const emailHeroSuccess = createAction('[Hero] Email Hero Results Success',
  props<{ imageUrl: string }>()
);

export const emailHeroFailure = createAction(
  '[Hero] Email Hero Results Failure',
  props<{ error: any }>()
);

export const clearHero = createAction('[Hero] Clear Hero');


export const noop = createAction('[Hero] No Operation');
