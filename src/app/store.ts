
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import categoriesReducer from '../features/products/categoriesSlice';
import addressReducer from '../features/adress/addressSlice';
import ordersReducer from "../features/orderSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    addresses: addressReducer,
    categories: categoriesReducer,
    orders:ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
