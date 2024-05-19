import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Input, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane, UncontrolledDropdown, Form, FormFeedback } from 'reactstrap';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
//SimpleBar
import { getComment, createComment } from "../../slices/thunks";
import SimpleBar from "simplebar-react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { createSelector } from "reselect";
import avtDefault from "../../../assets/images/users/anh_mac_dinh.jpg"
import { formatDateFromAPI } from "../../helpers/format"
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
                'type':3
            }
            const response = await dispatch(createComment(valueSubmit));
            if (response.payload) {
                resetForm();
                getCommentData({ limit: limit, page: page, taskId: dataTask.taskId,type:3 })
            setReplyId(0)
            }
        }
    });
    useEffect(() => {
        if (dataTask != undefined) {
            getCommentData({ limit: limit, page: page, taskId: dataTask.taskId, type:3 })
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
                        
                       
                    </TabContent>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default Comments;