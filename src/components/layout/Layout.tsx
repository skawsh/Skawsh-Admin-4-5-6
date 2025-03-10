
import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeSection }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-laundry-gray">
      <Sidebar activeSection={activeSection} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 animate-section-transition">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
