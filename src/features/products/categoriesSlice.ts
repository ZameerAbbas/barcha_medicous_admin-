/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebase"; // Assuming the path is correct
import {
  ref,
  push,
  update,
  remove,
  onValue,
} from "firebase/database";

export interface Category {
  id?: string; 
  name?: string;
  description?: string; 
  image?: string; 
}


interface CategoryState {
  categories: Category[];
  loading: boolean;
}

const initialState: CategoryState = {
  categories: [],
  loading: true,
};


export const startCategoriesRealtime = createAsyncThunk(
  "categories/startRealtime",
  async (_, { dispatch }) => {
    const categoriesRef = ref(db, "categories");

    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      const categories: Category[] = data
        ? Object.keys(data).map(id => ({
            id,
            ...data[id]
          }))
        : [];

      dispatch(setCategories(categories));
    });

    return unsubscribe; 
  }
);


export const addCategory = createAsyncThunk(
  "categories/add",
  async (category: Category) => {
    const categoriesRef = ref(db, "categories");
    const newRef = await push(categoriesRef, category);
    return { id: newRef.key!, ...category };
  }
);


export const updateCategory = createAsyncThunk(
  "categories/update",
  async (category: Category) => {
    if (!category.id) throw new Error("Category ID missing for update");

    const categoryRef = ref(db, `categories/${category.id}`);
    
    // Create a copy of the category data without the 'id' before pushing
    const { id, ...dataToUpdate } = category;

    await update(categoryRef, dataToUpdate);

    // Return the full category object for state update
    return category;
  }
);

// ---------------- Delete Category ----------------
/**
 * Removes a category from Firebase using its ID.
 */
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id: string) => {
    const categoryRef = ref(db, `categories/${id}`);
    await remove(categoryRef);
    return id; // Return the ID to filter it out from the state
  }
);


const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    /**
     * Reducer to set the categories array and mark loading as false.
     * Used internally by the `startCategoriesRealtime` thunk.
     */
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
      state.loading = false;
    },
  },
  // Handles the actions created by the async thunks
  extraReducers: builder => {
    builder
      // Handle successful addition
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      // Handle successful update
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
  
          state.categories[index] = action.payload;
        }
      })
      // Handle successful deletion
      .addCase(deleteCategory.fulfilled, (state, action) => {
        // Filter out the category with the deleted ID
        state.categories = state.categories.filter(c => c.id !== action.payload);
      });
  }
});

// Export the synchronous action
export const { setCategories } = categoriesSlice.actions;

// Export the reducer for the store
export default categoriesSlice.reducer;