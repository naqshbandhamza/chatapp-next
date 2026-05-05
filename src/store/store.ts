import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './slices/userSlice'; // Adjust path as needed
import { targetUserSlice } from './slices/targetUserSlice';
import { chatSlice } from './slices/chatSlice';
import { selectedChatSlice } from './slices/selectedChat';

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice.reducer,
      targetUser: targetUserSlice.reducer,
      chats:chatSlice.reducer,
      selectedChat:selectedChatSlice.reducer
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']