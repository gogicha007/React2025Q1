import { configureStore, Reducer } from '@reduxjs/toolkit';
import selectedCardsReducer from '../../../state/checkCards/selectedCardsSlice';
import { RootState } from '../../../state/store';

export const mockStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: {
      selectedCards: selectedCardsReducer as Reducer,
    },
    preloadedState: preloadedState ?? { selectedCards: { selectedCards: [] } },
  });

export type AppStore = ReturnType<typeof mockStore>;
