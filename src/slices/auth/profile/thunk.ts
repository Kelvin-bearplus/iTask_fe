//Include Both Helper File with needed methods

import { getUserByEmail,getUserProfile } from "../../../helpers/url_api";
import { APIClient } from "../../../helpers/api_helper";
import { AxiosResponse } from 'axios';

// action
import { profileSuccess, profileError, resetProfileFlagChange } from "./reducer";
import internal from "stream";
import { error } from "console";

const api = new APIClient();

export const editProfile = (user : any,id:internal) => async (dispatch : any) => {
    try {
      const url=getUserProfile+'/'+id;
    const   dataResponse=await api.update(url,user)
      if (dataResponse.data){
        const success={
       data:   "Change Profile Success"};
        dispatch(profileSuccess(success))
      }
      else{
       const error='Change Profile Failed'
        dispatch(profileError(error));
      }
    } catch (error) {
        dispatch(profileError(error));
    }
};
export const getUserProfileByEmail = (email: string) => async (dispatch: any) => {
    try {
      const params = {
        email: email
      };
      const response = await api.get(getUserByEmail,params );
      dispatch(profileSuccess(response.data)); // Truyền response.data vào action profileSuccess
      console.log("Dữ liệu:", response.data);
      return response.data; // Trả về dữ liệu từ phản hồi
    } catch (error) {
      const message = "Retrieve information failed";
      dispatch(profileError(message));
      return {}; // Trả về đối tượng rỗng trong trường hợp lỗi
    }
  };
export const resetProfileFlag = () => {
    try {
        const response = resetProfileFlagChange();
        return response;
    } catch (error) {
        return error;
    }
};