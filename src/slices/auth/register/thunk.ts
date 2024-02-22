//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeRegister,
  postJwtRegister,
} from "../../../helpers/fakebackend_helper";

// action
import {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
} from "./reducer";

// initialize relavant method of both Auth
const fireBaseBackend : any = getFirebaseBackend();

// Is user register successfull then direct plot user in redux.
export const registerUser = (user : any) => async (dispatch : any) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      response = fireBaseBackend.registerUser(user.email, user.password);
      // yield put(registerUserSuccessful(response));
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      // response = postJwtRegister('/post-jwt-register', user);
      response = postJwtRegister('http://ec2-13-212-101-187.ap-southeast-1.compute.amazonaws.com:8080/api/v1/register', user);
     console.log('kết quả'+response)
      // yield put(registerUserSuccessful(response));
    } else if (process.env.REACT_APP_API_URL) {
      response = postFakeRegister(user);
      const data : any = await response;

      if (data.message === "success") {
        dispatch(registerUserSuccessful(data));
      } else {
        dispatch(registerUserFailed(data));
      }
    }
  } catch (error : any) {
    dispatch(registerUserFailed(error));
  }
};

export const resetRegisterFlag = () => {
  try {
    const response = resetRegisterFlagChange();
    return response;
  } catch (error) {
    return error;
  }
};