import React, { useState, useEffect, useCallback } from "react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import avt_default from '../../../assets/images/users/anh_mac_dinh.jpg';
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


import {
  getTasksKanban,
  addCardData as onAddCardData,
  updateCardData as onUpdateCardData,
  deleteKanban as OnDeleteKanban,
  getTaskList,
  addNewTask,
  updateTask,
  deleteTask,
  getSimpleProject,getMemberList
} from "../../../slices/thunks"

//redux
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Link } from "react-router-dom"
import SimpleBar from "simplebar-react"
// import moment from "moment"
import { ToastContainer } from "react-toastify"
import Spinners from "Components/Common/Spinner"
import { AddTeamMember, headData } from "common/data"
import DeleteModal from "Components/Common/DeleteModal";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import { formatDateCreateProject } from "../../../helpers/format";


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

const TasksKanban: React.FC<prop> = (props) => {
  const handleTaskClicks = () => {
    setTask("");
    setIsEdit(false);
    toggle();
  };
  const [modal, setModal] = useState<boolean>(false)
  const toggle = () => {
    if (modal) {
      setModal(false)
      setImages([])
      setCardIdDelete(null)
    } else {
      setModal(true)
      setAssignTag([]);
    }
  }
  const [projectList, setProjectList] = useState<any>([]);

  const [modalCreateTask, setModalCreateTask] = useState<boolean>(false);
  const toggleCreate = useCallback(async () => {
    const projectListResponse = await dispatch(getSimpleProject());
    setProjectList(projectListResponse.payload);
    if (modalCreateTask) {
      setModalCreateTask(false);
    } else {
      setModalCreateTask(true);

    }
  }, [modalCreateTask]);
  const userIdString: string | null = localStorage.getItem('userId');
  var userId: number = 0;
  if (userIdString != null) {
    userId = parseInt(userIdString);
  }
  const [editorData, setEditorData] = useState("");
  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
  };

  const [task, setTask] = useState<any>([]);
  const handleCustomerClick = useCallback((arg: any) => {
    const taskData = arg;
    console.log(taskData)
    setTask({
      id: taskData.id,
      name: taskData.name,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      due_date: taskData.due_date,
      assignees: taskData.assignees
    });
    setEditorData(taskData.description);
    toggle();
  }, [toggle]);
  console.log(task)
  const [kanbanTasksCards, setKanbanTasksCards] = useState<any>()

  const validationCreate: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      taskId: '',
      name: '',
      description: '',
      dueDate: '',
      status: kanbanTasksCards ? kanbanTasksCards : '0',
      priority: '1',
      assignees: [],
      // project:'',
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
        project_id: props.project_id
        // assignees: values.assignees,
      };

      const dataResponse = await dispatch(addNewTask(dataTask));
      console.log(dataResponse)
      if (dataResponse.payload) {
        refreshTaskList()
        validationCreate.resetForm();
        setEditorData('');
      }
      toggleCreate();

    },
  });
  const dispatch = useDispatch<any>();

  const selectLayoutState = (state: any) => state.Tasks;
  const TasksKanbanProperties = createSelector(
    selectLayoutState,
    (state: any) => ({
      tasks: state.tasks,
      loading: state.loading
    }))

  const { tasks, loading } = useSelector(TasksKanbanProperties)

  const [isLoading, setLoading] = useState<boolean>(loading)
  const [cards, setCards] = useState<any>([])
  async function getDataTask(project_id: number) {
    const dataResponse = await dispatch(getTasksKanban(project_id));
    console.log(dataResponse.payload)
    if (dataResponse.payload) {
      setCards(dataResponse.payload.data)
    }
  }
  useEffect(() => {
    getDataTask(props.project_id);
  }, [props.project_id])



  console.log(cards)


  const handleDragEnd = async (result: any) => {
    console.log(result)
    if (result.destination != null) {

      if (!result.destination) return // If dropped outside a valid drop area, do nothing
      const indexDestination = result.destination.index;
      const { source, destination } = result
      // const positionTask=cards[destination]
      let positionTask: number = 0.000;
      cards.map((card: any) => {
        if (card.status == destination.droppableId) {
          const idCardTaskPrev = card.task_list[indexDestination - 1] ? card.task_list[indexDestination - 1].position : 0;
          const idCardTaskNext = card.task_list[indexDestination] ? card.task_list[indexDestination].position : 1;
          positionTask = (idCardTaskPrev + idCardTaskNext) / 2;
        }
      })
      if (source.droppableId != destination.droppableId || source.index != destination.index) {
        const data = {
          id: parseInt(result.draggableId),
          task: {
            project_id: props.project_id,
            status: parseInt(result.destination.droppableId),
            position: positionTask
          }
        }
        const dataResponse = dispatch(updateTask(data));
        console.log(positionTask);
      }
      // Reorder cards within the same card line
      if (source.droppableId == destination.droppableId) {
        const line = cards.find((line: any) => line.status == source.droppableId)
        const reorderedCards = Array.from(line.task_list)
        let [movedCard]: any = reorderedCards.splice(source.index, 1);
        movedCard = { ...movedCard, position: positionTask };
        reorderedCards.splice(destination.index, 0, movedCard)
        const updatedLines = cards.map((line: any) => {
          if (line.status == source.droppableId) {
            return { ...line, task_list: reorderedCards }
          }
          return line
        })
        // console.log("1")
        setCards(updatedLines)
      } else {
        // Move card between different card lines
        const sourceLine = cards.find((line: any) => line.status == source.droppableId)
        const destinationLine = cards.find(
          (line: any) => line.status == destination.droppableId
        )
        const sourceCards = Array.from(sourceLine.task_list)
        const destinationCards = Array.from(destinationLine.task_list)
        let [movedCard]: any = sourceCards.splice(source.index, 1)
        movedCard = { ...movedCard, position: positionTask };
        destinationCards.splice(destination.index, 0, movedCard)

        const updatedLines = cards.map((line: any) => {
          if (line.status == source.droppableId) {
            return { ...line, task_list: sourceCards }
          } else if (line.status == destination.droppableId) {
            return { ...line, task_list: destinationCards }
          }

          return line
        })

        setCards(updatedLines)
      }
    }
  }
  console.log(cards);
  // create Modal
  const [modall, setModall] = useState<boolean>(false)

  const handleOpen = () => {
    setModall(!modall);
    setCardHead(null)
  }

  const [cardhead, setCardHead] = useState<any>()


  const formik: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      status: (cardhead && cardhead.id) || "",
      status_name: (cardhead && cardhead.status_name) || "",
    } as KanbanColumn,
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Your Card Title"),
    }),
    onSubmit: (values: KanbanColumn) => {

      const newCardheaderData: KanbanColumn = {
        status: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
        status_name: values["status_name"],
        task_list: []
      }

      dispatch(onAddCardData(newCardheaderData))
      formik.resetForm()

      handleOpen()
    },
  })


  // badges
  const [tag, setTag] = useState<any>();
  const [assignTag, setAssignTag] = useState<any>([]);

  const handlestag = (tags: any) => {
    setTag(tags);
    const assigned = tags.map((item: any) => item.value);
    setAssignTag(assigned);
  };

  const tags = [
    { label: "Admin", value: "Admin" },
    { label: "Layout", value: "Layout" },
    { label: "Dashboard", value: "Dashboard" },
    { label: "Design", value: "Design" },
    { label: "Website", value: "Website" },
    { label: "Marketing", value: "Marketing" },
    { label: "Business", value: "Business" },
    { label: "Logo", value: "Logo" },
    { label: "UI/UX", value: "UI/UX" },
    { label: "Analysis", value: "Analysis" },
    { label: "Product", value: "Product" },
    { label: "Ecommerce", value: "Ecommerce" },
    { label: "Graphic", value: "Graphic" },
  ];

  // Add Modal

  async function refreshTaskList() {
    const dataResponse = await dispatch(getTasksKanban(props.project_id));
    console.log(dataResponse)
    if (dataResponse.payload.data) {
      setCards(dataResponse.payload.data)

    }
  }

  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [cardIdDelete, setCardIdDelete] = useState<any>()
  // validation
  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      taskId: (task && task.id) || '',
      name: (task && task.name) || '',
      description: (task && task.description) || '',
      dueDate: (task && task.due_date ? moment(task.due_date).format("DD MMM, YYYY") : '') || '',
      status: (task && task.status) || '',
      priority: (task && task.priority) || '',
      assignees: (task && task.assignees) || [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Task Name"),

    }),
    onSubmit: async (values) => {
      var dataDate = formatDateCreateProject(new Date(values.dueDate))
      console.log(values.dueDate)
      const updatedTask = {
        // id: task ? task.id : 0,
        // taskId: values.taskId,
        // project: values.project,
        name: values.name,
        description: editorData,
        due_date: dataDate,
        status: parseInt(values.status),
        priority: parseInt(values.priority),
        // assignees: values.assignees,
      };
      // update customer
      var data = {
        id: task.id,
        task: updatedTask
      }

      const dataResponse = await dispatch(updateTask(data));
      if (dataResponse.payload) {
        refreshTaskList()
      }
      // validation.resetForm();
      toggle();
      validation.resetForm();

    },
  });
  const handleAddNewCard = (line: any) => {
    setIsEdit(false)
    toggleCreate()
    setKanbanTasksCards(line.status)

  };
  // console.log(kanbanTasksCards)
  const [images, setImages] = useState<any>([])

  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const onClickDelete = (card: any) => {
    setCardIdDelete(card);
    setDeleteModal(true);
  };

  const handleDeleteCard = async () => {
    if (cardIdDelete) {
      console.log("card ===", cardIdDelete);

      const dataResponse = await dispatch(deleteTask(cardIdDelete));
      console.log(dataResponse)
      if (dataResponse.payload) {
        refreshTaskList();
      }
      setDeleteModal(false);
    }
  };


  const handleImage = (image: any) => {
    const updatedImages = images.includes(image)
      ? images.filter((item: any) => item !== image)
      : [...images, image];

    setImages(updatedImages);
    console.log("updatedImages", updatedImages);

    validation.setFieldValue('userImages', updatedImages)

  }
