/* eslint-disable @typescript-eslint/no-explicit-any */
// import { auth } from "../firebase";
// import { signOut } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const logout = async () => {
//     await signOut(auth);
//     navigate("/login");
//   };

//   return (
//     <div style={{ padding: 40 }}>
//       <h1>Dashboard</h1>
//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// }




// import { useState } from "react"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ShoppingCart, Users, DollarSign } from "lucide-react"

import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../app/store"
import { useEffect } from "react"

import {
  startOrdersRealtime,
} from "../features/orderSlice"
import { startCategoriesRealtime } from "../features/products/categoriesSlice"
import Loader from "../components/Loader"




const StatCard = ({ title, value, icon: Icon, description }: any) => (
  <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-slate-200">{title}</CardTitle>
      <Icon className="h-4 w-4 text-blue-400" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{value}</div>

      <p className="text-xs text-slate-400 mt-2">{description}</p>
    </CardContent>
  </Card>
)

export default function Dashboard() {
  // const [timeRange, setTimeRange] = useState("7days")


  const dispatch = useDispatch<AppDispatch>()
  const { orders, loading: orderLoading } = useSelector(
    (state: RootState) => state.orders
  )
  const { categories, loading: catLoading } = useSelector((state: RootState) => state.categories);


  useEffect(() => {
    dispatch(startOrdersRealtime())
    dispatch(startCategoriesRealtime())
  }, [dispatch])

  const revenueData = Array.from({ length: 12 }, (_, i) => {
    const monthOrders = orders.filter(
      (o) => new Date(o.orderDate).getMonth() === i
    );
    const revenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    return { month: new Date(0, i).toLocaleString("default", { month: "short" }), revenue, orders: monthOrders.length };
  });


  const categoryMap: Record<string, number> = {};

  orders?.forEach((order) => {
    order?.ProductOrder?.forEach((product) => {
      const categoryName = categories?.find((c: any) => c?.id === product?.product?.categoryId)?.name || "Unknown";
      categoryMap[categoryName] = (categoryMap[categoryName] || 0) + 1;
    });
  });

  const categoryData = Object.keys(categoryMap).map((cat, idx) => ({
    name: cat,
    value: categoryMap[cat],
    color: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][idx % 4],
  }));




  const recentOrders = orders
    .slice()
    .sort((a, b) => new Date(b.orderDate!).getTime() - new Date(a.orderDate!).getTime())
    .slice(0, 5);



  const orderTotal = orders.reduce((sum, product) => {
    return sum + (product.total || 0); // assuming each product has a 'total' field
  }, 0);


  if (orderLoading || catLoading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-6    rounded-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's your store performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Revenue" value={orderTotal} icon={DollarSign} description="Over all" />
        <StatCard title="Total Orders" value={orders?.length} icon={ShoppingCart} description="Over all" />
        <StatCard title="Total Customers" value={orders?.length} icon={Users} description="Active users" />

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue & Orders Chart */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Revenue & Orders Trend</CardTitle>
              <CardDescription>Monthly performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                    labelStyle={{ color: "#f1f5f9" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Distribution */}
        <div>
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Category Distribution</CardTitle>
              <CardDescription>Sales by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                    labelStyle={{ color: "#f1f5f9" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Orders</CardTitle>
          <CardDescription>Latest 5 orders from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Order ID</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Items</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-800 transition">
                    <td className="py-3 px-4 text-slate-200 font-medium">{order.orderId}</td>
                    <td className="py-3 px-4 text-slate-200">{order.customer.firstName} {order.customer.lastName}</td>
                    <td className="py-3 px-4 text-slate-400">{order?.ProductOrder?.length} items</td>
                    <td className="py-3 px-4 text-slate-200 font-semibold">Rs. {order.total}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${order.orderStatus.status === "delivered"
                          ? "bg-green-500/20 text-green-400"
                          : order.orderStatus.status === "In Transit"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-yellow-500/20 text-yellow-400"
                          }`}
                      >
                        {order.orderStatus.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{order.orderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
