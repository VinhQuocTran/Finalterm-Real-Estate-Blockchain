import { createSlice } from "@reduxjs/toolkit";

const authTokenCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('authToken='));

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: authTokenCookie ? authTokenCookie.split('=')[1] : null,
    loading: false,
    error: false
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
    },
    loginFailure: (state) => {
      state.loading = true;
      state.error = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = false;
    },
    updateUser: (state, action) => {
      console.log('before update:', state.user.cashBalance);

      // Create a new user object with updated properties
      const updatedUser = { ...state.user, ...action.payload };

      // Update the state with the new user object
      state.user = updatedUser;

      console.log('after update:', state.user.cashBalance);
    },
    updateCashBalance: (state, action) => {
      if (state.user) {
        state.user.cashBalance = action.payload;
      }
    },
    updateTokenBalance: (state, action) => {
      if (state.user) {
        state.user.tokenBalance = action.payload;
      }
    },
    decreaseCashBalance: (state, action) => {
      state.user.cashBalance -= action.payload;
    },
    increaseCashBalance: (state, action) => {
      state.user.cashBalance += action.payload;
    }
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  updateCashBalance,
  updateTokenBalance,
  decreaseCashBalance,
  increaseCashBalance
} = userSlice.actions;

export default userSlice.reducer;