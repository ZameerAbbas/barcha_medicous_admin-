/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import {
  ref,
  push,
  update,
  remove,
  onValue
} from "firebase/database";


export interface Product {
  id?: string;
  name: string;
  price: number;
  categoryId: string; 
  description: string;
  productImage: string;
  mg: number;
}

interface ProductState {
  products: Product[];
  loading: boolean;
}

const initialState: ProductState = {
  products: [],
  loading: true,
};

// ---------------- Realtime Fetch ----------------
export const startProductsRealtime = createAsyncThunk(
  "products/startRealtime",
  async (_, { dispatch }) => {
    const productsRef = ref(db, "products");

    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const products: Product[] = data
        ? Object.keys(data).map(id => ({
            id,
            ...data[id]
          }))
        : [];

      dispatch(setProducts(products));
    });

    return unsubscribe;
  }
);

// ---------------- Add Product ----------------
// The product argument now expects all the new fields
export const addProduct = createAsyncThunk(
  "products/add",
  async (product: Product) => {
    const productsRef = ref(db, "products");
    
    // Ensure all data except the temporary 'id' is pushed
    const { id, ...dataToPush } = product; 

    const newRef = await push(productsRef, dataToPush);
    return { id: newRef.key!, ...product };
  }
);

// ---------------- Update Product ----------------
// The product argument now expects all the new fields
export const updateProduct = createAsyncThunk(
  "products/update",
  async (product: Product) => {
    if (!product.id) throw new Error("Product ID missing");

    const productRef = ref(db, `products/${product.id}`);

    // Destructure the product to explicitly specify fields for the update payload
    const { name, price, categoryId, description, productImage, mg } = product;

    await update(productRef, {
      name,
      price,
      categoryId,
      description,
      productImage,
      mg
    });

    return product;
  }
);

// ---------------- Delete Product ----------------
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string) => {
    const productRef = ref(db, `products/${id}`);
    await remove(productRef);
    return id;
  }
);

// ---------------- Slice ----------------
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      });
  }
});

export const { setProducts } = productsSlice.actions;
export default productsSlice.reducer;