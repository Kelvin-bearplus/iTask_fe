//Include Both Helper File with needed methods
import { access } from "fs";
import { APIClient } from "../../../helpers/api_helper";
import { getUserLogin } from "../../../helpers/url_api";

import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';
import { string } from "yup";
const api = new APIClient();

export const loginUser = (user : any, history : any) => async (dispatch : any) => {
  try {
    let response;
  
      response = api.create (getUserLogin,user);

    var data = await response;

    if (data && data.accessToken) {
      console.log(data.accessToken);
      // Lưu trữ accessToken vào sessionStorage
      sessionStorage.setItem("authUser", data.accessToken);
      if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
        var finallogin : any = JSON.stringify(data);
        finallogin = JSON.parse(finallogin)
        data = finallogin.data;
        if (finallogin.status === "success") {
          dispatch(loginSuccess(user));
          history('/dashboard-projects')
        } 
        else {
          dispatch(apiError(finallogin));
        }
      } else {
        dispatch(loginSuccess(user));
        history('/dashboard-projects')
      }
    }
  } catch (error) {
    console.log(error);
    var message:string = "lỗi"
    dispatch(apiError(message));
  }
};

export const logoutUser = () => async (dispatch : any) => {
  try {
    sessionStorage.removeItem("authUser");
    // let fireBaseBackend : any = getFirebaseBackend();
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      // const response = fireBaseBackend.logout;
      // dispatch(logoutUserSuccess(response));
    } else {
      dispatch(logoutUserSuccess(true));
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (type : any, history : any) => async (dispatch : any) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      // const fireBaseBackend : any = getFirebaseBackend();
      // response = fireBaseBackend.socialLoginUser(type);
    }
    //  else {
      //   response = postSocialLogin(data);
      // }
      
      const socialdata = await response;
    if (socialdata) {
      sessionStorage.setItem("authUser", JSON.stringify(response));
      dispatch(loginSuccess(response));
      history('/dashboard')
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch : any) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};