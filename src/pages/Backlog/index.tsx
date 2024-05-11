import React, { useState, useEffect, useCallback } from "react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import avt_default from '../../assets/images/users/anh_mac_dinh.jpg';
import DeleteModal from "Components/Common/DeleteModal";
import { formatDateCreateProject } from "../../helpers/format";

import {
  Card,
  CardBody,
  Col,
  Row,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Label,
  Input,
  FormFeedback,
  Button
} from "reactstrap"
import { useFormik } from "formik"
import * as Yup from "yup"
import Select from "react-select";
import TaskDetails from "pages/Tasks/TaskDetails";

import {
  addNewTask,
  updateTask,
  updateTasks,
  deleteTask,
  getMemberList, getSprint,createSprint,deleteSprint as deleteSprintAPI,editSprint as editSprintAPI
} from "../../slices/thunks"

import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"
import { Link } from "react-router-dom"
import Flatpickr from "react-flatpickr";
import moment from "moment";
import { formatDateSprintFromAPI } from "../../helpers/format";


//Import Breadcrumb
interface CardData {
  id?: string;
  kanId?: string,
  title?: string,
  cardId?: string;
  botId?: any,
  text?: string;
  badge1?: any[];
  userImages?: any[];
  badgeColor?: string;
  eye?: boolean;
  que?: boolean;
  clip?: boolean;
}
interface prop {
  project_id: number;
}

interface KanbanColumn {
  status: string;
  status_name: string;
  badge?: number;
  color?: string;
  task_list?: any;
}

const Backlog: React.FC<prop> = (props) => {
  const [editorData, setEditorData] = useState("");
  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
  };
  const isCreateTask=(sprintId:number)=>{
    setSprintId(sprintId);
    toggleCreate();
  }
  const dispatch = useDispatch<any>();
  const [memberList, setMemberList] = useState([]);
  const [sprint, setSprint] = useState([]);
  async function getMember() {
    const dataResponse = await dispatch(getMemberList(props.project_id));
    const sprintResponse = await dispatch(getSprint(props.project_id));
    if (dataResponse.payload.data) {
      setMemberList(dataResponse.payload.data);
    }
    if (sprintResponse.payload.data) {
      setSprint(sprintResponse.payload.data);
    }
  }
  console.log(sprint)
  const parseHTML = (htmlString: string) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };
  const [modalCreateTask, setModalCreateTask] = useState<boolean>(false);
  const [modalCompleteSprint, setModalCompleteSprint] = useState<boolean>(false);
  const [modalEditTask, setModalEditTask] = useState<boolean>(false);
  const [modalCreateSprint, setModalCreateSprint] = useState<boolean>(false);
  const [modalEditSprint, setModalEditSprint] = useState<boolean>(false);
  const [modalStartSprint, setModalStartSprint] = useState<boolean>(false);
  const taskData = createSelector(
    (state: any) => state.Tasks.taskList,
    (taskList) => taskList
  );
  var taskList = useSelector(taskData);

  const toggleCreate = useCallback(async () => {
    
    if (modalCreateTask) {
      setModalCreateTask(false);
    } else {
      setModalCreateTask(true);

    }
  }, [modalCreateTask]);
  
  const toggleCreateSprint = useCallback(async () => {

    if (modalCreateSprint) {
      setModalCreateSprint(false);
    } else {
      setModalCreateSprint(true);
    }
  }, [modalCreateSprint]);
  const toggleCompleteSprint = useCallback(async () => {

    if (modalCompleteSprint) {
      setModalCompleteSprint(false);
    } else {
      setModalCompleteSprint(true);
    }
  }, [modalCompleteSprint]);
  const toggleEditSprint = useCallback(async () => {

    if (modalEditSprint) {
      setModalEditSprint(false);
    } else {
      setModalEditSprint(true);
    }
  }, [modalEditSprint]);
  const toggleStartSprint = useCallback(async () => {

    if (modalStartSprint) {
      setModalStartSprint(false);
    } else {
      setModalStartSprint(true);
    }
  }, [modalStartSprint]);
  const toggleEdit = useCallback(async () => {
    if (modalEditTask) {
      setModalEditTask(false);
    } else {
      setModalEditTask(true);

    }
  }, [modalEditTask]);
  const [taskIdDetail, setTaskIdDetail] = useState(0);
  const [idSprintEdit, setIdSprintEdit] = useState(0);
  const isEdit = (taskId: number) => {
    setTaskIdDetail(taskId);
    toggleEdit();
  }
  const isEditSprint = (sprintId: number) => {
    setIdSprintEdit(sprintId);
    toggleEditSprint();
  }
  const isCompleteSprint = (sprintId: number) => {
    setIdSprintEdit(sprintId);
    toggleCompleteSprint();
  }
  const isStartSprint = (sprintId: number) => {
    setIdSprintEdit(sprintId);
    toggleStartSprint();
  }
  useEffect(() => {
    getMember();
  }, [props.project_id, taskList])
  console.log(sprint)
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const handleDeleteTask = async () => {
    const dataResponse = await dispatch(deleteTask(idDeleteTask));
    if (dataResponse.payload) {
      refreshList()
    }
    setDeleteModal(false);
  };
  const handleDeleteSprint = async () => {
    const dataResponse = await dispatch(deleteSprintAPI(idDeleteSprint));
    if (dataResponse.payload) {
      refreshList()
    }
    setDeleteSprint(false);
  };
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteSprint, setDeleteSprint] = useState<boolean>(false);
  const [idDeleteSprint, setIdDeleteSprint] = useState(0);
  const [idDeleteTask, setIdDeleteTask] = useState(0);
  async function refreshList() {
    const sprintResponse = await dispatch(getSprint(props.project_id));
    if (sprintResponse.payload.data) {
      setSprint(sprintResponse.payload.data);

    }
  }
  const onClickDeleteSprint = (id: number) => {
    setIdDeleteSprint(id);
    setDeleteSprint(true);
  };
  const onClickDelete = (id: number) => {
    setIdDeleteTask(id);
    setDeleteModal(true);
  };
  const userIdString: string | null = localStorage.getItem('userId');
  var userId: number = 0;
  if (userIdString != null) {
    userId = parseInt(userIdString);
  }
