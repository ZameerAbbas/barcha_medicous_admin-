/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebase"; 
import {
  ref,
  push,
  update,
  remove,
  onValue,
} from "firebase/database";


export interface Address {
  id?: string; // Optional for new addresses, mandatory for updates/deletes
  street: string;
  city: string;
  stateProvince: string;
  zipCode: string;
  deliveryFee: string;
  deliveryFree: string;
  // userId?: string; // Optional: If addresses are linked to a specific user
}


interface AddressState {
  addresses: Address[];
  loading: boolean;
}

const initialState: AddressState = {
  addresses: [],
  loading: true,
};


export const startAddressesRealtime = createAsyncThunk(
  "addresses/startRealtime",
  async (_, { dispatch }) => {
    const addressesRef = ref(db, "addresses");

    const unsubscribe = onValue(addressesRef, (snapshot) => {
      const data = snapshot.val();
      const addresses: Address[] = data
        ? Object.keys(data).map(id => ({
            id,
            ...data[id]
          }))
        : [];

      dispatch(setAddresses(addresses));
    });

    return unsubscribe; 
  }
);


export const addAddress = createAsyncThunk(
  "addresses/add",
  async (address: Address) => {
    const addressesRef = ref(db, "addresses");
    const newRef = await push(addressesRef, address);
    return { id: newRef.key!, ...address };
  }
);


export const updateAddress = createAsyncThunk(
  "addresses/update",
  async (address: Address) => {
    if (!address.id) throw new Error("Address ID missing for update");

    const addressRef = ref(db, `addresses/${address.id}`);
    
   
    const { id, ...dataToUpdate } = address;

    await update(addressRef, dataToUpdate);

    return address;
  }
);


export const deleteAddress = createAsyncThunk(
  "addresses/delete",
  async (id: string) => {
    const addressRef = ref(db, `addresses/${id}`);
    await remove(addressRef);
    return id; 
  }
);


const addressSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    
    setAddresses(state, action: PayloadAction<Address[]>) {
      state.addresses = action.payload;
      state.loading = false;
    },
  },

  extraReducers: builder => {
    builder
     
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
     
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(a => a.id !== action.payload);
      });
  }
});


export const { setAddresses } = addressSlice.actions;

export default addressSlice.reducer;