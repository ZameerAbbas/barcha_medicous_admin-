/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { ref, push, update, remove, onValue, get } from "firebase/database";

/* ------------------ User Interface ------------------ */
export interface UserData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city?: string;
  referralCode?: string;
}

/* ------------------ Slice State ------------------ */
interface UserState {
  users: UserData[];
  loading: boolean;
}

const initialState: UserState = {
  users: [],
  loading: true,
};

/* ------------------ Realtime Users ------------------ */
export const startUsersRealtime = createAsyncThunk(
  "users/startRealtime",
  async (_, { dispatch }) => {
    const usersRef = ref(db, "users");

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const users: UserData[] = data
        ? Object.keys(data).map((id) => ({
            id,
            ...data[id],
          }))
        : [];

      dispatch(setUsers(users));
    });
  }
);

/* ------------------ Add User ------------------ */
export const addUser = createAsyncThunk(
  "users/add",
  async (user: UserData) => {
    const usersRef = ref(db, "users");
    const { id, ...payload } = user;

    const newRef = await push(usersRef, payload);

    return { id: newRef.key!, ...payload };
  }
);

/* ------------------ Update User ------------------ */
export const updateUser = createAsyncThunk(
  "users/update",
  async (user: UserData) => {
    if (!user.id) throw new Error("User ID missing");

    const userRef = ref(db, `users/${user.id}`);
    const { firstName, lastName, email, phone, city, referralCode } = user;

    await update(userRef, { firstName, lastName, email, phone, city, referralCode });

    const snapshot = await get(userRef);
    const updated = snapshot.val();

    return { id: user.id, ...updated } as UserData;
  }
);

/* ------------------ Get User by ID ------------------ */
export const getUserById = createAsyncThunk(
  "users/getById",
  async (id: string) => {
    const snapshot = await get(ref(db, `users/${id}`));
    const data = snapshot.val();
    return data ? ({ id, ...data } as UserData) : null;
  }
);

/* ------------------ Delete User ------------------ */
export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: string) => {
    await remove(ref(db, `users/${id}`));
    return id;
  }
);

/* ------------------ Slice ------------------ */
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<UserData[]>) {
      state.users = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;