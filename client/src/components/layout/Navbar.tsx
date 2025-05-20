import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import AuthModals from "@/components/auth/AuthModals";

const Navbar = () => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

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
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
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
                  Real Estate Assistant
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="hidden md:flex items-center space-x-4">
                  <span className="text-dark font-medium">Welcome, {user.fullName.split(' ')[0]}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-dark hover:text-primary font-medium transition-colors"
                  >
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
                className="md:hidden text-dark hover:text-primary transition-colors"
                aria-label="Toggle mobile menu"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu - Improved with animation and better contrast */}
        <div 
          className={`md:hidden bg-white border-t border-gray-200 transform transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-y-0 shadow-md' : '-translate-y-full'
          }`}
        >
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-dark hover:text-primary font-medium py-2 transition-colors">
                Home
              </Link>
              <Link href="/buy" onClick={() => setMobileMenuOpen(false)} className="text-dark hover:text-primary font-medium py-2 transition-colors">
                Buy
              </Link>
              <Link href="/rent" onClick={() => setMobileMenuOpen(false)} className="text-dark hover:text-primary font-medium py-2 transition-colors">
                Rent
              </Link>
              <Link href="/sell" onClick={() => setMobileMenuOpen(false)} className="text-dark hover:text-primary font-medium py-2 transition-colors">
                Sell
              </Link>
              <Link href="/assistant" onClick={() => setMobileMenuOpen(false)} className="text-dark hover:text-primary font-medium py-2 flex items-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Real Estate Assistant
              </Link>
              
              {user ? (
                <div className="flex flex-col pt-2 border-t border-gray-100">
                  <span className="text-dark font-medium py-2">Welcome, {user.fullName.split(' ')[0]}</span>
                  <button onClick={handleLogout} className="text-dark hover:text-primary font-medium py-2 text-left transition-colors">
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