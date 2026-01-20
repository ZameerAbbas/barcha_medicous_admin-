/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../firebase"; 
import {
  ref,
  push,
  update,
  remove,
  onValue,
} from "firebase/database";


export interface Agents {
  id?: string; // Optional for new addresses, mandatory for updates/deletes
  firstName: string;
  lastName: string;
   email: string;
   number: string;
   percentAge: number;
   referralCode?: string;
}


interface AgentsState {
  agents: Agents[];
  loading: boolean;
}

const initialState: AgentsState = {
  agents: [],
  loading: true,
};


export const startAgentsRealtime = createAsyncThunk(
  "agents/startRealtime",
  async (_, { dispatch }) => {
    const agentsRef = ref(db, "agents");

    const unsubscribe = onValue(agentsRef, (snapshot) => {
      const data = snapshot.val();
      const agents: Agents[] = data
        ? Object.keys(data).map(id => ({
            id,
            ...data[id]
          }))
        : [];

      dispatch(setAgents(agents));
    });

    return unsubscribe; 
  }
);


export const addAgent = createAsyncThunk(
  "agents/add",
  async (agent: Agents) => {
    const agentsRef = ref(db, "agents");
    const newRef = await push(agentsRef, agent);
    return { id: newRef.key!, ...agent };
  }
);


export const updateAgent = createAsyncThunk(
  "agents/update",
  async (agent: Agents) => {
    if (!agent.id) throw new Error("Agent ID missing for update");

    const agentRef = ref(db, `agents/${agent.id}`);
    
  

    const { id, ...dataToUpdate } = agent;

    await update(agentRef, dataToUpdate);

    return agent;
  }
);


export const deleteAgent = createAsyncThunk(
  "agents/delete",
  async (id: string) => {
    const agentRef = ref(db, `agents/${id}`);
    await remove(agentRef);
    return id; 
  }
);


const agentsSlice = createSlice({
  name: "agents",
  initialState,
  reducers: {
    
    setAgents(state, action: PayloadAction<Agents[]>) {
      state.agents = action.payload;
      state.loading = false;
    },
  },

  extraReducers: builder => {
    builder
     
      .addCase(addAgent.fulfilled, (state, action) => {
        state.agents.push(action.payload);
      })
     
      .addCase(updateAgent.fulfilled, (state, action) => {
        const index = state.agents.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.agents[index] = action.payload;
        }
      })

      .addCase(deleteAgent.fulfilled, (state, action) => {
        state.agents = state.agents.filter(a => a.id !== action.payload);
      });
  }
});


export const { setAgents } = agentsSlice.actions;

export default agentsSlice.reducer;