import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  forgetSuccessMsg: null,
  forgetError: null,
};

const forgotPasswordSlice = createSlice({
  name: "forgotpwd",
  initialState,
  reducers: {
      userForgetPasswordSuccess(state, action) {
          state.forgetSuccessMsg = action.payload
      },
      userForgetPasswordError(state, action) {
          state.forgetError = action.payload
      },
      userForgetPasswordFlag(state) {
        state.forgetError = null;
        state.forgetSuccessMsg=null;
    },
  },
});

export const {
  userForgetPasswordSuccess,
  userForgetPasswordError,
  userForgetPasswordFlag
} = forgotPasswordSlice.actions

export default forgotPasswordSlice.reducer;
