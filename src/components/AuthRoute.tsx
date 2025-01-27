'use client';

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserContext from "@/contexts/UserContext";
import { ReactNode } from "react";

const AuthRoute = ({ children }: { children: ReactNode }) => {
    const { user } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/auth/sign-in');
        }
    }, [user, router]);

    if (user) {
        return <>{children}</>;
    }

    return null;
};

export default AuthRoute;
