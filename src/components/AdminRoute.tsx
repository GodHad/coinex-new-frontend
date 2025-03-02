'use client';

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserContext from "@/contexts/UserContext";
import { ReactNode } from "react";

const AdminRoute = ({ children }: { children: ReactNode }) => {
    const { user } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (!user || !user.isAdmin) {
            router.push('/auth/sign-in');
        }
    }, [user, router]);

    if (user && user.isAdmin) {
        return <>{children}</>;
    }

    return null;
};

export default AdminRoute;
