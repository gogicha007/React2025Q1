'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { setupStore, AppStore } from '../state/store';
import { characterApiSlice } from '../state/features/characters/charactersApiSlice';

const store = setupStore();
store.dispatch(characterApiSlice.util.invalidateTags(['Characters']));

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(setupStore()).current;

  return <Provider store={storeRef}>{children}</Provider>;
}
