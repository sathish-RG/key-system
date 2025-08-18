import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/key-system-logo.png';
import { Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/features/auth/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Get user info and login status directly from Redux
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  
  // ✅ Create a single, reliable variable for the user's role
  const role = user?.role || localStorage.getItem("role");

  const handleLogout = () => {
    dispatch(logout());
    // The logout action in your slice should handle clearing localStorage
    navigate("/");
    setIsOpen(false);
  };

  const navLinkClasses = "text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300";

  return (
    <nav className="w-full bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            <img src={logo} alt="Key System Logo" className="w-32 h-auto" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {!isLoggedIn ? (
              // --- Logged Out Links ---
              <>
                <a href="/" className={navLinkClasses}>Home</a>
                <a href="#about" className={navLinkClasses}>About</a>
                <a href="#contacts" className={navLinkClasses}>Contacts</a>
                <Link to="/login" className={navLinkClasses}>Login</Link>
                <Link to="/register">
                  <button className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Get Started
                  </button>
                </Link>
              </>
            ) : (
              // --- Logged In Links ---
              <>
                {/* ✅ Conditionally render links based on role */}
                {role === 'admin' ? (
                  <>
                    <Link to="/admin" className={navLinkClasses}>Dashboard</Link>
                    <Link to="/admin/courses" className={navLinkClasses}>Add Courses</Link>
                  </>
                ) : (
                  <>
                    <Link to="/member" className={navLinkClasses}>Home</Link>
                    <Link to="/courses" className={navLinkClasses}>Courses</Link>
                    {/* You can add a link to a public courses page for members here if you have one */}
                    {/* <Link to="/courses" className={navLinkClasses}>Courses</Link> */}
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 dark:text-gray-200" aria-label="Toggle Menu">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4">
            <div className="flex flex-col items-center space-y-4">
              {!isLoggedIn ? (
                // --- Logged Out Mobile Links ---
                <>
                  <a href="/" className={navLinkClasses} onClick={() => setIsOpen(false)}>Home</a>
                  <a href="#about" className={navLinkClasses} onClick={() => setIsOpen(false)}>About</a>
                  <a href="#contacts" className={navLinkClasses} onClick={() => setIsOpen(false)}>Contacts</a>
                  <Link to="/login" className={navLinkClasses} onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <button className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white px-6 py-3 rounded-full font-semibold">
                      Get Started
                    </button>
                  </Link>
                </>
              ) : (
                // --- Logged In Mobile Links ---
                <>
                  {/* ✅ Apply the same conditional logic for the mobile menu */}
                  {role === 'admin' ? (
                    <>
                      <Link to="/admin" className={navLinkClasses} onClick={() => setIsOpen(false)}>Dashboard</Link>
                      <Link to="/admin/courses" className={navLinkClasses} onClick={() => setIsOpen(false)}>Add Courses</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/member" className={navLinkClasses} onClick={() => setIsOpen(false)}>Home</Link>
                      <Link to="/courses" className={navLinkClasses} onClick={() => setIsOpen(false)}>Courses</Link>
                      {/* <Link to="/courses" className={navLinkClasses} onClick={() => setIsOpen(false)}>Courses</Link> */}
                    </>
                  )}
                  <button onClick={handleLogout} className="w-full bg-red-600 text-white px-6 py-3 rounded-full font-semibold">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;