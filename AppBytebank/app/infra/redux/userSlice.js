import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserById, getUsers } from "../../domain/usecases/util.service";
import { CacheService } from "../cache/cache.service";

const initialState = {
  currentUser: null,
  allUsers: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

/**
 * 🔹 THUNK: Busca usuário por ID com cache
 */
export const fetchUserById = createAsyncThunk(
  "user/fetchById",
  async (userId, { rejectWithValue }) => {
    try {
      const cacheKey = `user_${userId}`;
      const cached = await CacheService.get(cacheKey);
      if (cached) {
        console.log("⚡ [Redux] fetchUserById retornando do cache");
        return cached;
      }

      console.log("🌐 [Redux] fetchUserById requisitando servidor");
      const user = await getUserById(userId);

      if (user) await CacheService.set(cacheKey, user);
      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * 🔹 THUNK: Busca todos os usuários (lista)
 */
export const fetchUsers = createAsyncThunk(
  "user/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const cacheKey = "users_all";
      const cached = await CacheService.get(cacheKey);
      if (cached) {
        console.log("⚡ [Redux] fetchUsers retornando do cache");
        return cached;
      }

      console.log("🌐 [Redux] fetchUsers requisitando servidor");
      const users = await getUsers();
      const json = await users.json();

      await CacheService.set(cacheKey, json);
      return json;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * 🔹 Re-hidrata Redux com cache salvo
 */
export const rehydrateUserState = createAsyncThunk(
  "user/rehydrate",
  async () => {
    const allUsers = (await CacheService.get("users_all")) || [];
    const lastUser = allUsers.length > 0 ? allUsers[0] : null;
    console.log("♻️ [Redux] Estado reidratado do cache");
    return { allUsers, lastUser };
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
      state.status = "idle";
    },
    setUser: (state, action) => {
      state.currentUser = action.payload; // ✅ permite atualizar o usuário diretamente
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
      })

      .addCase(rehydrateUserState.fulfilled, (state, action) => {
        state.allUsers = action.payload.allUsers;
        state.currentUser = action.payload.lastUser;
      });
  },
});

export const { clearUser, setUser } = userSlice.actions;
export default userSlice.reducer;
