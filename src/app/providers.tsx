'use client';

import { ReactNode, useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store/store';
import { User } from '@/types/User';
import { setUser } from '@/store/slices/userSlice';
import { setChats } from '@/store/slices/chatSlice';
import { Chat } from '@/types/chatTypes';
import React from 'react';


const store = makeStore();

export function Providers({ children, user, currentChats }: { children: ReactNode, user: User, currentChats: Chat[] }) {

  if (user?.id) {
    store.dispatch(setUser(user));
    store.dispatch(setChats(currentChats));
  }

  return <Provider store={store}>{children}</Provider>;
}
