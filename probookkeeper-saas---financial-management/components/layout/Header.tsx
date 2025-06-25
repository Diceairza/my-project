import React from 'react';
import { useLocation } from 'react-router-dom';
import { BellIcon, UserCircleIcon, LogOutIcon } from '../icons/LucideIcons';
import { User, ModuleInfo } from '../../types';
import { APP_MODULES } from '../../constants';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  const location = useLocation();

  const getPageTitle = () => {
    // Match the current path to a module name
    const currentPath = location.pathname;
    if (currentPath === '/login') return "Login";

    // Handle nested routes like /invoicing/quotes by checking base path
    const baseModulePath = `/${currentPath.split('/')[1]}`;
    const module = APP_MODULES.find(m => m.path === baseModulePath);
    
    if (module) return module.name;
    if (currentPath.startsWith('/pay/')) return "Invoice Payment"; // Specific case for payment page
    
    // Default or fallback title
    return "Bookkeeping"; 
  };
  
  const pageTitle = getPageTitle();

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 border-b border-gray-200">
      <div>
        <h2 className="text-lg font-semibold text-gray-700">{pageTitle}</h2>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-primary focus:outline-none" aria-label="Notifications">
          <BellIcon className="w-6 h-6" />
        </button>
        {currentUser && (
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="w-8 h-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{currentUser.fullName}</span>
            <button
              onClick={onLogout}
              className="p-1.5 text-gray-500 hover:text-red-600 focus:outline-none rounded-md hover:bg-red-50 transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOutIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
