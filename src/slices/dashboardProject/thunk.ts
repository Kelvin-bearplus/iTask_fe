import { createAsyncThunk } from "@reduxjs/toolkit";
//Include Both Helper File with needed methods
import {
  getAllProjectData as getAllProjectDataApi,
  getMonthProjectData as getMonthProjectDataApi,
  gethalfYearProjectData as gethalfYearProjectDataApi,
  getYearProjectData as getYearProjectDataApi,
  getAllProjectStatusData as getAllProjectStatusDataApi,
  getWeekProjectStatusData as getWeekProjectStatusDataApi,
  getMonthProjectStatusData as getMonthProjectStatusDataApi,
  getQuarterProjectStatusData as getQuarterProjectStatusDataApi
} from "../../helpers/fakebackend_helper";
import { getProjectActiveAPI,getTotalTaskDoneAPI,getTotalTaskAssignedAPI} from '../../helpers/url_api'
import { APIClient } from "../../helpers/api_helper";
const api = new APIClient();

export const getProjectChartsData = createAsyncThunk("dashboardProject/getProjectChartsData", async (data:any) => {
  try {
    var response;
    if (data === "all") {
      response = getAllProjectDataApi();
    }
    if (data === "month") {
      response = getMonthProjectDataApi();
    }
    if (data === "halfyear") {
      response = gethalfYearProjectDataApi();
    }
    if (data === "year") {
      response = getYearProjectDataApi();
    }
    return response;
  } catch (error) {
    return error;
  }
});

export const getProjectStatusChartsData = createAsyncThunk("dashboardProject/getProjectStatusChartsData", async (data:any) => {
  try {
    var response;
    if (data === "all") {
      response = getAllProjectStatusDataApi();
    }
    if (data === "week") {
      response = getWeekProjectStatusDataApi();
    }
    if (data === "month") {
      response = getMonthProjectStatusDataApi();
    }
    if (data === "quarter") {
      response = getQuarterProjectStatusDataApi();
    }
    return response;
  } catch (error) {
    return error;
  }
});
export const getProjectActive = createAsyncThunk("dashboardProject/getProjectActive", async () => {
  try {
  const response= await api.get(getProjectActiveAPI);
    return response.data;
  } catch (error:any) {
    return error;
  }
});
export const getPTaskDone = createAsyncThunk("dashboardProject/getPTaskDone", async () => {
  try {
  const response= await api.get(getTotalTaskDoneAPI);
    return response.data;
  } catch (error:any) {
    return error;
  }
});
export const getTaskAssigned= createAsyncThunk("dashboardProject/getTaskAssigned", async () => {
  try {
  const response= await api.get(getTotalTaskAssignedAPI);
    return response.data;
  } catch (error:any) {
    return error;
  }
});