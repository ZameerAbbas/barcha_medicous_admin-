/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { ref, push, update, remove, onValue, get } from "firebase/database";



import type { Address } from "./adress/addressSlice";
import type { Product } from "./products/productsSlice";


export interface IForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: Address | null;
}



export interface Order {
  orderDate?: any;
  orderId: string;
  id?: string;
  customer: IForm;
  ProductOrder: Product[];
  subtotal: number;
  deliveryFee: number;
  total?: any;
  orderStatus?:any
  referralCode?:any
}

interface OrderState {
  orders: Order[];
  loading: boolean;
}

const initialState: OrderState = {
  orders: [],
  loading: true,
};

/* ------------------ Realtime Fetch Orders ------------------ */
export const startOrdersRealtime = createAsyncThunk(
  "orders/startRealtime",
  async (_, { dispatch }) => {
    const ordersRef = ref(db, "orders");

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const orders: Order[] = data
        ? Object.keys(data).map((id) => ({
            id,
            ...data[id],
          }))
        : [];

      dispatch(setOrders(orders));
    });

    return unsubscribe;
  }
);

/* ------------------ Add Order ------------------ */
export const addOrder = createAsyncThunk(
  "orders/add",
  async (order: Order) => {
    const ordersRef = ref(db, "orders");

    const { id, ...dataToPush } = order;

    const newRef = await push(ordersRef, {
      ...dataToPush,
      createdAt: new Date().toISOString(),
      total: dataToPush.subtotal + dataToPush.deliveryFee,
    });

    return { id: newRef.key!, ...order };
  }
);

/* ------------------ Update Order ------------------ */
export const updateOrder = createAsyncThunk(
  "orders/update",
  async (order: Order) => {
    if (!order.id) throw new Error("Order ID missing");

    const orderRef = ref(db, `orders/${order.id}`);
    const { customer, ProductOrder, subtotal, deliveryFee, orderId, orderStatus } = order;

    // Update the order
    await update(orderRef, {
      customer,
      ProductOrder,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      orderId,
      orderStatus,
    });

    // Fetch the updated order
    const snapshot = await get(orderRef);
    const updatedOrder = snapshot.val();
    if (!updatedOrder) throw new Error("Failed to fetch updated order");

    return { id: order.id, ...updatedOrder } as Order;
  }
);


export const getOrderById = createAsyncThunk(
  "orders/getById",
  async (id: string) => {
    const orderRef = ref(db, `orders/${id}`);
    const snapshot = await get(orderRef); // fetch once
    const data = snapshot.val();
    if (data) {
      return { id, ...data } as Order;
    }
    return null;
  }
);

/* ------------------ Delete Order ------------------ */
export const deleteOrder = createAsyncThunk(
  "orders/delete",
  async (id: string) => {
    const orderRef = ref(db, `orders/${id}`);
    await remove(orderRef);
    return id;
  }
);

/* ------------------ Slice ------------------ */
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o.id === action.payload.id
        );
        if (index !== -1) state.orders[index] = action.payload;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o.id !== action.payload);
      })
       .addCase(getOrderById.fulfilled, (state, action) => {
        const order = action.payload;
        if (order) {
          const index = state.orders.findIndex((o) => o.id === order.id);
          if (index !== -1) state.orders[index] = order;
          else state.orders.push(order);
        }
      });
  },
});

export const { setOrders } = orderSlice.actions;
export default orderSlice.reducer;
