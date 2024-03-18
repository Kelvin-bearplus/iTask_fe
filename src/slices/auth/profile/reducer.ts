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
      // console.log(state.success);
      state.user = action.payload.data
      // setTimeout(() => window.location.reload(), 1000)
    },
    profileError(state, action) {
        state.error = action.payload
        console.log(state.error)
    },
    editProfileChange(state){
      state = { ...state };
    },
    resetProfileFlagChange(state : any){
      state.success = null;
      state.error = null
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