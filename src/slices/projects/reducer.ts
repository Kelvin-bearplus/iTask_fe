import { createSlice } from "@reduxjs/toolkit";
import { getProjectList, addProjectList, updateProjectList, deleteProjectList } from './thunk';
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
            state.projectLists = action.payload.data;
        });
        builder.addCase(getProjectList.rejected,(state:any, action:any) => {
            state.error = action.payload.error || null;
        });
        builder.addCase(addProjectList.fulfilled, (state:any, action:any) => {
            state.projectLists.push(action.payload);
            state.toastData=action.payload.toastData;
           if (action.payload.error){
            state.error=action.payload.error;
           }
           console.log(state.error)

        });
        builder.addCase(addProjectList.rejected, (state:any, action:any) => {
            console.log(action.payload)
            state.error = action.payload || null;
        });
        builder.addCase(updateProjectList.fulfilled, (state:any, action:any) => {
            state.projectLists = state.projectLists.map((project:any) =>
                project._id.toString() === action.payload.data._id.toString()
                    ? { ...project, ...action.payload.data }
                    : project
            );
        });
        builder.addCase(updateProjectList.rejected, (state:any, action:any) => {
            state.error = action.payload.error || null;
        });
        builder.addCase(deleteProjectList.fulfilled, (state:any, action:any) => {
            state.projectLists = state.projectLists.filter((project:any) => project.id.toString() !== action.payload.id.toString());
        });
        builder.addCase(deleteProjectList.rejected, (state:any, action:any) => {
            state.error = action.payload.error || null;
        });
    }
});
export const {
    resetProjectFlagChange
  } = ProjectsSlice.actions;
export default ProjectsSlice.reducer;