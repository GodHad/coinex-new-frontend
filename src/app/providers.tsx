'use client'

import UserContext, { User } from "@/contexts/UserContext";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [login, setLogin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [jwtToken, setJwtToken] = useState<string>('');

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                login,
                setLogin,
                isLoading,
                setIsLoading,
                jwtToken,
                setJwtToken
            }}
        >
            {children}
        </UserContext.Provider>
    )
}