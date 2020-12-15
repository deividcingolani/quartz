import { RootState } from '../../index';

export const selectSchematisedTags = (state: RootState) =>
  state.schematisedTags;

export const selectSchematisedTagListLoading = (state: RootState) =>
  state.loading.effects.schematisedTags.fetch;

export const selectSchematisedTagView = (state: RootState) =>
  state.schematisedTagView;

export const selectSchematisedTagViewLoading = (state: RootState) =>
  state.loading.effects.schematisedTagView.get;

export const selectSchematisedTagCreate = (state: RootState) =>
  state.loading.effects.schematisedTagView.create;

export const selectSchematisedTagEdit = (state: RootState) =>
  state.loading.effects.schematisedTagView.edit;
