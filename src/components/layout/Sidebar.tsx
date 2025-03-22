
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building, 
  Package, 
  Car, 
  ClipboardList, 
  BarChart2, 
  IndianRupee, 
  Users, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || activeSection === path.substring(1);
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Studios', icon: Building, path: '/studios' },
    { name: 'Services', icon: Package, path: '/services' },
    { name: 'Drivers', icon: Car, path: '/drivers' },
    { name: 'Orders', icon: ClipboardList, path: '/orders' },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' },
    { name: 'Revenue', icon: IndianRupee, path: '/revenue' },
    { name: 'Users', icon: Users, path: '/users' },
    { name: 'Feedback', icon: MessageSquare, path: '/feedback' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div 
      className={`relative flex flex-col bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[70px]' : 'w-[250px]'
      }`}
    >
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-gray-100`}>
        {!collapsed && (
          <Link to="/" className="text-xl font-bold text-laundry-blue transition-all hover:text-laundry-blue-dark">
            Admin Panel
          </Link>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-all"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`nav-item mx-2 ${isActive(item.path) ? 'active' : ''} ${
              collapsed ? 'justify-center !px-2' : ''
            }`}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-laundry-blue to-blue-600 text-white font-medium shadow-md">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@example.com</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-laundry-blue to-blue-600 text-white font-medium shadow-md">
              A
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
