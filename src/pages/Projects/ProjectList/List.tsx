import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Row, UncontrolledDropdown } from 'reactstrap';
import DeleteModal from "../../../Components/Common/DeleteModal";
import { ToastContainer } from 'react-toastify';
import { createSelector } from "reselect";

//redux
import { useSelector, useDispatch } from 'react-redux';
//Import Icons
import FeatherIcon from "feather-icons-react";

//import action
import {
    getProjectList as onGetProjectList,
    deleteProjectList as onDeleteProjectList,
} from "../../../slices/thunks";
const List = () => {
    const dispatch: any = useDispatch();
    const userId = localStorage.getItem('userId');
    const selectDashboardData = createSelector(
        (state: any) => state.Projects.projectLists,
        (projectLists) => projectLists
    );
    // Inside your component
    const projectLists = useSelector(selectDashboardData);

    const [projectId, setProjectId] = useState(0);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [totalProject, setTotalProject] = useState<number>(0);
    const [inPage, setInPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [keyWord, setKeyWord] = useState<string>("");
    const [createdDayRange, setCreatedDaRange] = useState<string>("-1");
    const limit = 8;
    var dataProject: any = [];
    useEffect(() => {
        async function fetchData() {
            //  dataProject = await dispatch(onGetProjectList({ inPage: inPage, limit: limit }));
            dataProject = await dispatch(onGetProjectList({ inPage: inPage, limit: limit, keyword: keyWord, created_day_range: createdDayRange }));

            console.log(dataProject)
            setTotalProject(dataProject.payload.paging.total);
            setTotalPage(Math.ceil(dataProject.payload.paging.total / limit))
            setInPage(dataProject.payload.paging.page)

        }
        fetchData();
    }, [dispatch]);


    // delete
    const onClickData = (id: any) => {
        setProjectId(id);
        setDeleteModal(true);
    };

    const handleDeleteProjectList = () => {
        if (projectId) {
            dispatch(onDeleteProjectList(projectId));
            setDeleteModal(false);
            setTimeout(() => {
                window.location.reload();
            },1500)
        }
    };

    const activebtn = (ele: any) => {
        if (ele.closest("button").classList.contains("active")) {
            ele.closest("button").classList.remove("active");
        } else {
            ele.closest("button").classList.add("active");
        }
    };

    console.log(Date().toString());

    function timeUpdate(time: string) {
        let date = new Date(time);
        let current = new Date();
        let timeUpdated = current.getTime() - date.getTime();
        const elapsedDays = Math.floor(timeUpdated / (1000 * 60 * 60 * 24));

        if (elapsedDays >= 10) {
            // Trả về ngày và tháng của thời gian được cập nhật
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleDateString(undefined, options);
        } else {
            const elapsedHours = Math.floor((timeUpdated % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const elapsedMinutes = Math.floor((timeUpdated % (1000 * 60 * 60)) / (1000 * 60));

            if (elapsedDays === 0) {
                if (elapsedHours === 0) {
                    return `${elapsedMinutes} minutes ago`;
                } else {
                    return `${elapsedHours} hours ago`;
                }
            } else {
                return `${elapsedDays} days ago`;
            }
        }
    }

    function getProgress(complete: number, total: number) {
        return complete / total;
    }
    function formatDate(isoString: Date) {
        // Tạo đối tượng Date từ chuỗi ISO 8601
        const date = new Date(isoString);

        // Lấy ngày, tháng và năm từ đối tượng Date
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        // Danh sách các tháng
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Định dạng lại chuỗi
        const formattedDate = `${day} ${months[monthIndex]}, ${year}`;

        return formattedDate;
    }
    const handleNext = () => {
        var dataPage = inPage + 1;
        if (dataPage <= totalPage) {
            setInPage(dataPage);
            // dispatch(onGetProjectList({ inPage: , limit: limit }));
            dispatch(onGetProjectList({ inPage: dataPage, limit: limit, keyword: keyWord, created_day_range: createdDayRange }));

        }
    }
    // useEffect(() => {
    //   if(projectLists.paging){
    //     setInPage(1);
    //     setTotalProject(projectLists.paging.total);
    //     setTotalPage(Math.ceil(projectLists.paging.total / limit))
    //   }
    // }, [projectLists]);
    const handlePrivous = () => {
        var dataPage = inPage - 1;
        if (dataPage > 0) {
            setInPage(dataPage);
            // dispatch(onGetProjectList({ inPage: dataPage, limit: limit }));
            dispatch(onGetProjectList({ inPage: dataPage, limit: limit, keyword: keyWord, created_day_range: createdDayRange }));

        }
    }
    const handlePaging = (numberPage: number) => {
        setInPage(numberPage);
        console.log(inPage)
        dispatch(onGetProjectList({ inPage: numberPage, limit: limit, keyword: keyWord, created_day_range: createdDayRange }));

    }
    const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const newKeyword = event.currentTarget.value; // Lấy giá trị mới của keyword
            setKeyWord(newKeyword);
            dataProject = await dispatch(onGetProjectList({ inPage: inPage, limit: limit, keyword: newKeyword, created_day_range: createdDayRange }));
            setTotalPage(Math.ceil(dataProject.payload.paging.total / limit))

        }
    };
    const handleSelectSearch: React.ChangeEventHandler<HTMLSelectElement> = async (event) => {
        setCreatedDaRange(event.currentTarget.value);
        dataProject = await dispatch(onGetProjectList({ inPage: inPage, limit: limit, keyword: keyWord, created_day_range: event.currentTarget.value }));
        setTotalPage(Math.ceil(dataProject.payload.paging.total / limit))
    };
    console.log(projectLists)
    return (
        <React.Fragment>
            <ToastContainer closeButton={false} />
            <DeleteModal
                show={deleteModal}
                onDeleteClick={() => handleDeleteProjectList()}
                onCloseClick={() => setDeleteModal(false)}
            />
            <Row className="g-4 mb-3">
                <div className="col-sm-auto">
                    <div>
                        <Link to="/apps-projects-create" className="btn btn-success"><i
                            className="ri-add-line align-bottom me-1"></i> Add New</Link>
                    </div>
                </div>
                <div className="col-sm-3 ms-auto">
                    <div className="d-flex justify-content-sm-end gap-2">
                        <div className="search-box ms-2 col-sm-7">
                            <Input type="text" className="form-control" placeholder="Search..." onKeyPress={handleKeyPress} />
                            <i className="ri-search-line search-icon"></i>
                        </div>

                        <select className="form-control w-md" data-choices data-choices-search-false onChange={handleSelectSearch}>
                            <option value="-1">All</option>
                            <option value="1">Last 1 Days</option>
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="365">Last Year</option>
                            <option value="0">Today</option>
                      
                        </select>
                    </div>
                </div>
            </Row>

            <div className="row">
                {(projectLists.data || []).map((item: any, index: any) => (
                    <React.Fragment key={item.id}>
                        <Col xxl={3} sm={6} className="project-card">
                            <Card className="card-height-100">
                                <CardBody>
                                    <div className="d-flex flex-column h-100">
                                        <div className="d-flex">
                                            <div className="flex-grow-1">
                                                <p className="text-muted mb-4">Updated {timeUpdate(item.updated_at)}</p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <div className="d-flex gap-1 align-items-center">
                                                    <button type="button" className={`btn avatar-xs mt-n1 p-0 favourite-btn ${item.ratingClass}`} onClick={(e) => activebtn(e.target)}>
                                                        <span className="avatar-title bg-transparent fs-15">
                                                            <i className="ri-star-fill"></i>
                                                        </span>
                                                    </button>
                                                    <UncontrolledDropdown direction='start'>
                                                        <DropdownToggle tag="button" className="btn btn-link text-muted p-1 mt-n2 py-0 text-decoration-none fs-15">
                                                            <FeatherIcon icon="more-horizontal" className="icon-sm" />
                                                        </DropdownToggle>

                                                        <DropdownMenu className="dropdown-menu-end">
                                                            <DropdownItem href={`apps-projects-overview?id=${item.id}`}><i className="ri-eye-fill align-bottom me-2 text-muted"></i> View</DropdownItem>
                                                            {
                                                                userId != null && userId == item.owner.id && (
                                                                    <DropdownItem
                                                                        href={`apps-projects-update?id=${item.id}`}
                                                                    >
                                                                        <i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit
                                                                    </DropdownItem>
                                                                )
                                                            }
                                                              {
                                                                userId != null && userId == item.owner.id && (
                                                                    <DropdownItem href="#" onClick={() => onClickData(item.id)} data-bs-toggle="modal" data-bs-target="#removeProjectModal"><i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Remove</DropdownItem>
                                                                )
                                                            }
                                                            
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="avatar-sm">
                                                    <span className={"avatar-title rounded p-2 bg-" + item.imgbgColor + "-subtle"}>
                                                        <img src={item.thumbnail_url} alt="" className="img-fluid p-1" />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h5 className="mb-1 fs-15"><div  className="text-body">{item.name}</div></h5>
                                                <div className="text-muted text-truncate-two-lines mb-3" dangerouslySetInnerHTML={{ __html: item.description }} />
                                            </div>
                                        </div>
                                        <div className="mt-auto">
                                            <div className="d-flex mb-2">
                                                <div className="flex-grow-1">
                                                    <div>Tasks</div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <div><i className="ri-list-check align-bottom me-1 text-muted"></i> {item.completed_tasks}/{item.total_tasks}</div>
                                                </div>
                                            </div>
                                            <div className="progress progress-sm animated-progess">
                                                <div className="progress-bar bg-success"
                                                    role="progressbar"
                                                    style={{ width: `${getProgress(item.completed_tasks, item.total_tasks) * 100}%` }}>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                                <div className="card-footer bg-transparent border-top-dashed py-2">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <div className="avatar-group">
                                                {item.members.map((item: any, key: any) => (
                                                    <React.Fragment key={key}>
                                                        {item.account_info.profile_ava_url ? <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Darline Williams">
                                                            <div className="avatar-xxs">
                                                                <img src={item.account_info.profile_ava_url} alt="" className="rounded-circle img-fluid" />
                                                            </div>
                                                        </Link> : <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Add Members">
                                                            <div className="avatar-xxs">
                                                                <div className={item.bgColor ? "avatar-title rounded-circle bg-" + item.bgColor : "avatar-title rounded-circle bg-light border-dashed border text-primary fs-16 "}>
                                                                    {item.imgNumber}
                                                                </div>
                                                            </div>
                                                        </Link>}
                                                    </React.Fragment>
                                                ))}
                                                <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Add Members">
                                                    <div className="avatar-xs" data-bs-toggle="modal" data-bs-target="#inviteMembersModal">
                                                        <div className="avatar-title fs-16 rounded-circle bg-light border-dashed border text-primary">
                                                            +
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="text-muted">
                                                <i className="ri-calendar-event-fill me-1 align-bottom"></i> {formatDate(item.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>


                    </React.Fragment>
                ))}

            </div>
            <Row className="g-0 text-center text-sm-start align-items-center mb-4">
                <Col sm={6}>
                    <div>
                        <p className="mb-sm-0 text-muted">Showing <span className="fw-semibold">1</span> to <span className="fw-semibold">10</span> of <span className="fw-semibold text-decoration-underline">12</span> entries</p>
                    </div>
                </Col>

                <Col sm={6}>
                    <ul className="pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
                        <li className={`page-item ${inPage === 0 ? 'disabled' : ''}`} onClick={handlePrivous}>
                            <Link to="#" className="page-link">Previous</Link>

                        </li>
                        {Array.from({ length: totalPage }, (_, index) => (
                            <li key={index + 1} className={`page-item ${index === inPage - 1 ? 'active' : ''}`} onClick={() => handlePaging(index + 1)}>
                                <Link to="#" className="page-link">{index + 1}</Link>
                            </li>
                        ))}
                        <li className={`page-item ${inPage === totalPage ? 'disabled' : ''}`} onClick={handleNext}>
                            <Link to="#" className="page-link">Next</Link>
                        </li>

                    </ul>
                </Col>

            </Row>
        </React.Fragment>
    );
};

export default List;