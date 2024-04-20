import { createAsyncThunk } from "@reduxjs/toolkit";
import 'react-toastify/dist/ReactToastify.css';
import { inviteMemberAPI,deleteMemberAPI,getMemberAssigneesAPI,assignMemberAPI } from '../../helpers/url_api'
import { APIClient } from "../../helpers/api_helper";
import { number } from "yup";
import { emit } from "process";
// import { resetProjectFlagChange } from "./reducer"

const api = new APIClient();
export const inviteMember = createAsyncThunk(
    "inviteMember",
    async ({ projectId, email }: { projectId: string, email: string }) => {
      try {
        console.log(projectId);
        const params = `${inviteMemberAPI}?project_id=${projectId}&email=${email}`;
        const response = await api.create(params);
        return response; // Return the response data to be handled by the slice reducer
      }  catch (error:any) {
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
        throw message;
        // throw error.response.data.message;
    }
});

export const assignMember = createAsyncThunk(
  "assignMember",
  async ({ task_id, user_id }: { task_id: number, user_id: number }) => {
    try {
      const data={
        task_id: task_id,
        user_id: user_id
      };
      const response = await api.create(assignMemberAPI,data);
      console.log(response);
      return response; // Return the response data to be handled by the slice reducer
    }  catch (error:any) {
      console.log(error);
      var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
       throw message;
  }
});

  export const deleteMember = createAsyncThunk(
    "deleteMemberAPI",
    async ({ projectId, user_id }: { projectId: number, user_id: number }) => {
      try {
        console.log(projectId);
        const params = `${deleteMemberAPI}?project_id=${projectId}&user_id=${user_id}`;
        const response = await api.deleteRequest(params);
        console.log(response);
        return response; // Return the response data to be handled by the slice reducer
      }  catch (error:any) {
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
        throw message;
    }
});
export const deleteAssign = createAsyncThunk(
  "deleteAssign",
  async ({ task_id, user_id }: { task_id: number, user_id: number }) => {
    try {
      console.log(task_id);
      const params = `${assignMemberAPI}?task_id=${task_id}&user_id=${user_id}`;
      const response = await api.deleteRequest(params);
      return response; // Return the response data to be handled by the slice reducer
    }  catch (error:any) {
      var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
       throw message;
  }
});
export const getMemberAssignees = createAsyncThunk(
  "getMemberAssignees",
  async ({ projectId, taskId }: { projectId: number, taskId: number }) => {
    try {
      console.log(projectId);
      const params = `${getMemberAssigneesAPI}?project_id=${projectId}&task_id=${taskId}`;
      const response = await api.get(params);
      console.log(response);
      return response; // Return the response data to be handled by the slice reducer
    }  catch (error:any) {
      var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
      throw message;
  }
});
// export const resetProjectFlag = () => {
//     try {
//         const response = resetProjectFlagChange();
//         return response;
//     } catch (error) {
//         return error;
//     }
// };

