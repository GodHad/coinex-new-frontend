"use client"
import { AdminData } from '@/types/admin-data';
import { createContext } from 'react';

type AdminDataContextType = {
    adminData: AdminData | null;
    setAdminData: (value: AdminData | null) => void;
};

const AdminDataContext = createContext<AdminDataContextType>({
    adminData: null,
    setAdminData: () => {},
})

export default AdminDataContext;