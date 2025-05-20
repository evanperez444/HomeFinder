import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import PropertyForm from "@/components/forms/PropertyForm";
import AuthModals from "@/components/auth/AuthModals";

const Sell = () => {
  const { user } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  const openLoginModal = () => {
    setLoginModalOpen(true);
    setSignupModalOpen(false);
  };

  const openSignupModal = () => {
    setSignupModalOpen(true);
    setLoginModalOpen(false);
  };

  const closeModals = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(false);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">List Your Property with HomeFinder</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Reach thousands of potential buyers and renters looking for their next home.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
            {user ? (
              <>
                <h2 className="text-2xl font-bold text-dark mb-6">Create a Property Listing</h2>
                <PropertyForm />
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                  <i className="fas fa-lock text-primary text-xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-dark mb-2">Sign In to List Your Property</h2>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                  You need to be logged in to create a property listing. Please sign in to your account or create a new one.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={openLoginModal}
                    className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Log In
                  </button>
                  <button
                    onClick={openSignupModal}
                    className="bg-white text-primary px-6 py-3 rounded-md border border-primary hover:bg-gray-100 transition duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-dark text-center mb-12">Why List With Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-globe text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Wider Reach</h3>
              <p className="text-gray-600">Your property will be seen by thousands of potential buyers or renters actively searching for their next home.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-secondary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bolt text-secondary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Faster Results</h3>
              <p className="text-gray-600">Our platform helps you sell or rent your property faster with targeted exposure to qualified buyers and renters.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-accent text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Better Value</h3>
              <p className="text-gray-600">Get the best possible price for your property with our market insights and professional presentation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-dark text-center mb-4">How It Works</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Listing your property with HomeFinder is simple and straightforward. Follow these easy steps:
          </p>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="flex-shrink-0 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 md:mb-0 md:mr-6">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-gray-600">Sign up for a free HomeFinder account to get started with your listing.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="flex-shrink-0 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 md:mb-0 md:mr-6">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Add Your Property Details</h3>
                <p className="text-gray-600">Fill out our property form with all the important information buyers and renters need to know.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="flex-shrink-0 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 md:mb-0 md:mr-6">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Photos</h3>
                <p className="text-gray-600">Add high-quality photos to showcase your property in the best light.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-shrink-0 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 md:mb-0 md:mr-6">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Connect with Buyers</h3>
                <p className="text-gray-600">Receive inquiries and appointment requests directly through our platform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to List Your Property?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">Join thousands of successful sellers and landlords who found the right buyers and tenants with HomeFinder.</p>
          {user ? (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-primary font-medium px-8 py-3 rounded-md hover:bg-gray-100 transition duration-300"
            >
              Create Your Listing Now
            </button>
          ) : (
            <button
              onClick={openSignupModal}
              className="bg-white text-primary font-medium px-8 py-3 rounded-md hover:bg-gray-100 transition duration-300"
            >
              Get Started
            </button>
          )}
        </div>
      </section>

      {/* Auth Modals */}
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

export default Sell;
