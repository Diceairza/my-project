
import React from 'react';
import Card from '../components/ui/Card';
import { APP_MODULES } from '../constants'; // To get icon

interface PlaceholderPageProps {
  moduleName: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ moduleName }) => {
  const moduleInfo = APP_MODULES.find(m => m.name === moduleName);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Card className="max-w-md w-full">
        {moduleInfo && React.isValidElement(moduleInfo.icon) && React.cloneElement(moduleInfo.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: "w-16 h-16 text-primary mx-auto mb-4" })}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{moduleName}</h1>
        <p className="text-gray-600 mb-6">This module is currently under construction.</p>
        <p className="text-sm text-gray-500">
          We're working hard to bring you this feature. Please check back later!
        </p>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
