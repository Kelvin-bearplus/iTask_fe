import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { useSelector, useDispatch } from "react-redux";
import { PrjectsStatusCharts } from './DashboardProjectCharts';
import { getProjectStatusChartsData,getProjectStatus as getProjectStatusAPI } from '../../slices/thunks';
import { createSelector } from 'reselect';

const ProjectsStatus = () => {
    const dispatch:any = useDispatch();

    const [chartData, setchartData] = useState<any>([]);

    const [seletedMonth, setSeletedMonth] = useState("All Time");
async function getProjectData(){
    const dataResponse=await dispatch(getProjectStatusAPI());
    console.log(dataResponse.payload);
    if(dataResponse.payload){
        var dataArray= Object.values(dataResponse.payload);
        dataArray.shift();
        setchartData(dataArray);
    }
    
}
    useEffect(() => {
        getProjectData()
    }, [dispatch]);
    console.log(chartData)
    return (
        <React.Fragment>
            <Col  >
                <Card className="card-height-100">
                    <CardHeader className="align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Projects Status</h4>
                       
                    </CardHeader>

                    <CardBody>
                        <PrjectsStatusCharts series={chartData} dataColors='[ "--vz-warning", "--vz-primary","--vz-success"]' />
                        <div className="mt-3">
                            <div className="d-flex justify-content-center align-items-center mb-4">
                                <h2 className="me-3 ff-secondary mb-0">{chartData.total_projects}</h2>
                                <div>
                                    <p className="text-muted mb-0">Total Projects</p>
                                    <p className="text-success fw-medium mb-0">
                                        <span className="badge bg-success-subtle text-success p-1 rounded-circle"><i className="ri-arrow-right-up-line"></i></span> +3 New
                                    </p>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between border-bottom border-bottom-dashed py-2">
                                <p className="fw-medium mb-0"><i className="ri-checkbox-blank-circle-fill text-warning align-middle me-2"></i> Pending</p>
                                <div>
                                <span className="text-muted pe-5">{chartData[0]} Projects</span>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between border-bottom border-bottom-dashed py-2">
                                <p className="fw-medium mb-0"><i className="ri-checkbox-blank-circle-fill text-primary align-middle me-2"></i> In Progress</p>
                                <div>
                                    <span className="text-muted pe-5">{chartData[1]} Projects</span>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between border-bottom border-bottom-dashed py-2">
                                <p className="fw-medium mb-0"><i className="ri-checkbox-blank-circle-fill text-success align-middle me-2"></i> Complete</p>
                                <div>
                                    <span className="text-muted pe-5">{chartData[2]} Projects</span>
                                </div>
                            </div>
                            
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default ProjectsStatus;