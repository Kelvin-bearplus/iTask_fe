import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getListProjects} from '../../helpers/url_api'
import { APIClient } from "../../helpers/api_helper";
import {
    getProjectList as getProjectListApi,
    addProjectList as addProjectListApi,
    updateProjectList as updateProjectListApi,
    deleteProjectList as deleteProjectListApi
} from "../../helpers/fakebackend_helper";
import {resetProjectFlagChange} from "./reducer"
const api = new APIClient();
export const getProjectList = createAsyncThunk("getListProjects", async () => {
    try {
        const response = await api.get(getListProjects);
        console.log(response);

        return response;
    } catch (error) {
        return error;
    }
});

export const addProjectList = createAsyncThunk("addProject", async (project:any) => {
    try {
        console.log(project)
        const response = await api.create(getListProjects,project);
        const data =  response;
        // toast.success("project-list Added Successfully", { autoClose: 3000 });
     const   dataReturn={
            data:data,
            toastData:"project-list Added Successfully",
        }
        
        return dataReturn;
    } catch (error) {
        // toast.error("project-list Added Failed", { autoClose: 3000 });
        return {
            error:error,
        }
    }
});

export const updateProjectList = createAsyncThunk("projects/updateProjectList", async (project:any) => {
    try {
        const response = updateProjectListApi(project);
        const data = await response;
        toast.success("project-list Updated Successfully", { autoClose: 3000 });
        return data;
    } catch (error) {
        toast.error("project-list Updated Failed", { autoClose: 3000 });
        return error;
    }
});

export const deleteProjectList = createAsyncThunk("projects/deleteProjectList", async (data:any) => {
    try {
        const response = deleteProjectListApi(data);
        const newdata = await response;
        toast.success("project-list Delete Successfully", { autoClose: 3000 });
        return newdata;
    } catch (error) {
        toast.error("project-list Delete Failed", { autoClose: 3000 });
        return error;
    }
});
export const resetProjectFlag = () => {
    try {
      const response = resetProjectFlagChange();
      return response;
    } catch (error) {
      return error;
    }
  };