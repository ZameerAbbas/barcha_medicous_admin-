// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
// import ordersReducer from '../features/orders/ordersSlice';
import categoriesReducer from '../features/products/categoriesSlice';
import addressSlice from '../features/adress/addressSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    addresses: addressSlice,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
