import { createContext, useContext } from 'react';

interface AdminContextType {
    isAdmin: boolean;
}

export const AdminContext = createContext<AdminContextType>({ isAdmin: false });

export const useAdmin = () => useContext(AdminContext);
