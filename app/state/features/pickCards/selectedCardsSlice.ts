import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction, Reducer } from '@reduxjs/toolkit';

interface SelectedCardsState {
  selectedCards: number[];
}

const initialState: SelectedCardsState = {
  selectedCards: [],
};

const selectedCardsSlice = createSlice({
  name: 'selectedCards',
  initialState,
  reducers: {
    toggleCardSelection: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.selectedCards.includes(id)) {
        state.selectedCards = state.selectedCards.filter(
          (cardId) => cardId !== id
        );
      } else {
        state.selectedCards.push(id);
      }
    },

    clearSelection: (state) => {
      state.selectedCards = [];
    },
  },
});

export const { toggleCardSelection, clearSelection } =
  selectedCardsSlice.actions;
export default selectedCardsSlice.reducer as Reducer<SelectedCardsState>;
