import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import ProductsPage from "./pages/product";
import Categories from "./pages/Categories";
import Address from "./pages/addresses";
import Order from "./pages/order";
import ProductOrderDetail from "./pages/productorderdetail";
import Brands from "./pages/brand";
import Agent from "./pages/agent";
import OrderAgents from "./pages/order-agents";
import OrderAgentsRevenue from "./pages/order-agents-revenue";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProductsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Order />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Categories />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/addresses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Address />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/productorderdetail"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProductOrderDetail />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/brand"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Brands />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Agent />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-agents"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OrderAgents />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-agents-revenue"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OrderAgentsRevenue />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
