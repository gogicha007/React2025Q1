import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import selectedCardsReducer from './features/pickCards/selectedCardsSlice';
import { characterApiSlice } from './features/characters/charactersApiSlice';

const rootReducer = combineReducers({
  selectedCards: selectedCardsReducer,
  [characterApiSlice.reducerPath]: characterApiSlice.reducer,
});

export function setupStore(preloadedState?: Partial<RootState>) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(characterApiSlice.middleware),
    preloadedState,
  });
  setupListeners(store.dispatch)
  return store
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
