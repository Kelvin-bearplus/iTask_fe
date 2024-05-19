import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Input, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane, UncontrolledDropdown, Form, FormFeedback } from 'reactstrap';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
//SimpleBar
import { getComment, createComment } from "../../../slices/thunks";
import SimpleBar from "simplebar-react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { createSelector } from "reselect";
import avtDefault from "../../../assets/images/users/anh_mac_dinh.jpg"
import { formatDateFromAPI } from "../../../helpers/format"
const Comments = (dataTask: any) => {
    const [limit, setLimit] = useState(100);
    const [page, setPage] = useState(1);
    const dispatch: any = useDispatch();
    const [activeTab, setActiveTab] = useState<any>('1');
    const toggleTab = (tab: any) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };
    interface dataGetComment {
        limit: number,
        page: number,
        taskId: number,
        type:number
    }
    const [replyId, setReplyId] = useState(0)
    const [isReply, setIsReply] = useState(false)
    const [dataComment, setDataComment] = useState([])
    async function getCommentData(dataComment: dataGetComment) {
        const response = await dispatch(getComment(dataComment));
        if (response.payload) {
            setDataComment(response.payload);
        }
    }
    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            contentComment: ''
        },
        validationSchema: Yup.object({
            contentComment: Yup.string().required("Please Enter Your Comment"),
        }),
        onSubmit: async (values, { resetForm }) => {
            var valueSubmit = {
                'task_id': dataTask.taskId,
                'parent_comment_id': replyId,
                'message': values.contentComment,
                type:1
            }
            const response = await dispatch(createComment(valueSubmit));
            if (response.payload) {
                resetForm();
                getCommentData({ limit: limit, page: page, taskId: dataTask.taskId,type:1 })
            setReplyId(0)
            }
        }
    });
    useEffect(() => {
        if (dataTask != undefined) {
            getCommentData({ limit: limit, page: page, taskId: dataTask.taskId, type:1 })
        }
    }, []);
    const selectCommentData = createSelector(
        (state: any) => state.Comment.commentList,
        (commentList) => commentList
    );
    const commentList = useSelector(selectCommentData);
    return (
        <React.Fragment>
            <Card>
                <CardHeader>
                    <div>
                        <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0" role="tablist">
                            <NavItem>
                                <NavLink
                                    href="#"
                                    className={classnames({ active: activeTab === '1' })}
                                    onClick={() => { toggleTab('1'); }}
                                >
                                    Comments ({dataComment.length})
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    href="#"
                                    className={classnames({ active: activeTab === '2' })}
                                    onClick={() => { toggleTab('2'); }}
                                >
                                    Attachments File (4)
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    href="#"
                                    className={classnames({ active: activeTab === '3' })}
                                    onClick={() => { toggleTab('3'); }}
                                >
                                    Time Entries (9 hrs 13 min)
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </div>
                </CardHeader>
                <CardBody>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                            <h5 className="card-title mb-4">Comments</h5>
                           {dataComment.length > 0 && <SimpleBar style={{ height: "508px" }} className="px-3 mx-n3 mb-2">
                                    { dataComment.map((comment: any, index: number) => {
                                        return (
                                                <div className="d-flex mb-4" key={index}>
                                                <div className="flex-shrink-0">
                                                    <img src={comment.owner ? comment.owner.profile_ava_url : avtDefault} alt="" className="avatar-xs rounded-circle" />
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h5 className="fs-13"><Link to="/pages-profile">{comment.owner ? comment.owner.full_name : "New member"}</Link> <span className="text-muted">{formatDateFromAPI(comment.updated_at)}</span></h5>
                                                    <p className="text-muted">{comment.message}</p>
                                                    <p onClick={() => setReplyId(comment.id)} className="badge text-muted bg-light __reply"><i className="mdi mdi-reply"></i> Reply</p>
                                                    {comment.reply_comments.length > 0 && comment.reply_comments.map((commentReply: any, index: number) => {
                                                        return (
                                                            <div className="d-flex mt-4" key={index}>
                                                                <div className="flex-shrink-0">
                                                                    <img src={avtDefault} alt="" className="avatar-xs rounded-circle" />
                                                                </div>
                                                                <div className="flex-grow-1 ms-3">
                                                                    <h5 className="fs-13"><Link to="/pages-profile">{commentReply.owner ? commentReply.owner.full_name : "New member"}</Link> <span className="text-muted">{formatDateFromAPI(commentReply.updated_at)}</span></h5>
                                                                    <p className="text-muted">{commentReply.message}</p>
                                                                    {/* <Link to="#" className="badge text-muted bg-light"><i className="mdi mdi-reply"></i> Reply</Link> */}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                    {replyId === comment.id && <Form className="mt-4"
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            validation.handleSubmit();
                                                            return false;
                                                        }}
                                                    >
                                                        <Row className="g-3">
                                                            <Col lg={12}>
                                                                <label htmlFor="exampleFormControlTextarea1" className="form-label">Leave a Comments</label>
                                                                <Input type="text" className="form-control" id="project-title-input" name="contentComment"
                                                                    placeholder="Your Comment" onChange={validation.handleChange}
                                                                    onBlur={validation.handleBlur}
                                                                    value={validation.values.contentComment || ""}
                                                                    invalid={
                                                                        validation.touched.contentComment && validation.errors.contentComment ? true : false
                                                                    } />
                                                                {validation.touched.contentComment && validation.errors.contentComment ? (
                                                                    <FormFeedback type="invalid">{validation.errors.contentComment}</FormFeedback>
                                                                ) : null}
                                                            </Col>
                                                            <Col xs={12} className="text-end">
                                                                <button className="btn btn-success" type="submit">Post Comments</button>
                                                            </Col>
                                                        </Row>
                                                    </Form>}
                                                </div>
                                            </div>
                                        )
                                    })}

                            </SimpleBar>}
                          {replyId ===0 && <Form className="mt-4"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    validation.handleSubmit();
                                    return false;
                                }}
                            >
                                <Row className="g-3">
                                    <Col lg={12}>
                                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Leave a Comments</label>
                                        <Input type="text" className="form-control" id="project-title-input" name="contentComment"
                                            placeholder="Your Comment" onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.contentComment || ""}
                                            invalid={
                                                validation.touched.contentComment && validation.errors.contentComment ? true : false
                                            } />
                                        {validation.touched.contentComment && validation.errors.contentComment ? (
                                            <FormFeedback type="invalid">{validation.errors.contentComment}</FormFeedback>
                                        ) : null}
                                    </Col>
                                    <Col xs={12} className="text-end">
                                        <button className="btn btn-success" type="submit">Post Comments</button>
                                    </Col>
                                </Row>
                            </Form>
}
                        </TabPane>
                        <TabPane tabId="2">
                            <div className="table-responsive table-card">
                                <Table className="table-borderless align-middle mb-0">
                                    <thead className="table-light text-muted">
                                        <tr>
                                            <th scope="col">File Name</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Size</th>
                                            <th scope="col">Upload Date</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm">
                                                        <div className="avatar-title bg-primary-subtle text-primary rounded fs-20">
                                                            <i className="ri-file-zip-fill"></i>
                                                        </div>
                                                    </div>
                                                    <div className="ms-3 flex-grow-1">
                                                        <h6 className="fs-15 mb-0"><Link to="#">App pages.zip</Link></h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>Zip File</td>
                                            <td>2.22 MB</td>
                                            <td>21 Dec, 2021</td>
                                            <td>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle tag="a" href="#" className="btn btn-light btn-icon">
                                                        <i className="ri-equalizer-fill"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end" style={{ position: "absolute", inset: "0px 0px auto auto", margin: "0px", transform: "translate(0px, 23px)" }}>
                                                        <li><DropdownItem><i className="ri-eye-fill me-2 align-middle text-muted"></i>View</DropdownItem></li>
                                                        <li><DropdownItem><i className="ri-download-2-fill me-2 align-middle text-muted"></i>Download</DropdownItem></li>
                                                        <li className="dropdown-divider"></li>
                                                        <li><DropdownItem><i className="ri-delete-bin-5-line me-2 align-middle text-muted"></i>Delete</DropdownItem></li>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm">
                                                        <div className="avatar-title bg-danger-subtle text-danger rounded fs-20">
                                                            <i className="ri-file-pdf-fill"></i>
                                                        </div>
                                                    </div>
                                                    <div className="ms-3 flex-grow-1">
                                                        <h6 className="fs-15 mb-0"><Link to="#">Velzon admin.ppt</Link></h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>PPT File</td>
                                            <td>2.24 MB</td>
                                            <td>25 Dec, 2021</td>
                                            <td>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle tag="a" href="#" className="btn btn-light btn-icon">
                                                        <i className="ri-equalizer-fill"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end" style={{ position: "absolute", inset: "0px 0px auto auto", margin: "0px", transform: "translate(0px, 23px)" }}>
                                                        <li><DropdownItem><i className="ri-eye-fill me-2 align-middle text-muted"></i>View</DropdownItem></li>
                                                        <li><DropdownItem><i className="ri-download-2-fill me-2 align-middle text-muted"></i>Download</DropdownItem></li>
                                                        <li className="dropdown-divider"></li>
                                                        <li><DropdownItem><i className="ri-delete-bin-5-line me-2 align-middle text-muted"></i>Delete</DropdownItem></li>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm">
                                                        <div className="avatar-title bg-info-subtle text-info rounded fs-20">
                                                            <i className="ri-folder-line"></i>
                                                        </div>
                                                    </div>
                                                    <div className="ms-3 flex-grow-1">
                                                        <h6 className="fs-15 mb-0"><Link to="#">Images.zip</Link></h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>ZIP File</td>
                                            <td>1.02 MB</td>
                                            <td>28 Dec, 2021</td>
                                            <td>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle tag="a" href="#" className="btn btn-light btn-icon">
                                                        <i className="ri-equalizer-fill"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end" style={{ position: "absolute", inset: "0px 0px auto auto", margin: "0px", transform: "translate(0px, 23px)" }}>
                                                        <li><DropdownItem><i className="ri-eye-fill me-2 align-middle text-muted"></i>View</DropdownItem></li>
                                                        <li><DropdownItem><i className="ri-download-2-fill me-2 align-middle text-muted"></i>Download</DropdownItem></li>
                                                        <li className="dropdown-divider"></li>
                                                        <li><DropdownItem><i className="ri-delete-bin-5-line me-2 align-middle text-muted"></i>Delete</DropdownItem></li>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm">
                                                        <div className="avatar-title bg-danger-subtle text-danger rounded fs-20">
                                                            <i className="ri-image-2-fill"></i>
                                                        </div>
                                                    </div>
                                                    <div className="ms-3 flex-grow-1">
                                                        <h6 className="fs-15 mb-0"><Link to="#">Bg-pattern.png</Link></h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>PNG File</td>
                                            <td>879 KB</td>
                                            <td>02 Nov 2021</td>
                                            <td>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle tag="a" href="#" className="btn btn-light btn-icon">
                                                        <i className="ri-equalizer-fill"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end" style={{ position: "absolute", inset: "0px 0px auto auto", margin: "0px", transform: "translate(0px, 23px)" }}>
                                                        <li><DropdownItem><i className="ri-eye-fill me-2 align-middle text-muted"></i>View</DropdownItem></li>
                                                        <li><DropdownItem><i className="ri-download-2-fill me-2 align-middle text-muted"></i>Download</DropdownItem></li>
                                                        <li className="dropdown-divider"></li>
                                                        <li><DropdownItem><i className="ri-delete-bin-5-line me-2 align-middle text-muted"></i>Delete</DropdownItem></li>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tr> */}
                                    </tbody>
                                </Table>
                            </div>
                        </TabPane>
                        <TabPane tabId="3">
                            <h6 className="card-title mb-4 pb-2">Time Entries</h6>
                            <div className="table-responsive table-card">
                                <table className="table align-middle mb-0">
                                    <thead className="table-light text-muted">
                                        <tr>
                                            <th scope="col">Member</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Duration</th>
                                            <th scope="col">Timer Idle</th>
                                            <th scope="col">Tasks Title</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* <tr>
                                            <th scope="row">
                                                <div className="d-flex align-items-center">
                                                    <img src={avatar8} alt="" className="rounded-circle avatar-xxs" />
                                                    <div className="flex-grow-1 ms-2">
                                                        <Link to="/pages-profile" className="fw-medium">Thomas Taylor</Link>
                                                    </div>
                                                </div>
                                            </th>
                                            <td>02 Jan, 2022</td>
                                            <td>3 hrs 12 min</td>
                                            <td>05 min</td>
                                            <td>Apps Pages</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img src={avatar10} alt="" className="rounded-circle avatar-xxs" />
                                                    <div className="flex-grow-1 ms-2">
                                                        <Link to="/pages-profile" className="fw-medium">Tonya Noble</Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>28 Dec, 2021</td>
                                            <td>1 hrs 35 min</td>
                                            <td>-</td>
                                            <td>Profile Page Design</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">
                                                <div className="d-flex align-items-center">
                                                    <img src={avatar10} alt="" className="rounded-circle avatar-xxs" />
                                                    <div className="flex-grow-1 ms-2">
                                                        <Link to="/pages-profile" className="fw-medium">Tonya Noble</Link>
                                                    </div>
                                                </div>
                                            </th>
                                            <td>27 Dec, 2021</td>
                                            <td>4 hrs 26 min</td>
                                            <td>03 min</td>
                                            <td>Ecommerce Dashboard</td>
                                        </tr> */}
                                    </tbody>
                                </table>
                            </div>
                        </TabPane>
                    </TabContent>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default Comments;