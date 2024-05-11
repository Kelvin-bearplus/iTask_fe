import { createAsyncThunk } from "@reduxjs/toolkit";
import 'react-toastify/dist/ReactToastify.css';
import { getCommentAPI } from '../../helpers/url_api'
import { APIClient } from "../../helpers/api_helper";
// import { resetProjectFlagChange } from "./reducer"

const api = new APIClient();
export const getComment = createAsyncThunk("getComment", async ({ page, limit, taskId,type  }: { page:number, limit:number , taskId:number,type:number}) => {
    try {
    
            const params = {
                page: page,
                limit: limit,
                object_id: taskId,
                type:type
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

export const createComment = createAsyncThunk("createComment", async ({ task_id, parent_comment_id, message ,type }: {type:number, task_id:number, parent_comment_id:number, message:string}) => {
    try {
    
            const data = {
                type:type,
                object_id: task_id,
                parent_comment_id: parent_comment_id,
                message: message,
            };
            console.log(data)
            const response = await api.create(getCommentAPI, data);
            console.log(response);
            return response.data;
        

    } catch (error:any) {
        var errorMessage:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
        console.log(error)
       throw errorMessage;
    }
});


