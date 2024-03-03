import { createSlice } from "@reduxjs/toolkit";
interface EmptyObject {}

export const initialState = {
  error: "",
  success:"",
  user:{}
};

const ProfileSlice = createSlice({
  name: "Profile",
  initialState,
  reducers: { 
    profileSuccess(state, action) {
      state.success = action.payload.data;
      state.user = action.payload.data
    },
    profileError(state, action) {
        state.error = action.payload
    },
    editProfileChange(state){
      state = { ...state };
    },
    resetProfileFlagChange(state : any){
      state.success = null
    }
  },
});

export const {
    profileSuccess,
    profileError,
    editProfileChange,
    resetProfileFlagChange
} = ProfileSlice.actions

export default ProfileSlice.reducer;