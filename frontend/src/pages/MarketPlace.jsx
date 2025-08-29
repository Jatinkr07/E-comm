import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../utils/api";

const Marketplace = ({ currentUser }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (product) => {
    try {
      const orderData = {
        buyer_id: currentUser,
        seller_id: product.seller_id,
        product_id: product._id,
        quantity: 1,
        price: product.price,
      };

      await axios.post(`${API_BASE_URL}/api/orders`, orderData);
      setMessage(`Successfully purchased ${product.name}!`);
      fetchProducts();
      setTimeout(() => setMessage(""), 3000);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error creating order:", error);
      setMessage(error.response?.data?.error || "Error purchasing product");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Marketplace</h1>

      {message && (
        <div
          className={`mb-4 p-4 rounded-md transition-all duration-300 ${
            message.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center text-gray-600 mt-8">
          <p className="text-lg">No products available</p>
          <p className="mt-2">Be the first to add a product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => openModal(product)}
            >
              {product.image ? (
                <img
                  src={`${API_BASE_URL}${product.image}`}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-green-600">
                  ${product.price}
                </span>
                <span className="text-sm text-gray-500">
                  Qty: {product.quantity}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Seller ID: {product.seller_id}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuy(product);
                  }}
                  disabled={
                    product.quantity === 0 || product.seller_id === currentUser
                  }
                  className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                    product.quantity === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : product.seller_id === currentUser
                      ? "bg-yellow-500 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {product.quantity === 0
                    ? "Out of Stock"
                    : product.seller_id === currentUser
                    ? "Your Product"
                    : "Buy Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedProduct.name}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {selectedProduct.image ? (
              <img
                src={`${API_BASE_URL}${selectedProduct.image}`}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-gray-500">Price:</span>
                <p className="font-medium">${selectedProduct.price}</p>
              </div>
              <div>
                <span className="text-gray-500">Quantity:</span>
                <p className="font-medium">{selectedProduct.quantity}</p>
              </div>
              <div>
                <span className="text-gray-500">Seller ID:</span>
                <p className="font-medium">{selectedProduct.seller_id}</p>
              </div>
            </div>
            <button
              onClick={() => handleBuy(selectedProduct)}
              disabled={
                selectedProduct.quantity === 0 ||
                selectedProduct.seller_id === currentUser
              }
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                selectedProduct.quantity === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : selectedProduct.seller_id === currentUser
                  ? "bg-yellow-500 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {selectedProduct.quantity === 0
                ? "Out of Stock"
                : selectedProduct.seller_id === currentUser
                ? "Your Product"
                : "Buy Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
