import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/User';

const initialState: User = {
  id: null,
  username: null,
  token: null,
};

export const targetUserSlice = createSlice({
  name: 'targetUser',
  initialState,
  reducers: {
    setTargetUser: (
      state,
      action: PayloadAction<User>
    ) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.token = action.payload.token;
    },
    clearTargetUser: (state) => {
      state.id = null;
      state.username = null;
      state.token = null;
    },
  },
});

export const { setTargetUser, clearTargetUser } = targetUserSlice.actions;
export default targetUserSlice.reducer;
