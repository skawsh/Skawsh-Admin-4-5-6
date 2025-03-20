
import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  noScroll?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeSection, noScroll = false }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-laundry-gray">
      <Sidebar activeSection={activeSection} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        {noScroll ? (
          <main className="flex-1 p-6 animate-section-transition">
            {children}
          </main>
        ) : (
          <ScrollArea className="flex-1">
            <main className="p-6 animate-section-transition">
              {children}
            </main>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default Layout;
