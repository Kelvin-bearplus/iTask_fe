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
const  EricDetail: React.FC<prop> = (props) => {
  const dispatch = useDispatch<any>();
  const [eric, setEric] = useState<any>([]);
  useEffect(() => {
    getEric();
  }, []);
async function getEric(){
  const dataResponse= await dispatch(getEricAPI(props.ericId));
  if(dataResponse.payload){
    setEric(dataResponse.payload);
  }
}
console.log(eric)

  return(
    <div>
      <h1>{props.ericId}</h1>
    </div>
  )
}
export default EricDetail;