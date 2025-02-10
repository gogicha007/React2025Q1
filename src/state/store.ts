import { combineReducers, configureStore } from '@reduxjs/toolkit';
import selectedCardsReducer from './checkCards/selectedCardsSlice';

const rootReducer = combineReducers({
  selectedCards: selectedCardsReducer,
});

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
