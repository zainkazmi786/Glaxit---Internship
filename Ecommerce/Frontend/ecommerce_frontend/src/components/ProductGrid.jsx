import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const getCategoryName = async (category) => {
  try {
    const response = await fetch(`http://localhost:5000/api/categories/${category}`);
    if (!response.ok) throw new Error('Category not found');
    const data = await response.json();
    return data.name;
  } catch (error) {
    console.error('Error fetching category:', error.message);
    return null;
  }
};

const ProductGrid = ({ products, title }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [categoryMap, setCategoryMap] = useState({});

  // Fetch all category names for product category IDs
  useEffect(() => {
    const fetchCategories = async () => {
      const uniqueCategoryIds = [...new Set(products.map(p => p.category_id.$oid))];
      const entries = await Promise.all(
        uniqueCategoryIds.map(async id => [id, await getCategoryName(id)])
      );
      const map = Object.fromEntries(entries);
      setCategoryMap(map);
    };

    fetchCategories();
  }, [products]);

  const getCategory = (categoryId) => categoryMap[categoryId] || '';

  const categories = ['all', ...new Set(Object.values(categoryMap))];

  const filteredProducts =
    activeTab === 'all'
      ? products
      : products.filter(p => getCategory(p.category_id.$oid) === activeTab);
  console.log('Filtered Products:', filteredProducts);

 return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">{title}</h2>
        <div className="w-24 h-1 bg-indigo-600 mx-auto mb-10"></div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeTab === category
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200'
                }`}
                onClick={() => setActiveTab(category)}
              >
                {category === 'all' ? 'All Products' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product._id.$oid} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;