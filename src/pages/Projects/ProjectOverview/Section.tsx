import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';

//import images
import slack from '../../../assets/images/brands/slack.png';
import OverviewTab from './OverviewTab';
import AllTasks from '../../Tasks/TaskList/AllTasks';
import KanbanTask from '../../Tasks/KanbanBoard/index';
import ActivitiesTab from './ActivitiesTab';
import TeamTab from './TeamTab';

const Section = (dataProject:any) => {
    //Tab 
    const [activeTab, setActiveTab] = useState<any>('1');
    const toggleTab = (tab:any) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            console.log(activeTab)
        }
    };
    const[startDate,setStartDate]=useState<any>();
    const[deadlineDate,setDeadlineDate]=useState<any>();
    function formatDate(inputDate:string) {
        // Tạo một đối tượng Date từ chuỗi đầu vào
        const date = new Date(inputDate);
        
        // Mảng các tháng
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
        // Lấy ngày, tháng và năm từ đối tượng Date
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
      
        // Tạo định dạng ngày mới
        const formattedDate = `${day} ${months[monthIndex]}, ${year}`;
      
        return formattedDate;
      }
      useEffect(() => {
        setStartDate(formatDate(dataProject.prop.started_at))
      setDeadlineDate(formatDate(dataProject.prop.deadline))
      },[])
    console.log(dataProject)
    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <Card className="mt-n4 mx-n4">
                        <div className="bg-warning-subtle">
                            <CardBody className="pb-0 px-4">
                                <Row className="mb-3">
                                    <div className="col-md">
                                        <Row className="align-items-center g-3">
                                            <div className="col-md-auto">
                                                <div className="avatar-md">
                                                    <div className="avatar-title bg-white rounded-circle">
                                                        <img src={dataProject.prop.thumbnail_url?dataProject.prop.thumbnail_url:slack} alt="" className="avatar-xs" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md">
                                                <div>
                                                    <h4 className="fw-bold">{dataProject.prop.name?dataProject.prop.name:""}</h4>
                                                    <div className="hstack gap-3 flex-wrap">
                                                        <div><i className="ri-building-line align-bottom me-1"></i> Themesbrand</div>
                                                        <div className="vr"></div>
                                                        <div>Create Date : <span className="fw-medium">{startDate}</span></div>
                                                        <div className="vr"></div>
                                                        <div>Due Date : <span className="fw-medium">{deadlineDate}</span></div>
                                                        <div className="vr"></div>
                                                        {/* <div className="badge rounded-pill bg-info fs-12">New</div> */}
                                                        <div className="badge rounded-pill bg-danger fs-12">{dataProject.prop.priority}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Row>
                                    </div>
                                    <div className="col-md-auto">
                                        <div className="hstack gap-1 flex-wrap">
                                            <button type="button" className="btn py-0 fs-16 favourite-btn active">
                                                <i className="ri-star-fill"></i>
                                            </button>
                                            <button type="button" className="btn py-0 fs-16 text-body">
                                                <i className="ri-share-line"></i>
                                            </button>
                                            <button type="button" className="btn py-0 fs-16 text-body">
                                                <i className="ri-flag-line"></i>
                                            </button>
                                        </div>
                                    </div>
                                </Row>

                                <Nav className="nav-tabs-custom border-bottom-0" role="tablist">
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === '1' }, "fw-semibold")}
                                            onClick={() => { toggleTab('1'); }}
                                            href="#">
                                            Overview
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === '2' }, "fw-semibold")}
                                            onClick={() => { toggleTab('2'); }}
                                            href="#">
                                            List View Task
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === '3' }, "fw-semibold")}
                                            onClick={() => { toggleTab('3'); }}
                                            href="#">
                                            Kanban Board Task
                                        </NavLink>
                                    </NavItem>
                                    
                                </Nav>
                            </CardBody>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col lg={12}>

                {activeTab === '1' &&     <OverviewTab dataProject={dataProject} startDate={startDate} deadlineDate={deadlineDate}/>}
          {activeTab === '2' && <AllTasks />}
          {activeTab === '3' && <KanbanTask />}
          {/* {activeTab === '4' && <TeamTab />} */}
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Section;