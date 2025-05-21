import React, { use } from 'react';
import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import FeatureBar from '../components/FeatureBar';
import PromotionGrid from '../components/PromotionGrid';
import ProductGrid from '../components/ProductGrid';
import CategoryBanner from '../components/CategoryBanner';

// Import data
import productData from '../data/products.json';

const HomePage = () => {
 const [featuredproducts, setfeaturedproducts] = useState([]);
  useEffect(() => {
    const fetchproducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setfeaturedproducts(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching Products:', error);
      }
    };
    fetchproducts();
  }, []);
  return (
    <div className="min-h-screen bg-white flex flex-col gap-20">
      {/* Hero Banner Section */}
      <HeroBanner banner={productData.banners.hero} />
      
      {/* Feature Bar Section */}
      <FeatureBar features={productData.features} />
      
      {/* Promotion Grid Section */}
      <PromotionGrid promotions={productData.banners.promotions} />
      
      {/* Featured Products Section */}
      <ProductGrid products={featuredproducts} title="Featured Products" />
      
      {/* Category Banner Section */}
      <CategoryBanner categories={productData.categories} />
    </div>
  );
};

export default HomePage;