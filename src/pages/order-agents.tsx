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


import {
  startAgentsRealtime,

} from "../features/agentsSlice";

const OrderAgents = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const { orders, loading } = useSelector(
    (state: RootState) => state.orders
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("all")


  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const { agents } = useSelector((state: RootState) => state.agents);

  const pageSize = 10
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(startOrdersRealtime())
    dispatch(startAgentsRealtime())
  }, [dispatch])


  console.log("statusFilter", selectedAgent)
  console.log("agents", agents)

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchSearch =
          searchTerm === "" || order.id?.toString().includes(searchTerm) || order.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchStatus =
          selectedAgent === "all" || order?.referralCode === selectedAgent
        // Both conditions must be true
        return matchSearch && matchStatus
      })
      .sort((a, b) => {
        const dateA = new Date(a.orderDate).getTime()
        const dateB = new Date(b.orderDate).getTime()
        return dateB - dateA
      })
  }, [orders, searchTerm, selectedAgent])


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

  const exportToPDF = () => {
    console.log("Export orders:", filteredOrders)
    alert("PDF export logic can be added here")
  }

  const handleRowClick = (order: any) => {
    localStorage.setItem("OrderId", order.id!);
    navigate("/productorderdetail");
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
            All Orders
          </CardTitle>

          <Button size="sm" onClick={exportToPDF} className="text-white bg-gray-900  hover:bg-gray-700">
            <Download className="mr-2 h-4 w-4 " />
            Export to PDF
          </Button>
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

          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {agents.map((agent: any) => (
                <SelectItem key={agent.id} value={agent.referralCode}>
                  {agent.firstName} {agent.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <ScrollArea className="h-[600px] border rounded-md">
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
      </CardContent>
    </Card>
  )
}

export default OrderAgents
