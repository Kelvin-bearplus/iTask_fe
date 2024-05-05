import { createSlice } from "@reduxjs/toolkit";
import { getSprint} from './thunk';
export const initialState : any= {
    sprintList: [],
    error: "",
    toastData: "",
    
};
const SpintSlide = createSlice({
    name: 'SpintSlide',
    initialState,
    reducers: {
        resetProjectFlagChange(state : any) {
            state.toastData = "";
            state.error = "";
          },
    },
    extraReducers: (builder) => {
      builder.addCase(getSprint.fulfilled, (state:any, action:any) => {
          state.sprintList = action.payload;
      });
      builder.addCase(getSprint.rejected,(state:any, action:any) => {
          state.error = action.payload;
      });
    
  }
});
export const {
    resetProjectFlagChange
  } = SpintSlide.actions;
export default SpintSlide.reducer;