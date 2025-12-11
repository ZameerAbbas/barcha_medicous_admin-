import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">Admin</h2>

      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/categories">Categories</Link></li>
      </ul>
    </div>
  );
}
