import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Include Both Helper File with needed methods
import {
    getTasks as getTasksApi,
    addNewTasks as addNewTasksApi,
    updateTasks as updateTasksApi,
    deleteTasks as deleteTasksApi
} from "../../helpers/fakebackend_helper";
import { getTaskListAPI,deleteTaskAPI,getTaskByIdAPI ,assigneesAPI,getUnassignessAPI,getTaskKanbanAPI,updateTasksListAPI} from '../../helpers/url_api'
import { APIClient } from "../../helpers/api_helper";
const api = new APIClient();
export const getTaskList = createAsyncThunk("tasks/getTaskList", async (project_id:number) => {
    try {
        const param={project_id:project_id,limit:1000}
        const response =await api.get(getTaskListAPI,param);
        console.log(response)
        return response.data;
    } catch (error:any) {
        throw error.response.data.message;
    }
});
export const getTaskListAgain = createAsyncThunk("tasks/getTaskListAgain", async( {project_id,status}:{project_id:any, status?:number}) => {
    try {
     if(status!=null){
        const param={project_id:project_id,limit:1000,status:status}
        const response =await api.get(getTaskListAPI,param);
        console.log(response)
        return response.data;
     }
     else{
        const param={project_id:project_id,limit:1000}
        const response =await api.get(getTaskListAPI,param);
        console.log(response)
        return response.data;
     }
    } catch (error:any) {
        throw error.response.data.message;
    }
});
export const getTaskById = createAsyncThunk("tasks/getTaskById", async (id:number) => {
    try {
        const url = `${getTaskByIdAPI}/${id}`
        const response =await api.get(url);
        // console.log(response)
        return response.data;
    } catch (error) {
        throw error;
    }
});
export const getAssigneesById = createAsyncThunk("tasks/getAssigneesById", async (id:number) => {
    try {
        const url = `${assigneesAPI}/${id}`
        const response =await api.get(url);
        // console.log(response)
        return response.data;
    } catch (error:any) {
        throw error.response.data.message;

    }
});
export const getUnassigness = createAsyncThunk("getUnassigness", async ({email,projectId}:{email:string, projectId:number}) => {
    try {
            const param={
                email:email,
                project_id:projectId
            }
            const response = await api.get(getUnassignessAPI,param);
            console.log(response);
            return response;
        

    } catch (error:any) {
        console.log(error);
        throw error.response.data.message;
    }
});
export const addNewTask = createAsyncThunk("tasks/addNewTask", async (task: any) => {
    try {
        console.log(task)
        const response =await api.create(getTaskListAPI,task);
        toast.success("Task Added Successfully", { autoClose: 3000 });
        return response;
    } catch (error:any) {
        toast.error(error.response.data.message, { autoClose: 3000 });
        throw error.response.data.message;
    }
});
export const updateTask = createAsyncThunk("tasks/updateTask", async (data: any) => {
    try {
        console.log(data);
        const url =getTaskListAPI+"/"+data.id;
        
        const response = await api.create(url,data.task)
        toast.success("Task Updated Successfully", { autoClose: 2000 });
        console.log(response)
        return data;
    } catch (error:any) {
        console.log(error)
        toast.error(error.response.data.message, { autoClose: 2000 });
        throw error.response.data.message;
    }
});
export const updateTasks = createAsyncThunk("tasks/updateTasks", async (data: any) => {
    try {
        console.log(data);
        const queryString = data.id.map((id:number) => `ids=${id}`).join("&");
        const url =updateTasksListAPI+"?"+queryString;
        
        const response = await api.create(url,data.dataSprint)
        toast.success("Task Updated Successfully", { autoClose: 2000 });
        console.log(response)
        return response.data;
    } catch (error:any) {
        console.log(error)
        toast.error(error.response.data.message, { autoClose: 2000 });
        throw error.response.data.message;
    }
});
export const deleteTask = createAsyncThunk("tasks/deleteTask", async (taskId: any) => {
    try {
        const url=deleteTaskAPI+"/"+taskId;
        console.log(url)
        const response =await api.deleteRequest(url);
        toast.success("Task Deleted Successfully", { autoClose: 3000 });
        return { taskId, ...response };
    } catch (error:any) {
        console.log(error.response.data.error)
        toast.error(error.response.data.error, { autoClose: 3000 });
        throw error.response.data.error;
    }
});
// Kanban Board
export const getTasksKanban = createAsyncThunk("tasks/getTasksKanban", async (project_id:number) => {
    try {
        const param={
            project_id:project_id
        }
        const response = api.get(getTaskKanbanAPI,param);
        return response;
    } catch (error:any) {
        throw error.response.data.error;
    }
});
export const addCardData = createAsyncThunk("tasks/addCardData", async (card: any) => {
    try {
        const response = addNewTasksApi(card);
        const data = await response;
        toast.success("Card Add Successfully", { autoClose: 2000 })
        return data;
    } catch (error) {
        toast.error("Card Add Failded", { autoClose: 2000 })
        return error;
    }
})
export const updateCardData = createAsyncThunk("tasks/updateCardData", async (card: any) => {
    try {
        const response = updateTasksApi(card);
        const data = await response;
        toast.success("Card Update Successfully", { autoClose: 2000 })
        return data;
    } catch (error) {
        toast.error("Card Update Failded", { autoClose: 2000 })
        return error
    }
})
export const deleteKanban = createAsyncThunk("tasks/deleteKanban", async (card: any) => {
    try {
        const response = deleteTasksApi(card);
        toast.success("Card Delete Successfully", { autoClose: 2000 })
        return response;
    } catch (error) {
        toast.error("Card Delete Failded", { autoClose: 2000 })
        return error;
    }
})