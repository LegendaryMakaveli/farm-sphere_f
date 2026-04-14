import { createSlice } from '@reduxjs/toolkit';

const storedUser = JSON.parse(localStorage.getItem('farmsphere_user') || 'null');
const storedToken = localStorage.getItem('farmsphere_token') || null;

const initialState = {
  user: storedUser,
  token: storedToken,
  roles: storedUser?.roles || [],
  profileStatus: storedUser?.profileStatus || null,
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const payload = action.payload;
      state.token = payload.token || state.token;
      
      // Merge user data to prevent losing fields (address, gender, age) missing in lean responses
      state.user = { 
        ...state.user, 
        ...payload,
        roles: payload.roles ? [...payload.roles] : (state.user?.roles || [])
      };
      
      state.roles = state.user.roles;
      state.profileStatus = state.user.profileStatus;
      state.isAuthenticated = true;

      localStorage.setItem('farmsphere_token', state.token);
      localStorage.setItem('farmsphere_user', JSON.stringify(state.user));
    },

    updateProfileStatus: (state, action) => {
      state.profileStatus = action.payload;
      if (state.user) {
        state.user.profileStatus = action.payload;
        localStorage.setItem('farmsphere_user', JSON.stringify(state.user));
      }
    },

    updateRoles: (state, action) => {
      state.roles = [...action.payload];
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.roles = [];
      state.profileStatus = null;
      state.isAuthenticated = false;
      localStorage.removeItem('farmsphere_token');
      localStorage.removeItem('farmsphere_user');
    },
  },
});

export const { setCredentials, updateProfileStatus, updateRoles, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectRoles = (state) => state.auth.roles;
export const selectProfileStatus = (state) => state.auth.profileStatus;
export const selectIsFarmer = (state) => state.auth.roles.includes('FARMER');
export const selectIsInvestor = (state) => state.auth.roles.includes('INVESTOR');
export const selectIsAdmin = (state) => state.auth.roles.includes('ADMIN');
export const selectIsUser = (state) => state.auth.roles.includes('USER');

export default authSlice.reducer;
