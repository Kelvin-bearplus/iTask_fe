import { createAsyncThunk } from "@reduxjs/toolkit";
import 'react-toastify/dist/ReactToastify.css';
import { getCommentAPI } from '../../helpers/url_api'
import { APIClient } from "../../helpers/api_helper";
// import { resetProjectFlagChange } from "./reducer"

const api = new APIClient();
export const getComment = createAsyncThunk("getComment", async ({ inPage, limit, taskId  }: { inPage:number, limit:number , taskId:number}) => {
    try {
    
            const params = {
                page: inPage,
                limit: limit,
                task_id: taskId,
                
            };
            console.log(params);
            // Sử dụng tham số inPage và limit trong request API
            const response = await api.get(getCommentAPI, params);
            console.log(response);
            return response.data;
        

    } catch (error:any) {
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
       throw message;
    }
});

export const createComment = createAsyncThunk("createComment", async ({ task_id, parent_comment_id, message  }: { task_id:number, parent_comment_id:number, message:string}) => {
    try {
    
            const data = {
                task_id: task_id,
                parent_comment_id: parent_comment_id,
                message: message,
                
            };
            console.log(data)
            const response = await api.create(getCommentAPI, data);
            console.log(response);
            return response.data;
        

    } catch (error:any) {
        var errorMessage:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
       throw errorMessage;
    }
});


