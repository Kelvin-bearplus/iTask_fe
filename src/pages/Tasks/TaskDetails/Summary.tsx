import React, { useState ,useCallback} from 'react';
import { Card, CardBody, Input, Label, ModalHeader,Modal, ModalBody,Form,Row,Col,FormFeedback,Button } from 'reactstrap';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { updateTask,  addNewTask, } from "../../../slices/thunks";
import { useDispatch } from "react-redux";
import avt_default from '../../../assets/images/users/anh_mac_dinh.jpg';
import { useFormik } from "formik";
import { formatDateCreateProject } from "../../../helpers/format";
import * as Yup from "yup";
import Flatpickr from "react-flatpickr";
import * as moment from "moment";

const Summary = (dataTask: any) => {
    const statusTaskChange = (item_id:number,e: any) => {
        const data = {
            id: item_id,

            task: {
                status: parseInt(e.target.value),
                project_id: dataTask.prop.project_info.id
            }
        }
        console.log(data)
        dispatch(updateTask(data))
    }
    var items = [];
    if (dataTask.prop.tags) {
        items = dataTask.prop.tags.split(', ');
        console.log(dataTask);
    }
    const parseHTML = (htmlString: string) => {
        return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
    };
    const [editorData, setEditorData] = useState("");
    const [editorDataDetail, setEditorDataDetail] = useState("");
    const dispatch: any = useDispatch();

    const handleEditorChange = (event: any, editor: any) => {
        const descriptionText = editor.getData();
        const data = {
            id: dataTask.prop.id,

            task: {
                description: descriptionText,
                project_id: dataTask.prop.project_info.id
            }
        }
        console.log(data)
        dispatch(updateTask(data))
        setEditorData(descriptionText);
    };
    const handleEditorChangeDetail = (event: any, editor: any) => {
        const data = editor.getData();
        setEditorDataDetail(data);
      };
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
    const userIdString: string | null = localStorage.getItem('userId');
    var userId: number = 0;
    if (userIdString != null) {
      userId = parseInt(userIdString);
    }
  const [modalCreateTask, setModalCreateTask] = useState<boolean>(false);
    const toggleCreateDetail = useCallback(async () => {

        if (modalCreateTask) {
          setModalCreateTask(false);
        } else {
          setModalCreateTask(true);
    
        }
      }, [modalCreateTask]);
    const validationCreateDetail: any = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
    
        initialValues: {
          taskId: '',
          name: '',
          description: '',
          dueDate: '',
          status: '1',
          priority: '1',
          assignees: [],
          project: '',
          deadlineDate: '',
          startDate: '',
        },
        validationSchema: Yup.object({
          name: Yup.string().required("Please Enter Task Name"),
          dueDate: Yup.string().required("Please Select Due Date"),
          deadlineDate: Yup.string().required("Please Select Deadline Date"),
          startDate: Yup.string().required("Please Select Start Date"),
        }),
        onSubmit: async (values) => {
          var startDate = formatDateCreateProject(new Date(values.startDate))
          var deadlineDate = formatDateCreateProject(new Date(values.deadlineDate))
          var dueDate = formatDateCreateProject(new Date(values.dueDate))
          const dataTaskInf = {
            name: values.name,
            description: editorDataDetail ? editorDataDetail : '',
            due_date: dueDate,
            started_at: startDate,
            deadline: deadlineDate,
            status: parseInt(values.status),
            priority: parseInt(values.priority),
            position: 1,
            created_by: userId,
            project_id: dataTask.prop.project_info.id,
            parent_task_id:dataTask.prop.id,
            tags:''
          };
    
          // dispatch(addNewTask(dataTask));
          const dataResponse = await dispatch(addNewTask(dataTaskInf));
          console.log(dataResponse)
          if (dataResponse.payload) {
            validationCreateDetail.resetForm();
            setEditorDataDetail('');
          }
          toggleCreateDetail();
    
        },
      })
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <div className="text-muted">
                        <h6 className="mb-3 fw-semibold text-uppercase">Summary</h6>
                        <CKEditor
                            editor={ClassicEditor}
                            data={dataTask.prop.description}
                            onBlur={handleEditorChange}
                            onReady={(editor) => {
                            }}
                        />

                    </div>

                    { <div className='mt-3'><div className="box_dec d-flex flex-row justify-content-between align-items-center mb-2">
                      <p className="label_eric mb-0">Child issues</p>
                      <div className="__box_create d-flex justify-content-between align-items-center">
                      <div className="__btn_create" onClick={toggleCreateDetail}>+</div>
          
                        {/* <UncontrolledDropdown>
                          <DropdownToggle tag="button" className="btn btn-icon text-muted btn-sm fs-18 dropdown" type="button">
                            <i className="ri-more-fill"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <li><DropdownItem><i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Order By</DropdownItem></li>
                            <li><DropdownItem><i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete</DropdownItem></li>
                          </DropdownMenu>
                        </UncontrolledDropdown> */}
                      </div>
                    </div>
                    {dataTask.prop.child_tasks.length > 0 &&  <div className="table_task_child ">
                        {
                             dataTask.prop.child_tasks.map((item: any, key: number) => {

                                return (<div className="box_task_child_eric d-flex">
                                    <div className=" _eric__title__name">{item.name}</div>
                                    {/* <div className="box_task_child_eric__title__date">{formatDateCreateProject(item.created_at)}</div> */}
                                    <div className="box_state">  {item.owner != null && <img className="avt_owner" src={item.owner.profile_ava_url ? item.owner.profile_ava_url : avt_default} title={item.owner.full_name ? item.owner.full_name : 'Member'} alt=""></img>}
                                        {item.owner == null && <img className="avt_owner" src={avt_default} title='Member' alt=""></img>}
                                        <select className={`badge border-0 text-${convertColorStatus(item.status)} `} onChange={(e)=>statusTaskChange(item.id,e)}>
                                            <option value="1" {...item.status === 0 && { selected: true }}>Unassigned</option>
                                            <option value="1" {...item.status === 1 && { selected: true }}>Pending</option>
                                            <option value="2" {...item.status === 2 && { selected: true }}>In-progress</option>
                                            <option value="3" {...item.status === 3 && { selected: true }}>Done</option>
                                        </select></div>
                                </div>

                                )
                            })
                        }
                    </div>}
                    </div>
                    }
                </CardBody>
            </Card>
            <Modal
        isOpen={modalCreateTask}
        toggle={toggleCreateDetail}
        centered
        size="lg"
        className="border-0"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-info-subtle" toggle={toggleCreateDetail}>
          Create Task
        </ModalHeader>
        <Form className="tablelist-form" onSubmit={(e: any) => {
          e.preventDefault();
          validationCreateDetail.handleSubmit();
          return false;
        }}>
          <ModalBody className="modal-body">
            <Row className="g-3">



              <Col lg={12}>
                <div>
                  <Label for="tasksTitle-field" className="form-label">Task name</Label>
                  <Input
                    name="name"
                    id="tasksTitle-field"
                    className="form-control"
                    placeholder="Task name"
                    type="text"
                    validate={{
                      required: { value: true },
                    }}
                    onChange={validationCreateDetail.handleChange}
                    onBlur={validationCreateDetail.handleBlur}
                    value={validationCreateDetail.values.name || ""}
                    invalid={
                      validationCreateDetail.touched.name && validationCreateDetail.errors.name ? true : false
                    }
                  />
                  {validationCreateDetail.touched.name && validationCreateDetail.errors.name ? (
                    <FormFeedback type="invalid">{validationCreateDetail.errors.name}</FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col lg={12}>
                <div className="mb-3">
                  <Label className="form-label">Issue Description</Label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={editorDataDetail}
                    onChange={handleEditorChangeDetail}
                    onReady={(editor) => {
                    }}
                  />
                </div>
              </Col>

              <Col lg={12}>
                {/* <Label className="form-label">Assigned To</Label> */}
                {/* <SimpleBar style={{ maxHeight: "95px" }}>
                  <ul className="list-unstyled vstack gap-2 mb-0">
                    {Assigned.map((item, key) => (<li key={key}>
                      <div className="form-check d-flex align-items-center">
                        <Input name="subItem" className="form-check-input me-3" type="checkbox"
                          onChange={validationCreateDetail.handleChange}
                          onBlur={validationCreateDetail.handleBlur}
                          value={item.img}
                          invalid={validationCreateDetail.touched.subItem && validationCreateDetail.errors.subItem ? true : false}
                          id={item.imgId} />

                        <Label className="form-check-label d-flex align-items-center" htmlFor={item.imgId}>
                          <span className="flex-shrink-0">
                            <img src={item.img} alt="" className="avatar-xxs rounded-circle" />
                          </span>
                          <span className="flex-grow-1 ms-2">
                            {item.name}
                          </span>
                        </Label>
                        {validationCreateDetail.touched.subItem && validationCreateDetail.errors.subItem ? (
                          <FormFeedback type="invalid">{validationCreateDetail.errors.subItem}</FormFeedback>
                        ) : null}
                      </div>
                    </li>))}
                  </ul>
                </SimpleBar> */}
              </Col>
              <Col lg={6}>
                <Label for="start-field" className="form-label">Start Date</Label>
                <Flatpickr
                  name="startDate"
                  id="start-field"
                  className="form-control"
                  placeholder="Select a date"
                  options={{
                    altInput: true,
                    altFormat: "d M, Y",
                    dateFormat: "d M, Y",
                  }}
                  onChange={(startDate: any) => validationCreateDetail.setFieldValue("startDate", moment(startDate[0]).format("DD MMMM ,YYYY"))}
                  value={validationCreateDetail.values.startDate || ''}
                />
                {validationCreateDetail.errors.startDate && validationCreateDetail.touched.startDate ? (
                  <FormFeedback type="invalid" className='d-block'>{validationCreateDetail.errors.startDate}</FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="deadline-field" className="form-label">Deadline Date</Label>
                <Flatpickr
                  name="deadlineDate"
                  id="deadline-field"
                  className="form-control"
                  placeholder="Select a date"
                  options={{
                    altInput: true,
                    altFormat: "d M, Y",
                    dateFormat: "d M, Y",
                  }}
                  onChange={(deadlineDate: any) => validationCreateDetail.setFieldValue("deadlineDate", moment(deadlineDate[0]).format("DD MMMM ,YYYY"))}
                  value={validationCreateDetail.values.deadlineDate || ''}
                />
                {validationCreateDetail.errors.deadlineDate && validationCreateDetail.touched.deadlineDate ? (
                  <FormFeedback type="invalid" className='d-block'>{validationCreateDetail.errors.deadlineDate}</FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="duedate-field" className="form-label">Due Date</Label>
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
                  onChange={(dueDate: any) => validationCreateDetail.setFieldValue("dueDate", moment(dueDate[0]).format("DD MMMM ,YYYY"))}
                  value={validationCreateDetail.values.dueDate || ''}
                />
                {validationCreateDetail.errors.dueDate && validationCreateDetail.touched.dueDate ? (
                  <FormFeedback type="invalid" className='d-block'>{validationCreateDetail.errors.dueDate}</FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="ticket-status" className="form-label">Status</Label>
                <Input
                  name="status"
                  type="select"
                  className="form-select"
                  id="ticket-field"
                  onChange={validationCreateDetail.handleChange}
                  onBlur={validationCreateDetail.handleBlur}
                  value={validationCreateDetail.values.status || ""}
                  invalid={
                    validationCreateDetail.touched.status && validationCreateDetail.errors.status ? true : false
                  }
                >
                  <option value="0">Unssigned</option>
                  <option value="1">Pending</option>
                  <option value="2">In-progress</option>
                  <option value="3">Completed</option>
                </Input>
                {validationCreateDetail.touched.status && validationCreateDetail.errors.status ? (
                  <FormFeedback type="invalid">{validationCreateDetail.errors.status}</FormFeedback>
                ) : null}
              </Col>

              <Col lg={12}>
                <Label for="priority-field" className="form-label">Priority</Label>
                <Input
                  name="priority"
                  type="select"
                  className="form-select"
                  id="priority-field"
                  onChange={validationCreateDetail.handleChange}
                  onBlur={validationCreateDetail.handleBlur}
                  value={validationCreateDetail.values.priority || ""}
                  invalid={
                    validationCreateDetail.touched.priority && validationCreateDetail.errors.priority ? true : false
                  }
                >
                  <option value="1">High</option>
                  <option value="2">Medium</option>
                  <option value="3">Low</option>
                </Input>
                {validationCreateDetail.touched.priority && validationCreateDetail.errors.priority ? (
                  <FormFeedback type="invalid">{validationCreateDetail.errors.priority}</FormFeedback>
                ) : null}
              </Col>
            </Row>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button
                type="button"
                onClick={() => {
                  toggleCreateDetail()
                }}
                className="btn-light"
              >Close</Button>
              <button type="submit" className="btn btn-success" id="add-btn">Create Task</button>
            </div>
          </div>
        </Form>
      </Modal>
        </React.Fragment>
    );
};

export default Summary;