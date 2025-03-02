'use client'

import AdminDataContext from "@/contexts/AdminContext";
import UserContext, { User } from "@/contexts/UserContext";
import { AdminData } from "@/types/admin-data";
import { getCookie, loginWithJWT } from "@/utils/api";
import { useEffect, useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [login, setLogin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [jwtToken, setJwtToken] = useState<string>('');
    const [adminData, setAdminData] = useState<AdminData | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            const token = getCookie("jwtToken");

            if (token && !user) {
                try {
                    const result = await loginWithJWT();
                    if (result) {
                        setUser(result.user);
                        window.localStorage.setItem("jwtToken", result.token);
                        setJwtToken(result.token);
                    }
                } catch (error) {
                    console.error("JWT validation failed:", error);
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

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