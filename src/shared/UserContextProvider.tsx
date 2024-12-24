'use client';
import { ReactNode } from 'react';
import { User } from './interfaces';
import { UserContext } from './UserContext';

interface UserContextProviderProps {
  children: ReactNode,
  user?: User,
}

export default function UserContextProvider({ children, user }: UserContextProviderProps) {
  return (
    <UserContext value={user}>
      {children}
    </UserContext>
  );
}
