'use client';

import { Sidebar } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { ReactNode, useContext } from "react";
import Providers from "./providers";
import AuthRoute from "@/components/AuthRoute";
import UserContext from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

interface Props {
    children: ReactNode;
    socialLinks: {
        twitter?: string;
        telegram?: string;
        discord?: string;
        instagram?: string;
    }
}

export default function App({ children, socialLinks }: Props) {
    const pathname = usePathname();

    const { setUser } = useContext(UserContext);
    const router = useRouter();

    const handleLogout = () => {
        setUser(null);
        window.localStorage.removeItem('jwtToken');
        router.push('/auth/sign-in');
    }

    return (
        <Providers>
            {pathname.includes("/auth") ? (
                children
            ) : (
                <AuthRoute>
                    <div className="flex">
                        <Sidebar
                            socialLinks={socialLinks}
                            currentPath={pathname}
                            onLogout={handleLogout}
                        />
                        <main className="flex-1 ml-64 bg-gray-50 min-h-screen">
                            {children}
                        </main>
                    </div>
                </AuthRoute>
            )}
        </Providers>
    );
}