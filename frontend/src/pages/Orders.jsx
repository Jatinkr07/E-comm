import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../utils/api";

const Orders = ({ currentUser }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/orders?userId=${currentUser}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    if (activeTab === "purchases") {
      return orders.filter((order) => order.buyer_id === currentUser);
    } else if (activeTab === "sales") {
      return orders.filter((order) => order.seller_id === currentUser);
    }
    return orders;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading orders...</div>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "all"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("purchases")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "purchases"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            My Purchases (
            {orders.filter((order) => order.buyer_id === currentUser).length})
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "sales"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            My Sales (
            {orders.filter((order) => order.seller_id === currentUser).length})
          </button>
        </nav>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-600 mt-8">
          <p className="text-lg">No orders found</p>
          <p className="mt-2">
            {activeTab === "purchases" && "You haven't made any purchases yet."}
            {activeTab === "sales" && "You haven't made any sales yet."}
            {activeTab === "all" && "No orders available."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {order.product_id?.name || "Product name not available"}
                  </h3>
                  <p className="text-gray-600 text-sm">Order ID: {order._id}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Quantity:</span>
                  <p className="font-medium">{order.quantity}</p>
                </div>
                <div>
                  <span className="text-gray-500">Price:</span>
                  <p className="font-medium">${order.price}</p>
                </div>
                <div>
                  <span className="text-gray-500">
                    {order.buyer_id === currentUser ? "Seller:" : "Buyer:"}
                  </span>
                  <p className="font-medium">
                    User{" "}
                    {order.buyer_id === currentUser
                      ? order.seller_id
                      : order.buyer_id}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {order.product_id?.description || "No description available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
