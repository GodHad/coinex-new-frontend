'use client';

import { Sidebar } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { ReactNode, useContext } from "react";
import Providers from "@/contexts/Provider";
import AuthRoute from "./AuthRoute";
import UserContext from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

interface Props {
    children: ReactNode;
    socialLinks: {
        twitter?: string;
        telegram?: string;
        discord?: string;
        instagram?: string;
    },
    sidebarTitle: string;
}

export default function App({ children, socialLinks, sidebarTitle }: Props) {
    const pathname = usePathname();

    const { setUser } = useContext(UserContext);
    const router = useRouter();

    const handleLogout = () => {
        setUser(null);
        window.localStorage.removeItem('jwtToken');
        document.cookie = `jwtToken=''; path=/; Secure;`;
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
                            sidebarTitle={sidebarTitle}
                            socialLinks={socialLinks}
                            currentPath={pathname}
                            onLogout={handleLogout}
                        />
                        <main className="flex-1 md:ml-64 bg-gray-50 min-h-screen md:pt-0 pt-8">
                            {children}
                        </main>
                    </div>
                </AuthRoute>
            )}
        </Providers>
    );
}