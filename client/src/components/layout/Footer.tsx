import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">HomeFinder</h3>
            <p className="text-gray-400 mb-4">Making your property search simple, efficient, and enjoyable.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link href="/buy" className="text-gray-400 hover:text-white transition">Buy</Link></li>
              <li><Link href="/rent" className="text-gray-400 hover:text-white transition">Rent</Link></li>
              <li><Link href="/sell" className="text-gray-400 hover:text-white transition">Sell</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Agents</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Mortgage Calculator</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Neighborhood Guides</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Home Buying Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Selling Tips</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-2 text-gray-400"></i>
                <span className="text-gray-400">123 Main Street, Los Angeles, CA 90001</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-2 text-gray-400"></i>
                <a href="tel:+11234567890" className="text-gray-400 hover:text-white transition">(123) 456-7890</a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2 text-gray-400"></i>
                <a href="mailto:info@homefinder.com" className="text-gray-400 hover:text-white transition">info@homefinder.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} HomeFinder. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
