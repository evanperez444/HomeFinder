import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import AuthModals from "@/components/auth/AuthModals";
import { X, Menu, User, LogOut } from "lucide-react";

const Navbar = () => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
    setSignupModalOpen(false);
    setMobileMenuOpen(false);
  };

  const openSignupModal = () => {
    setSignupModalOpen(true);
    setLoginModalOpen(false);
    setMobileMenuOpen(false);
  };

  const closeModals = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md py-2" : "bg-white/90 py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center">
                <i className="fas fa-home text-primary text-2xl mr-2"></i>
                <span className="text-xl font-bold text-dark">HomeFinder</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className={`text-dark hover:text-primary font-medium transition-colors ${location === '/' ? 'text-primary' : ''}`}>
                  Home
                </Link>
                <Link href="/buy" className={`text-dark hover:text-primary font-medium transition-colors ${location === '/buy' ? 'text-primary' : ''}`}>
                  Buy
                </Link>
                <Link href="/rent" className={`text-dark hover:text-primary font-medium transition-colors ${location === '/rent' ? 'text-primary' : ''}`}>
                  Rent
                </Link>
                <Link href="/sell" className={`text-dark hover:text-primary font-medium transition-colors ${location === '/sell' ? 'text-primary' : ''}`}>
                  Sell
                </Link>
                <Link href="/assistant" className={`text-dark hover:text-primary font-medium flex items-center transition-colors ${location === '/assistant' ? 'text-primary' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  Assistant
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-dark font-medium">{user.fullName.split(' ')[0]}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-dark hover:text-primary font-medium transition-colors flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Log Out
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={openLoginModal} 
                    className="hidden md:block text-dark hover:text-primary font-medium transition-colors"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={openSignupModal}
                    className="hidden md:block bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden text-dark hover:text-primary transition-colors p-1"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Improved Mobile Menu with Animation */}
        <div 
          className={`md:hidden bg-white border-t border-gray-200 absolute w-full left-0 transition-all duration-300 ease-in-out ${
            mobileMenuOpen 
              ? 'opacity-100 max-h-[80vh] overflow-y-auto shadow-lg' 
              : 'opacity-0 max-h-0 overflow-hidden'
          }`}
        >
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-dark hover:text-primary font-medium py-2 transition-colors border-b border-gray-100">
                Home
              </Link>
              <Link href="/buy" onClick={() => setMobileMenuOpen(false)} className="text-dark hover:text-primary font-medium py-2 transition-colors border-b border-gray-100">
                Buy
              </Link>
              <Link href="/rent" onClick={() => setMobileMenuOpen(false)} className="text-dark hover:text-primary font-medium py-2 transition-colors border-b border-gray-100">
                Rent
              </Link>
              <Link href="/sell" onClick={() => setMobileMenuOpen(false)} className="text-dark hover:text-primary font-medium py-2 transition-colors border-b border-gray-100">
                Sell
              </Link>
              <Link href="/assistant" onClick={() => setMobileMenuOpen(false)} className="text-dark hover:text-primary font-medium py-2 flex items-center transition-colors border-b border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Real Estate Assistant
              </Link>
              
              {user ? (
                <div className="flex flex-col pt-2 border-t border-gray-100">
                  <div className="flex items-center py-2 text-dark">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-medium">{user.fullName}</span>
                  </div>
                  <button onClick={handleLogout} className="text-dark hover:text-primary font-medium py-2 text-left transition-colors flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                  <button 
                    onClick={openLoginModal}
                    className="text-dark hover:text-primary font-medium py-2 text-left transition-colors"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={openSignupModal}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-center"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Page content spacer to account for fixed header */}
      <div className={`h-${scrolled ? '16' : '20'} md:h-${scrolled ? '14' : '18'}`}></div>

      <AuthModals 
        loginOpen={loginModalOpen}
        signupOpen={signupModalOpen}
        onClose={closeModals}
        onSwitchToSignup={() => {
          setLoginModalOpen(false);
          setSignupModalOpen(true);
        }}
        onSwitchToLogin={() => {
          setSignupModalOpen(false);
          setLoginModalOpen(true);
        }}
      />
    </>
  );
};

export default Navbar;