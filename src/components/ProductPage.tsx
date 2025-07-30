import React, { useState } from 'react';
import './ProductPage.css';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
}

const getHighResolutionImage = (id: number): string => {
  return `https://picsum.photos/id/${id}/3840/2160`
};

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const searchProducts = async (term: string) => {
    const response = await fetch(`https://api.escuelajs.co/api/v1/products/?title=${term}`);
    const data = await response.json();

    const productsWithHeavyImages = data.map((product: Product, index: number) => ({
      ...product,
      images: [getHighResolutionImage(index)]
    }));

    setProducts(productsWithHeavyImages);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    searchProducts(value);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const calculateDiscount = (price: number): string => {
    return (price * 0.9).toFixed(2);
  };

  return (
    <div className="product-page">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Pesquisar produtos..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="search-loading">Buscando...</div>
      </div>

      <div className="product-grid">
        {products.map(product => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => handleProductClick(product)}
          >
            <img
              src={product.images[0]}
              alt={product.title}
              className="product-image"
              loading="eager"
            />
            <h3>{product.title}</h3>
            <p className="product-description">
              {product.description}
            </p>
            <p>R$ {calculateDiscount(product.price)}</p>
            <button className="add-to-cart-btn">
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedProduct && (
        <div className="modal">
          <h2>{selectedProduct.title}</h2>
          <img className="modal-image"src={selectedProduct.images[0]}></img>
          <p>{selectedProduct.description}</p>
          <p>R$ {selectedProduct.price}</p>
          <div onClick={() => setShowModal(false)}>Fechar</div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
