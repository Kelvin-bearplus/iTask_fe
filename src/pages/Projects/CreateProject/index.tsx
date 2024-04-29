import React,{useEffect, useState} from 'react';
import { Link,useParams } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Input, Label, Row,Form,FormFeedback ,Alert} from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';

import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import * as Yup from "yup";
import { useFormik } from "formik";
import Dropzone from "react-dropzone";
import{ formatDateCreateProject} from"../../../helpers/format";
import DatePicker from "react-flatpickr";
import { useSelector, useDispatch } from "react-redux";
import {addProjectList,resetProjectFlag,getPathImage,getProjectById} from "../../../slices/thunks"
import { toast,ToastContainer } from 'react-toastify';
import { createSelector } from 'reselect';

const CreateProject = () => {
    

    const SingleOptions = [
        { value: 'Watches', label: 'Watches' },
        { value: 'Headset', label: 'Headset' },
        { value: 'Sweatshirt', label: 'Sweatshirt' },
        { value: '20% off', label: '20% off' },
        { value: '4 star', label: '4 star' },
      ];
      const dispatch: any = useDispatch();
      const selectLayoutState = (state: any) => state.Projects;
      const projectData = createSelector(
          selectLayoutState,
          (state) => ({
            toastData: state.toastData,
              error: state.error
          })
      );
      var {
        toastData, error
    } = useSelector(projectData);
    useEffect(()=>{
        if(toastData){
            // setTimeout(()=>{
            //     window.location.reload();
            // },2000)
        }
        setTimeout(() => {
            dispatch(resetProjectFlag());
        }, 3000);
    },[toastData,error,dispatch]);

    const [selectedMulti, setselectedMulti] = useState<any>("");
    const [dataTag, setDataTag] = useState<any>("");

    const handleMulti = (selectedMulti:any) => {
    setselectedMulti(selectedMulti);
        var selectedData="";
        let lastIndex = selectedMulti.length - 1;

        // Sử dụng forEach để duyệt qua mảng và xử lý từng phần tử
        selectedMulti.forEach((item: any, index: number) => {
            // Xử lý phần tử hiện tại
            selectedData += item.value;
            
            // Kiểm tra xem phần tử hiện tại có phải là phần tử cuối cùng không
            if (index !== lastIndex) {
                // Nếu không phải là phần tử cuối cùng, thêm dấu phẩy vào sau giá trị
                selectedData += ",";
            }
        });
        setDataTag(selectedData);
    }  
    
    //Dropzone file upload
    // const [selectedFiles, setselectedFiles] = useState<any>([]);
  
    // const handleAcceptedFiles = (files:any) => {
    //   files.map((file:any) =>
    //     Object.assign(file, {
    //       preview: URL.createObjectURL(file),
    //       formattedSize: formatBytes(file.size),
    //     })
    //   );
    //   setselectedFiles(files);
    // }

        /**
     * Formats the size
     */
    const [thumbnail, setThumbnail]=useState("");
    const formatBytes = (bytes:any, decimals = 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }
    const [editorData, setEditorData] = useState("");
    const handleEditorChange = (event:any, editor:any) => {
        const data = editor.getData();
        setEditorData(data);
      };
    const [selectedStart, setSelectedStart] = useState<string>('');

    const handleStartChange = (date: Date[]) => {
        setSelectedStart(formatDateCreateProject(date[0])); // Lấy ngày đầu tiên trong mảng date
        console.log('Selected Start:', setSelectedStart);
    };
    const [selectedDeadline, setSelectedDeadline] = useState<string>('');

    const handleDeadlineChange = (date: Date[]) => {
        setSelectedDeadline(formatDateCreateProject(date[0])); // Lấy ngày đầu tiên trong mảng date
        console.log('Selected Start:', setSelectedDeadline);
    };
    const userIdString:string|null = localStorage.getItem('userId'); 
    var userId:number=0;
    if (userIdString!=null){
         userId = parseInt(userIdString);
    }
 const [showError, setShowError] = useState(false);
const getThumbnail = async (e:any) => {
        var file = e.target.files[0];

        // console.log(formData);
       
        var urlThumbnail = await getPathImage(file);
        // urlThumbnail="https://"+urlThumbnail;
        console.log(urlThumbnail)
        setThumbnail(urlThumbnail);
}

      const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            name:  '',
            privacy: "0",
            status: 1,
            priority:1
            // description: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Please Enter Your Project Title"),
            // description: Yup.string().required("Please Enter Your Description"),
        }),
            onSubmit: (values) => {

            var valueSubmit={
                name:values.name,
                description:editorData,
                thumbnail_url:thumbnail,
               privacy:parseInt(values.privacy),
               status: parseInt(values.status.toString()),
               deadline:selectedDeadline,
               started_at:selectedStart,
               created_by:userId, 
               tags:dataTag,
               priority: parseInt(values.priority.toString()),
            }
            console.log(typeof values.status.toString());
            if (selectedDeadline&&selectedStart){
                dispatch(addProjectList(valueSubmit))

            }
            }
    });

