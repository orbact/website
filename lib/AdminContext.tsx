import React, { createContext, useContext, useEffect, useState } from 'react';
import { adminAuth } from './adminAuth';

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
  refreshAdmin: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  loading: true,
  refreshAdmin: async () => false,
});

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(adminAuth.isAdmin());
  const [loading, setLoading] = useState(true);

  const refreshAdmin = async () => {
    setLoading(true);
    const result = await adminAuth.checkAdmin();
    setIsAdmin(result);
    setLoading(false);
    return result;
  };

  useEffect(() => {
    refreshAdmin();
    const { data } = adminAuth.onAuthStateChange((nextIsAdmin) => {
      setIsAdmin(nextIsAdmin);
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, loading, refreshAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
