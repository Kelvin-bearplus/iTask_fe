import React, { useState, useEffect, useMemo, useCallback, ChangeEvent } from 'react';
import TableContainer from '../../../Components/Common/TableContainer';
import DeleteModal from "../../../Components/Common/DeleteModal";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { formatDateCreateProject } from "../../../helpers/format";
// Import Scroll Bar - SimpleBar
// import SimpleBar from 'simplebar-react';
import TaskDetails from "pages/Tasks/TaskDetails";

//Import Flatepicker
import Flatpickr from "react-flatpickr";
import * as moment from "moment";

//redux
import { useSelector, useDispatch } from "react-redux";
import {
  Col, Modal, ModalBody, Row, Label, Input, Button, ModalHeader, FormFeedback, Form, DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Dropdown,
} from 'reactstrap';

import {
  getTaskList,
  addNewTask,
  updateTask,
  deleteTask,
  getSimpleProject,
  getTaskListAgain
} from "../../../slices/thunks";

import {
  OrdersId,
  Project,
  CreateBy,
  DueDate,
  Status,
  Priority
} from "./TaskListCol";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { isEmpty } from "lodash";
import { Link } from 'react-router-dom';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import { createSelector } from 'reselect';


interface prop {
  project_id: number;
}

const AllTasks: React.FC<prop> = (props) => {
  const [checkedItems, setCheckedItems] = useState({
    eric: false,
    task: false,
    story: false,
    bug: false,
  });

  const [selectedValues, setSelectedValues] = useState<number[]>([]);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const valueMap: { [key: string]: number } = {
      eric: 1,
      task: 3,
      story: 2,
      bug: 4,
    };

    setCheckedItems({
      ...checkedItems,
      [name]: checked,
    });

    if (checked) {
      setSelectedValues((prevValues) => [...prevValues, valueMap[name]]);
    } else {
      setSelectedValues((prevValues) =>
        prevValues.filter((value) => value !== valueMap[name])
      );
    }
  };
  const dispatch: any = useDispatch();
  const [taskIdDetail, setTaskIdDetail] = useState(0);
  const [modalCreateTask, setModalCreateTask] = useState<boolean>(false);
  const selectLayoutState = (state: any) => state.Tasks;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (state) => ({
      taskListData: state.taskList,
      isTaskSuccess: state.isTaskSuccess,
      error: state.error,
      isTaskAdd: state.isTaskAdd,
      isTaskAddFail: state.isTaskAddFail,
      isTaskDelete: state.isTaskDelete,
      isTaskDeleteFail: state.isTaskDeleteFail,
      isTaskUpdate: state.isTaskUpdate,
      isTaskUpdateFail: state.isTaskUpdateFail,
    })
  );
  const [isLoad, setIsLoad] = useState(true);
  useEffect(() => {
    setTimeout(() => {

      setIsLoad(false);

    }, 1500)
  }, [])
  const {
    taskListData, isTaskSuccess, error
  } = useSelector(selectLayoutProperties);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [task, setTask] = useState<any>([]);
  const [taskList, setTaskList] = useState<any>([]);
  const [projectList, setProjectList] = useState<any>([]);

  // Delete Task
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const toggle = useCallback(() => {

    if (modal) {
      setModal(false);
      setTask(null);
    } else {
      setModal(true);
    }
  }, [modal]);
  const toggleCreate = useCallback(async () => {

    const projectListResponse = await dispatch(getSimpleProject());
    setProjectList(projectListResponse.payload);
    if (modalCreateTask) {
      setModalCreateTask(false);
    } else {
      setModalCreateTask(true);

    }
  }, [modalCreateTask]);
  // Delete Data
  const onClickDelete = (task: any) => {
    setTask(task);
    setDeleteModal(true);
  };
  // Delete Data
  const handleDeleteTask = async () => {
    if (task) {
      const dataResponse = await dispatch(deleteTask(task.id));
      if (dataResponse.payload) {
        refreshTaskList()
      }
      setDeleteModal(false);
    }
  };
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
      const updatedTask = {
        // id: task ? task.id : 0,
        // taskId: values.taskId,
        project_id: props.project_id,
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
  const userIdString: string | null = localStorage.getItem('userId');
  var userId: number = 0;
  if (userIdString != null) {
    userId = parseInt(userIdString);
  }
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
      type:'1',
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Issue Name"),
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
        type: parseInt(values.type),
      };

      // dispatch(addNewTask(dataTask));
      const dataResponse = await dispatch(addNewTask(dataTask));
      if (dataResponse.payload) {
        refreshTaskList()
        validationCreate.resetForm();
        setEditorData('');
      }
      toggleCreate();

    },
  });
  const [editorData, setEditorData] = useState("");
  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
  };
  const handleCustomerClick = useCallback((arg: any) => {
    const task = arg;
    setTaskIdDetail(task.id);
    setTask({
      id: task.id,
      name: task.name,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      assignees: task.assignees
    });
    setEditorData(task.description);
    toggle();
  }, [toggle]);

  // Add Data
  const handleTaskClicks = () => {
    setTask("");
    setIsEdit(false);
    toggle();
  };

  useEffect(() => {
    // setTaskList(taskList);
    refreshTaskList();
  }, [props.project_id]);
  useEffect(() => {
    refreshTaskListAgain();
  }, [taskListData,selectedValues]);
  async function refreshTaskList() {
 
    const dataResponse = await dispatch(getTaskList(props.project_id));
    if (dataResponse.payload) {
      setTaskList(dataResponse.payload);
    }
  }

  async function refreshTaskListAgain() {
    if(selectedValues.length>0){
      const dataResponse = await dispatch(getTaskListAgain({ project_id: props.project_id, type: selectedValues }));
      if (dataResponse.payload) {
        setTaskList(dataResponse.payload);
      }
    }
    else{
      const dataResponse = await dispatch(getTaskListAgain({ project_id: props.project_id }));
      if (dataResponse.payload) {
        setTaskList(dataResponse.payload);
      }
    }

  }
  // Checked All
  const checkedAll = useCallback(() => {

    const checkall: any = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".taskCheckBox");

    if (checkall.checked) {
      ele.forEach((ele: any) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele: any) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState<any>([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState<boolean>(false);

  const deleteMultiple = async () => {
    const checkall: any = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach(async (element: any) => {
      const dataResponse = await dispatch(deleteTask(element.value));
      if (dataResponse.payload) {
        refreshTaskList();
      }
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".taskCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  const columns = useMemo(
    () => [
      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps: any) => {
          return <input type="checkbox" className="taskCheckBox form-check-input" value={cellProps.row.original.id} onChange={() => deleteCheckbox()} />;
        },
        id: '#',
      },
      {
        Header: "Type",
        accessor: "type",
        filterable: false,
        Cell: (cellProps: any) => {
          return <OrdersId {...cellProps} />;
        },
      },
      {
        Header: "Project",
        accessor: "project_info.name",
        filterable: false,
        Cell: (cellProps: any) => {
          return <Project {...cellProps} />;
        },
      },
      {
        Header: "Tasks",
        accessor: "name",
        filterable: false,
        Cell: (cellProps: any) => {
          return <React.Fragment>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">{cellProps.value}</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <Link to={`/apps-tasks-details?id=${cellProps.row.original.id}`}>
                      <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link to="#" onClick={() => { const taskData = cellProps.row.original; handleCustomerClick(taskData); }}>
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link to="#" className="remove-item-btn" onClick={() => { const taskData = cellProps.row.original; onClickDelete(taskData); }}>
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </React.Fragment>;
        },
      },
      {
        Header: "Created By",
        accessor: "owner.full_name",
        filterable: false,
        Cell: (cellProps: any) => {
          return <CreateBy {...cellProps} />;
        },
      },
      // {
      //   Header: "Assigned To",
      //   accessor: "subItem",
      //   filterable: false,
      //   Cell: (cell: any) => {
      //     const assigned = cell.value.map((item: any) => item.img ? item.img : item);
      //     return (<React.Fragment>
      //       <div className="avatar-group">
      //         {assigned.map((item: any, index: any) => (
      //           <Link key={index} to="#" className="avatar-group-item">
      //             <img src={item} alt="" className="rounded-circle avatar-xxs" />
      //             {/* process.env.REACT_APP_API_URL + "/images/users/" + */}
      //           </Link>
      //         ))}

      //       </div>
      //     </React.Fragment>);
      //   },
      // },
      {
        Header: "Due Date",
        accessor: "due_date",
        filterable: true,
        Cell: (cellProps: any) => {
          return <DueDate {...cellProps} />;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        filterable: true,
        Cell: (cellProps: any) => {
          return <Status {...cellProps} />;
        },
      },
      {
        Header: "Priority",
        accessor: "priority",
        filterable: false,
        Cell: (cellProps: any) => {
          return <Priority {...cellProps} />;
        },
      },
    ],
    [handleCustomerClick, checkedAll]
  );
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  // Handler for date change
  const handleDateChange = (selectedDates: Date[]) => {
    if (selectedDates.length === 2) {
      setStartDate(selectedDates[0].toISOString()); // Convert Date to ISO string
      setEndDate(selectedDates[1].toISOString());
    }
  };
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      // var data={project_id: props.project_id};
      let data: { project_id: number; type?: any };
      if(selectedValues.length>0){
        data = { project_id: props.project_id, type: selectedValues }
      }
      else{
        data = { project_id: props.project_id }
      }
      const dataResponse = await dispatch(getTaskListAgain(data));
      if (dataResponse.payload) {
        let filtered = dataResponse.payload;
        if (startDate && endDate) {
          filtered = filtered.filter((item: any) => {
            const itemDate = new Date(item.due_date);
            return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
          });
        }

        // Filter by status
        if (status !== "") {
          filtered = filtered.filter((item: any) => item.status === status);
        }

        setFilteredData(filtered);
      }
    };

    fetchData();
  }, [dispatch, props.project_id, startDate, endDate, status, taskList]);
  // Handler for status change
  const handleStatusChange = (value: any) => {
    if (value != '') {
      value = parseInt(value)
      setStatus(value);
    }

  };
  const handleFilterClick = () => {
    setTaskList(filteredData)
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(true);
  const onClickToggle = () => setDropdownOpen(!dropdownOpen)

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTask}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />
      <div className="row">
        <Col lg={12}>
          <div className="card" id="tasksList">
            <div className="card-header border-0">
              <div className="d-flex align-items-center">
                <h5 className="card-title mb-0 flex-grow-1">All Issue</h5>
                <div className="flex-shrink-0 d-flex align-items-center">
                  <div className="d-flex flex-wrap gap-2">
                    <div  >
                      <p className="__text_fillter_task" onClick={onClickToggle}>Type</p>
                      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>

                        <DropdownMenu>
                          <DropdownItem tag="div">
                            <input
                              type="checkbox"
                              name="eric"
                              id="__eric"
                              checked={checkedItems.eric}
                              onChange={handleCheckboxChange}
                            />
                            <label htmlFor="__eric">Eric</label>
                          </DropdownItem>
                          <DropdownItem tag="div">
                            <input
                              type="checkbox"
                              name="task"
                              id="__task"
                              checked={checkedItems.task}
                              onChange={handleCheckboxChange}
                            />
                            <label htmlFor="__task">Task</label>
                          </DropdownItem>
                          <DropdownItem tag="div">
                            <input
                              type="checkbox"
                              name="story"
                              id="__story"
                              checked={checkedItems.story}
                              onChange={handleCheckboxChange}
                            />
                            <label htmlFor="__story">Story</label>
                          </DropdownItem>
                          <DropdownItem tag="div">
                            <input
                              type="checkbox"
                              name="bug"
                              id="__bug"
                              checked={checkedItems.bug}
                              onChange={handleCheckboxChange}
                            />
                            <label htmlFor="__bug">Bug</label>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown >
                    </div>

                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <button className="btn btn-primary add-btn me-1" onClick={() => { toggleCreate(); }}><i className="ri-add-line align-bottom me-1"></i> Create Issue</button>
                    {isMultiDeleteButton && <button className="btn btn-soft-danger" onClick={() => setDeleteModalMulti(true)} ><i className="ri-delete-bin-2-line"></i></button>}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body pt-0">
              {isLoad && <Loader error={error} isLoading={isLoad} />}
              {!isLoad && isTaskSuccess &&
                <TableContainer
                  columns={columns}
                  data={(taskList || [])}
                  isGlobalFilter={true}
                  isAddUserList={false}
                  customPageSize={8}
                  className="custom-header-css"
                  divClass="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap mb-0"
                  theadClass="table-light text-muted"
                  thClass="table-light text-muted"
                  handleTaskClick={handleTaskClicks}
                  isTaskListFilter={true}
                  SearchPlaceholder="Search for tasks or something..."
                  handleStatusChange={handleStatusChange}
                  handleDateChange={handleDateChange}
                  handleFilterClick={handleFilterClick}
                />

              }
              <ToastContainer closeButton={false} limit={1} />
            </div>
          </div>
        </Col>
      </div>


      <Modal
        isOpen={modal}
        toggle={toggle}
        centered
        size="lg"
        className="border-0"
        modalClassName='modal fade zoomIn col-12 __modal_task_all'
      >
        <ModalHeader className="p-3 bg-info-subtle" toggle={toggle}>
          Edit Task
        </ModalHeader>

        <ModalBody className="modal-body col-12">
          <TaskDetails idTask={taskIdDetail} />

        </ModalBody>
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
          Create Issue
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
                  <Label for="tasksTitle-field" className="form-label">Issue name</Label>
                  <Input
                    name="name"
                    id="tasksTitle-field"
                    className="form-control"
                    placeholder="Issue name"
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
                  <option value="0">Unssigned</option>
                  <option value="1">Pending</option>
                  <option value="2">In-progress</option>
                  <option value="3">Completed</option>
                </Input>
                {validationCreate.touched.status && validationCreate.errors.status ? (
                  <FormFeedback type="invalid">{validationCreate.errors.status}</FormFeedback>
                ) : null}
              </Col>

              <Col lg={6}>
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
              <Col lg={6}>
                <Label for="priority-field" className="form-label">Type</Label>
                <Input
                  name="type"
                  type="select"
                  className="form-select"
                  id="priority-field"
                  onChange={validationCreate.handleChange}
                  onBlur={validationCreate.handleBlur}
                  value={validationCreate.values.type || ""}
                  invalid={
                    validationCreate.touched.priority && validationCreate.errors.type ? true : false
                  }
                >
                  <option value="1">Epic</option>
                  <option value="2">Story</option>
                  <option value="3">Task</option>
                  <option value="4">Bug</option>
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
              <button type="submit" className="btn btn-success" id="add-btn">Create Issue</button>
            </div>
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default AllTasks;