import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/key-system-logo.png";
import { Twitter, Facebook, Linkedin } from "lucide-react";

const Footer = () => {
    // ✅ Use Redux state instead of localStorage directly
    const { user, isLoggedIn } = useSelector((state) => state.auth);
    
    // ✅ Fallback to localStorage if Redux state is not set (page refresh)
    const userRole = localStorage.getItem("role");
    const loggedIn = isLoggedIn || Boolean(userRole && userRole === "admin");

  // OR fallback to localStorage if Redux isn't fully set up yet:
  // const userRole = localStorage.getItem("role");
  // const loggedIn = Boolean(userRole && userRole === "admin");

  return (
    <footer className="w-full bg-white dark:bg-gray-900 shadow-inner mt-auto">
      <div className="container mx-auto px-6 py-12">

        {/* Show full footer only if NOT logged in */}
        {!loggedIn && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-5">
            {/* Column 1: Branding */}
            <div className="space-y-4">
              <Link to="/" className="inline-block">
                <img src={logo} alt="Key Kissan Logo" className="h-12" />
              </Link>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                Empowering farmers and learners with financial knowledge to grow,
                prosper, and embrace the future of digital finance.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#home" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">About Us</a></li>
                <li><a href="#features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Features</a></li>
                <li><a href="#testimonials" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Testimonials</a></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#privacy" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Column 4: Social */}
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" aria-label="Twitter" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  <Twitter size={22} />
                </a>
                <a href="#" aria-label="Facebook" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  <Facebook size={22} />
                </a>
                <a href="#" aria-label="LinkedIn" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  <Linkedin size={22} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar (always visible) */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-0 pb-0 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} <span className="font-semibold">Key Kissan</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
