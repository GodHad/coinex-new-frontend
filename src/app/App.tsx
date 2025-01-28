'use client';

import { Sidebar } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { ReactNode, useContext } from "react";
import { ToastContainer } from "react-toastify";
import Providers from "./providers";
import AuthRoute from "@/components/AuthRoute";
import UserContext from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

const App = ({ children }: { children: ReactNode }) => {
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
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick={true}
                pauseOnHover={true}
                draggable={true}
                theme='colored'
            />
            {pathname.includes("/auth") ? (
                children
            ) : (
                <AuthRoute>
                    <div className="flex">
                        <Sidebar
                            currentPath={pathname}
                            isAdmin={true}
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
};

export default App;