import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import Cart from './Cart';
import { Link } from 'react-router-dom';

// import { list } from 'postcss/lib/list';

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [categories, setcategories] = useState([]);
  const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Blog', href: '/blog' },
  { label: 'Elements', href: '/elements' }
];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
        setShowCart(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();
        setcategories((data));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="border-b shadow-sm">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white text-sm py-1 px-4 md:px-16 flex justify-between items-center">
        <div className="flex flex-wrap gap-4">
          <span>📧 support@pressmart.com</span>
          <span>📞 +(023) 4567 890</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <span>Welcome to Our Store!</span>
          <span>English ▾</span>
          <span>$ Dollar (US) ▾</span>
        </div>
      </div>

      {/* Navbar Main */}
      <div className="flex items-center justify-between px-4 md:px-16 py-3 bg-white relative">
        <h1 className="text-2xl font-bold">PressMart.</h1>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <FaTimes /> : <FaBars />}
        </button>

        {/* Links */}
        <ul
          className={`md:flex gap-6 items-center text-sm ${
            showMobileMenu ? 'block' : 'hidden'
          } md:block absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 shadow md:shadow-none z-20`}
        >
          {navLinks.map((link) => (
            <li key={link.label} className="py-2 md:py-0 hover:text-blue-600 cursor-pointer">
              <Link to={link.href}>{link.label}</Link>
            </li>
          ))}

          {/* Pages Dropdown */}
          <li
            className="relative group dropdown-container"
            onMouseEnter={() =>
              openDropdown !== 'pages' && setOpenDropdown('pages')
            }
            onMouseLeave={() =>
              openDropdown !== 'pages' && setOpenDropdown(null)
            }
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown(openDropdown === 'pages' ? null : 'pages');
              }}
              className="py-2 px-2 hover:text-blue-600 cursor-pointer flex items-center gap-1"
            >
              Pages <span className="text-xs">▼</span>
            </div>
            <ul
              className={`absolute left-0 mt-2 bg-white border shadow-md rounded-md min-w-[150px] z-30 transition-all duration-300 origin-top-left 
              ${
                openDropdown === 'pages'
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >{categories.map((category) => (
                  <Link
                    key={category._id.$oid}
                    to={`/shop?category_id=${category._id.$oid}`}
                  >
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      {category.name}
                    </li>
                  </Link>
                ))}

              
            </ul>
          </li>

          {/* Buy Dropdown */}
          <li
            className="relative group dropdown-container"
            onMouseEnter={() =>
              openDropdown !== 'buy' && setOpenDropdown('buy')
            }
            onMouseLeave={() =>
              openDropdown !== 'buy' && setOpenDropdown(null)
            }
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown(openDropdown === 'buy' ? null : 'buy');
              }}
              className="py-2 px-2 hover:text-blue-600 cursor-pointer flex items-center gap-1"
            >
              Buy <span className="text-xs">▼</span>
            </div>
            <ul
              className={`absolute left-0 mt-2 bg-white border shadow-md rounded-md min-w-[150px] z-30 transition-all duration-300 origin-top-left 
              ${
                openDropdown === 'buy'
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              {categories.map((category) => (
                <Link
                  key={category._id.$oid}
                  to={`/shop?category_id=${category._id.$oid}`}
                >
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    {category.name}
                  </li>
                </Link>
              ))}

            </ul>
          </li>
        </ul>
        
        {/* Cart */}
        <Link to="/cart">
        <div
          className="relative cursor-pointer  p-1 rounded dropdown-container"
          onMouseEnter={() => setShowCart(true)}
          onMouseLeave={() => setShowCart(false)}
          onClick={(e) => {
            e.stopPropagation();
            setShowCart(!showCart);
          }}
          >
          <FaShoppingCart size={22} />
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full text-xs px-1">
            {localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')).length : 0}
          </span>

          {/* Cart Dropdown */}
          <div
            className={`absolute right-0 mt-2 w-72 bg-white shadow-lg z-30 rounded-md transition-all duration-300 origin-top-right
            ${
              showCart
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-95 pointer-events-none'
              }`}
          >
            <Cart />
          </div>
        </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
