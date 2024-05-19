// import React from 'react';
import { Link } from 'react-router-dom';
import { Input, Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown, Modal, ModalHeader, ModalBody } from 'reactstrap';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getUninvited, inviteMember, deleteMember } from "../../../slices/thunks";
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { createSelector } from 'reselect';
import avt_default from "../../../assets/images/users/anh_mac_dinh.jpg";
import Comments from'./Comment'
//SimpleBar
import SimpleBar from "simplebar-react";
const userId = localStorage.getItem('userId');
const OverviewTab = ({ dataProject, startDate, deadlineDate }: { dataProject: any, startDate: Date, deadlineDate: Date }) => {

    const parseHTML = (htmlString: string) => {
        return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
    };
    const [modal, setModal] = useState<boolean>(false);
    const toggleModal = useCallback(() => {
        if (modal) {
            setModal(false);
        } else {
            setModal(true);
        }
    }, [modal]);
    const InviteMember = (email: string) => async () => {
        const dataUrl = {
            projectId: dataProject.prop.id, // Match the property name with the expected parameter name
            email: email
        };

        dispatch(inviteMember(dataUrl));
        setSearchMember(memberInit);
    }

    const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const newKeyword = event.currentTarget.value; // Lấy giá trị mới của keyword
            searchMembers(newKeyword)

        }
    };
    const [inviteMemberData, setInviteMemberData] = useState([]);
    useEffect(() => {
        setInviteMemberData(dataProject.prop.members);
    }, [dataProject])
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
    function isObjectEmpty(obj: any) {
        return Object.keys(obj).length === 0;
    }
    const [searchMember, setSearchMember] = useState(memberInit);
    const dispatch: any = useDispatch();
    const [errorMessage, setErrorMessage] = useState("");
    const searchMembers = async (email: any) => {
        const dataAPI = {
            email: email,
            projectId: dataProject.prop.id
        }
        const data = await dispatch(getUninvited(dataAPI));
        if (data.payload && !isObjectEmpty(data.payload)) {
            if (!data.payload.is_invited&&!data.payload.message) {
                setSearchMember(data.payload);
                setErrorMessage("");
            }
            else if(data.payload.message) {
                setErrorMessage(data.payload.message)
                setSearchMember(memberInit);
            }
            else {
                setErrorMessage("Member is invited!")
                setSearchMember(memberInit);
            }
        }
       
        return data;
    }
    const [toastData, setToastData] = useState("");
    const [errorData, setErrorData] = useState("");
    async function deleteMemberHandel(userId: number, name: string) {
        const dataDelete = {
            projectId: dataProject.prop.id,
            user_id: userId
        }
        const data = await dispatch(deleteMember(dataDelete));
        if (data.payload !== undefined && data.payload.data) {
            setErrorData("")
            const messageSuccess = "Delete member " + name + " success!";
            setToastData(messageSuccess);
            setInviteMemberData(inviteMemberData.filter((member: any) => member.account_info.id !== userId));
        }
        else {
            setToastData("");
            setErrorData("Delete member " + name + " fail!")
        }
    }

    return (
        <React.Fragment>
            {toastData && toastData !== "" ? (
                <>
                    {toast(toastData, { position: "top-right", hideProgressBar: false, className: 'bg-success text-white', progress: undefined, toastId: "" })}
                    <ToastContainer autoClose={2000} limit={1} />
                </>
            ) : null}
            {errorData && errorData !== "" ? (
                <>
                    {toast(errorData, { position: "top-right", hideProgressBar: false, className: 'bg-danger text-white', progress: undefined, toastId: "" })}
                    <ToastContainer autoClose={2000} limit={1} />
                </>
            ) : null}

            <Row>
                <Col xl={9} lg={8}>
                    <Card>
                        <CardBody>
                            <div className="text-muted">
                                <h6 className="mb-3 fw-semibold text-uppercase">Summary</h6>
                                {parseHTML(dataProject.prop.description)}

                                <div>
                                    <button type="button" className="btn btn-link link-success p-0">Read more</button>
                                </div>

                                <div className="pt-3 border-top border-top-dashed mt-4">
                                    <Row className="gy-3">

                                        <Col lg={3} sm={6}>
                                            <div>
                                                <p className="mb-2 text-uppercase fw-medium">Create Date :</p>
                                                <h5 className="fs-15 mb-0">{startDate?.toString()}</h5>
                                            </div>
                                        </Col>
                                        <Col lg={3} sm={6}>
                                            <div>
                                                <p className="mb-2 text-uppercase fw-medium">Due Date :</p>
                                                <h5 className="fs-15 mb-0">{deadlineDate?.toString()}</h5>
                                            </div>
                                        </Col>
                                        <Col lg={3} sm={6}>
                                            <div>
                                                <p className="mb-2 text-uppercase fw-medium">Priority :</p>
                                                <div className="badge bg-danger fs-12">{dataProject.prop.priority}</div>
                                            </div>
                                        </Col>
                                        <Col lg={3} sm={6}>
                                            <div>
                                                <p className="mb-2 text-uppercase fw-medium">Status :</p>
                                                <div className="badge bg-warning fs-12">{dataProject.prop.status}</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </CardBody>

                    </Card>
                    {dataProject.prop.id!==undefined && <Comments taskId={parseInt(dataProject.prop.id)} />}
                   

                </Col>

                <Col xl={3} lg={4}>
                    <Card>
                        <CardBody>
                            <h5 className="card-title mb-4">Skills</h5>
                            <div className="d-flex flex-wrap gap-2 fs-16">
                                {dataProject.prop.tags && dataProject.prop.tags.split(', ').map((item: string, index: number) => (
                                    <div key={index} className="badge fw-medium bg-secondary-subtle text-secondary">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>


                    {userId === dataProject.prop.owner.id &&
                        <Card>
                            <CardHeader className="align-items-center d-flex border-bottom-dashed">
                                <h4 className="card-title mb-0 flex-grow-1">Members</h4>
                                <div className="flex-shrink-0">
                                    <button type="button" className="btn btn-soft-danger btn-sm" onClick={() => { toggleModal(); }}><i className="ri-share-line me-1 align-bottom"></i> Invite Member</button>
                                </div>
                            </CardHeader>

                            <CardBody>
                                <SimpleBar data-simplebar style={{ height: "235px" }} className="mx-n3 px-3">
                                    <div className="vstack gap-3">
                                        {inviteMemberData && inviteMemberData.map((member: any, index: number) => (

                                            <div key={index} className={`d-flex align-items-center ${userId === member.account_info.id ? "bg_own_main" : ""}`}>
                                                <div className="avatar-xs flex-shrink-0 me-3">
                                                    <img src={member.account_info.profile_ava_url} alt="" className="img-fluid rounded-circle" />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h5 className="fs-13 mb-0">
                                                        <Link to="#" className="text-body d-block">{member.account_info.full_name}</Link>
                                                    </h5>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <div className="d-flex align-items-center gap-1">
                                                        <button type="button" className="btn btn-light btn-sm">Message</button>
                                                        <UncontrolledDropdown>
                                                            <DropdownToggle type="button" className="btn btn-icon btn-sm fs-16 text-muted dropdown" tag="button">
                                                                <i className="ri-more-fill"></i>
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                <li><DropdownItem><i className="ri-eye-fill text-muted me-2 align-bottom"></i>View</DropdownItem></li>
                                                                <li><DropdownItem><i className="ri-star-fill text-muted me-2 align-bottom"></i>Favourite</DropdownItem></li>
                                                                {userId !== member.account_info.id && <li onClick={() => deleteMemberHandel(member.account_info.id, member.account_info.full_name)}><DropdownItem><i className="ri-delete-bin-5-fill text-muted me-2 align-bottom" ></i>Delete</DropdownItem></li>}
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </SimpleBar>

                            </CardBody>

                        </Card>
                    }
                    <Card>
                        {/* <CardHeader className="align-items-center d-flex border-bottom-dashed">
                            <h4 className="card-title mb-0 flex-grow-1">Attachments</h4>
                            <div className="flex-shrink-0">
                                <button type="button" className="btn btn-soft-info btn-sm"><i className="ri-upload-2-fill me-1 align-bottom"></i> Upload</button>
                            </div>
                        </CardHeader> */}

                        {/* <CardBody>

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
                                            <h5 className="fs-13 mb-1"><Link to="#" className="text-body text-truncate d-block">App-pages.zip</Link></h5>
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
                                            <h5 className="fs-13 mb-1"><Link to="#" className="text-body text-truncate d-block">Velzon-admin.ppt</Link></h5>
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

                                <div className="border rounded border-dashed p-2">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0 me-3">
                                            <div className="avatar-sm">
                                                <div className="avatar-title bg-light text-secondary rounded fs-24">
                                                    <i className="ri-image-2-line"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="fs-13 mb-1"><Link to="#" className="text-body text-truncate d-block">bg-pattern.png</Link></h5>
                                            <div>1.1MB</div>
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
                        </CardBody> */}
                    </Card>
                </Col>
            </Row>
            <Modal isOpen={modal} toggle={toggleModal} centered className="border-0">
                <ModalHeader toggle={toggleModal} className="p-3 ps-4 bg-success-subtle">
                    Members
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
                            {inviteMemberData && inviteMemberData.map((member: any, index: number) => {
                                return (
                                    <Link to="" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title={member.account_info.full_name ? member.account_info.full_name : ""} data-bs-original-title="Brent Gonzalez">
                                        <div className="avatar-xs">
                                            <img src={member.account_info.profile_ava_url ? member.account_info.profile_ava_url : avt_default} alt="" className="rounded-circle img-fluid" />
                                        </div>
                                    </Link>);
                            })}
                        </div>
                    </div>
                    <SimpleBar className="mx-n4 px-4" data-simplebar="init" style={{ maxHeight: "225px" }}>
                        <div className="vstack gap-3">

                            {
                                searchMember.id > 0 && <div className="d-flex align-items-center">
                                    <div className="avatar-xs flex-shrink-0 me-3">
                                        <img src={searchMember.profile_ava_url ? searchMember.profile_ava_url : ""} alt="" className="img-fluid rounded-circle" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="fs-13 mb-0"><Link to="#" className="text-body d-block">{searchMember.full_name ? searchMember.full_name : ""}</Link></h5>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <button type="button" className="btn btn-light btn-sm" onClick={InviteMember(searchMember.email)}>Add</button>
                                    </div>
                                </div>
                            }
                            {
                                errorMessage != "" && <div>{errorMessage} </div>
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

export default OverviewTab;