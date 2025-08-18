import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import apiClient from '../../../api/apiClient'; // Import the configured axios instance

const API_URL = 'http://localhost:5001/api/courses';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

// Async Thunks
export const fetchAllCourses = createAsyncThunk('courses/fetchAll', async (_, { rejectWithValue }) => {
  try {
    // ✅ 3. Use apiClient with a relative path
    const res = await apiClient.get('/courses');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch courses');
  }
});

export const addCourse = createAsyncThunk('courses/add', async (courseData, { rejectWithValue }) => {
  // 👇 ADD LOGS HERE
  console.log('--- Starting addCourse thunk ---');
  console.log('Course data received:', courseData);
  
  try {
    console.log('Attempting API call to POST /courses...');
    
    const res = await apiClient.post('/courses', courseData);
    
    console.log('✅ API call successful. Response:', res.data);
    return res.data;
  } catch (err) {
    // This will catch any error, including config errors in apiClient
    console.error('💥 Error inside addCourse thunk:', err); 
    return rejectWithValue(err.response?.data?.message || 'Failed to create course');
  }
});
export const editCourse = createAsyncThunk('courses/edit', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    // ✅ 5. Use apiClient for PUT requests
    const res = await apiClient.put(`/courses/${id}`, updatedData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update course');
  }
});

export const removeCourse = createAsyncThunk('courses/remove', async (id, { rejectWithValue }) => {
  try {
    // ✅ 6. Use apiClient for DELETE requests
    await apiClient.delete(`/courses/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete course');
  }
});

// The Slice (No changes needed here)
const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.courses.unshift(action.payload);
      })
      .addCase(editCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.courses[index] = action.payload;
      })
      .addCase(removeCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(c => c._id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearError } = courseSlice.actions;
export default courseSlice.reducer;