const [sprinId, setSprintId]=useState(0);
  const validationCreate: any = useFormik({
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
      const dataTask = {
        name: values.name,
        description: editorData ? editorData : '',
        due_date: dueDate,
        started_at: startDate,
        deadline: deadlineDate,
        status: parseInt(values.status),
        priority: parseInt(values.priority),
        position: 1,
        created_by: userId,
        project_id: props.project_id,
        sprint_id: sprinId,
        // assignees: values.assignees,
      };

      // dispatch(addNewTask(dataTask));
      const dataResponse = await dispatch(addNewTask(dataTask));
      console.log(dataResponse)
      if (dataResponse.payload) {
        refreshList()
        validationCreate.resetForm();
        setEditorData('');
      }
      toggleCreate();

    },
  });
  const validationCreateSprint: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: '',
      goal: '',
      startAt:'',
      endAt:''
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Sprint Name"),
      startAt: Yup.string().required("Please Enter Start Date"),
      endAt: Yup.string().required("Please Enter End Date"),
    }),
    onSubmit: async (values) => {
      var startDate = formatDateCreateProject(new Date(values.startAt))
      var endDate = formatDateCreateProject(new Date(values.endAt))
      const dataTask = {
        name: values.name,
        goal: editorData ? editorData : '',
        started_at:startDate,
        ended_at:endDate,
        project_id:props.project_id
      };

      // dispatch(addNewTask(dataTask));
      const dataResponse = await dispatch(createSprint(dataTask));
      console.log(dataResponse)
      if (dataResponse.payload) {
        refreshList()
        validationCreateSprint.resetForm();
        setEditorData('');
      }
      toggleCreateSprint();

    },
  });
  const [sprintEdit,setSprintEdit]=useState<any>({})
  const validationEditSprint: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: sprintEdit.name,
      goal: '',
      startAt:(sprintEdit && sprintEdit.started_at ? moment(sprintEdit.started_at).format("DD MMM, YYYY"): '' ) || '',
      endAt:(sprintEdit && sprintEdit.ended_at ? moment(sprintEdit.ended_at).format("DD MMM, YYYY"): '' ) || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Sprint Name"),
      startAt: Yup.string().required("Please Enter Start Date"),
      endAt: Yup.string().required("Please Enter End Date"),
    }),
    onSubmit: async (values) => {
      var startDate = formatDateCreateProject(new Date(values.startAt))
      var endDate = formatDateCreateProject(new Date(values.endAt))
      const dataTask = {
      id: idSprintEdit,
      data:{
        name: values.name,
        goal: editorData ? editorData : '',
        started_at:startDate,
        ended_at:endDate,
      }
      };

      // dispatch(addNewTask(dataTask));
      const dataResponse = await dispatch(editSprintAPI(dataTask));
      console.log(dataResponse)
      if (dataResponse.payload) {
        refreshList()
        validationCreateSprint.resetForm();
        setEditorData('');
      }
      toggleEditSprint();

    },
  });
  const validationStartSprint: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: sprintEdit.name,
      goal: '',
      startAt:(sprintEdit && sprintEdit.started_at ? moment(sprintEdit.started_at).format("DD MMM, YYYY"): '' ) || '',
      endAt:(sprintEdit && sprintEdit.ended_at ? moment(sprintEdit.ended_at).format("DD MMM, YYYY"): '' ) || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Sprint Name"),
      startAt: Yup.string().required("Please Enter Start Date"),
      endAt: Yup.string().required("Please Enter End Date"),
    }),
    onSubmit: async (values) => {
      var startDate = formatDateCreateProject(new Date(values.startAt))
      var endDate = formatDateCreateProject(new Date(values.endAt))
      const dataTask = {
      id: idSprintEdit,
      data:{
        name: values.name,
        goal: editorData ? editorData : '',
        started_at:startDate,
        ended_at:endDate,
        started:true,
      }
      };

      // dispatch(addNewTask(dataTask));
      const dataResponse = await dispatch(editSprintAPI(dataTask));
      console.log(dataResponse)
      if (dataResponse.payload) {
        refreshList()
        validationCreateSprint.resetForm();
        setEditorData('');
      }
      toggleStartSprint();

    },
  });
  const validationCompleteSprint: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      sprintIdTo:'' ,
    },

    onSubmit: async (values) => {
      const incompleteTasksIds = sprintEdit.tasks && sprintEdit.tasks.filter((item:any) => item.status !== 3).map((item:any) => item.id);
    
    console.log(incompleteTasksIds);
      const dataTask = {
      id: incompleteTasksIds,
      dataSprint:{
       sprint_id:values.sprintIdTo,
       project_id:props.project_id
      }
      };

      const dataResponse = await dispatch(updateTasks(dataTask));
      console.log(dataResponse)
      if (dataResponse.payload) {
        refreshList()
        validationCreateSprint.resetForm();
        setEditorData('');
      }
      toggleCompleteSprint();

    },
  });
  const statusTaskChange = (id: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const data = {
      id: id,
      task: {
        status: parseInt(e.target.value),
        project_id: props.project_id
      }
    }
    console.log(data)
    dispatch(updateTask(data))
    refreshList()
  }
