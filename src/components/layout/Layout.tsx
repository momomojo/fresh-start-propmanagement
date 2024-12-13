import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../lib/store';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, sidebarOpen } = useSelector((state: RootState) => state.ui);

  return (
    <div className="min-h-screen">
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex flex-col flex-1 w-full">
          <Navbar />
          <main className="h-full overflow-y-auto p-4">
            <div className="container mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;