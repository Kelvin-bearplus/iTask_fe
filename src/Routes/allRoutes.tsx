import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard

import DashboardProject from "../pages/DashboardProject";


// // Email box

// //Chat
import Chat from "../pages/Chat";



// // Project
import ProjectList from "../pages/Projects/ProjectList";
import ProjectOverview from "../pages/Projects/ProjectOverview";
import CreateProject from "../pages/Projects/CreateProject";

// //Task
import TaskDetails from "../pages/Tasks/TaskDetails";
import TaskList from "../pages/Tasks/TaskList";





// //login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";



// //Job pages


// // User Profile
import UserProfile from "../pages/Authentication/user-profile";

import Kanbanboard from "pages/Tasks/KanbanBoard";


const authProtectedRoutes = [
 
  { path: "/dashboard-projects", component: <DashboardProject /> },
  




  // //Chat
  { path: "/apps-chat", component: <Chat /> },


  // //Projects
  { path: "/apps-projects-list", component: <ProjectList /> },
  { path: "/apps-projects-overview", component: <ProjectOverview /> },
  { path: "/apps-projects-create", component: <CreateProject /> },

  // //Task
  { path: "/apps-tasks-kanban", component: <Kanbanboard /> },
  { path: "/apps-tasks-list-view", component: <TaskList /> },
  { path: "/apps-tasks-details", component: <TaskDetails /> },


  //User Profile
  { path: "/profile", component: <UserProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

  // //AuthenticationInner pages

 


];

export { authProtectedRoutes, publicRoutes };