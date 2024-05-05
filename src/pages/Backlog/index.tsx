import React, { useState, useEffect, useCallback } from "react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import avt_default from '../../assets/images/users/anh_mac_dinh.jpg';
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
  getTasksKanban,
  addCardData as onAddCardData,
  updateCardData as onUpdateCardData,
  deleteKanban as OnDeleteKanban,
  getTaskList,
  addNewTask,
  updateTask,
  deleteTask,
  getSimpleProject,
  getMemberList, getSprint
} from "../../slices/thunks"

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
  const parseHTML = (htmlString: string) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };
  const [modalCreateTask, setModalCreateTask] = useState<boolean>(false);

  const toggleCreate = useCallback(async() => {

   if (modalCreateTask) {
     setModalCreateTask(false);
   } else {
     setModalCreateTask(true);
    
   }
 }, [modalCreateTask]);
 const isEdit=()=>{
  toggleCreate();
 }
  useEffect(() => {
    getMember();
  }, [props.project_id])
  console.log(sprint)
  const [showTaskDetail, setShowTaskDetail] = useState(false)
  return (
    <React.Fragment>
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
      <Row className="__sprint">
        {sprint.length > 0 && sprint.map((item: any, key) => {
          return (
            <Col lg={12} className="box_sprin mb-4">
              <div className="col-12 d-flex justify-content-between header_sprin align-items-center">
                <div className="col-7"><div className="name_sprin">{item.name} <span className="time_sprin">{formatDateSprintFromAPI(item.started_at)} - {formatDateSprintFromAPI(item.ended_at)} ({item.tasks!=null&&item.tasks.length>0&&item.tasks.length} {item.tasks==null&&0} issues)</span></div>
                </div>
                <div className="col-5 d-flex justify-content-end">
                  <p className="complete_sprin mb-0">
                    {item.started ? "Complete sprint" : "Start sprint"}
                  </p>
                  <UncontrolledDropdown className="float-end dropdown_sprin">
                    <DropdownToggle
                      className="arrow-none "
                      tag="a"
                      color="white"
                    >
                      <i className="ri-more-fill"></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                      <DropdownItem
                        className="edittask-details" href={`/apps-tasks-details`}
                      >
                        Edit sprint
                      </DropdownItem>
                      <DropdownItem
                        className="edittask-details"

                      >
                        Delete sprint
                      </DropdownItem>

                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>

              </div>
              <div className="dec_sprin">
                {parseHTML(item.goal)}
              </div>

              <div className="col-12">
               {item.tasks!=null&&item.tasks.length>0&& item.tasks.map((task:any,key:number)=>{
                return(
                  <div className="col-12 d-flex box_task ">
                  <div className="col-5 d-flex align-items-center">
                    <p className="task_name">{task.name}</p>
                    <div><i className="ri-pencil-fill align-bottom ms-3 text-muted edit_task" onClick={isEdit}></i></div>
                    <div><i className="ri-delete-bin-fill align-bottom ms-3 text-muted edit_task"></i></div>
                  </div>
                  <div className="col-2 d-flex justify-content-end align-items-center">
                    <p className="name_eric">Eric 1</p>
                  </div>
                  <div className="col-2 d-flex justify-content-end align-items-center">
                    <select className={`task_status ${task.status===0 &&"unassigned"} ${task.status===1 &&"pending"} ${task.status===2 &&"in_progress"} ${task.status===3 &&"done"}`}>
                      <option value="0" {...task.status===0 && {selected: true}}>Unassigned</option>
                      <option value="1" {...task.status===1 && {selected: true}}>Pending</option>
                      <option value="2" {...task.status===2 && {selected: true}}>In-progress</option>
                      <option value="3" {...task.status===3 && {selected: true}}>Done</option>
                    </select>
                  </div>
                  <div className="col-2 d-flex justify-content-end align-items-center">
                    {/* <img src={item.account_info.profile_ava_url?item.account_info.profile_ava_url:avt_default} className="avt_user" alt="" title={item.account_info.full_name?item.account_info.full_name:'New Member'} /> */}
                  <img src={avt_default} alt="" className="avt_user"/>
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
                        <DropdownItem
                          className="edittask-details" href={`/apps-tasks-details`}
                        >
                          Move on
                        </DropdownItem>


                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </div>
                )
               })}
              </div>
              <div className="col-12 __create_task">+ Create Task</div>

            </Col>
          )
          // Add your code here

        })}
      </Row>
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
        <ModalBody>
        <TaskDetails idTask={33}/>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default Backlog
