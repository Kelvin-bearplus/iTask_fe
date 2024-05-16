//Include Both Helper File with needed methods
import { APIClient } from "../../../helpers/api_helper";
import { getUserLogin,getUserByEmail } from "../../../helpers/url_api";
import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';
const api = new APIClient();
export const timeExpire=(date:Date):string=>{
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lưu ý: Tháng trong JavaScript là từ 0 đến 11, nên cần cộng thêm 1
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
}
interface ApiResponse {
  accessToken: string;
  expiresAt: number;
  // Các trường khác nếu cần
}
// var data:any;
export const loginUser = (user : any, history : any) => async (dispatch : any) => {
  try {
    let response = await api.create(getUserLogin, user) as unknown as ApiResponse;
    const data = response;
    console.log(response);
 if (data&&data.accessToken){
  if (data.expiresAt) {
    const timeExpireFormatted: string = timeExpire(new Date(data.expiresAt * 1000));
    localStorage.setItem("authUser", data.accessToken);
    localStorage.setItem("timeExpire", timeExpireFormatted);
  }
  const params = {
    email: user.email
  };
  const responseInfo = await api.get(getUserByEmail,params );
  localStorage.setItem('user_avatar_url', responseInfo.data.profile_ava_url);
  localStorage.setItem('user_name', responseInfo.data.full_name);
  localStorage.setItem('userId', responseInfo.data.id);
  dispatch(loginSuccess(user));
  // console.log("loggined");
  window.location.href = '/dashboard-projects';
  return data;
 }
      }
    
  catch (error:any) {
    // var log =Promise.reject(error);
    var message:any = error.response.data.error.message?error.response.data.error.message:"Lỗi";
    // throw message;
    dispatch(apiError(message));
  }
};

export const logoutUser = () => async (dispatch : any) => {
  try {
    localStorage.removeItem("authUser");
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
      localStorage.setItem("authUser", JSON.stringify(response));
      dispatch(loginSuccess(response));
      history('/dashboard-projects')
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