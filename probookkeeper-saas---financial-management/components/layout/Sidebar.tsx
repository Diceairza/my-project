
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ModuleInfo } from '../../types';
import { APP_NAME } from '../../constants';
import { ZapIcon } from '../icons/LucideIcons'; // Example app icon

interface SidebarProps {
  modules: ModuleInfo[];
}

const Sidebar: React.FC<SidebarProps> = ({ modules }) => {
  return (
    <div className="w-64 bg-neutral-dark text-white flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-neutral-dark shadow-md">
        <ZapIcon className="w-8 h-8 text-primary mr-2" />
        <h1 className="text-xl font-semibold">{APP_NAME.split(' ')[0]}</h1> 
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {modules.map((module) => (
          <NavLink
            key={module.id}
            to={module.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
              ${isActive 
                ? 'bg-primary text-white shadow-lg' 
                : 'text-gray-300 hover:bg-neutral-dark hover:text-white hover:bg-opacity-75'
              }`
            }
          >
            {module.icon}
            <span>{module.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-neutral-dark">
        <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} {APP_NAME}</p>
      </div>
    </div>
  );
};

export default Sidebar;
