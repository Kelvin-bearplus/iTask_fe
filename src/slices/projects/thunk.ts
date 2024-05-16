import { createAsyncThunk } from "@reduxjs/toolkit";
import 'react-toastify/dist/ReactToastify.css';
import { getListProjects, uploadFile,simpleProjectAPI,uninvitedAPI ,getMemberAPI} from '../../helpers/url_api'
import { APIClient } from "../../helpers/api_helper";
import { resetProjectFlagChange } from "./reducer"

const api = new APIClient();
export const getProjectList = createAsyncThunk("getListProjects", async ({ inPage, limit, keyword, created_day_range  }: { inPage?:number, limit?:number, keyword?: any , created_day_range?:string}) => {
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
        

    }catch (error:any) {
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
        throw message;
    }
});
export const getMemberList=createAsyncThunk("getMemberList", async (id:number) => {
    try {
            var url=getMemberAPI+'/'+id;
            const response = await api.get(url);
            console.log(response);
            return response;
        

    }catch (error:any) {
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
        throw message;
    }
});
export const getProjectById = createAsyncThunk("getProjectById", async (id:number) => {
    try {
            var url=getListProjects+id;
            const response = await api.get(url);
            console.log(response);
            return response;
        

    }catch (error:any) {
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
        throw message;
    }
});
export const getUninvited = createAsyncThunk("getUninvited", async ({email,projectId}:{email:string, projectId:number}) => {
    try {
            const param={
                email:email,
                project_id:projectId
            }
            const response = await api.get(uninvitedAPI,param);
            console.log(response);
            return response;
        

    } catch (error:any) {
        console.log(error);
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
       throw error;
    }
});
export const updateProjectById = createAsyncThunk("updateProjectById", async({ id, project }:{id:string,project:any}) => {
    try {
            var url=getListProjects+id;
            const response = await api.create(url,project);
            // console.log(response);
            return response.data;
    } catch (error:any) {
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
        throw message;
    }
});
export const deleteProjectList = createAsyncThunk("deleteProjectList", async(id:number) => {
    try {
            var url=getListProjects+id;
            const response = await api.deleteRequest(url);
            console.log(response);
            return response.data;
        

    } catch (error:any) {
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
        throw message;
    }
});
export const addProjectList = createAsyncThunk("addProject", async (project: any) => {
    try {
        console.log(project)
        const response = await api.create(getListProjects, project);
        const data = response.data;
        
        // toast.success("project-list Added Successfully", { autoClose: 3000 });
        const dataReturn = {
            data: data,
            toastData: "project-list Added Successfully",
        }

        return dataReturn;
    } catch (error:any) {
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
        throw message;
    }
});

export const getSimpleProject = createAsyncThunk("getSimpleProject", async (limit?:number) => {
    try {
        if(limit){
            const param ={
                limit:limit
            }
            const response = await api.get(simpleProjectAPI,param);
        return response.data;

        }
        else{
            const response = await api.get(simpleProjectAPI);
        return response.data;
        }
     
        
        // toast.success("project-list Added Successfully", { autoClose: 3000 });

    } catch (error:any) {
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
        throw message;
    }
});

export const resetProjectFlag = () => {
    try {
        const response = resetProjectFlagChange();
        return response;
    } catch (error:any) {
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
        throw message;
    }
};
export const getPathImage = async (fileUrl: File) => {
    try {
        const formData = new FormData();
        formData.append('file', fileUrl);
        // Gọi API với FormData đã tạo
        const responseApi = await api.createFile(uploadFile, formData);
        const data = responseApi.data.url;
        return data;
    } catch (error:any) {
        var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
        throw message;
    }
}
