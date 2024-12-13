import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { HeroActions } from '..';
import { Hero } from '../models/hero.models';

export const heroFeatureKey = 'hero';

export interface HeroState {
  hero: Hero[];
  isHeroLoading: boolean;
  imageUrl: string | null;
  error: string | null;
}

export const initialHeroState: HeroState = {
  hero: [],
  isHeroLoading: false,
  imageUrl: null,
  error: null,
};

// hero.reducer.ts
export const reducer = createReducer(
  initialHeroState,
  on(HeroActions.setHero, (state, { superPowers }) => ({
    ...state,
    hero: superPowers,
  })),
  on(HeroActions.resetHeroState, (state) => ({
    ...state,
    ...initialHeroState,
  })),
  on(HeroActions.initiateHeroGeneration, (state) => {
    return {
      ...state,
      isHeroLoading: false,
    }
  }
  ),
  on(HeroActions.heroGenerationFailed, (state, { error }) => ({
    ...state,
    error,
    isHeroLoading: false,
  })),
  on(HeroActions.heroGenerationInitiated, (state, { message }) => ({
    ...state,
    error: message,
    isHeroLoading: true,
  })),
  on(HeroActions.setErrorMessage, (state, { errorMessage }) => ({
    ...state,
    errorMessage: errorMessage,
  })),
  on(HeroActions.clearErrorMessage, (state) => ({
    ...state,
    errorMessage: null,
  })),
  on(HeroActions.setIsHeroLoading, (state, { isHeroLoading: isHeroLoaded }) => ({
    ...state,
    isHeroLoading: isHeroLoaded,
  })
  ),
  on(HeroActions.setHero, (state, { superPowers: superPowers }) => ({
    ...state,
    superPowers,
  })),
  on(HeroActions.fetchHero, (state) => {
    return {
      ...state,
      isHeroLoading: false,
    }
  }),
  on(HeroActions.fetchHeroSuccess, (state, { superPowers: superPowers }) => {
    return {
      ...state,
      hero: superPowers,
      isHeroLoading: true,
    }
  }),
  on(HeroActions.fetchHeroFailure, (state, { error }) => ({
    ...state,
    isHeroLoading: false,
    error,
  })
  ),
  on(HeroActions.deleteSuperPower, (state) => ({
    ...state,
  })),
  on(HeroActions.deleteSuperPowerSuccess, (state, { superPowerId: superPowerId }) => ({
    ...state,
    entities: state.hero.filter((superPower) => superPower.id !== superPowerId),
  })),
  on(HeroActions.deleteSuperPowerFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(HeroActions.clearHero, (state) => ({
    ...state,
    hero: [],
  }),
  ),
  on(HeroActions.emailHero, (state) => ({
    ...state,
  })),
  on(HeroActions.emailHeroSuccess, (state, { imageUrl }) => ({
    ...state,
    imageUrl: imageUrl,
  })
  ),
  on(HeroActions.emailHeroFailure, (state, { error }) => ({
    ...state,
    error,
  }),
  ),
  on(HeroActions.noop, (state) => ({
    ...state,
  }),
  ),
);


export function heroReducer(state: HeroState | undefined, action: Action) {
  // return logger(reducer(state, action), action);
  return reducer(state, action);
}

export function logger(state: HeroState | undefined, action: Action) {
  console.log('Hero state', state);
  console.log('Hero action', action);

  return reducer(state, action);
}