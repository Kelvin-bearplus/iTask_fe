import { createSlice } from "@reduxjs/toolkit";
import { inviteMember,deleteMember,getMemberAssignees,assignMember,deleteAssign} from './thunk';
export const initialState : any= {
    projectLists: [],
    error: "",
    toastData: "",
    
};
const MemberSlide = createSlice({
    name: 'MemberSlide',
    initialState,
    reducers: {
        resetProjectFlagChange(state : any) {
            state.toastData = "";
            state.error = "";
          },
    },
    extraReducers: (builder) => {
        builder.addCase(inviteMember.fulfilled, (state:any, action:any) => {
            state.projectLists = action.payload;
        });
        builder.addCase(inviteMember.rejected,(state:any, action:any) => {
            state.error = action.payload;
        });
        builder.addCase(assignMember.fulfilled, (state:any, action:any) => {
            state.projectLists = action.payload;
        });
        builder.addCase(assignMember.rejected,(state:any, action:any) => {
            state.error = action.payload;
        });
        builder.addCase(getMemberAssignees.fulfilled, (state:any, action:any) => {
            state.projectLists = action.payload;
        });
        builder.addCase(getMemberAssignees.rejected,(state:any, action:any) => {
            state.error = action.payload;
        });
        builder.addCase(deleteMember.fulfilled, (state:any, action:any) => {
            state.projectLists = action.payload;
        });
        builder.addCase(deleteMember.rejected,(state:any, action:any) => {
            state.error = action.payload;
        });
        builder.addCase(deleteAssign.fulfilled, (state:any, action:any) => {
            state.projectLists = action.payload;
        });
        builder.addCase(deleteAssign.rejected,(state:any, action:any) => {
            state.error = action.payload;
        });
    }
});
export const {
    resetProjectFlagChange
  } = MemberSlide.actions;
export default MemberSlide.reducer;