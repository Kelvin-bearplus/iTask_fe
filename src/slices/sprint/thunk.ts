import { createAsyncThunk } from "@reduxjs/toolkit";
import 'react-toastify/dist/ReactToastify.css';
import { getSprintAPI } from '../../helpers/url_api'
import { APIClient } from "../../helpers/api_helper";
import { number } from "yup";
import { emit } from "process";
// import { resetProjectFlagChange } from "./reducer"

const api = new APIClient();
export const getSprint = createAsyncThunk(
    "getSprint",
    async({projectId,type}:{projectId:number,type?:number[]}) => {
      try {
        if(type!==undefined){
          const queryString = type.map((id: number) => `epic_id=${id}`).join("&");
          const params = `${getSprintAPI}/${projectId}?${queryString}`;
          const response = await api.get(params);
          return response; // Return the response data to be handled by the slice reducer
        }
      else{
        const params = `${getSprintAPI}/${projectId}`;
        const response = await api.get(params);
        return response; // Return the response data to be handled by the slice reducer
      }

      }  catch (error:any) {
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
        throw message;
        // throw error.response.data.message;
    }
});
export const createSprint = createAsyncThunk(
  "createSprint",
  async (data:any) => {
    try {
      console.log(data);
      const response = await api.create(getSprintAPI,data);
      return response; // Return the response data to be handled by the slice reducer
    }  catch (error:any) {
      var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
      throw message;
      // throw error.response.data.message;
  }
});
export const deleteSprint = createAsyncThunk(
  "deleteSprint",
  async (id:number) => {
    try {
      const url = getSprintAPI+'/'+id
      const response = await api.deleteRequest(url);
      return response; // Return the response data to be handled by the slice reducer
    }  catch (error:any) {
      var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
      throw message;
      // throw error.response.data.message;
  }
});
export const editSprint = createAsyncThunk(
  "editSprint",
  async ({id, data}:{id:number,data:any}) => {
    try {
      const url = getSprintAPI+'/'+id;
      const response = await api.create(url,data);
      return response; // Return the response data to be handled by the slice reducer
    }  catch (error:any) {
      var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
      throw message;
      // throw error.response.data.message;
  }
});
