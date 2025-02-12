import { configureStore, Reducer } from '@reduxjs/toolkit';
import selectedCardsReducer from '../../../state/checkCards/selectedCardsSlice';
import { characterApiSlice } from '../../../state/characters/charactersApiSlice';
import { RootState } from '../../../state/store';

export const mockStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: {
      selectedCards: selectedCardsReducer as Reducer,
      [characterApiSlice.reducerPath]: characterApiSlice.reducer as Reducer,
    },
    preloadedState: preloadedState ?? { selectedCards: { selectedCards: [] } },
  });

export type AppStore = ReturnType<typeof mockStore>;
