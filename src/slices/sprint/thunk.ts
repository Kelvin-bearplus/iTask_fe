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
    async (projectId:number) => {
      try {
        console.log(projectId);
        const params = `${getSprintAPI}/${projectId}`;
        const response = await api.get(params);
        return response; // Return the response data to be handled by the slice reducer
      }  catch (error:any) {
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
        throw message;
        // throw error.response.data.message;
    }
});

