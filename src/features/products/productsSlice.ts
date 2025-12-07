// src/features/products/productsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";

export interface Product {
  id?: string;
  name: string;
  price: number;
  category: string;
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
    const productsRef = collection(db, "products");

    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const products: Product[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      dispatch(setProducts(products));
    });

    return unsubscribe; // call unsubscribe() on component unmount
  }
);

// ---------------- CRUD Actions ----------------
export const addProduct = createAsyncThunk(
  "products/add",
  async (product: Product) => {
    const docRef = await addDoc(collection(db, "products"), product);
    return { id: docRef.id, ...product };
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async (product: Product) => {
    if (!product.id) throw new Error("Product ID missing");
    await updateDoc(doc(db, "products", product.id), {
      name: product.name,
      price: product.price,
      category: product.category
    });
    return product;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string) => {
    await deleteDoc(doc(db, "products", id));
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
