import { createSlice } from "@reduxjs/toolkit";
import {getComment,createComment} from './thunk';
export const initialState : any= {
    commentList: [],
    error: "",
    toastData: "",
    
};
const ProjectsSlice = createSlice({
    name: 'CommentSlide',
    initialState,
    reducers: {
        resetProjectFlagChange(state : any) {
            state.toastData = "";
            state.error = "";
          },
    },
    extraReducers: (builder) => {
        builder.addCase(getComment.fulfilled, (state:any, action:any) => {
            state.projectLists = action.payload;
        });
        builder.addCase(getComment.rejected,(state:any, action:any) => {
            state.error = action.payload || null;
        });
        builder.addCase(createComment.fulfilled, (state:any, action:any) => {
            state.projectLists = action.payload;
        });
        builder.addCase(createComment.rejected,(state:any, action:any) => {
            state.error = action.payload || null;
        });
    }
});
export const {
    resetProjectFlagChange
  } = ProjectsSlice.actions;
export default ProjectsSlice.reducer;