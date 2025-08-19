import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

// --- Thunks ---
export const fetchAllMembers = createAsyncThunk(
   'members/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/admin/members');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch members');
    }
  }
);

export const fetchAllAdmins = createAsyncThunk(
  'members/fetchAllAdmins',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/admin/admins');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch admins');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'members/updateRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const res = await apiClient.put(`/admin/users/${userId}/role`, { role });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update role');
    }
  }
);

const memberSlice = createSlice({
  name: 'members',
  initialState: {
    members: [],
    admins: [], // ✅ Add state for admins
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetching
      .addCase(fetchAllMembers.pending, (state) => { state.loading = true; })
      .addCase(fetchAllMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchAllMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllAdmins.fulfilled, (state, action) => {
        state.admins = action.payload;
      })
      
      // Role Update
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        // Remove user from both lists first to handle promotion/demotion
        state.members = state.members.filter(m => m._id !== updatedUser._id);
        state.admins = state.admins.filter(a => a._id !== updatedUser._id);

        // Add the updated user to the correct list
        if (updatedUser.role === 'admin') {
          state.admins.push(updatedUser);
        } else {
          state.members.push(updatedUser);
        }
      });
  },
});

export default memberSlice.reducer;