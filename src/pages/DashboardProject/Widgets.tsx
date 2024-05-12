import React, { useEffect,useState } from 'react';
import { projectsWidgets } from '../../common/data';
import CountUp from "react-countup";

//Import Icons
import FeatherIcon from "feather-icons-react";
import { Card, CardBody, Col, Row } from 'reactstrap';
import { useDispatch } from "react-redux"
import {
    getProjectActive as getProjectActiveAPI,
    getTaskAssigned as getTaskAssignedAPI,
    getPTaskDone as getPTaskDoneAPI,
  } from "../../slices/thunks"
const Widgets = () => {
    const [projectActive,setProjectActive]=useState(0);
    const [taskDone,setTaskDone]=useState(0);
    const [taskAssigned,setTaskAssigned]=useState(0);
  const dispatch = useDispatch<any>();
  async function getProjectActive(){
  const dataResponse=await dispatch(getProjectActiveAPI());
  console.log(dataResponse);
  if(dataResponse.payload){
    setProjectActive(dataResponse.payload);
  }
  }
  async function getTotalTaskDone(){
    const dataResponse=await dispatch(getPTaskDoneAPI());
    console.log(dataResponse);
    if(dataResponse.payload){
        setTaskDone(dataResponse.payload);
    }
    }
    async function getTotalTaskAssigned(){
        const dataResponse=await dispatch(getTaskAssignedAPI());
        console.log(dataResponse);
        if(dataResponse.payload){
            setTaskAssigned(dataResponse.payload);
        }
        }
  useEffect(()=>{
    getProjectActive();
    getTotalTaskDone();
    getTotalTaskAssigned();
  },[])
  console.log(projectActive)
    return (
        <React.Fragment>
            <Row className='w-100'>
                    <Col xl={4}>
                        <Card className="card-animate">
                            <CardBody>
                                <div className="d-flex align-items-center">
                                    <div className="avatar-sm flex-shrink-0">
                                        <span className={`avatar-title bg-primary-subtle text-primary rounded-2 fs-2`}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-briefcase text-primary"><g><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></g></svg>
                                        </span>
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden ms-3">
                                        <p className="text-uppercase fw-medium text-muted text-truncate mb-3">Active Project</p>
                                        <div className="d-flex align-items-center mb-3">
                                            <h4 className="fs-4 flex-grow-1 mb-0">
                                         <span className="counter-value me-1" data-target="825" >
                                                    <CountUp
                                                        start={0}
                                                        end={projectActive}
                                                        duration={1}
                                                    />
                                                </span>
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl={4}>
                        <Card className="card-animate">
                            <CardBody>
                                <div className="d-flex align-items-center">
                                    <div className="avatar-sm flex-shrink-0">
                                        <span className={`avatar-title bg-warning-subtle text-warning rounded-2 fs-2`}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-award text-warning"><g><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></g></svg>
                                        </span>
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden ms-3">
                                        <p className="text-uppercase fw-medium text-muted text-truncate mb-3">Total Task Assigned</p>
                                        <div className="d-flex align-items-center mb-3">
                                            <h4 className="fs-4 flex-grow-1 mb-0">
                                         <span className="counter-value me-1" data-target="825" >
                                                    <CountUp
                                                        start={0}
                                                        end={taskAssigned}
                                                        duration={1}
                                                    />
                                                </span>
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl={4}>
                        <Card className="card-animate">
                            <CardBody>
                                <div className="d-flex align-items-center">
                                    <div className="avatar-sm flex-shrink-0">
                                        <span className={`avatar-title bg-info-subtle text-info rounded-2 fs-2`}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-clock text-info"><g><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></g></svg>
                                        </span>
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden ms-3">
                                        <p className="text-uppercase fw-medium text-muted text-truncate mb-3">Total Task Complete</p>
                                        <div className="d-flex align-items-center mb-3">
                                            <h4 className="fs-4 flex-grow-1 mb-0">
                                         <span className="counter-value me-1" data-target="825" >
                                                    <CountUp
                                                        start={0}
                                                    end={taskDone}
                                                        duration={1}
                                                    />
                                                </span>
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
            </Row>
        </React.Fragment>
    );
};

export default Widgets;