import { createSlice } from "@reduxjs/toolkit";

const userPropertiesSlice = createSlice({
  name: 'userProperties',
  initialState: {
    userProperties: [],
    loading: false,
    error: false
  },
  reducers: {
    fetchUserPropertiesStart: (state) => {
      state.loading = true;
    },
    fetchUserPropertiesSuccess: (state, action) => {
      state.userProperties = action.payload;
      state.loading = false;
    },
    fetchUserPropertiesFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    updateUserProperties: (state, action) => {
      state.userProperties = [action.payload, ...state.userProperties];
    },
    updateVerifiedPropertyStatus: (state, action) => {
      const index = state.userProperties.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.userProperties[index] = { ...state.userProperties[index], ...{isVerified: "0"} };
      }
    },
    updateListingPropertyStatus: (state, action) => {
      const index = state.userProperties.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.userProperties[index] = { ...state.userProperties[index], ...{isListed: "0"} };
      }
    },
    updateProperty: (state, action) => {
      const index = state.userProperties.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.userProperties[index] = { ...state.userProperties[index], ...action.payload };
      }
    }
  }
});

export const { 
  fetchUserPropertiesStart, 
  fetchUserPropertiesSuccess, 
  fetchUserPropertiesFailure, 
  updateUserProperties, 
  updateVerifiedPropertyStatus,
  updateListingPropertyStatus,
  updateProperty
} = userPropertiesSlice.actions;

export default userPropertiesSlice.reducer;