document.title="Create Project For My Team";

    return (
        <React.Fragment>
            <div className="page-content">
            {toastData && toastData ? (
                                                    <>
                                                        {toast("Add Project Success", { position: "top-right", hideProgressBar: false, className: 'bg-success text-white', progress: undefined, toastId: "" })}
                                                        <ToastContainer autoClose={2000} limit={1} />
                                                    </>
                                                ) : null}
              {error && error ? (
                                                    <>
                                                        {toast("project-list Added Failed", { position: "top-right", hideProgressBar: false, className: 'bg-danger text-white', progress: undefined, toastId: "" })}
                                                        <ToastContainer autoClose={2000} limit={1} />
                                                
                                                    </>
                                                ) : null}
                <Container fluid>
                    <BreadCrumb title="Create Project" pageTitle="Projects" />
                    <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                    }}
                    >
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>

                                    <div className="mb-3">
                                        <Label className="form-label" htmlFor="project-title-input">Project Title</Label>
                                        <Input type="text" className="form-control" id="project-title-input" name="name"
                                            placeholder="Enter project title"   onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.name || ""}
                                            invalid={
                                                validation.touched.name && validation.errors.name ? true : false
                                            } />
                                             {validation.touched.name && validation.errors.name ? (
                                                                <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
                                                            ) : null}
                                    </div>

                                    <div className="mb-3">
                                        <Label className="form-label" htmlFor="project-thumbnail-img">Thumbnail Image</Label>
                                        <Input className="form-control" name="thumnail_url" id="project-thumbnail-img" type="file" accept="image/png, image/gif, image/jpeg" onChange={getThumbnail}/>
                                        {thumbnail && <img src={thumbnail} className='mt-2 __thumb_avai'/>}
                                    </div>

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
                                    <Row>
                                    <Col lg={4}>
                                    <div>
                                        <Label htmlFor="choices-privacy-status-input" className="form-label">Privacy</Label>
                                        <select className="form-select" data-choices data-choices-search-false
                                            id="choices-privacy-status-input" name='privacy' onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.privacy || "Private"}>
                                            <option value="0">Private</option>
                                            <option value="1">Public</option>
                                        </select>
                                    </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="mb-3 mb-lg-0">
                                                <Label htmlFor="choices-status-input" className="form-label">Status</Label>
                                                <select className="form-select" data-choices data-choices-search-false
                                                    id="choices-status-input" name='status' onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.status || 1} >
                                                    <option value="1">Pending</option>
                                                    <option value="2">Inprogress</option>
                                                </select>
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div>
                                                <Label htmlFor="datepicker-deadline-input" className="form-label">Start at</Label>
                                                <DatePicker
                                                            onChange={handleStartChange}
                                                            placeholder="Enter start day"
                                                            className={`form-control `}
                                                            options={{
                                                                dateFormat: "d-m-Y", // Định dạng ngày tháng thành "dd-mm-yyyy"
                                                            }}
                                                            // defaultValue={dob}
                                                            />
                                                            {showError && !selectedStart && <div  className="invalid-feedback" style={{display:"block"}}>Please Enter Start day</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='mt-3'>
                                        <Col lg={4}>
                                            <div>
                                                <Label htmlFor="choices-text-input" className="form-label">Tag</Label>
                                                <Select
                                                    value={selectedMulti}
                                                    isMulti={true}
                                                    onChange={(selectedMulti: any) => {
                                                        handleMulti(selectedMulti);
                                                    }}
                                                    options={SingleOptions}
                                                    // onInputChange={handleInputChange}
                                                />
                                                {/* <div onClick={khanh}>check</div> */}
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div>
                                                <Label htmlFor="choices-text-input" className="form-label">Priority</Label>
                                                <select className="form-select" data-choices data-choices-search-false
                                            id="choices-privacy-status-input" name='priority' onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={validation.values.priority }>
                                            <option value="1">High</option>
                                            <option value="2">Medium</option>
                                            <option value="3">Low</option>
                                        </select>
                                                {/* <div onClick={khanh}>check</div> */}
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                        <div>
                                                <Label htmlFor="datepicker-deadline-input" className="form-label">Deadline</Label>
                                                <DatePicker
                                                            onChange={handleDeadlineChange}
                                                            placeholder="Enter deadline day"
                                                            className={`form-control `}
                                                            options={{
                                                                dateFormat: "d-m-Y", // Định dạng ngày tháng thành "dd-mm-yyyy"
                                                            }}
                                                            // defaultValue={dob}
                                                            />
                                                             {showError &&!selectedDeadline && <div  className="invalid-feedback" style={{display:"block"}}>Please Enter Start day</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card>
                                {/* <CardHeader >
                                    <h5 className="card-title mb-0">Attached files</h5>
                                </CardHeader> */}
                                {/* <CardBody>
                                    <div>
                                        <p className="text-muted">Add Attached files here.</p>

                                        <Dropzone
                                            onDrop={acceptedFiles => {
                                            handleAcceptedFiles(acceptedFiles);
                                            }}
                                        >
                                            {({ getRootProps, getInputProps }) => (
                                            <div className="dropzone dz-clickable">
                                                <div
                                                className="dz-message needsclick"
                                                {...getRootProps()}
                                                >
                                                <div className="mb-3">
                                                    <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                                </div>
                                                <h4>Drop files here or click to upload.</h4>
                                                </div>
                                            </div>
                                            )}
                                        </Dropzone>

                                        <ul className="list-unstyled mb-0" id="dropzone-preview">
                                        
                                        {selectedFiles.map((f:any, i:any) => {
                                            return (
                                                <Card
                                                className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                key={i + "-file"}
                                                >
                                                <div className="p-2">
                                                    <Row className="align-items-center">
                                                    <Col className="col-auto">
                                                        <img
                                                        data-dz-thumbnail=""
                                                        height="80"
                                                        className="avatar-sm rounded bg-light"
                                                        alt={f.name}
                                                        src={f.preview}
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Link
                                                        to="#"
                                                        className="text-muted font-weight-bold"
                                                        >
                                                        {f.name}
                                                        </Link>
                                                        <p className="mb-0">
                                                        <strong>{f.formattedSize}</strong>
                                                        </p>
                                                    </Col>
                                                    </Row>
                                                </div>
                                                </Card>
                                            );
                                            })}
                                        </ul>

                                    </div>
                                </CardBody> */}
                            </Card>

                            <div className="text-end mb-4">
                            
                                <button type="submit" className="btn btn-success w-sm" onClick={() => setShowError(!showError)}>Create</button>
                            </div>
                        </Col>

                        
                    </Row>
                    </Form>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default CreateProject;