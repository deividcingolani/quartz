export const BASKET_SELECTION_HASH = '#basket';

export const isSelectionActive = (): boolean => {
  return window.location.hash.includes(BASKET_SELECTION_HASH);
};