async  function updateTaskToSprint(sprinIdTask:number,taskIdSprint:number){
    const dataTask = {
      id: taskIdSprint,
      task:{
        sprint_id:sprinIdTask,
        project_id:props.project_id
      }
      };
   await   dispatch(updateTask(dataTask))
      refreshList()
  
  }

  useEffect(() => {
    const fetchData = async () => {
      if(idSprintEdit!==0){
        const dataResponse:any = sprint.find((item:any)=>item.id===idSprintEdit);
        if (dataResponse) {
          setSprintEdit(dataResponse);
    setEditorData(dataResponse.goal);

        }}
    };

    fetchData();
  }, [idSprintEdit]);
    
console.log(sprintEdit)
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTask}
        onCloseClick={() => setDeleteModal(false)}
      />
 <DeleteModal
        show={deleteSprint}
        onDeleteClick={handleDeleteSprint}
        onCloseClick={() => setDeleteSprint(false)}
      />
      <Card>
        <CardBody>
          <Row className="g-2">
            <div className="col-lg-auto">
              <div className="hstack gap-2">
              </div>
            </div>
            <div className="col-lg-3 col-auto">
              <div className="search-box">
                <input type="text" className="form-control search" id="search-task-options" placeholder="Search for project, tasks..." />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
            <div className="col-auto ms-sm-auto">
              <div className="avatar-group" id="newMembar">
                {memberList.length > 0 && memberList.map((item: any, key: any) => (<Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" key={key} data-bs-trigger="hover" data-bs-placement="top" aria-label={item.name} data-bs-original-title={item.name}>
                  <img src={item.account_info.profile_ava_url ? item.account_info.profile_ava_url : avt_default} alt="" title={item.account_info.full_name ? item.account_info.full_name : ""} className="rounded-circle avatar-xs" />
                </Link>))}
                
              </div>
            </div>
          </Row>
        </CardBody>
      </Card>
      <Row className="__sprint">
        {sprint.length > 0 && sprint.map((item: any, key) => {
          return (
           !item.closed &&
            <Col lg={12} className="box_sprin mb-4">
            <div className="col-12 d-flex justify-content-between header_sprin align-items-center">
              <div className="col-7"><div className="name_sprin">{item.name} <span className="time_sprin">{formatDateSprintFromAPI(item.started_at)} - {formatDateSprintFromAPI(item.ended_at)} ({item.tasks != null && item.tasks.length > 0 && item.tasks.length} {item.tasks == null && 0} issues)</span></div>
              </div>
              <div className="col-5 d-flex justify-content-end">
                {item.id !== 0 &&item.started && <p className={`complete_sprin mb-0 complete_sprint`} onClick={()=>isCompleteSprint(item.id)}>
                Complete sprint
                </p>}
                {item.id !== 0 &&!item.started&& <p className={`complete_sprin mb-0 `} onClick={( )=>isStartSprint(item.id)}>
                 Start sprint
                </p>}
                {item.id!==0 && <UncontrolledDropdown className="float-end dropdown_sprin">
                  <DropdownToggle
                    className="arrow-none "
                    tag="a"
                    color="white"
                  >
                    <i className="ri-more-fill"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem
                      className="edittask-details"onClick={()=>isEditSprint(item.id)}
                    >
                      Edit sprint
                    </DropdownItem>
                    <DropdownItem
                      className="edittask-details"
                      onClick={()=>onClickDeleteSprint(item.id)}
                    >
                      Delete sprint
                    </DropdownItem>

                  </DropdownMenu>
                </UncontrolledDropdown>}
              </div>

            </div>
            <div className="dec_sprin">
              {parseHTML(item.goal)}
            </div>

            <div className="col-12">
              {item.tasks != null && item.tasks.length > 0 && item.tasks.map((task: any, key: number) => {
                return (
                  <div className="col-12 d-flex box_task ">
                    <div className="col-5 d-flex align-items-center">
                      <p className="task_name">{task.name}</p>
                      <div><i className="ri-pencil-fill align-bottom ms-3 text-muted edit_task" onClick={() => isEdit(task.id)}></i></div>
                      <div><i className="ri-delete-bin-fill align-bottom ms-3 text-muted edit_task" onClick={() => onClickDelete(task.id)}></i></div>
                    </div>
                    <div className="col-2 d-flex justify-content-end align-items-center">
                      <p className="name_eric">Eric 1</p>
                    </div>
                    <div className="col-2 d-flex justify-content-end align-items-center">
                      <select className={`task_status ${task.status === 0 && "unassigned"} ${task.status === 1 && "pending"} ${task.status === 2 && "in_progress"} ${task.status === 3 && "done"}`} onChange={(e) => statusTaskChange(task.id, e)}>
                        <option value="0" {...task.status === 0 && { selected: true }}>Unassigned</option>
                        <option value="1" {...task.status === 1 && { selected: true }}>Pending</option>
                        <option value="2" {...task.status === 2 && { selected: true }}>In-progress</option>
                        <option value="3" {...task.status === 3 && { selected: true }}>Done</option>
                      </select>
                    </div>
                    <div className="col-2 d-flex justify-content-end align-items-center">
                      {/* <img src={item.account_info.profile_ava_url?item.account_info.profile_ava_url:avt_default} className="avt_user" alt="" title={item.account_info.full_name?item.account_info.full_name:'New Member'} /> */}
                      <img src={avt_default} alt="" className="avt_user" />
                    </div>
                    <div className="col-1 d-flex justify-content-end align-items-center">
                      <UncontrolledDropdown className="float-end dropdown_sprin __task">
                        <DropdownToggle
                          className="arrow-none "
                          tag="a"
                          color="white"
                        >
                          <i className="ri-more-fill"></i>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                 
                            {sprint.map((itemMove:any,keyMove:number)=>{
                              return(
                                itemMove.id  !== item.id && itemMove.id!==0 && <DropdownItem
                                  className="edittask-details" onClick={()=>updateTaskToSprint(itemMove.id,task.id)}
                                >
                                Move to {itemMove.name}
                                </DropdownItem>
                              )
                            })}


                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="col-12 __create_task" onClick={()=>isCreateTask(item.id)}>+ Create Task</div>

          </Col>
           
          )
          // Add your code here

        })}
        <button className="btn btn-primary add-btn me-1" onClick={() => { toggleCreateSprint(); }}><i className="ri-add-line align-bottom me-1"></i> Create Sprint</button>
      </Row>

      <Modal
        isOpen={modalEditTask}
        toggle={toggleEdit}
        centered
        size="lg"
        className="border-0 col-12 __modal_task_detail"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-info-subtle" toggle={toggleEdit}>
          Edit Task
        </ModalHeader>
        <ModalBody>
          <TaskDetails idTask={taskIdDetail} />
        </ModalBody>
      </Modal>


      <Modal
        isOpen={modalCreateTask}
        toggle={toggleCreate}
        centered
        size="lg"
        className="border-0 col-12 __modal_task_detail"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-info-subtle" toggle={toggleCreate}>
          Create Task
        </ModalHeader>
        <Form className="tablelist-form" onSubmit={(e: any) => {
          e.preventDefault();
          validationCreate.handleSubmit();
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
                    onChange={validationCreate.handleChange}
                    onBlur={validationCreate.handleBlur}
                    value={validationCreate.values.name || ""}
                    invalid={
                      validationCreate.touched.name && validationCreate.errors.name ? true : false
                    }
                  />
                  {validationCreate.touched.name && validationCreate.errors.name ? (
                    <FormFeedback type="invalid">{validationCreate.errors.name}</FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col lg={12}>
                <div className="mb-3">
                  <Label className="form-label">Project Description</Label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={editorData}
                    onChange={handleEditorChange}
                    onReady={(editor) => {
                    }}
                  />
                     
                </div>
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
                  onChange={(startDate: any) => validationCreate.setFieldValue("startDate", moment(startDate[0]).format("DD MMMM ,YYYY"))}
                  value={validationCreate.values.startDate || ''}
                />
                {validationCreate.errors.startDate && validationCreate.touched.startDate ? (
                  <FormFeedback type="invalid" className='d-block'>{validationCreate.errors.startDate}</FormFeedback>
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
                  onChange={(deadlineDate: any) => validationCreate.setFieldValue("deadlineDate", moment(deadlineDate[0]).format("DD MMMM ,YYYY"))}
                  value={validationCreate.values.deadlineDate || ''}
                />
                {validationCreate.errors.deadlineDate && validationCreate.touched.deadlineDate ? (
                  <FormFeedback type="invalid" className='d-block'>{validationCreate.errors.deadlineDate}</FormFeedback>
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
                  onChange={(dueDate: any) => validationCreate.setFieldValue("dueDate", moment(dueDate[0]).format("DD MMMM ,YYYY"))}
                  value={validationCreate.values.dueDate || ''}
                />
                {validationCreate.errors.dueDate && validationCreate.touched.dueDate ? (
                  <FormFeedback type="invalid" className='d-block'>{validationCreate.errors.dueDate}</FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="ticket-status" className="form-label">Status</Label>
                <Input
                  name="status"
                  type="select"
                  className="form-select"
                  id="ticket-field"
                  onChange={validationCreate.handleChange}
                  onBlur={validationCreate.handleBlur}
                  value={validationCreate.values.status || ""}
                  invalid={
                    validationCreate.touched.status && validationCreate.errors.status ? true : false
                  }
                >
                  <option value="0">Unssigned</option>
                  <option value="1">Pending</option>
                  <option value="2">In-progress</option>
                  <option value="3">Completed</option>
                </Input>
                {validationCreate.touched.status && validationCreate.errors.status ? (
                  <FormFeedback type="invalid">{validationCreate.errors.status}</FormFeedback>
                ) : null}
              </Col>

              <Col lg={12}>
                <Label for="priority-field" className="form-label">Priority</Label>
                <Input
                  name="priority"
                  type="select"
                  className="form-select"
                  id="priority-field"
                  onChange={validationCreate.handleChange}
                  onBlur={validationCreate.handleBlur}
                  value={validationCreate.values.priority || ""}
                  invalid={
                    validationCreate.touched.priority && validationCreate.errors.priority ? true : false
                  }
                >
                  <option value="1">High</option>
                  <option value="2">Medium</option>
                  <option value="3">Low</option>
                </Input>
                {validationCreate.touched.priority && validationCreate.errors.priority ? (
                  <FormFeedback type="invalid">{validationCreate.errors.priority}</FormFeedback>
                ) : null}
              </Col>
            </Row>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button
                type="button"
                onClick={() => {
                  toggleCreate()
                }}
                className="btn-light"
              >Close</Button>
              <button type="submit" className="btn btn-success" id="add-btn">Create Task</button>
            </div>
          </div>
        </Form>
      </Modal>


      <Modal
        isOpen={modalCreateSprint}
        toggle={toggleCreateSprint}
        centered
        size="lg"
        className="border-0 col-12 __modal_task_detail"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-info-subtle" toggle={toggleCreateSprint}>
          Create Sprint
        </ModalHeader>
        <Form className="tablelist-form" onSubmit={(e: any) => {
          e.preventDefault();
          validationCreateSprint.handleSubmit();
          return false;
        }}>
          <ModalBody className="modal-body">
            <Row className="g-3">
              <Col lg={12}>
                <div>
                  <Label for="tasksTitle-field" className="form-label">Sprint name</Label>
                  <Input
                    name="name"
                    id="tasksTitle-field"
                    className="form-control"
                    placeholder="Sprint name"
                    type="text"
                    validate={{
                      required: { value: true },
                    }}
                    onChange={validationCreateSprint.handleChange}
                    onBlur={validationCreateSprint.handleBlur}
                    value={validationCreateSprint.values.name || ""}
                    invalid={
                      validationCreateSprint.touched.name && validationCreateSprint.errors.name ? true : false
                    }
                  />
                  {validationCreateSprint.touched.name && validationCreateSprint.errors.name ? (
                    <FormFeedback type="invalid">{validationCreateSprint.errors.name}</FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col lg={12}>
                <div className="mb-3">
                  <Label className="form-label">Srpint Description</Label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={editorData}
                    onChange={handleEditorChange}
                    onReady={(editor) => {
                    }}
                  />
                
                </div>
              </Col>
              <Col lg={6}>
                <Label for="start-field" className="form-label">Start Date</Label>
                <Flatpickr
                  name="startAt"
                  id="start-field"
                  className="form-control"
                  placeholder="Select a date start"
                  options={{
                    altInput: true,
                    altFormat: "d M, Y",
                    dateFormat: "d M, Y",
                  }}
                  onChange={(startAt: any) => validationCreateSprint.setFieldValue("startAt", moment(startAt[0]).format("DD MMMM ,YYYY"))}
                  value={validationCreateSprint.values.startAt || ''}
                  
                />
                   {validationCreateSprint.touched.startAt && validationCreateSprint.errors.startAt ? (
                    <FormFeedback type="invalid" className='d-block'>{validationCreateSprint.errors.startAt}</FormFeedback>
                  ) : null}
              </Col>
              <Col lg={6}>
                <Label for="deadline-field" className="form-label">Deadline Date</Label>
                <Flatpickr
                  name="endAt"
                  id="deadline-field"
                  className="form-control"
                  placeholder="Select a date end"
                  options={{
                    altInput: true,
                    altFormat: "d M, Y",
                    dateFormat: "d M, Y",
                  }}
                  onChange={(endAt: any) => validationCreateSprint.setFieldValue("endAt", moment(endAt[0]).format("DD MMMM ,YYYY"))}
                  value={validationCreateSprint.values.endAt || ''}
                />
                    {validationCreateSprint.touched.endAt && validationCreateSprint.errors.endAt ? (
                    <FormFeedback type="invalid" className='d-block' >{validationCreateSprint.errors.endAt}</FormFeedback>
                  ) : null}
              </Col>
            </Row>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button
                type="button"
                onClick={() => {
                  toggleCreateSprint()
                }}
                className="btn-light"
              >Close</Button>
              <button type="submit" className="btn btn-success" id="add-btn">Create Sprint</button>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
        isOpen={modalEditSprint}
        toggle={toggleEditSprint}
        centered
        size="lg"
        className="border-0 col-12 __modal_task_detail"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-info-subtle" toggle={toggleEditSprint}>
          Edit Sprint
        </ModalHeader>
        <Form className="tablelist-form" onSubmit={(e: any) => {
          e.preventDefault();
          validationEditSprint.handleSubmit();
          return false;
        }}>
          <ModalBody className="modal-body">
            <Row className="g-3">
              <Col lg={12}>
                <div>
                  <Label for="tasksTitle-field" className="form-label">Sprint name</Label>
                  <Input
                    name="name"
                    id="tasksTitle-field"
                    className="form-control"
                    placeholder="Sprint name"
                    type="text"
                    validate={{
                      required: { value: true },
                    }}
                    onChange={validationEditSprint.handleChange}
                    onBlur={validationEditSprint.handleBlur}
                    value={validationEditSprint.values.name || ""}
                    invalid={
                      validationEditSprint.touched.name && validationEditSprint.errors.name ? true : false
                    }
                  />
                  {validationEditSprint.touched.name && validationEditSprint.errors.name ? (
                    <FormFeedback type="invalid">{validationEditSprint.errors.name}</FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col lg={12}>
                <div className="mb-3">
                  <Label className="form-label">Srpint Description</Label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={editorData}
                    onChange={handleEditorChange}
                    onReady={(editor) => {
                    }}
                  />
                
                </div>
              </Col>
              <Col lg={6}>
                <Label for="start-field" className="form-label">Start Date</Label>
                <Flatpickr
                  name="startAt"
                  id="start-field"
                  className="form-control"
                  placeholder="Select a date start"
                  options={{
                    altInput: true,
                    altFormat: "d M, Y",
                    dateFormat: "d M, Y",
                  }}
                  onChange={(startAt: any) => validationEditSprint.setFieldValue("startAt", moment(startAt[0]).format("DD MMMM ,YYYY"))}
                  value={validationEditSprint.values.startAt || ''}
                  
                />
                   {validationEditSprint.touched.startAt && validationEditSprint.errors.startAt ? (
                    <FormFeedback type="invalid" className='d-block'>{validationEditSprint.errors.startAt}</FormFeedback>
                  ) : null}
              </Col>
              <Col lg={6}>
                <Label for="deadline-field" className="form-label">Deadline Date</Label>
                <Flatpickr
                  name="endAt"
                  id="deadline-field"
                  className="form-control"
                  placeholder="Select a date end"
                  options={{
                    altInput: true,
                    altFormat: "d M, Y",
                    dateFormat: "d M, Y",
                  }}
                  onChange={(endAt: any) => validationEditSprint.setFieldValue("endAt", moment(endAt[0]).format("DD MMMM ,YYYY"))}
                  value={validationEditSprint.values.endAt || ''}
                />
                    {validationEditSprint.touched.endAt && validationEditSprint.errors.endAt ? (
                    <FormFeedback type="invalid" className='d-block' >{validationEditSprint.errors.endAt}</FormFeedback>
                  ) : null}
              </Col>
            </Row>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button
                type="button"
                onClick={() => {
                  toggleCreateSprint()
                }}
                className="btn-light"
              >Close</Button>
              <button type="submit" className="btn btn-success" id="add-btn">Update Sprint</button>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
        isOpen={modalStartSprint}
        toggle={toggleStartSprint}
        centered
        size="lg"
        className="border-0 col-12 __modal_task_detail"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-info-subtle" toggle={toggleStartSprint}>
          Start Sprint
        </ModalHeader>
        <Form className="tablelist-form" onSubmit={(e: any) => {
          e.preventDefault();
          validationStartSprint.handleSubmit();
          return false;
        }}>
          <ModalBody className="modal-body">
            <Row className="g-3">
              <Col lg={12}>
                <div>
                  <Label for="tasksTitle-field" className="form-label">Sprint name</Label>
                  <Input
                    name="name"
                    id="tasksTitle-field"
                    className="form-control"
                    placeholder="Sprint name"
                    type="text"
                    validate={{
                      required: { value: true },
                    }}
                    onChange={validationStartSprint.handleChange}
                    onBlur={validationStartSprint.handleBlur}
                    value={validationStartSprint.values.name || ""}
                    invalid={
                      validationStartSprint.touched.name && validationStartSprint.errors.name ? true : false
                    }
                  />
                  {validationStartSprint.touched.name && validationStartSprint.errors.name ? (
                    <FormFeedback type="invalid">{validationStartSprint.errors.name}</FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col lg={12}>
                <div className="mb-3">
                  <Label className="form-label">Srpint Description</Label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={editorData}
                    onChange={handleEditorChange}
                    onReady={(editor) => {
                    }}
                  />
                
                </div>
              </Col>
              <Col lg={6}>
                <Label for="start-field" className="form-label">Start Date</Label>
                <Flatpickr
                  name="startAt"
                  id="start-field"
                  className="form-control"
                  placeholder="Select a date start"
                  options={{
                    altInput: true,
                    altFormat: "d M, Y",
                    dateFormat: "d M, Y",
                  }}
                  onChange={(startAt: any) => validationStartSprint.setFieldValue("startAt", moment(startAt[0]).format("DD MMMM ,YYYY"))}
                  value={validationStartSprint.values.startAt || ''}
                  
                />
                   {validationStartSprint.touched.startAt && validationStartSprint.errors.startAt ? (
                    <FormFeedback type="invalid" className='d-block'>{validationStartSprint.errors.startAt}</FormFeedback>
                  ) : null}
              </Col>
              <Col lg={6}>
                <Label for="deadline-field" className="form-label">Deadline Date</Label>
                <Flatpickr
                  name="endAt"
                  id="deadline-field"
                  className="form-control"
                  placeholder="Select a date end"
                  options={{
                    altInput: true,
                    altFormat: "d M, Y",
                    dateFormat: "d M, Y",
                  }}
                  onChange={(endAt: any) => validationStartSprint.setFieldValue("endAt", moment(endAt[0]).format("DD MMMM ,YYYY"))}
                  value={validationStartSprint.values.endAt || ''}
                />
                    {validationStartSprint.touched.endAt && validationStartSprint.errors.endAt ? (
                    <FormFeedback type="invalid" className='d-block' >{validationStartSprint.errors.endAt}</FormFeedback>
                  ) : null}
              </Col>
            </Row>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button
                type="button"
                onClick={() => {
                  toggleCreateSprint()
                }}
                className="btn-light"
              >Close</Button>
              <button type="submit" className="btn btn-success" id="add-btn">Start Sprint</button>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
        isOpen={modalCompleteSprint}
        toggle={toggleCompleteSprint}
        centered
        size="lg"
        className="border-0 col-12 __modal_task_detail"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-info-subtle" toggle={toggleCompleteSprint}>
          Complete Sprint
        </ModalHeader>
        <Form className="tablelist-form" onSubmit={(e: any) => {
          e.preventDefault();
          validationCompleteSprint.handleSubmit();
          return false;
        }}>
          <ModalBody className="modal-body">
            <Row className="g-3">
              <Col >
              <div className="__name_sprint_modal">Complete {sprintEdit.name}</div>
              <div className="__sub_sprint">This sprint contains task done:</div>
              <ul className="__done_task">
                {sprintEdit.tasks && sprintEdit.tasks.map((item:any,key:number)=>{
                  return(
                    item.status===3 && <li>{item.name}</li>
                  )
                })}
              </ul>
              <div className="__sub_sprint">This sprint contains task open:</div>
              <ul className="__no_done_task">
                {sprintEdit.tasks && sprintEdit.tasks.map((item:any,key:number)=>{
                  return(
                    item.status!==3 && <li>{item.name}</li>
                  )
                })}
              </ul>
              </Col>
            <Col lg={12}>
                <Label for="priority-field" className="form-label">Move open task to</Label>
                <Input
                  name="sprintIdTo"
                  type="select"
                  className="form-select"
                  id="priority-field"
                  onChange={validationCompleteSprint.handleChange}
                  onBlur={validationCompleteSprint.handleBlur}
                  value={validationCompleteSprint.values.sprintIdTo || ""}
                  invalid={
                    validationCompleteSprint.touched.sprintIdTo && validationCompleteSprint.errors.sprintIdTo ? true : false
                  }
                >
                  {sprint.map((item:any,key:number)=>{
                    return(
                      !item.closed && item.id!==idSprintEdit && <option value={item.id}>{item.name}</option>
                    )
                  })}
                </Input>
                {validationCompleteSprint.touched.sprintIdTo && validationCompleteSprint.errors.sprintIdTo ? (
                  <FormFeedback type="invalid">{validationCompleteSprint.errors.sprintIdTo}</FormFeedback>
                ) : null}
              </Col>
            </Row>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button
                type="button"
                onClick={() => {
                  toggleCompleteSprint()
                }}
                className="btn-light"
              >Close</Button>
              <button type="submit" className="btn btn-success" id="add-btn">Complete Sprint</button>
            </div>
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  )
}

export default Backlog
