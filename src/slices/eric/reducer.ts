import { createSlice } from "@reduxjs/toolkit";
import { getEric} from './thunk';
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
      builder.addCase(getEric.fulfilled, (state:any, action:any) => {
          state.sprintList = action.payload;
      });
      builder.addCase(getEric.rejected,(state:any, action:any) => {
          state.error = action.payload;
      });
     
  }
});
export const {
    resetProjectFlagChange
  } = SpintSlide.actions;
export default SpintSlide.reducer;