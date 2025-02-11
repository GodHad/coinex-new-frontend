'use client'

import AdminDataContext from "@/contexts/AdminContext";
import UserContext, { User } from "@/contexts/UserContext";
import { AdminData } from "@/types/admin-data";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [login, setLogin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [jwtToken, setJwtToken] = useState<string>('');
    const [adminData, setAdminData] = useState<AdminData | null>(null);
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
            <AdminDataContext.Provider
                value={{
                    adminData,
                    setAdminData
                }}
            >
                {children}
            </AdminDataContext.Provider>
        </UserContext.Provider>
    )
}