import { createSlice } from "@reduxjs/toolkit";
import { getSprint,createSprint,deleteSprint,editSprint} from './thunk';
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
      builder.addCase(createSprint.fulfilled, (state:any, action:any) => {
        state.sprintList = action.payload;
    });
    builder.addCase(createSprint.rejected,(state:any, action:any) => {
        state.error = action.payload;
    });
    builder.addCase(deleteSprint.fulfilled, (state:any, action:any) => {
        state.sprintList = action.payload;
    });
    builder.addCase(deleteSprint.rejected,(state:any, action:any) => {
        state.error = action.payload;
    });
    builder.addCase(editSprint.fulfilled, (state:any, action:any) => {
        state.sprintList = action.payload;
    });
    builder.addCase(editSprint.rejected,(state:any, action:any) => {
        state.error = action.payload;
    });
  }
});
export const {
    resetProjectFlagChange
  } = SpintSlide.actions;
export default SpintSlide.reducer;