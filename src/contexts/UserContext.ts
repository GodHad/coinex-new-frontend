"use client"
import { createContext } from 'react';

export type User = {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userMode: string;
    isAdmin?: boolean;
    subscribed?: number;
    subscribeEndDate?: Date;
    status?: number;
    inviteCode?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

type UserContextType = {
    user: User | null;
    setUser: (value: User | null) => void;

    login: boolean;
    setLogin: (value: boolean) => void;

    isLoading: boolean;
    setIsLoading: (value: boolean) => void;

    jwtToken: string;
    setJwtToken: (value: string) => void;
};

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},

    login: false,
    setLogin: () => {},

    isLoading: false,
    setIsLoading: () => {},

    jwtToken: '',
    setJwtToken: () => {}
})

export default UserContext;