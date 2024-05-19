import React, { useState, useCallback, useEffect } from 'react';
import { Input, Card, CardBody, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Modal, ModalHeader, ModalBody } from 'reactstrap';
import SimpleBar from "simplebar-react";

import avt_default from "../../../assets/images/users/anh_mac_dinh.jpg";
import Flatpickr from "react-flatpickr";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { inviteMember, getMemberAssignees, deleteAssign, assignMember, updateTask } from "../../../slices/thunks";

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
            setListMemberAssignees(listMemberAssignees.filter(
                (item: any) => {
                    // Kiểm tra nếu item.user_info không tồn tại
                    if (item.user_info) {
                        return item.user_info.id !== userId;
                    }
                    else {
                        return item.account_info.id !== userId;
                    }
                }
            ))
            const newListNoMemberAssignees = [...listMemberNoAssignees];
            const filteredItems = listMemberAssignees.filter(
                (item: any) => {
                    // Kiểm tra nếu item.user_info không tồn tại
                    if (item.user_info) {
                        return item.user_info.id == userId;
                    }
                    else {
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
        if (assignData.payload && assignData.payload.data == 0) {
            setListMemberNoAssignees(listMemberNoAssignees.filter(
                (item: any) => {
                    if (item.user_info) {
                        return item.user_info.id !== userId;
                    }
                    else {
                        return item.account_info.id !== userId;
                    }
                }
            ))
            const newListMemberAssignees = [...listMemberAssignees];
            const filteredItems = listMemberNoAssignees.filter(
                (item: any) => {
                    if (item.user_info) {
                        return item.user_info.id == userId;
                    }
                    else {
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
        if (data.payload) {
            setListMemberNoAssignees(data.payload);
        }
    }
    useEffect(() => {
        setListMemberAss();
        setListMemberAssignees(dataTask.prop.assignees)
    }, [])
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
    const titleTaskChang = (e: any) => {
        const data = {
            id: dataTask.prop.id,

            task: {
                name: e.target.value,
                project_id: dataTask.prop.project_info.id
            }
        }
        dispatch(updateTask(data))
    }
    const priorityTaskChange = (e: any) => {
        const data = {
            id: dataTask.prop.id,

            task: {
                priority: parseInt(e.target.value),
                project_id: dataTask.prop.project_info.id
            }
        }
        dispatch(updateTask(data))
    }
    const statusTaskChange = (e: any) => {
        const data = {
            id: dataTask.prop.id,

            task: {
                status: parseInt(e.target.value),
                project_id: dataTask.prop.project_info.id
            }
        }
        dispatch(updateTask(data))
    }
 const onChangeDueDate = (selectedDates:any, dateStr:any) => {
    const selectedDate = selectedDates.length > 0 ? selectedDates[0] : null;

    if (selectedDate) {
        // Chuyển đổi đối tượng Date thành chuỗi có định dạng ISO 8601
        const isoDateString = selectedDate.toISOString();
        const data = {
            id: dataTask.prop.id,
    
            task: {
                due_date: isoDateString,
                project_id: dataTask.prop.project_info.id
            }
        }
        dispatch(updateTask(data))
    }
  
}
    return (
        <React.Fragment>
       
            <Card className="mb-3">
                <CardBody>
                  
                    <div className="table-card">
                        <table className="table mb-0">
                            <tbody>

                                <tr>
                                    <td className="fw-medium">Tasks Title</td>
                                    {/* <td>{dataTask.prop.name}</td> */}
                                    <td><input type="text" className='__input_custom' defaultValue={dataTask.prop.name} onBlur={titleTaskChang} /></td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Project Name</td>
                                    <td>{dataTask.prop.project_info.name}</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Priority</td>
                                    <td><select className={`badge bg-danger-subtle text-${convertColorPrority(dataTask.prop.priority)} select_custom`} onChange={priorityTaskChange}>
                                        <option value="1" {...dataTask.prop.priority === 1 && { selected: true }}>High</option>
                                        <option value="2" {...dataTask.prop.priority === 2 && { selected: true }}>Medium</option>
                                        <option value="3" {...dataTask.prop.priority === 3 && { selected: true }}>Low</option>
                                    </select></td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Status</td>
                                    <td><select className={`badge border-0 text-${convertColorStatus(dataTask.prop.status)} `} onChange={statusTaskChange}>
                                        <option value="1" {...dataTask.prop.status === 0 && { selected: true }}>Unassigned</option>
                                        <option value="1" {...dataTask.prop.status === 1 && { selected: true }}>Pending</option>
                                        <option value="2" {...dataTask.prop.status === 2 && { selected: true }}>In-progress</option>
                                        <option value="3" {...dataTask.prop.status === 3 && { selected: true }}>Done</option>
                                    </select></td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Due Date</td>
                                    <td>
                                        <Flatpickr
                                            name="dueDate"
                                            id="duedate-field"
                                            className="form-control"
                                            placeholder="Select a date"
                                            options={{
                                                altInput: true,
                                                altFormat: "d M, Y",
                                                dateFormat: "d M, Y",
                                            }}
                                            onChange={onChangeDueDate}
                                            value={convertDate(dataTask.prop.due_date)}
                                        />
                                    </td>
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
                        {/* <div className="flex-shrink-0">
                            <button type="button" className="btn btn-soft-danger btn-sm" onClick={() => { toggleModal(); }}><i className="ri-share-line me-1 align-bottom"></i> Assigned Member</button>
                        </div> */}
                    </div>
                    <ul className="list-unstyled vstack gap-3 mb-0">
                        {listMemberAssignees && listMemberAssignees.map((member: any, index: number) => {
                            return (
                                <li key={index}>
                                    {
                                        member.user_info && <div className={`d-flex align-items-center ${member.user_info.id == dataTask.prop.owner.id ? "bg_own_main" : ""}`}>
                                            <div className="flex-shrink-0">
                                                <img src={member.user_info.profile_ava_url ? member.user_info.profile_ava_url : avt_default} alt="" className="avatar-xs rounded-circle" />
                                            </div>
                                            <div className="flex-grow-1 ms-2">
                                                <h6 className="mb-1"><Link to="/pages-profile">{member.user_info.full_name ? member.user_info.full_name : "New User"}</Link></h6>
                                                {member.user_info.id !== dataTask.prop.owner.id && <p className="text-muted mb-0">{member.user_info.title ? member.user_info.title : "Member"}</p>}
                                                {member.user_info.id == dataTask.prop.owner.id && <p className="text-muted mb-0">Owner Project</p>}
                                            </div>
                                            {member.user_info.id !== dataTask.prop.owner.id && <div className="flex-shrink-0">
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
                                <li key={index}>
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