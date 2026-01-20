/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { format } from "date-fns"

interface InvoicePrintProps {
    order: any

}

const InvoicePrint: React.FC<InvoicePrintProps> = ({ order }) => {
    const items = order?.ProductOrder || []

    const fullName = `${order?.customer.firstName} ${order?.customer.lastName}`

    const subtotal = items.reduce(
        (sum: number, item: any) => sum + item.product.price * item.quantity,
        0
    )

    const deliveryFee = parseFloat(order?.deliveryFee || "0")
    const discount = 0
    const total = subtotal + deliveryFee - discount

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 text-gray-900">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Invoice</h1>
                    <p className="text-gray-600">Order ID: {order?.orderId}</p>
                    <p className="text-gray-600">
                        Date: {format(new Date(order?.createdAt || Date.now()), "dd/MM/yyyy")}
                    </p>
                </div>
                <div className="flex items-center gap-2 font-sans">
                    <h2 className="text-2xl font-bold text-white tracking-wider">
                        <img
                            src={"../public/logo.png"}
                            alt="BARCHA Medicous"
                            className="w-15 h-15"
                        />
                    </h2>
                </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border rounded-lg p-4">
                <div>
                    <h2 className="font-semibold mb-2">Bill To</h2>
                    <p className="font-medium">{fullName}</p>
                    <p className="text-sm text-gray-600">{order?.customer.email}</p>
                    <p className="text-sm text-gray-600">{order?.customer.phone}</p>
                </div>

                <div>
                    <h2 className="font-semibold mb-2">Shipping Address</h2>
                    <p className="text-sm text-gray-600">{order?.customer.city.street}</p>
                    <p className="text-sm text-gray-600">
                        {order?.customer.city.city}, {order?.customer.city.stateProvince} {order?.customer.city.zipCode}
                    </p>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8 border-collapse">
                <thead>
                    <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-2">Item</th>
                        <th className="text-right py-2">Qty</th>
                        <th className="text-right py-2">Price</th>
                        <th className="text-right py-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item: any, index: number) => (
                        <tr key={index} className="border-b">
                            <td className="py-3">
                                <p className="font-medium">{item.product.name}</p>
                                {item.product.mg && (
                                    <p className="text-sm text-gray-500">{item.product.mg} mg</p>
                                )}
                            </td>
                            <td className="text-right">{item.quantity}</td>
                            <td className="text-right">Rs. {item.product.price.toFixed(2)}</td>
                            <td className="text-right">
                                Rs. {(item.product.price * item.quantity).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Summary */}
            <div className="flex justify-end">
                <div className="w-72 space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>Rs. {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>Rs. {deliveryFee.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Discount</span>
                        <span>Rs. {discount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between font-bold border-t pt-2">
                        <span>Total</span>
                        <span>Rs. {total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-10 text-center text-gray-600">
                <p>Thank you for your purchase!</p>
            </div>
        </div>
    )
}

export default InvoicePrint
