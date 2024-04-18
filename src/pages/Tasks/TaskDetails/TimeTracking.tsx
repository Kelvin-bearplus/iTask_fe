import React, { useState, useCallback, useEffect } from 'react';
import { Input, Card, CardBody, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Modal, ModalHeader, ModalBody } from 'reactstrap';
import SimpleBar from "simplebar-react";

import avt_default from "../../../assets/images/users/anh_mac_dinh.jpg";

import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { inviteMember, getMemberAssignees, deleteAssign, assignMember } from "../../../slices/thunks";

const TimeTracking = (dataTask: any) => {
    function checkInvite(member: any) {
        let isMemberFound = true;

        if (dataTask.prop.assignees != null) {
            dataTask.prop.assignees.some((memberProject: any) => {
                if (memberProject.user_id === member.id) {
                    isMemberFound = false;
                    return true;
                }
            });
        }

        return isMemberFound;
    }
    async function deleteAssignHandle(userId: number) {
        const dataDelete = await dispatch(deleteAssign({ task_id: dataTask.prop.id, user_id: userId }));
        if (dataDelete.payload && dataDelete.payload.data == true) {
            console.log(listMemberNoAssignees);
            setListMemberAssignees(listMemberAssignees.filter(
                (item: any) => {
                    // Kiểm tra nếu item.user_info không tồn tại
                    if(item.user_info){
                        return item.user_info.id !== userId;
                    }
                    else{
                        return item.account_info.id !== userId;
                    }
                }
            ))
            const newListNoMemberAssignees = [...listMemberNoAssignees];
            const filteredItems = listMemberAssignees.filter(
                (item: any) => {
                    // Kiểm tra nếu item.user_info không tồn tại
                    if(item.user_info){
                        return item.user_info.id == userId;
                    }
                    else{
                        return item.account_info.id == userId;
                    }
                }
            );
            newListNoMemberAssignees.push(...filteredItems);
            setListMemberNoAssignees(newListNoMemberAssignees);
        }
    }
    async function assignMemberHandle(userId: number) {
        const assignData = await dispatch(assignMember({ task_id: dataTask.prop.id, user_id: userId }));
        console.log(assignData)
        if (assignData.payload && assignData.payload.data == 0) {
            console.log(listMemberNoAssignees);
            setListMemberNoAssignees(listMemberNoAssignees.filter(
                (item: any) => {
                    if(item.user_info){
                        return item.user_info.id !== userId;
                    }
                    else{
                        return item.account_info.id !== userId;
                    }
                }
            ))
            const newListMemberAssignees = [...listMemberAssignees];
            const filteredItems = listMemberNoAssignees.filter(
                (item: any) => {
                    if(item.user_info){
                        return item.user_info.id == userId;
                    }
                    else{
                        return item.account_info.id == userId;
                    }
                }
            );
            newListMemberAssignees.push(...filteredItems);
            setListMemberAssignees(newListMemberAssignees);
        }
    }
    const [listMemberNoAssignees, setListMemberNoAssignees] = useState([]);
    const [listMemberAssignees, setListMemberAssignees] = useState([]);
    async function setListMemberAss() {
        const data = await dispatch(getMemberAssignees({ projectId: dataTask.prop.project_info.id, taskId: dataTask.prop.id }));
        console.log(data);
        if (data.payload) {
            setListMemberNoAssignees(data.payload);
        }
    }
    useEffect(() => {
        setListMemberAss();
        setListMemberAssignees(dataTask.prop.assignees)
    }, [])
    // console.log(listMemberAssignees)
    const [modal, setModal] = useState<boolean>(false);
    const toggleModal = useCallback(() => {
        if (modal) {
            setModal(false);
        } else {
            setModal(true);
        }
    }, [modal]);
    function convertPriority(priority: number) {
        switch (priority) {
            case 1:
                return "High";
            case 2:
                return "Medium";
            case 3:
                return "Low";
            default:
                return "High";
        }
    }
    function convertStatus(status: number) {
        switch (status) {
            case 1:
                return "Pending";
            case 2:
                return "In-progress";
            case 3:
                return "Done";
            case 4:
                return "Delete";
            default:
                return "Pending";
        }
    }
    function convertColorStatus(status: number) {
        switch (status) {
            case 1:
                return "secondary";
            case 2:
                return "info";
            case 3:
                return "success";
            default:
                return "danger";
        }
    }
    function convertColorPrority(status: number) {
        switch (status) {
            case 1:
                return "danger";
            case 2:
                return "warning";
            case 3:
                return "success";
            default:
                return "danger";
        }
    }
    function isObjectEmpty(obj: any) {
        return Object.keys(obj).length === 0;
    }

    const dispatch: any = useDispatch();
    const [errorMessage, setErrorMessage] = useState("");
    function convertDate(dateString: string) {
        var dateData = new Date(dateString);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var day = dateData.getDate();
        var month = months[dateData.getMonth()];
        var year = dateData.getFullYear();
        return (day < 10 ? '0' : '') + day + ' ' + month + ', ' + year;
    }

    console.log(listMemberAssignees)
    console.log(listMemberNoAssignees)
    return (
        <React.Fragment>
            {/* <Card>
                <CardBody className="text-center">
                    <h6 className="card-title mb-3 flex-grow-1 text-start">Time Tracking</h6>
                    <div className="mb-2">
                    <i className="ri-time-line display-2 text-success"></i>
                    </div>
                    <h3 className="mb-1">9 hrs 13 min</h3>
                    <h5 className="fs-14 mb-4">Profile Page Satructure</h5>
                    <div className="hstack gap-2 justify-content-center">
                        <button className="btn btn-danger btn-sm"><i className="ri-stop-circle-line align-bottom me-1"></i> Stop</button>
                        <button className="btn btn-success btn-sm"><i className="ri-play-circle-line align-bottom me-1"></i> Start</button>
                    </div>
                </CardBody>
            </Card> */}
            <Card className="mb-3">
                <CardBody>
                    {/* <div className="mb-4">
                        <select className="form-control" name="choices-single-default" data-choices data-choices-search-false>
                            <option value="">Select Task board</option>
                            <option value="Unassigned">Unassigned</option>
                            <option value="To Do">To Do</option>
                            <option value="Inprogress">Inprogress</option>
                            <option defaultValue="In Reviews">In Reviews</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div> */}
                    <div className="table-card">
                        <table className="table mb-0">
                            <tbody>

                                <tr>
                                    <td className="fw-medium">Tasks Title</td>
                                    <td>{dataTask.prop.name}</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Project Name</td>
                                    <td>Velzon - Admin Dashboard</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Priority</td>
                                    <td><span className={`badge bg-danger-subtle text-${convertColorPrority(dataTask.prop.priority)}`}>{convertPriority(dataTask.prop.priority)}</span></td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Status</td>
                                    <td><span className={`badge bg-secondary-subtle text-${convertColorStatus(dataTask.prop.status)}`}>{convertStatus(dataTask.prop.status)}</span></td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Due Date</td>
                                    <td>{convertDate(dataTask.prop.due_date)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="d-flex mb-3">
                        <h6 className="card-title mb-0 flex-grow-1" >Assigned To</h6>
                        <div className="flex-shrink-0">
                            <button type="button" className="btn btn-soft-danger btn-sm" onClick={() => { toggleModal(); }}><i className="ri-share-line me-1 align-bottom"></i> Assigned Member</button>
                        </div>
                    </div>
                    <ul className="list-unstyled vstack gap-3 mb-0">
                        {listMemberAssignees && listMemberAssignees.map((member: any, index: number) => {
                            return (
                                <li>
                                    {
                                        member.user_info && <div className={`d-flex align-items-center ${member.user_info.id==dataTask.prop.owner.id ? "bg_own_main" : ""}`}>
                                            <div className="flex-shrink-0">
                                                <img src={member.user_info.profile_ava_url ? member.user_info.profile_ava_url : avt_default} alt="" className="avatar-xs rounded-circle" />
                                            </div>
                                            <div className="flex-grow-1 ms-2">
                                                <h6 className="mb-1"><Link to="/pages-profile">{member.user_info.full_name ? member.user_info.full_name : "New User"}</Link></h6>
                                                {member.user_info.id!==dataTask.prop.owner.id  &&<p className="text-muted mb-0">{member.user_info.title ? member.user_info.title : "Member"}</p>}
                                                {member.user_info.id==dataTask.prop.owner.id  &&<p className="text-muted mb-0">Owner Project</p>}
                                            </div>
                                           {member.user_info.id!==dataTask.prop.owner.id  && <div className="flex-shrink-0">
                                                <i className="ri-delete-bin-5-fill text-muted me-2 align-bottom icon_delete" onClick={() => deleteAssignHandle(member.user_info.id)}></i>
                                            </div>}
                                        </div>
                                    }
                                    {
                                        member.account_info && <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <img src={member.account_info.profile_ava_url ? member.account_info.profile_ava_url : avt_default} alt="" className="avatar-xs rounded-circle" />
                                            </div>
                                            <div className="flex-grow-1 ms-2">
                                                <h6 className="mb-1"><Link to="/pages-profile">{member.account_info.full_name ? member.account_info.full_name : "New User"}</Link></h6>
                                                <p className="text-muted mb-0">{member.account_info.title ? member.account_info.title : "Member"}</p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <i className="ri-delete-bin-5-fill text-muted me-2 align-bottom icon_delete" onClick={() => deleteAssignHandle(member.account_info.id)}></i>
                                            </div>
                                        </div>
                                    }
                                </li>
                            );
                        })}

                    </ul>
                    <ul className="list-unstyled vstack gap-3 mb-0 mt-3">
                        {listMemberNoAssignees && listMemberNoAssignees.map((member: any, index: number) => {
                            return (
                                <li>
                                   {
                                    member.user_info && <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <img src={member.user_info.profile_ava_url ? member.user_info.profile_ava_url : avt_default} alt="" className="avatar-xs rounded-circle" />
                                    </div>
                                    <div className="flex-grow-1 ms-2">
                                        <h6 className="mb-1"><Link to="/pages-profile">{member.user_info.full_name ? member.user_info.full_name : "New User"}</Link></h6>
                                        <p className="text-muted mb-0">{member.user_info.title ? member.user_info.title : "Member"}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <button type="button" className="btn btn-light btn-sm" onClick={() => assignMemberHandle(member.user_info.id)}>Assign</button>
                                    </div>
                                </div>
                                   }
                                         {
                                    member.account_info && <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <img src={member.account_info.profile_ava_url ? member.account_info.profile_ava_url : avt_default} alt="" className="avatar-xs rounded-circle" />
                                    </div>
                                    <div className="flex-grow-1 ms-2">
                                        <h6 className="mb-1"><Link to="/pages-profile">{member.account_info.full_name ? member.account_info.full_name : "New User"}</Link></h6>
                                        <p className="text-muted mb-0">{member.account_info.title ? member.account_info.title : "Member"}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <button type="button" className="btn btn-light btn-sm" onClick={() => assignMemberHandle(member.account_info.id)}>Assign</button>
                                    </div>
                                </div>
                                   }
                                </li>
                            );
                        })}

                    </ul>
                </div>

            </div>
            {/* <Card>
                <CardBody>
                    <h5 className="card-title mb-3">Attachments</h5>
                    <div className="vstack gap-2">
                        <div className="border rounded border-dashed p-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm">
                                        <div className="avatar-title bg-light text-secondary rounded fs-24">
                                            <i className="ri-folder-zip-line"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="fs-13 mb-1"><Link to="#" className="text-body text-truncate d-block">App pages.zip</Link></h5>
                                    <div>2.2MB</div>
                                </div>
                                <div className="flex-shrink-0 ms-2">
                                    <div className="d-flex gap-1">
                                        <button type="button" className="btn btn-icon text-muted btn-sm fs-18"><i className="ri-download-2-line"></i></button>
                                        <UncontrolledDropdown>
                                            <DropdownToggle tag="button" className="btn btn-icon text-muted btn-sm fs-18 dropdown" type="button">
                                                <i className="ri-more-fill"></i>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <li><DropdownItem><i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Rename</DropdownItem></li>
                                                <li><DropdownItem><i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete</DropdownItem></li>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border rounded border-dashed p-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm">
                                        <div className="avatar-title bg-light text-secondary rounded fs-24">
                                            <i className="ri-file-ppt-2-line"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="fs-13 mb-1"><Link to="#" className="text-body text-truncate d-block">Velzon admin.ppt</Link></h5>
                                    <div>2.4MB</div>
                                </div>
                                <div className="flex-shrink-0 ms-2">
                                    <div className="d-flex gap-1">
                                        <button type="button" className="btn btn-icon text-muted btn-sm fs-18"><i className="ri-download-2-line"></i></button>
                                        <UncontrolledDropdown>
                                            <DropdownToggle tag="button" className="btn btn-icon text-muted btn-sm fs-18 dropdown" type="button">
                                                <i className="ri-more-fill"></i>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <li><DropdownItem><i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Rename</DropdownItem></li>
                                                <li><DropdownItem><i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete</DropdownItem></li>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border rounded border-dashed p-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm">
                                        <div className="avatar-title bg-light text-secondary rounded fs-24">
                                            <i className="ri-folder-zip-line"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="fs-13 mb-1"><Link to="#" className="text-body text-truncate d-block">Images.zip</Link></h5>
                                    <div>1.2MB</div>
                                </div>
                                <div className="flex-shrink-0 ms-2">
                                    <div className="d-flex gap-1">
                                        <button type="button" className="btn btn-icon text-muted btn-sm fs-18"><i className="ri-download-2-line"></i></button>
                                        <UncontrolledDropdown>
                                            <DropdownToggle tag="button" className="btn btn-icon text-muted btn-sm fs-18 dropdown" type="button">
                                                <i className="ri-more-fill"></i>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <li><DropdownItem><i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Rename</DropdownItem></li>
                                                <li><DropdownItem><i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete</DropdownItem></li>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 text-center">
                            <button type="button" className="btn btn-success">View more</button>
                        </div>
                    </div>
                </CardBody>
            </Card> */}

        </React.Fragment>
    );
};

export default TimeTracking;