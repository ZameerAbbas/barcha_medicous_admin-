/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../app/store"

import {
  startOrdersRealtime,
  deleteOrder,
} from "../features/orderSlice"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
// import { Badge } from "../components/ui/badge"
import { Checkbox } from "../components/ui/checkbox"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { ScrollArea } from "../components/ui/scroll-area"

import {
  Search,
  Trash2,
  ShoppingCart,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react"


import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader"

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



import {
  startAgentsRealtime,

} from "../features/agentsSlice";

const OrderAgentsRevenue = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const { orders, loading } = useSelector(
    (state: RootState) => state.orders
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgent, setSelectedAgent] = useState<any>({ referralCode: "all" })


  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const { agents } = useSelector((state: RootState) => state.agents);

  const pageSize = 10
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(startOrdersRealtime())
    dispatch(startAgentsRealtime())
  }, [dispatch])



  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchSearch =
          searchTerm === "" || order.id?.toString().includes(searchTerm) || order.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchStatus =
          selectedAgent.referralCode === "all" ||
          order?.referralCode === selectedAgent.referralCode

        return matchSearch && matchStatus
      })
      .sort((a, b) => {
        const dateA = new Date(a.orderDate).getTime()
        const dateB = new Date(b.orderDate).getTime()
        return dateB - dateA
      })
  }, [orders, searchTerm, selectedAgent.referralCode])


  console.log("filteredOrders", filteredOrders)
  const totalPages = Math.ceil(filteredOrders.length / pageSize)

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )


  const handleDeleteOrder = (id?: string) => {
    if (!id) return
    dispatch(deleteOrder(id))
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedOrders(
      checked ? filteredOrders.map((o) => o.id!) : []
    )
  }

  const handleSelectOrder = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    )
  }



  const handleRowClick = (order: any) => {
    localStorage.setItem("OrderId", order.id!);
    navigate("/productorderdetail");
  };






  const totalAgentCommission =
    selectedAgent !== "all"
      ? filteredOrders.reduce((sum, order) => {
        return (
          sum +
          (order.total * Number(selectedAgent.percentAge || 0)) / 100
        );
      }, 0)
      : 0;



  const agentPercentage =
    selectedAgent !== "all" ? Number(selectedAgent.percentAge || 0) : 0;

  const totalOrders = filteredOrders.length;

  const totalSales = filteredOrders.reduce((sum, order) => {
    return sum + order.total;
  }, 0);

  const agentRevenue =
    selectedAgent !== "all"
      ? filteredOrders.reduce((sum, order) => {
        return sum + (order.subtotal * agentPercentage) / 100;
      }, 0)
      : 0;

  const adminRevenue = totalSales - agentRevenue;





  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Revenue Invoice Report", 14, 20);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 14, 28);

    // Agent Info
    if (selectedAgent !== "all") {
      doc.setFontSize(12);
      doc.text("Agent Details", 14, 40);

      doc.setFontSize(10);
      doc.text(
        `Name: ${selectedAgent.firstName} ${selectedAgent.lastName}`,
        14,
        48
      );
      doc.text(`Email: ${selectedAgent.email}`, 14, 54);
      doc.text(`Phone: ${selectedAgent.number}`, 14, 60);
      doc.text(`Commission Rate: ${selectedAgent.percentAge}%`, 14, 66);
      doc.text(`Referral Code: ${selectedAgent.referralCode}`, 14, 72);
    }

    // Revenue Summary Table ✅ FIXED
    autoTable(doc, {
      startY: selectedAgent !== "all" ? 82 : 40,
      head: [["Metric", "Amount"]],
      body: [
        ["Total Orders", totalOrders.toString()],
        ["Total Sales", totalSales.toFixed(2)],
        ["Agent Revenue", agentRevenue.toFixed(2)],
        ["Admin Revenue", adminRevenue.toFixed(2)],
      ],
    });

    doc.save("revenue-invoice.pdf");
  };


  if (loading) {
    return (
      <Loader />
    );
  }




  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">
            Orders and Agents Revenue
          </CardTitle>

          {/* <Button size="sm" onClick={exportToPDF} className="text-white bg-gray-900  hover:bg-gray-700">
            <Download className="mr-2 h-4 w-4 " />
            Export to PDF
          </Button> */}
        </div>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by Order ID or Referral Code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select
            value={selectedAgent.id || "all"}
            onValueChange={(value) => {
              if (value === "all") {
                setSelectedAgent({ referralCode: "all" })
              } else {
                const agent = agents.find(a => a.id === value)
                setSelectedAgent(agent)
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select agent">
                {selectedAgent.referralCode === "all"
                  ? "All Agents"
                  : `${selectedAgent.firstName} ${selectedAgent.lastName}`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {agents.map((agent: any) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.firstName} {agent.lastName} ({agent.referralCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <ScrollArea className="h-[500px] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      selectedOrders.length === filteredOrders.length &&
                      filteredOrders.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Referral Code</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id!)}
                        onCheckedChange={() =>
                          handleSelectOrder(order.id!)
                        }
                      />
                    </TableCell>

                    <TableCell>{order?.orderId}</TableCell>
                    <TableCell>{order?.referralCode}</TableCell>
                    <TableCell>{order?.orderStatus?.status}</TableCell>

                    <TableCell>
                      {order.customer.firstName}{" "}
                      {order.customer.lastName}
                    </TableCell>

                    <TableCell>
                      {order.customer.city?.city}
                    </TableCell>

                    <TableCell className="font-semibold">
                      Rs. {order.total}
                    </TableCell>

                    <TableCell>
                      {new Date(order.orderDate || "").toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="bg-white">
                          <DialogHeader>
                            <DialogTitle>Products</DialogTitle>
                          </DialogHeader>

                          {order?.ProductOrder?.map((p) => (
                            <div
                              key={p.id}
                              className="flex justify-between text-sm"
                            >
                              <span>{p.product.name}</span>
                              <span>Rs. {p.product.price}</span>
                            </div>
                          ))}
                        </DialogContent>
                      </Dialog>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex space-x-2">


                        <Button variant="ghost" size="sm" onClick={() => handleRowClick(order)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {/* Details */}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Pagination */}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <CardContent>

          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-semibold">
                {selectedAgent === "all" ? "All Agents" : `Agent: ${selectedAgent.firstName} ${selectedAgent.lastName}`} Revenue
              </CardTitle>

              <Button size="sm" onClick={exportToPDF} className="text-white bg-gray-900  hover:bg-gray-700">
                <Download className="mr-2 h-4 w-4 " />
                Export Revenue
              </Button>
            </div>


            {selectedAgent !== "all" && (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Agent Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Commission %</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Referral Code</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Total Commission
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3">
                        {selectedAgent.firstName} {selectedAgent.lastName}
                      </td>
                      <td className="px-4 py-3">{selectedAgent.email}</td>
                      <td className="px-4 py-3">{selectedAgent.number}</td>
                      <td className="px-4 py-3">{selectedAgent.percentAge}%</td>
                      <td className="px-4 py-3">{selectedAgent.referralCode}</td>
                      <td className="px-4 py-3 font-semibold text-green-600">
                        {totalAgentCommission.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

          </CardHeader>
        </CardContent>

      </CardContent>
    </Card >
  )
}

export default OrderAgentsRevenue
