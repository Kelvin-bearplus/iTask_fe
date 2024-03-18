import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getListProjects, uploadFile } from '../../helpers/url_api'
import { APIClient } from "../../helpers/api_helper";
import {
    getProjectList as getProjectListApi,
    addProjectList as addProjectListApi,
    updateProjectList as updateProjectListApi,
    deleteProjectList as deleteProjectListApi
} from "../../helpers/fakebackend_helper";
import { resetProjectFlagChange } from "./reducer"
import { date } from "yup";
const api = new APIClient();
export const getProjectList = createAsyncThunk("getListProjects", async ({ inPage, limit, keyword, created_day_range  }: { inPage:number, limit:number, keyword: any , created_day_range:string}) => {
    try {
    
            const params = {
                page: inPage,
                limit: limit,
                keyword: keyword,
                created_day_range: created_day_range,
                
            };
            console.log(params);
            // Sử dụng tham số inPage và limit trong request API
            const response = await api.get(getListProjects, params);
            console.log(response);
            return response;
        

    } catch (error) {
        return error;
    }
});
export const getProjectById = createAsyncThunk("getProjectById", async (id:number) => {
    try {
            var url=getListProjects+'/'+id;
            const response = await api.get(url);
            console.log(response);
            return response;
        

    } catch (error) {
        return error;
    }
});
export const updateProjectById = createAsyncThunk("updateProjectById", async({ id, project }:{id:string,project:any}) => {
    try {
            var url=getListProjects+'/'+id;
            const response = await api.create(url,project);
            console.log(response);
            return response;
        

    } catch (error) {
        return error;
    }
});
export const deleteProjectList = createAsyncThunk("deleteProjectList", async(id:number) => {
    try {
            var url=getListProjects+'/'+id;
            const response = await api.delete(url);
            console.log(response);
            return response;
        

    } catch (error) {
        return error;
    }
});
export const addProjectList = createAsyncThunk("addProject", async (project: any) => {
    try {
        console.log(project)
        const response = await api.create(getListProjects, project);
        const data = response;
        
        // toast.success("project-list Added Successfully", { autoClose: 3000 });
        const dataReturn = {
            data: data,
            toastData: "project-list Added Successfully",
        }

        return dataReturn;
    } catch (error) {
        // toast.error("project-list Added Failed", { autoClose: 3000 });
        return {
            error: error,
        }
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
//   export const getPathImage=async (file:string)=>{
// try{
//    var fileUrl=new FormData();
//    fileUrl.append('file', file);
//    console.log(fileUrl);
// const response=await api.create(uploadFile,fileUrl)
// const data=response.data.url;
// return data
// }
// catch(error){
//     return false;
// }
//   }
export const getPathImage = async (fileUrl: File) => {
    try {
        const formData = new FormData();
        formData.append('file', fileUrl);
        // Gọi API với FormData đã tạo
        const responseApi = await api.createFile(uploadFile, formData);
        const data = responseApi.data.url;
        return data;
    } catch (error) {
        console.error(error);
        // Xử lý lỗi ở đây nếu cần
    }
}
