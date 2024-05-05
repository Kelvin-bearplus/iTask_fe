import { combineReducers } from "redux";

// Front

// Authentication
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ProfileReducer from "./auth/profile/reducer";

//Calendar
//Chat
import chatReducer from "./chat/reducer";
//Ecommerce

//Project
import ProjectsReducer from "./projects/reducer";
import SprintReducer from "./sprint/reducer";
import Member from "./member/reducer";

// Tasks
import TasksReducer from "./tasks/reducer";
import CommentReducer from "./comment/reducer";

//Crypto


// Dashboard Cryto
import DashboardProjectReducer from "./dashboardProject/reducer";

// Dashboard NFT


const rootReducer = combineReducers({
    Login: LoginReducer,
    Account: AccountReducer,
    ForgetPassword: ForgetPasswordReducer,
    Profile: ProfileReducer,
    Chat: chatReducer,
    Projects: ProjectsReducer,
    Member: Member,
    Tasks: TasksReducer,
    DashboardProject: DashboardProjectReducer,
    Comment:CommentReducer,
    Sprint:SprintReducer
});

export default rootReducer;