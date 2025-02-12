import { configureStore } from '@reduxjs/toolkit';
// import { Store } from '@reduxjs/toolkit';
import { RootState } from '../../../state/store';

export function setupApiStore<T>(api: T, preloadedState?: Partial<RootState>) {
  const store = configureStore({
    reducer: { [(api as any).reducerPath]: (api as any).reducer },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat((api as any).middleware),
  });
  return { store };
}
