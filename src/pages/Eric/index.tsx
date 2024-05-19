import React, { useState, useEffect, useCallback } from "react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import avt_default from '../../assets/images/users/anh_mac_dinh.jpg';
import DeleteModal from "Components/Common/DeleteModal";
import { formatDateCreateProject } from "../../helpers/format";
import BreadCrumb from '../../Components/Common/BreadCrumb';

import EricDetail from './Eric_detail'
const Eric =()=>{
  return(
<React.Fragment>
<div className="mt-100"><BreadCrumb title="Project/Eric" pageTitle="Eric" /></div>
  <EricDetail ericId={40}/>
</React.Fragment>
  )
}
export default Eric;