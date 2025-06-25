
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode; // e.g., buttons in the card header
  icon?: React.ReactNode; // Added icon prop
}

const Card: React.FC<CardProps> = ({ title, children, className = '', actions, icon }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl overflow-hidden ${className}`}>
      {(title || actions || icon) && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center">
            {icon && <span className="mr-2 text-primary">{icon}</span>}
            {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
