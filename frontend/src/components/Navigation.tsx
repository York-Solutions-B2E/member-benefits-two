import { useAuth } from 'contexts/AuthContext';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationProps {
  pageTitle: string;
  displayName?: string;
  showBreadcrumb?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  pageTitle, 
  displayName,
  showBreadcrumb = true 
}) => {
  const { user, member } = useAuth();

  const finalDisplayName = displayName || ( user ? `${user.email}` : 'User')
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = (): void => {
    window.location.href = 'http://localhost:8080/logout';
  };

  const handleNavigation = (path: string): void => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Generate breadcrumb based on current path
  const getBreadcrumb = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [];

    // Always start with Dashboard
    breadcrumbItems.push({
      label: 'Dashboard',
      path: '/dashboard',
      isActive: location.pathname === '/dashboard'
    });

    // Add Claims if we're on claims pages
    if (pathSegments.includes('claims')) {
      breadcrumbItems.push({
        label: 'Claims',
        path: '/claims',
        isActive: location.pathname === '/claims'
      });

      // Add Claim Detail if we're viewing a specific claim
      if (pathSegments.length > 1 && pathSegments[1] !== 'claims') {
        breadcrumbItems.push({
          label: 'Claim Detail',
          path: location.pathname,
          isActive: true
        });
      }
    }

    return breadcrumbItems;
  };

  const breadcrumbItems = getBreadcrumb();


  // Use member's name if available, otherwise fall back to email or displayName prop
  const getUserDisplayName = () => {
    if (member?.firstName && member?.lastName) {
      return `${member.firstName} ${member.lastName}`;
    }
    if (displayName) {
      return displayName;
    }
    if (user?.email) {
      return user.email;
    }
    return 'User';
  };

  const getUserInitials = () => {
    if (member?.firstName && member?.lastName) {
      return `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.split('@')[0].slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="bg-white rounded-xl shadow-lg mx-4 mt-4 mb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          
          {/* Left side - Brand/Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('/dashboard')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
            >
              {/* Brand Icon */}
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              {/* Brand Text */}
              <span className="text-xl font-semibold text-gray-900">
                Member Benefits
              </span>
            </button>
          </div>

          {/* Center - Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleNavigation('/dashboard')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/dashboard'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {/* Dashboard Icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleNavigation('/claims')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname.startsWith('/claims')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {/* Claims Icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Claims</span>
            </button>
          </nav>

          {/* Right side - User actions */}
          <div className="flex items-center space-x-4">
           

            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {getUserInitials()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
              </div>
            </div>

            {/* Sign out button */}
            <button
              onClick={handleSignOut}
              className="p-2 text-rose-600 hover:text-rose-900rounded-lg transition-colors duration-200"
              title="Sign out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        {showBreadcrumb && breadcrumbItems.length > 1 && (
          <div className="py-3 border-t border-gray-100">
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={item.path}>
                  {index > 0 && (
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`transition-colors duration-200 ${
                      item.isActive
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {item.label}
                  </button>
                </React.Fragment>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
