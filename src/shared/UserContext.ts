import { createContext } from 'react';
import { User } from './interfaces';

export const UserContext = createContext<User | undefined>(undefined);
