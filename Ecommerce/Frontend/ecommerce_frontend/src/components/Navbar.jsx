import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import Cart from './Cart';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;



const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [categories, setcategories] = useState([]);
  const [cartitems, setcartitems] = useState(0);
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' }
  ];
  
  useEffect(() => {
    const updateCartItems = () => {
      setcartitems(JSON.parse(localStorage.getItem('cart'))?.length || 0);
    };
    // Run once on mount
    updateCartItems();
    // Listen to cart updates
    window.addEventListener('cartUpdated', updateCartItems);
    // Cleanup
    return () => window.removeEventListener('cartUpdated', updateCartItems);
  }, []);
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
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        setcategories((data));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="border-b shadow-sm fixed top-0 left-0 right-0 z-50 bg-white">


      {/* Navbar Main */}
      <div className="flex items-center justify-between px-4 md:px-16 py-3 bg-white relative">
        {/* Logo */}
        <div className="flex items-center gap-2">

        <Link to="/" className="text-xl font-bold text-indigo-600 ">
          <img src="https://glaxit.com/wp-content/uploads/2024/11/Glaxit-Logo.png" alt="Logo" className="w-30" />
        </Link>        
        {/* <h1 className="text-2xl font-bold">Glaxit Super Store.</h1> */}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <FaTimes /> : <FaBars />}
        </button>

        {/* Links */}
        <ul
          className={`md:flex gap-6 items-center text-sm text-indigo-600 font-semibold ${
            showMobileMenu ? 'block' : 'hidden'
          } md:block absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 shadow md:shadow-none z-20`}
        >
          {navLinks.map((link) => (
            <li key={link.label} className="py-2 md:py-0 hover:text-indigo-800 cursor-pointer">
              <Link to={link.href}>{link.label}</Link>
            </li>
          ))}

          {/* Pages Dropdown */}
          <li
            className="relative group dropdown-container  hover:text-indigo-800"
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
              className="py-2 px-2 hover:text-indigo-900 cursor-pointer flex items-center gap-1"
            >
              Categories <span className="text-xs">▼</span>
            </div>
            <ul
              className={`absolute left-20  mt-2 bg-white text-black border shadow-md min-w-[150px] z-30 transition-all duration-300 origin-top-left 
              ${
                openDropdown === 'pages'
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >{categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/shop?category_id=${category._id}`}
                  >
                    <li onClick={()=>setOpenDropdown(null)} className="px-4 py-2 hover:bg-indigo-400 cursor-pointer">
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
          <img src="/cart.png" alt="" className='h-7'  />
          <span className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full text-xs px-1">
            {cartitems > 0 ? cartitems : ''}
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
