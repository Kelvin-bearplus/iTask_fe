import { createSlice } from "@reduxjs/toolkit";
import { getProjectList, addProjectList, deleteProjectList,getProjectById,updateProjectById ,getSimpleProject,getUninvited} from './thunk';
export const initialState : any= {
    projectLists: [],
    error: "",
    toastData: "",
    
};
const ProjectsSlice = createSlice({
    name: 'ProjectsSlice',
    initialState,
    reducers: {
        resetProjectFlagChange(state : any) {
            state.toastData = "";
            state.error = "";
          },
    },
    extraReducers: (builder) => {
        builder.addCase(getProjectList.fulfilled, (state:any, action:any) => {
            state.projectLists = action.payload;
        });
        builder.addCase(getProjectList.rejected,(state:any, action:any) => {
            state.error = action.payload.error || null;
        });
        builder.addCase(getUninvited.fulfilled, (state:any, action:any) => {
            state.projectLists = action.payload;
        });
        builder.addCase(getUninvited.rejected,(state:any, action:any) => {
            state.error = action.payload || null;
        });
        builder.addCase(getSimpleProject.fulfilled, (state:any, action:any) => {
            // state.projectLists = action.payload;
        });
        builder.addCase(getSimpleProject.rejected,(state:any, action:any) => {
            state.error = action.payload.error || null;
        });
        builder.addCase(addProjectList.fulfilled, (state:any, action:any) => {
            state.toastData=action.payload.toastData;
            state.projectLists=action.payload;

        });
        builder.addCase(addProjectList.rejected, (state:any, action:any) => {
            console.log(action.payload)
            state.error = action.payload || null;
        });
        builder.addCase(getProjectById.fulfilled, (state:any, action:any) => {
            // state.projectLists=action.payload.data;
         
        });
        builder.addCase(getProjectById.rejected, (state:any, action:any) => {
            console.log(action.payload)
            state.error = action.payload || null;
        });
        builder.addCase(updateProjectById.fulfilled, (state:any, action:any) => {
    state.projectLists=action.payload;
    state.toastData="Update Project Success"
        });
        builder.addCase(updateProjectById.rejected, (state:any, action:any) => {
            console.log(action.payload)
            state.error = action.payload;
        });

        builder.addCase(deleteProjectList.fulfilled, (state:any, action:any) => {
            state.projectLists =action.payload;
        });
        builder.addCase(deleteProjectList.rejected, (state:any, action:any) => {
            state.error = action.payload;
        });
    }
});
export const {
    resetProjectFlagChange
  } = ProjectsSlice.actions;
export default ProjectsSlice.reducer;