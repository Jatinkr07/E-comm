import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Marketplace from "./pages/MarketPlace";
import AddProduct from "./pages/AddProducts";
import Orders from "./pages/Orders";

function App() {
  const [currentUser, setCurrentUser] = useState(1);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={<Marketplace currentUser={currentUser} />}
            />
            <Route
              path="/add-product"
              element={<AddProduct currentUser={currentUser} />}
            />
            <Route
              path="/orders"
              element={<Orders currentUser={currentUser} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
