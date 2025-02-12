import { combineReducers, configureStore } from '@reduxjs/toolkit';
import selectedCardsReducer from './checkCards/selectedCardsSlice';
import { characterApiSlice } from './characters/charactersApiSlice';

const rootReducer = combineReducers({
  selectedCards: selectedCardsReducer,
  [characterApiSlice.reducerPath]: characterApiSlice.reducer,
});

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(characterApiSlice.middleware);
    },
    preloadedState,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
