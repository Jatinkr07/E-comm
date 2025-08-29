import { Link, useLocation } from "react-router-dom";

const Navbar = ({ currentUser, setCurrentUser }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "bg-blue-700" : "hover:bg-blue-600";
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                "/"
              )}`}
            >
              Marketplace
            </Link>
            <Link
              to="/add-product"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                "/add-product"
              )}`}
            >
              Add Product
            </Link>
            <Link
              to="/orders"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                "/orders"
              )}`}
            >
              My Orders
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">User ID: {currentUser}</span>
            <select
              value={currentUser}
              onChange={(e) => setCurrentUser(parseInt(e.target.value))}
              className="bg-blue-700 text-white px-2 py-1 rounded text-sm"
            >
              <option value={1}>User 1</option>
              <option value={2}>User 2</option>
              <option value={3}>User 3</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
