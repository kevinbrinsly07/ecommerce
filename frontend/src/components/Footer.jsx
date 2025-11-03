import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">EBucket</h2>
          <p className="text-sm text-slate-400 mb-4">
            Curated products for modern living. Shop the latest fashion, gadgets, and home goods — all in one place.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 transition">
              <FiInstagram className="text-lg" />
            </a>
            <a href="#" className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 transition">
              <FiTwitter className="text-lg" />
            </a>
            <a href="#" className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 transition">
              <FiFacebook className="text-lg" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/products" className="hover:text-white transition">Shop</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="hover:text-white transition">FAQs</Link></li>
            <li><Link to="/returns" className="hover:text-white transition">Returns</Link></li>
            <li><Link to="/shipping" className="hover:text-white transition">Shipping Info</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <FiMapPin className="text-slate-400" /> Colombo, Sri Lanka
            </li>
            <li className="flex items-center gap-2">
              <FiPhone className="text-slate-400" /> +94 77 123 4567
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-slate-400" /> support@ebucket.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} EBucket. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;