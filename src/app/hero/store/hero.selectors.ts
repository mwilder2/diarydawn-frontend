import { createFeatureSelector, createSelector } from '@ngrx/store';
import { heroFeatureKey, HeroState } from './hero.reducer';

export const selectHeroState = createFeatureSelector<HeroState>(heroFeatureKey);

export const selectAllHeroes = createSelector(
  selectHeroState,
  (state: HeroState) => state.hero
);

export const selectSuperpowerById = (id: number) =>
  createSelector(
    selectHeroState,
    (state: HeroState) => state.hero[id]
  );

export const selectIsHeroLoading = createSelector(
  selectHeroState,
  (state: HeroState) => state.isHeroLoading
);

export const selectError = createSelector(
  selectHeroState,
  (state: HeroState) => state.error
);

export const selectImageUrl = createSelector(
  selectHeroState,
  (state: HeroState) => state.imageUrl
);