
/* eslint-disable @typescript-eslint/no-explicit-any */




'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, PackageCheck, Package, Truck, CreditCard, XCircle, AlertCircle, Clock } from 'lucide-react'

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { useDispatch, } from "react-redux"
import type { AppDispatch } from "../app/store"
import OrderProgress from '../components/orderprogress'
import { updateOrder } from '../features/orderSlice'
import { get, ref } from 'firebase/database'
import { db } from '../firebase'




export default function ProductOrderDetail() {

  const dispatch = useDispatch<AppDispatch>()


  const [isupdate, setIsupdate] = useState(false)


  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    const orderId = localStorage.getItem("OrderId");
    if (!orderId) return;

    const orderRef = ref(db, `orders/${orderId}`);
    get(orderRef).then((snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        setOrder({ id: orderId, ...data });
      }
    }).catch((err) => console.error("Failed to fetch order:", err));
  }, []);
  useEffect(() => {
    const orderId = localStorage.getItem("OrderId");
    if (!orderId) return;

    const orderRef = ref(db, `orders/${orderId}`);
    get(orderRef).then((snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        setOrder({ id: orderId, ...data });
      }
    }).catch((err) => console.error("Failed to fetch order:", err));
  }, [isupdate]);







  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const statusPositionMap: Record<string, number> = {
    pending: 0,
    inroute: 1,
    delivered: 2,
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    try {
      const updateObject = {
        ...order,
        orderStatus: {
          position: statusPositionMap[newStatus.toLowerCase()] ?? 0,
          status: newStatus,
        },
      };

      await dispatch(updateOrder(updateObject)).unwrap();

      setIsupdate(!isupdate);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };










  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Order is placed': "bg-yellow-100 text-yellow-800 border-yellow-300",
      'Processing/Packed': "bg-blue-100 text-blue-800 border-blue-300",
      'Dispatched': "bg-purple-100 text-purple-800 border-purple-300",
      'Out for delivery': "bg-green-100 text-green-800 border-green-300",
      'Delivered': "bg-green-100 text-green-800 border-green-300",
      'Cancelled': "bg-red-100 text-red-800",
      'Refund Completed': "bg-green-100 text-green-800",
      'Refund Request': "bg-green-100 text-green-800",
    }
    return `${statusStyles[status as keyof typeof statusStyles]}`
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      'pending': <Clock className="h-4 w-4" />,
      'inroute': <Truck className="h-4 w-4" />,
      'delivered': <PackageCheck className="h-4 w-4" />,
      'cancelled': <XCircle className="h-4 w-4" />,
    }
    return icons[status as keyof typeof icons] || <AlertCircle className="h-4 w-4" />
  }

















  if (!order) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Order # {order?.orderId}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={getStatusBadge(order?.orderStatus?.status)}>
              {getStatusIcon(order?.orderStatus?.status)}
              <span className="ml-1">{order?.orderStatus?.status}</span>
            </Badge>

          </div>
          <p className="text-sm text-muted-foreground">{order?.orderDate?.split('T')[0]}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isLoading}>
                More actions
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">




              <DropdownMenuItem onClick={() => void handleStatusChange("pending")} disabled={order?.orderStatus?.status === 'Cancelled'} className="cursor-pointer">
                <Package className="h-4 w-4 mr-2" />
                Mark as Pending

              </DropdownMenuItem>


              <DropdownMenuItem onClick={() => void handleStatusChange("inroute")} disabled={order?.orderStatus?.status === 'Cancelled'} className="cursor-pointer">
                <Package className="h-4 w-4 mr-2" />
                Mark as In Route
              </DropdownMenuItem>


              <DropdownMenuItem onClick={() => void handleStatusChange("delivered")} disabled={order.orderStatus?.status === 'Cancelled'} className="cursor-pointer">
                <Package className="h-4 w-4 mr-2" />
                Mark as Order Delivered
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={() => setIsCancelDialogOpen(true)}
              // disabled={OrderSingle?.productOrder?.orderStatus?.status !== 'Order is placed'}

              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      <div className="mb-8">

        <OrderProgress currentStatus={order?.orderStatus?.status
        } />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="items" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-400 rounded-md p-1">
              <TabsTrigger
                value="items"
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow"
              >
                Order Items
              </TabsTrigger>
              <TabsTrigger
                value="summary"
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow"
              >
                Order Summary
              </TabsTrigger>
            </TabsList>

            <TabsContent value="items">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>
                    {order?.ProductOrder?.length} {order?.ProductOrder?.length === 1 ? 'item' : 'items'} in this order
                  </CardDescription>
                </CardHeader>
                <CardContent>


                  <div className="space-y-6">
                    {order?.ProductOrder?.map((item: any, index: any) => (
                      <div
                        key={index}
                        className="p-6 bg-muted/50 rounded-xl hover:bg-muted transition-colors border border-border/50"
                      >
                        <div className="flex flex-col justify-between lg:flex-row gap-6">
                          {/* Product Image and Basic Info */}
                          <div className="flex items-start gap-4">
                            <div className="relative h-24 w-24 rounded-xl overflow-hidden flex-shrink-0">
                              <img
                                src={item.product.productImage || "/placeholder.svg"}
                                alt={item.product.name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className=" text-ms ">{item?.product.description}</h3>

                              <span className="  ml-1 mr-1">
                                Dose: {item.product.mg}
                              </span>





                            </div>
                          </div>

                          {/* Pricing and Quantity */}
                          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 lg:gap-2 lg:min-w-[120px]">
                            <div className="text-right">
                              <p className="text-1xl font-bold text-foreground">
                                {"RS : "}


                                {
                                  item?.product.price * item?.quantity
                                }

                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-muted-foreground">Qty:</span>
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                                  {item?.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Products Price</span>
                      <span>
                        RS{" "}


                        {/* {
                          order?.ProductOrder?.reduce((total: number, item: any) => {
                            const price = item.product?.price ?? 0;
                            const quantity = item.quantity ?? 1;
                            const itemTotal = price * quantity;
                            return total + itemTotal;
                          }, 0).toFixed(2)
                        } */}

                        {order?.subtotal}{" "}


                      </span>


                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>
                        {order?.deliveryFee ?? "Free Delivery"}
                      </span>
                    </div>




                    <Separator />

                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>
                        {order?.total}{" "}



                      </span>

                    </div>
                  </div>
                </CardContent>

              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div>
                    <h3 className="font-medium mb-2">Delivery Address</h3>
                    <div className="p-4 bg-muted/50 rounded-lg relative text-sm space-y-1">
                      <p><strong>Name:</strong> {order?.customer?.firstName} {order?.customer?.lastName}</p>
                      <p><strong>Email:</strong> {order?.customer?.email}</p>
                      <p><strong>Phone:</strong> {order?.customer?.phone}</p>
                      <p><strong>Street:</strong> {order?.customer?.city?.street}</p>
                      <p><strong>City:</strong> {order?.customer?.city?.city}</p>
                      <p><strong>State/Province:</strong> {order?.customer?.city?.stateProvince}</p>
                      <p><strong>ZIP Code:</strong> {order?.customer?.city?.zipCode || "N/A"}</p>
                      <p><strong>Delivery Fee:</strong> {order?.customer?.city?.deliveryFee}</p>
                    </div>
                  </div>
                </div>


                <div>
                  <h3 className="font-medium mb-2">Status</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusBadge(order?.orderStatus?.status)}>
                      {getStatusIcon(order?.orderStatus?.status)}
                      <span className="ml-1">{order?.orderStatus?.status}</span>
                    </Badge>

                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                    <CreditCard className="h-4 w-4" />
                    <span className="capitalize">{"Cash On Delivery"}</span>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>


        </div>
      </div>


      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently cancel the order
              and notify the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
            // onClick={() => {

            //   ConfrmCancel()
            // }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </div >
  )
}


