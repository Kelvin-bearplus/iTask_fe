import { userForgetPasswordSuccess, userForgetPasswordError, userForgetPasswordFlag } from "./reducer"
import { APIClient } from "../../../helpers/api_helper";
import { forgotPassword ,verifyCode,resetPassword} from "../../../helpers/url_api";
const api = new APIClient();

//Include Both Helper File with needed methods

export const userForgetPassword = (email: any, history: any) => async (dispatch: any) => {
    try {
        const url = forgotPassword + '?email=' + email;
        console.log(url)
        const data = await api.create(url, '');

        if (data) {
            dispatch(userForgetPasswordSuccess(
                "Reset link are sended to your mailbox, check there first"
            ))
            return "Success";
        }
    } catch (forgetError) {
        dispatch(userForgetPasswordError("Your email is not registered"))
        return "Fail";
    }
}
export const userVerifyCode = (user: any, history: any) => async (dispatch: any) => {
    try {
        const url = verifyCode + '?email=' + user.email+'&secret_code='+user.code;
        console.log(user)
        // console.log(url)
        const data = await api.get(url, '');

        if (data) {
            dispatch(userForgetPasswordSuccess(
                "Verify code success"
            ))
            return "Success";
        }
    } catch (forgetError) {
        console.log(forgetError)
        dispatch(userForgetPasswordError("Your Code is incorrect or expired. Please try again"))
        return "Fail";
    }
}
export const userResetPassword = (user: any, history: any) => async (dispatch: any) => {
    try {
        const url = resetPassword + '?email=' + user.email;
        const data_body = {
            newpassword: user.password,
        };

        const response = await api.create(url, data_body);

        // Kiểm tra trạng thái của phản hồi
        if (response.status === 200) {
            dispatch(userForgetPasswordSuccess("Reset password success"));
            return "Success";
        } else {
            // Xử lý lỗi 400 hoặc các trạng thái lỗi khác ở đây
         console.log(response)
            // dispatch(userForgetPasswordError(errorMessage));
            return "Fail";
        }
    } catch (error) {
        console.error(error);
        dispatch(userForgetPasswordError("Reset password fail"));
        return "Fail";
    }
};

export const userForgetPasswordFlagNew = () => async (dispatch: any) => {
    try {
        const response = dispatch(userForgetPasswordFlag());
        return response;
    } catch (error) {
        //   dispatch(userForgetPasswordError(error));
    }
};