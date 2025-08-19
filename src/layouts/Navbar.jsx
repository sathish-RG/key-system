import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/key-system-logo.png';
import { Menu, X, Home, BookOpen, Settings, LogOut, User, ChevronRight, ChevronLeft, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/features/auth/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get user info and login status from Redux, fallback to localStorage if not available
  const { user: reduxUser, isLoggedIn } = useSelector((state) => state.auth);
  
  // Create a user object that combines Redux state with localStorage data
  const user = reduxUser || JSON.parse(localStorage.getItem("user")) || {};
  
  // Get role with fallback to localStorage
  const role = user?.role || localStorage.getItem("role");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // Clear localStorage on logout
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    dispatch(logout());
    navigate("/");
    setIsOpen(false);
    setSidebarOpen(false);
  };

  // Check if current path is active
  const isActive = (path) => location.pathname === path;

  // Enhanced navigation items with icons
  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: Home },
    { path: '/admin/courses', label: 'Add Courses', icon: BookOpen },
    { path: '/admin/members', label: 'Members', icon: Users },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const memberNavItems = [
    { path: '/member', label: 'Home', icon: Home },
    { path: '/courses', label: 'Courses', icon: BookOpen },
  ];

  const navItems = role === 'admin' ? adminNavItems : memberNavItems;

  const navLinkClasses = "relative text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 font-medium";

  return (
    <>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar for logged in users - Now in ABSOLUTE mode */}
      {isLoggedIn && (
        <div className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-50 ${
          sidebarMinimized ? 'w-20' : 'w-72'
        } bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700`}>
          
          {/* Sidebar Header */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              {!sidebarMinimized ? (
                <Link to={role === 'admin' ? "/admin" : "/member"} className="flex items-center space-x-3">
                  <img src={logo} alt="Key System Logo" className="w-30 h-12" />
                  <div>
                    {/* <h2 className="text-xl font-bold text-gray-800 dark:text-white">Key System</h2> */}
                    {/* <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{role} Panel</p> */}
                  </div>
                </Link>
              ) : (
                <Link to={role === 'admin' ? "/admin" : "/member"} className="flex justify-center w-full">
                  <img src={logo} alt="Key System Logo" className=" w-30 h-12" />
                </Link>
              )}
              
              <div className="flex items-center space-x-2">
                {/* Minimize/Maximize Button - Hidden on mobile */}
                <button 
                  onClick={() => setSidebarMinimized(!sidebarMinimized)} 
                  className="hidden md:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title={sidebarMinimized ? "Expand sidebar" : "Minimize sidebar"}
                >
                  {sidebarMinimized ? (
                    <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
                  ) : (
                    <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
                  )}
                </button>
                
                {/* Mobile close button */}
                <button 
                  onClick={() => setSidebarOpen(false)} 
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            {/* User Profile Section */}
            {!sidebarMinimized && (
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {user?.name || 'User'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Minimized User Profile */}
            {sidebarMinimized && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-full flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`group flex items-center ${
                      sidebarMinimized ? 'justify-center p-3' : 'justify-between p-4'
                    } rounded-xl transition-all duration-300 ${
                      active 
                        ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-lg transform scale-105' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:transform hover:scale-105'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                    title={sidebarMinimized ? item.label : ''}
                  >
                    <div className={`flex items-center ${sidebarMinimized ? '' : 'space-x-3'}`}>
                      <Icon size={20} className={active ? 'text-white' : 'text-gray-500 group-hover:text-teal-500'} />
                      {!sidebarMinimized && <span className="font-medium">{item.label}</span>}
                    </div>
                    {!sidebarMinimized && (
                      <ChevronRight size={16} className={`transition-transform duration-300 ${active ? 'text-white' : 'text-gray-400 group-hover:text-teal-500 group-hover:translate-x-1'}`} />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className={`w-full flex items-center ${
                  sidebarMinimized ? 'justify-center p-3' : 'justify-center space-x-3 p-4'
                } bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`}
                title={sidebarMinimized ? 'Logout' : ''}
              >
                <LogOut size={20} />
                {!sidebarMinimized && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Main Navbar - NO LEFT PADDING for absolute sidebar */}
      <nav className={`w-full sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-white dark:bg-gray-800 shadow-md'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            
            {/* Logo and Menu Button for logged in users */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)} 
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 md:hidden"
                  aria-label="Toggle Sidebar"
                >
                  <Menu size={24} className="text-gray-700 dark:text-gray-300" />
                </button>
                
                {/* Mobile Logo - only visible on small screens when sidebar is closed */}
                <Link to={role === 'admin' ? "/admin" : "/member"} className="md:hidden">
                  <img src={logo} alt="Key System Logo" className="w-30 h-13 rounded-lg" />
                </Link>

                {/* Desktop - Show minimize/maximize button */}
                <div className="hidden md:flex items-center space-x-4">
                  <button 
                    onClick={() => setSidebarMinimized(!sidebarMinimized)} 
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                    title={sidebarMinimized ? "Expand sidebar" : "Minimize sidebar"}
                  >
                    <Menu size={24} className="text-gray-700 dark:text-gray-300" />
                  </button>
                  <span className="text-lg font-semibold text-gray-800 dark:text-white ml-1">
                    {role === 'admin' ? 'Admin Panel' : 'Member Panel'}
                  </span>
                </div>
              </div>
            ) : (
              <Link to="/" className="flex items-center space-x-3 group">
                <img src={logo} alt="Key System " className="w-32 h-15 bg-gray-300" />
                
              </Link>
            )}

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {!isLoggedIn ? (
                // Logged Out Links
                <>
                  <a href="/" className={`${navLinkClasses} hover:scale-105`}>
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-green-600 text-white transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <a href="#about" className={`${navLinkClasses} hover:scale-105`}>About</a>
                  <a href="#contacts" className={`${navLinkClasses} hover:scale-105`}>Contacts</a>
                  <Link to="/login" className={`${navLinkClasses} hover:scale-105`}>Login</Link>
                  <Link to="/register">
                    <button className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-8 py-3 rounded-full font-semibold hover:from-teal-600 hover:bg-gradient-to-r from-teal-600 to-green-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5">
                      Get Started
                    </button>
                  </Link>
                </>
              ) : (
                // Logged In - User info and logout
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {user?.name || user?.username || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300" 
                aria-label="Toggle Menu"
              >
                {isOpen ? (
                  <X size={24} className="text-gray-700 dark:text-gray-300" />
                ) : (
                  <User size={24} className="text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          {isOpen && (
            <div className="md:hidden mt-6 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 shadow-xl border border-gray-200 dark:border-gray-600">
              <div className="flex flex-col space-y-4">
                {!isLoggedIn ? (
                  // Logged Out Mobile Links
                  <>
                    <a href="/" className="p-3 rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 text-center font-medium" onClick={() => setIsOpen(false)}>
                      Home
                    </a>
                    <a href="#about" className="p-3 rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 text-center font-medium" onClick={() => setIsOpen(false)}>
                      About
                    </a>
                    <a href="#contacts" className="p-3 rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 text-center font-medium" onClick={() => setIsOpen(false)}>
                      Contacts
                    </a>
                    <Link to="/login" className="p-3 rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 text-center font-medium" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        Get Started
                      </button>
                    </Link>
                  </>
                ) : (
                  // Logged In Mobile - User info and logout
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3 p-4 bg-white dark:bg-gray-600 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-full flex items-center justify-center">
                        <User size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {user?.name || user?.username || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{role}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;