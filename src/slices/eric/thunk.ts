import { createAsyncThunk } from "@reduxjs/toolkit";
import 'react-toastify/dist/ReactToastify.css';
import { getOneEricAPI } from '../../helpers/url_api'
import { APIClient } from "../../helpers/api_helper";
// import { resetProjectFlagChange } from "./reducer"

const api = new APIClient();
export const getEric = createAsyncThunk(
    "getEric",
    async (ericId:number) => {
      try {
        console.log(ericId);
        const params = `${getOneEricAPI}/${ericId}`;
        const response = await api.get(params);
        return response.data; // Return the response data to be handled by the slice reducer
      }  catch (error:any) {
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
        throw message;
        // throw error.response.data.message;
    }
});

