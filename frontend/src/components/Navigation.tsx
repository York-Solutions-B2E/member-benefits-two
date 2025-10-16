import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationProps {
  pageTitle: string;
  userName?: string;
  showBreadcrumb?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  pageTitle, 
  userName = 'John Smith',
  showBreadcrumb = true 
}) => {
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

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Left side - Logo/Brand and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Brand/Logo */}
            <div className="flex items-center">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
              >
                Member Benefits Dashboard
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === '/dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation('/claims')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname.startsWith('/claims')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Claims
              </button>
            </nav>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-4">
            {/* User info */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">Member</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {userName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>

            {/* Sign out button */}
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors duration-200"
            >
              Sign out
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
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

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium text-left transition-colors duration-200 ${
                  location.pathname === '/dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation('/claims')}
                className={`px-3 py-2 rounded-md text-sm font-medium text-left transition-colors duration-200 ${
                  location.pathname.startsWith('/claims')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Claims
              </button>
            </nav>
            
            {/* Mobile user info */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {userName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">Member</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
