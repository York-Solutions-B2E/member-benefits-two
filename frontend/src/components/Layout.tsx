import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  userName?: string;
  showBreadcrumb?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  pageTitle, 
  userName,
  showBreadcrumb = true 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        pageTitle={pageTitle}
        displayName={userName}
        showBreadcrumb={showBreadcrumb}
      />
      {children}
    </div>
  );
};

export default Layout;
