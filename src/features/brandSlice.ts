/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk,  } from "@reduxjs/toolkit";
import  type { PayloadAction  } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { ref, push, update, remove, onValue, get } from "firebase/database";


export interface BrandOrder {
  id?: string;
  brand: string; 
}

interface BrandState {
  brandOrders: BrandOrder[];
  loading: boolean;
}

const initialState: BrandState = {
  brandOrders: [],
  loading: true,
};

export const startBrandRealtime = createAsyncThunk(
  "brand/startRealtime",
  async (_, { dispatch }) => {
    const brandRef = ref(db, "brand");
    onValue(brandRef, (snapshot) => {
      const data = snapshot.val();
      const brandOrders: BrandOrder[] = data
        ? Object.keys(data).map((id) => ({
            id,
            ...data[id],
          }))
        : [];

      dispatch(setBrandOrders(brandOrders));
    });
  }
);

export const addBrandOrder = createAsyncThunk(
  "brand/add",
  async (order: BrandOrder) => {
    const brandRef = ref(db, "brand");

    const { id, ...payload } = order;

    const newRef = await push(brandRef, {
      ...payload,
      
    });

    return { id: newRef.key!, ...order };
  }
);

export const updateBrandOrder = createAsyncThunk(
  "brand/update",
  async (order: BrandOrder) => {
    if (!order.id) throw new Error("Order ID missing");

    const brandRef = ref(db, `brand/${order.id}`);

    const {
      brand,
    } = order;

    await update(brandRef, {
      brand,
    });

    const snapshot = await get(brandRef);
    const updated = snapshot.val();

    return { id: order.id, ...updated } as BrandOrder;
  }
);

/* ------------------ Get Brand Order By ID ------------------ */
export const getBrandOrderById = createAsyncThunk(
  "brand/getById",
  async (id: string) => {
    const snapshot = await get(ref(db, `brand/${id}`));
    const data = snapshot.val();
    return data ? ({ id, ...data } as BrandOrder) : null;
  }
);

/* ------------------ Delete Brand Order ------------------ */
export const deleteBrandOrder = createAsyncThunk(
  "brand/delete",
  async (id: string) => {
    await remove(ref(db, `brand/${id}`));
    return id;
  }
);

/* ------------------ Slice ------------------ */
const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setBrandOrders(state, action: PayloadAction<BrandOrder[]>) {
      state.brandOrders = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBrandOrder.fulfilled, (state, action) => {
        state.brandOrders.push(action.payload);
      })
      .addCase(updateBrandOrder.fulfilled, (state, action) => {
        const index = state.brandOrders.findIndex(
          (o) => o.id === action.payload.id
        );
        if (index !== -1) state.brandOrders[index] = action.payload;
      })
      .addCase(deleteBrandOrder.fulfilled, (state, action) => {
        state.brandOrders = state.brandOrders.filter(
          (o) => o.id !== action.payload
        );
      })
   
  },
});

export const { setBrandOrders } = brandSlice.actions;
export default brandSlice.reducer;
