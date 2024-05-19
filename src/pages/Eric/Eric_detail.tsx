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
import {
  getEric as getEricAPI
} from "../../slices/thunks"
import { useDispatch } from "react-redux"
interface prop {
  ericId: number;
}
const EricDetail: React.FC<prop> = (props) => {
  const dispatch = useDispatch<any>();
  const [eric, setEric] = useState<any>({});
  useEffect(() => {
    getEric();
  }, []);
  async function getEric() {
    const dataResponse = await dispatch(getEricAPI(props.ericId));
    if (dataResponse.payload) {
      setEric(dataResponse.payload);
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
  return (
    <React.Fragment>
      {eric && (
      <Row>
        <Col lg={3} className="px-3">
               <div className="col-12">
                <select name="" id="" className="__eric_status ms-3">
                <option value="1" {...eric.status === 0 && { selected: true }}>Unassigned</option>
                                        <option value="1" {...eric.status === 1 && { selected: true }}>Pending</option>
                                        <option value="2" {...eric.status === 2 && { selected: true }}>In-progress</option>
                                        <option value="3" {...eric.status === 3 && { selected: true }}>Done</option>
                </select>
                <select name="" id="" className="__eric_status ms-3">
                                        <option value="1" {...eric.priority === 1 && { selected: true }}>Hight</option>
                                        <option value="2" {...eric.priority === 2 && { selected: true }}>Medium</option>
                                        <option value="3" {...eric.priority === 3 && { selected: true }}>Low</option>
                </select>
               </div>
               <div className="__box_inf_detail_eric">
                <p className="__eric_inf__title mb-0 px-1">Details</p>
                <div className="__eric_inf__content d-flex align-item-center justify-content-between px-1 py-2">
                  <p className="__eric_inf__content__title  mb-0 ">Reporter </p>
                  <p className="__eric_inf__content__value  mb-0">{eric.owner && eric.owner.full_name}</p>
               </div>
               </div>
        </Col>
        <Col lg={9}>
        <div className="box_detail">
          <input type="text" className='__input_custom title_eric ps-0'  defaultValue={eric.name} />
         {eric.project_info&& 
         <div className="__project_info_eric d-flex align-items-center"><p className="label_project_eric my-2 me-3">Project owner: </p>{eric.project_info.name}</div>
         }
          <div className="box_dec">
            <p className="label_eric">Description</p>
            <CKEditor
                    editor={ClassicEditor}
                    data={eric.description}
                    // onBlur={handleEditorChange}
                    onReady={(editor) => {
                    }}
                  />
          </div>
          <div className="box_dec">
            <p className="label_eric">Attachments</p>
          </div>
          <div className="box_dec d-flex flex-row justify-content-between align-items-center mb-2">
            <p className="label_eric mb-0">Child issues</p>
            <div className="__box_create d-flex justify-content-between align-items-center">
            <div className="__btn_create">+</div>

              <UncontrolledDropdown>
                <DropdownToggle tag="button" className="btn btn-icon text-muted btn-sm fs-18 dropdown" type="button">
                  <i className="ri-more-fill"></i>
                </DropdownToggle>
                <DropdownMenu>
                  <li><DropdownItem><i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Order By</DropdownItem></li>
                  <li><DropdownItem><i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete</DropdownItem></li>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
          <div className="table_task_child">
          {
            eric.child_tasks!=null && eric.child_tasks.map((item:any, key:number)=>{
             
             return(<div className="box_task_child_eric d-flex">
                 <div className=" _eric__title__name">{item.name}</div>
                {/* <div className="box_task_child_eric__title__date">{formatDateCreateProject(item.created_at)}</div> */}
              <div className="box_state">  {item.owner!=null && <img className="avt_owner" src={item.owner.profile_ava_url?item.owner.profile_ava_url:avt_default} title={item.owner.full_name?item.owner.full_name:'Member'} alt=""></img>}
                {item.owner==null && <img className="avt_owner" src={avt_default} title='Member' alt=""></img>}
                <select className={`badge border-0 text-${convertColorStatus(item.status)} `} >
                                        <option value="1" {...item.status === 0 && { selected: true }}>Unassigned</option>
                                        <option value="1" {...item.status === 1 && { selected: true }}>Pending</option>
                                        <option value="2" {...item.status === 2 && { selected: true }}>In-progress</option>
                                        <option value="3" {...item.status === 3 && { selected: true }}>Done</option>
                                    </select></div>
              </div>
              
            )
            })
          }
          </div>
        <div className="eric_comment">
          
        </div>
        </div>
        </Col>
      </Row>
      )}
    </React.Fragment>

  )
}
export default EricDetail;