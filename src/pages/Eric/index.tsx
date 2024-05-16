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
import EricDetail from './Eric_detail'
const Eric =()=>{
  return(
<React.Fragment>
  <EricDetail ericId={40}/>
</React.Fragment>
  )
}
export default Eric;