import React ,{useState,useCallback}from 'react';
import { Input, Card, CardBody, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Modal, ModalHeader, ModalBody } from 'reactstrap';
import SimpleBar from "simplebar-react";

import avatar10 from "../../../assets/images/users/avatar-10.jpg";

import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUserProfileByEmail, inviteMember } from "../../../slices/thunks";

const TimeTracking = (dataTask:any) => {
    const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const newKeyword = event.currentTarget.value; // Lấy giá trị mới của keyword
            const memberSearch = await searchMembers(newKeyword)

        }
    };
    function checkInvite(member: any) {
        let isMemberFound = true;
    
        if(dataTask.prop.assignees!=null){dataTask.prop.assignees.some((memberProject: any) => {
            if (memberProject.user_id === member.id) {
                isMemberFound = false;
                return true;
            }
        });}
    
        return isMemberFound;
    }
    
    const [modal, setModal] = useState<boolean>(false);
    const toggleModal = useCallback(() => {
        if (modal) {
            setModal(false);
        } else {
            setModal(true);
        }
    }, [modal]);
function convertPriority(priority:number){
    switch(priority){
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
function convertStatus(status:number){
    switch(status){
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
function convertColorStatus(status:number){
    switch(status){
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
function convertColorPrority(status:number){
    switch(status){
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
interface memberData {
    id: number,
    role: string,
    email: string,
    username: string,
    full_name: string,
    address: string,
    title: string,
    phone: string,
    dob: string,
    bio: string,
    profile_ava_url: string,
    profile_cover_url: string,
    created: string,
    updated: string
}
const memberInit: memberData = {
    id: -1,
    role: "",
    email: "",
    username: "",
    full_name: "",
    address: "",
    title: "",
    phone: "",
    dob: "",
    bio: "",
    profile_ava_url: "",
    profile_cover_url: "",
    created: "",
    updated: ""
}
const [searchMember, setSearchMember] = useState(memberInit);
    const dispatch: any = useDispatch();
const [errorMessage,setErrorMessage]=useState("");
    const searchMembers = async (email: any) => {
        const  dataAPI={
            email:email,
            projectId:dataTask.prop.id
        }
        // const data = await dispatch(getUninvited(dataAPI));
        const data:any={};
        console.log(data)
        if (data.payload&&!isObjectEmpty(data.payload)) {
            if (!data.payload.is_invited) {
                setSearchMember(data.payload);
               setErrorMessage("");
            }
           else{
            setErrorMessage("Member is assignees!")
            setSearchMember(memberInit);
           }
        }
        else {
            setErrorMessage(data.error.message)
            setSearchMember(memberInit);
        }
        return data;
    }
    console.log(searchMember)
function convertDate(dateString:string) {
    var dateData = new Date(dateString);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var day = dateData.getDate();
    var month = months[dateData.getMonth()];
    var year = dateData.getFullYear();
    return (day < 10 ? '0' : '') + day + ' ' + month + ', ' + year;
}
const InviteMember = (email: string) => async () => {
    const dataUrl = {
        projectId: dataTask.prop.id, // Match the property name with the expected parameter name
        email: email
    };
    console.log(dataTask)

    const data = await dispatch(inviteMember(dataUrl));

}
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
                    {dataTask.prop.assignees && dataTask.prop.assignees.map((member: any, index: number) => {
                                return (
                                    <li>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0">
                                            <img src={member.user_info.profile_ava_url} alt="" className="avatar-xs rounded-circle" />
                                        </div>
                                        <div className="flex-grow-1 ms-2">
                                            <h6 className="mb-1"><Link to="/pages-profile">{member.user_info.full_name}</Link></h6>
                                            <p className="text-muted mb-0">{member.user_info.title}</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <UncontrolledDropdown>
                                                <DropdownToggle tag="button" className="btn btn-icon btn-sm fs-16 text-muted dropdown" type="button">
                                                    <i className="ri-more-fill"></i>
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <div><DropdownItem><i className="ri-eye-fill text-muted me-2 align-bottom"></i>View</DropdownItem></div>
                                                    <div><DropdownItem><i className="ri-star-fill text-muted me-2 align-bottom"></i>Favourite</DropdownItem></div>
                                                    <div><DropdownItem><i className="ri-delete-bin-5-fill text-muted me-2 align-bottom"></i>Delete</DropdownItem></div>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </div>
                                    </div>
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
            <Modal isOpen={modal} toggle={toggleModal} centered className="border-0">
                <ModalHeader toggle={toggleModal} className="p-3 ps-4 bg-success-subtle">
                    Assignees
                </ModalHeader>
                <ModalBody className="p-4">
                    <div className="search-box mb-3">
                        <Input type="text" className="form-control bg-light border-light" id="search_member" placeholder="Search here..." onKeyPress={handleKeyPress} />
                        <i className="ri-search-line search-icon"></i>
                    </div>

                    <div className="mb-4 d-flex align-items-center">
                        <div className="me-2">
                            <h5 className="mb-0 fs-13">Members :</h5>
                        </div>
                        <div className="avatar-group justify-content-center">
                            {dataTask.prop.assigness && dataTask.prop.assignees.map((project: any, index: number) => {
                                return (
                                    <Link to="" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="" data-bs-original-title="Brent Gonzalez">
                                        <div className="avatar-xs">
                                            <img src={project.account_info.profile_ava_url} alt="" className="rounded-circle img-fluid" />
                                        </div>
                                    </Link>);
                            })}
                        </div>
                    </div>
                    <SimpleBar className="mx-n4 px-4" data-simplebar="init" style={{ maxHeight: "225px" }}>
                        <div className="vstack gap-3">
                          
                           {
                            searchMember.id>0 && <div className="d-flex align-items-center">
                            <div className="avatar-xs flex-shrink-0 me-3">
                                <img src={searchMember.profile_ava_url} alt="" className="img-fluid rounded-circle" />
                            </div>
                            <div className="flex-grow-1">
                                <h5 className="fs-13 mb-0"><Link to="#" className="text-body d-block">{searchMember.full_name}</Link></h5>
                            </div>
                            <div className="flex-shrink-0">
                                <button type="button" className="btn btn-light btn-sm" onClick={InviteMember(searchMember.email)}>Add</button>
                            </div>
                        </div>
                           }
                           {
                          searchMember.id===-1 && <div>Không tìm thấy thành viên </div>
                           }
                             {
                          searchMember.id===-2 && <div>Tài khoản này đã là thành viên trong project</div>
                           }
                        </div>

                    </SimpleBar>
                </ModalBody>
                <div className="modal-footer">
                    <button type="button" className="btn btn-success w-xs" onClick={toggleModal}>Done</button>
                </div>

            </Modal>
        </React.Fragment>
    );
};

export default TimeTracking;