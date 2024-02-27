//Include Both Helper File with needed methods

import { getUserByEmail } from "../../../helpers/url_api";
import { APIClient } from "../../../helpers/api_helper";
import { AxiosResponse } from 'axios';

// action
import { profileSuccess, profileError, resetProfileFlagChange } from "./reducer";

const api = new APIClient();

export const editProfile = (user : any) => async (dispatch : any) => {
    try {
       

    } catch (error) {
        dispatch(profileError(error));
    }
};
export const getUserProfileByEmail = (email: string) => async (dispatch: any) => {
    try {
      const params = {
        email: email
      };
      const response = await api.get(getUserByEmail, { params });
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