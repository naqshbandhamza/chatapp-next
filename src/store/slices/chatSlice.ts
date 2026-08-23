// store/slices/chatSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat } from '@/types/chatTypes';
import { Message } from '@/types/chatTypes';

interface ChatState {
  chats: Chat[];
  loading: boolean;
  error: string | null;
  messages: Message[];
}

const initialState: ChatState = {
  chats: [],
  loading: false,
  error: null,
  messages: []
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<Chat[]>) {

      state.chats = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearChats(state) {
      state.chats = [];
      state.error = null;
      state.loading = false;
    },
    updateMessages(state, action: PayloadAction<Message[]>) {
      state.messages = [...state.messages, ...action.payload];
    },
    updateChats(state, action: PayloadAction<Message>) {
      const newMessage = action.payload;
      console.log("new msg: ", newMessage)

      let tttt: any = newMessage.chat;
      // Find the index of the chat this message belongs to
      const chatIndex = state.chats.findIndex(chat => chat.chat_id === parseInt(tttt));

      if (chatIndex !== -1) {
        // Update latest_message
        state.chats[chatIndex].latest_message = newMessage;

        // Move chat to the top of the list
        const updatedChat = state.chats.splice(chatIndex, 1)[0];
        state.chats.unshift(updatedChat);
      } else {
        console.warn('Chat not found for message:', newMessage.chat);
      }
    },
    updateChatsReadStatus(state, action: PayloadAction<any>) {

      let chatid = action.payload.chat_id;
      if (typeof chatid !== 'number')
        chatid = parseInt(chatid)
      // Find the index of the chat this message belongs to
      const chatIndex = state.chats.findIndex(chat => chat.chat_id === chatid)

      if (chatIndex !== -1) {
        // Update latest_message 
        state.chats[chatIndex].read_status.last_read_message_id = state.chats[chatIndex].latest_message?.message_id;
      }
    },
    appendChat(state, action: PayloadAction<Chat>) {
      const newChat = action.payload;
      state.chats = [newChat, ...state.chats]
    },
  },
});

export const { setChats, setLoading, setError, clearChats, updateChats, appendChat, updateChatsReadStatus, updateMessages } = chatSlice.actions;
export default chatSlice.reducer;
