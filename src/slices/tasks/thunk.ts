import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Include Both Helper File with needed methods
import {
    addNewTask as addNewTaskApi,
    updateTask as updateTaskApi,
    deleteTask as deleteTaskApi,
    getTasks as getTasksApi,
    addNewTasks as addNewTasksApi,
    updateTasks as updateTasksApi,
    deleteTasks as deleteTasksApi
} from "../../helpers/fakebackend_helper";
import { getTaskListAPI,deleteTaskAPI } from '../../helpers/url_api'
import { APIClient } from "../../helpers/api_helper";
const api = new APIClient();
export const getTaskList = createAsyncThunk("tasks/getTaskList", async () => {
    try {
        const response =await api.get(getTaskListAPI);
        console.log(response)
        return response.data;
    } catch (error) {
        return error;
    }
});
export const addNewTask = createAsyncThunk("tasks/addNewTask", async (task: any) => {
    try {
        const response = addNewTaskApi(task);
        toast.success("Task Added Successfully", { autoClose: 3000 });
        return response;
    } catch (error) {
        toast.error("Task Added Failed", { autoClose: 3000 });
        return error;
    }
});
export const updateTask = createAsyncThunk("tasks/updateTask", async (data: any) => {
    try {
        const url =getTaskListAPI+"/"+data.id;
        const response = await api.create(url,data.task)
        toast.success("Task Updated Successfully", { autoClose: 3000 });
        console.log(response.data)
        return response.data;
    } catch (error) {
        toast.error("Task Updated Failed", { autoClose: 3000 });
        return error;
    }
});
export const deleteTask = createAsyncThunk("tasks/deleteTask", async (taskId: any) => {
    try {
        const url=deleteTaskAPI+"/"+taskId;
        console.log(url)
        const response =await api.deleteRequest(url);
        toast.success("Task Updated Successfully", { autoClose: 3000 });
        return { taskId, ...response };
    } catch (error:any) {
        console.log(error.response.data.error)
        toast.error(error.response.data.error, { autoClose: 3000 });
        throw error.response.data.error;
    }
});
// Kanban Board
export const getTasks = createAsyncThunk("tasks/getTasks", async () => {
    try {
        const response = getTasksApi();
        return response;
    } catch (error) {
        return error;
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