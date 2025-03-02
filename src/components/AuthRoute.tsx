'use client';

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserContext from "@/contexts/UserContext";
import { ReactNode } from "react";

const AuthRoute = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        console.log(user, isLoading)
        if (!user && !isLoading) {
            router.push('/auth/sign-in');
        }
    }, [user, isLoading, router]);

    if (user) {
        return <>{children}</>;
    }

    return null;
};

export default AuthRoute;