const [memberList, setMemberList]=useState([]);
async function getMember(){
  const dataResponse = await dispatch(getMemberList(props.project_id));
 if(dataResponse.payload.data){
  setMemberList(dataResponse.payload.data);
 }
}
useEffect(() => {
  getMember();
},[props.project_id])
console.log(memberList)
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteCard()}
        onCloseClick={() => setDeleteModal(false)}
      />

      <Card>
        <CardBody>
          <Row className="g-2">
            <div className="col-lg-auto">
              <div className="hstack gap-2">
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createboardModal" onClick={handleOpen}>
                  <i className="ri-add-line align-bottom me-1"></i> Create Board</button>
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
                {memberList.length>0 && memberList.map((item: any, key: any) => (<Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" key={key} data-bs-trigger="hover" data-bs-placement="top" aria-label={item.name} data-bs-original-title={item.name}>
                  <img src={item.account_info.profile_ava_url?item.account_info.profile_ava_url:avt_default} alt="" title={item.account_info.full_name?item.account_info.full_name:""} className="rounded-circle avatar-xs" />
                </Link>))}
                <Link to="#addmemberModal" data-bs-toggle="modal" className="avatar-group-item" >
                  <div className="avatar-xs">
                    <div className="avatar-title rounded-circle">
                      +
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </Row>
        </CardBody>
      </Card>

      <div className="tasks-board mb-3 d-flex" id="kanbanboard">
        {
          isLoading ? <Spinners setLoading={setLoading} /> :
            <DragDropContext onDragEnd={handleDragEnd}>
              {cards.length > 0 && (cards || []).map((line: KanbanColumn) => {
                return (
                  // header line
                  <div className="tasks-list" key={parseInt(line.status)}>
                    <div className="d-flex mb-3">
                      <div className="flex-grow-1">
                        <h6 className="fs-14 text-uppercase fw-semibold mb-0">{line.status_name} </h6>
                      </div>
                      {/* <div className="flex-shrink-0">
                        <UncontrolledDropdown className="card-header-dropdown float-end">
                          <DropdownToggle
                            className="text-reset dropdown-btn"
                            tag="a"
                            color="white"
                          >
                            <span className="fw-medium text-muted fs-12">Priority<i className="mdi mdi-chevron-down ms-1"></i></span>
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem>Priority</DropdownItem>
                            <DropdownItem>Date Added</DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div> */}
                    </div>
                    {/* data */}
                    <SimpleBar className="tasks-wrapper px-3 mx-n3">
                      <div id="unassigned-task" className={line.task_list === "object" ? "tasks" : "tasks noTask"}>
                        <Droppable droppableId={line.status.toString()}>
                          {(provided: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {line.task_list.length > 0 && line.task_list.map((task: any, index: any) => {
                                return (
                                  <Draggable
                                    key={task.id}
                                    draggableId={task.id.toString()}
                                    index={index}
                                  >
                                    {(provided: any) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        // className="card task-list"
                                        className="pb-1 task-list"
                                        id={line.status_name + "-task"}
                                      >
                                        <div className="card task-box" id="uptask-1">
                                          <CardBody>
                                            {/* <Link to="#" className="text-muted fw-medium fs-14 flex-grow-1 ">{task.id}</Link> */}
                                            <UncontrolledDropdown className="float-end">
                                              <DropdownToggle
                                                className="arrow-none"
                                                tag="a"
                                                color="white"
                                              >
                                                <i className="ri-more-fill"></i>
                                              </DropdownToggle>
                                              <DropdownMenu className="dropdown-menu-end">
                                                <DropdownItem
                                                  className="edittask-details" href={`/apps-tasks-details?id=${task.id}`}
                                                >
                                                  View
                                                </DropdownItem>
                                                <DropdownItem
                                                  className="edittask-details"
                                                  onClick={() =>
                                                    handleCustomerClick(task)
                                                  }
                                                >
                                                  Edit
                                                </DropdownItem>
                                                <DropdownItem
                                                  className="deletetask"
                                                  onClick={() =>
                                                    onClickDelete(task.id)
                                                  }
                                                >
                                                  Delete
                                                </DropdownItem>
                                              </DropdownMenu>
                                            </UncontrolledDropdown>
                                            <div className="mb-3">

                                              <h6 className="fs-15 mb-0 flex-grow-1 text-truncate task-title">
                                                <Link
                                                  to="#"
                                                  className="d-block"
                                                  id="task-name"
                                                >
                                                  {task.name}
                                                </Link>
                                              </h6>
                                            </div>
                                            <div className="text-muted" dangerouslySetInnerHTML={{ __html: task.description }}>
                                            </div>
                                            <div className="d-flex justify-content-end">
                                            {task.assignees.length > 0 && task.assignees.map((item: any, key: any) => {
                                              return (<img className="tasks-img rounded mb-2" src={item.user_info.profile_ava_url?item.user_info.profile_ava_url:avt_default} title={item.user_info.full_name?item.user_info.full_name:"New user"} />)
                                            })
                                            }
                                            </div>
                                            {
                                              <div className="d-flex align-items-center">
                                                {/* <div className="flex-grow-1">
                                                  {card.badge1.map((badgeText: any, index: any) => (
                                                    <span key={index} className="badge bg-primary-subtle text-primary me-1">
                                                      {badgeText}
                                                    </span>
                                                  ))}
                                                </div> */}
                                                {/* <div className="flex-shrink-0">
                                                  <div className="avatar-group">
                                                    {card.userImages.map((picturedata: any, idx: any) => (
                                                      <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Alexis" key={idx}>
                                                        <img src={picturedata.img} alt="" className="rounded-circle avatar-xxs" />
                                                      </Link>
                                                    ))}
                                                  </div>
                                                </div> */}
                                              </div>
                                            }

                                          </CardBody>
                                          {/* bottom */}
                                          <div className="card-footer border-top-dashed">
                                            <div className="d-flex">
                                              <div className="flex-grow-1">
                                                <span className="text-muted"><i className="ri-time-line align-bottom"></i>{moment(task.due_date).format("DD MMM, YYYY")}</span>
                                              </div>

                                            </div>
                                          </div>



                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                )
                              })}
                              {line.task_list.length === 0 &&
                                <Draggable
                                  key={-1}
                                  draggableId={"-1"}
                                  index={-1}
                                >

                                  {
                                    (provided: any) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        // className="card task-list"
                                        className="pb-1 task-list"
                                        id={line.status_name + "-task"}
                                      >
                                      </div>
                                    )}
                                </Draggable>

                              }
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </SimpleBar>
                    <div className="my-2 mt-0">
                      <button className="btn btn-soft-info w-100" data-bs-toggle="modal" data-bs-target="#creatertaskModal" onClick={() => handleAddNewCard(line)}>Add More</button>
                    </div>
                  </div>
                )
              })}
            </DragDropContext>
        }
      </div>


      {/* Create Modal */}
      <Modal isOpen={modall} toggle={handleOpen} centered={true}>
        <div className="modal-content border-0" >
          <ModalHeader className=" p-3 bg-info-subtle" toggle={handleOpen}>Add Board
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={(event: any) => {
              event.preventDefault();
              formik.handleSubmit();
              return false
            }}>
              <Row>
                <Col lg={12}>
                  <Label htmlFor="boardName" className="form-label">Board Name</Label>
                  <Input type="text" id="boardName" placeholder="Enter board name"
                    // validaue={{ required: { value: true } }}
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    invalid={
                      formik.touched.name && formik.errors.name
                        ? true
                        : false
                    }
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <FormFeedback type="invalid">
                      {formik.errors.name}
                    </FormFeedback>
                  ) : null}
                </Col>
                <div className="mt-4">
                  <div className="hstack gap-2 justify-content-end">
                    <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-success" id="addNewBoard">Add Board</button>
                  </div>
                </div>
              </Row>
            </Form>
          </ModalBody>
        </div>

      </Modal>
      <Modal
        isOpen={modalCreateTask}
        toggle={toggleCreate}
        centered
        size="lg"
        className="border-0"
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

              <Col lg={12}>
                {/* <Label className="form-label">Assigned To</Label> */}
                {/* <SimpleBar style={{ maxHeight: "95px" }}>
                  <ul className="list-unstyled vstack gap-2 mb-0">
                    {Assigned.map((item, key) => (<li key={key}>
                      <div className="form-check d-flex align-items-center">
                        <Input name="subItem" className="form-check-input me-3" type="checkbox"
                          onChange={validationCreate.handleChange}
                          onBlur={validationCreate.handleBlur}
                          value={item.img}
                          invalid={validationCreate.touched.subItem && validationCreate.errors.subItem ? true : false}
                          id={item.imgId} />

                        <Label className="form-check-label d-flex align-items-center" htmlFor={item.imgId}>
                          <span className="flex-shrink-0">
                            <img src={item.img} alt="" className="avatar-xxs rounded-circle" />
                          </span>
                          <span className="flex-grow-1 ms-2">
                            {item.name}
                          </span>
                        </Label>
                        {validationCreate.touched.subItem && validationCreate.errors.subItem ? (
                          <FormFeedback type="invalid">{validationCreate.errors.subItem}</FormFeedback>
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
                  <option value="0">UNASSIGNED</option>
                  <option value="1">Pending</option>
                  <option value="2">In-progress</option>
                  <option value="3">Completed</option>
                </Input>
                {validationCreate.touched.status && validationCreate.errors.status ? (
                  <FormFeedback type="invalid">{validationCreate.errors.status}</FormFeedback>
                ) : null}
              </Col>
              {/* <Col lg={6}>
                <Label for="priority-field" className="form-label">Project</Label>
                <Input
                  name="project"
                  type="select"
                  className="form-select"
                  id="priority-field"
                  onChange={validationCreate.handleChange}
                  onBlur={validationCreate.handleBlur}
                  value={validationCreate.values.project || ""}
                  invalid={
                    validationCreate.touched.project && validationCreate.errors.project ? true : false
                  }
                >
                    {projectList.length>0&&projectList.map((item:any, key:any) =>(
                  <option key={key} value={item.id}>{item.name}</option>
                  ))}
                </Input>
                {validationCreate.touched.priority && validationCreate.errors.priority ? (
                  <FormFeedback type="invalid">{validationCreate.errors.priority}</FormFeedback>
                ) : null}
              </Col> */}
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
        isOpen={modal}
        toggle={toggle}
        centered
        size="lg"
        className="border-0"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-info-subtle" toggle={toggle}>
          Edit Task
        </ModalHeader>
        <Form className="tablelist-form" onSubmit={(e: any) => {
          e.preventDefault();
          validation.handleSubmit();
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
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.name || ""}
                    invalid={
                      validation.touched.name && validation.errors.name ? true : false
                    }
                  />
                  {validation.touched.name && validation.errors.name ? (
                    <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
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

              <Col lg={12}>
                {/* <Label className="form-label">Assigned To</Label> */}
                {/* <SimpleBar style={{ maxHeight: "95px" }}>
                  <ul className="list-unstyled vstack gap-2 mb-0">
                    {Assigned.map((item, key) => (<li key={key}>
                      <div className="form-check d-flex align-items-center">
                        <Input name="subItem" className="form-check-input me-3" type="checkbox"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={item.img}
                          invalid={validation.touched.subItem && validation.errors.subItem ? true : false}
                          id={item.imgId} />

                        <Label className="form-check-label d-flex align-items-center" htmlFor={item.imgId}>
                          <span className="flex-shrink-0">
                            <img src={item.img} alt="" className="avatar-xxs rounded-circle" />
                          </span>
                          <span className="flex-grow-1 ms-2">
                            {item.name}
                          </span>
                        </Label>
                        {validation.touched.subItem && validation.errors.subItem ? (
                          <FormFeedback type="invalid">{validation.errors.subItem}</FormFeedback>
                        ) : null}
                      </div>
                    </li>))}
                  </ul>
                </SimpleBar> */}
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
                  onChange={(dueDate: any) => validation.setFieldValue("dueDate", moment(dueDate[0]).format("DD MMMM ,YYYY"))}
                  value={validation.values.dueDate || ''}
                />
                {validation.errors.dueDate && validation.touched.dueDate ? (
                  <FormFeedback type="invalid" className='d-block'>{validation.errors.dueDate}</FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="ticket-status" className="form-label">Status</Label>
                <Input
                  name="status"
                  type="select"
                  className="form-select"
                  id="ticket-field"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.status || ""}
                  invalid={
                    validation.touched.status && validation.errors.status ? true : false
                  }
                >
                  <option value="1">Pending</option>
                  <option value="2">In-progress</option>
                  <option value="3">Completed</option>
                </Input>
                {validation.touched.status && validation.errors.status ? (
                  <FormFeedback type="invalid">{validation.errors.status}</FormFeedback>
                ) : null}
              </Col>
              <Col lg={12}>
                <Label for="priority-field" className="form-label">Priority</Label>
                <Input
                  name="priority"
                  type="select"
                  className="form-select"
                  id="priority-field"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.priority || ""}
                  invalid={
                    validation.touched.priority && validation.errors.priority ? true : false
                  }
                >
                  <option value="1">High</option>
                  <option value="2">Medium</option>
                  <option value="3">Low</option>
                </Input>
                {validation.touched.priority && validation.errors.priority ? (
                  <FormFeedback type="invalid">{validation.errors.priority}</FormFeedback>
                ) : null}
              </Col>
            </Row>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button
                type="button"
                onClick={() => {
                  setModal(false);
                }}
                className="btn-light"
              >Close</Button>
              <button type="submit" className="btn btn-success" id="add-btn">Update Task</button>
            </div>
          </div>
        </Form>
      </Modal>
      <ToastContainer />

    </React.Fragment>
  )
}

export default TasksKanban
