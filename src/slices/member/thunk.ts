import { createAsyncThunk } from "@reduxjs/toolkit";
import 'react-toastify/dist/ReactToastify.css';
import { inviteMemberAPI } from '../../helpers/url_api'
import { APIClient } from "../../helpers/api_helper";
import { number } from "yup";
import { emit } from "process";
// import { resetProjectFlagChange } from "./reducer"

const api = new APIClient();
export const inviteMember = createAsyncThunk(
    "inviteMember",
    async ({ projectId, email }: { projectId: string, email: string }) => {
      try {
        console.log(projectId);
        const params = `${inviteMemberAPI}?project_id=${projectId}&email=${email}`;
        console.log(params);
        
        // Make API request
        const response = await api.create(params);
  
        console.log(response); // Log or handle the response as needed
        
        return response; // Return the response data to be handled by the slice reducer
      } catch (error) {
        console.error("Error inviting member:", error); // Log or handle errors
        throw error; // Rethrow the error to be caught by the slice reducer
      }
    }
  );
  


// export const resetProjectFlag = () => {
//     try {
//         const response = resetProjectFlagChange();
//         return response;
//     } catch (error) {
//         return error;
//     }
// };

