import { createSlice } from "@reduxjs/toolkit";
import { inviteMember} from './thunk';
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
            state.error = action.payload.error || null;
        });
       
    }
});
export const {
    resetProjectFlagChange
  } = MemberSlide.actions;
export default MemberSlide.reducer;