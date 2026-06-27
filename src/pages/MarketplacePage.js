import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MarketplacePage.css';

const MarketplacePage = ({ user }) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Premium Digital Course',
      price: 50,
      seller: 'Course Creator',
      description: 'Learn blockchain development',
      image: '📚',
    },
    {
      id: 2,
      name: 'Design Templates',
      price: 25,
      seller: 'Design Studio',
      description: 'Professional UI kits',
      image: '🎨',
    },
    {
      id: 3,
      name: 'Software License',
      price: 100,
      seller: 'Tech Company',
      description: '1 year license',
      image: '💻',
    },
    {
      id: 4,
      name: 'Music Collection',
      price: 30,
      seller: 'Music Producer',
      description: '100 royalty-free tracks',
      image: '🎵',
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleBuy = (product) => {
    if (!user) {
      alert('Please sign in first');
      return;
    }
    setSelectedProduct(product);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="marketplace-page">
      <div className="marketplace-header">
        <h1>Marketplace</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">{product.image}</div>
            <h3>{product.name}</h3>
            <p className="seller">by {product.seller}</p>
            <p className="description">{product.description}</p>
            <div className="product-footer">
              <span className="price">{product.price} π</span>
              <button
                onClick={() => handleBuy(product)}
                className="btn btn-primary"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>×</button>
            <div className="modal-body">
              <div className="modal-image">{selectedProduct.image}</div>
              <h2>{selectedProduct.name}</h2>
              <p className="modal-seller">Seller: {selectedProduct.seller}</p>
              <p className="modal-description">{selectedProduct.description}</p>
              <div className="modal-price">{selectedProduct.price} π</div>
              <Link
                to={`/payment/${selectedProduct.id}`}
                className="btn btn-primary btn-large"
              >
                Proceed to Payment
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
