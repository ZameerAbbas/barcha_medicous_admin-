// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
// import ordersReducer from '../features/orders/ordersSlice';
// import categoriesReducer from '../features/categories/categoriesSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    // orders: ordersReducer,
    // categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
