import { createSlice } from "@reduxjs/toolkit";
import { getProjectChartsData, getProjectStatusChartsData,getProjectActive,getTaskAssigned,getPTaskDone } from './thunk';

export const initialState = {
  projectData: [],
  projectStatusData: [],
  error: {}
};


const DashboardProjectSlice = createSlice({
  name: 'DashboardProject',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectChartsData.fulfilled, (state:any, action:any) => {
      state.projectData = action.payload;
    });
    builder.addCase(getProjectChartsData.rejected, (state:any, action:any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(getProjectStatusChartsData.fulfilled, (state:any, action:any) => {
      state.projectStatusData = action.payload;
    });
    builder.addCase(getProjectStatusChartsData.rejected, (state:any, action:any) => {
      state.error = action.payload.error || null;
    });
    builder.addCase(getProjectActive.fulfilled, (state:any, action:any) => {
      state.projectData = action.payload;
    });
    builder.addCase(getProjectActive.rejected, (state:any, action:any) => {
      state.error = action.payload || null;
    });
    builder.addCase(getPTaskDone.fulfilled, (state:any, action:any) => {
      state.projectData = action.payload;
    });
    builder.addCase(getPTaskDone.rejected, (state:any, action:any) => {
      state.error = action.payload || null;
    });
    builder.addCase(getTaskAssigned.fulfilled, (state:any, action:any) => {
      state.projectData = action.payload;
    });
    builder.addCase(getTaskAssigned.rejected, (state:any, action:any) => {
      state.error = action.payload || null;
    });
  }
});

export default DashboardProjectSlice.reducer;