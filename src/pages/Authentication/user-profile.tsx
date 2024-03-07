import React, { useState, useEffect,useRef } from "react";
import { isEmpty } from "lodash";
import DatePicker from "react-flatpickr";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";
//redux
import { useSelector, useDispatch } from "react-redux";
// actions
import { editProfile, resetProfileFlag, getUserProfileByEmail } from "../../slices/thunks";
import { createSelector } from "reselect";
import internal from "stream";

const UserProfile = () => {
  const dispatch: any = useDispatch();
  interface UserInfo {
    id?:internal,
    "profile_ava_url": string;
    "username": string;
    "full_name": string;
    "address": string;
    "phone": string;
    "dob": string;
    "bio": string;
    
  }
  const initialUserInfo: UserInfo = {
    profile_ava_url: "",
    username: "",
    full_name: "",
    address: "",
    phone: "",
    dob: "",
    bio: "",
  };
  const [userInfoApi, setUserInfoApi] = useState<UserInfo>(initialUserInfo);

  const userInfo: string = localStorage.getItem("userInfo") ?? "";
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateChange = (date: Date[]) => {
    setSelectedDate(formatDateToApi(date[0])); // Lấy ngày đầu tiên trong mảng date
    console.log('Selected date:', selectedDate);
  };
  const selectLayoutState = (state: any) => state.Profile;
  const userprofileData = createSelector(
    selectLayoutState,
    (state) => ({
      user: state.user,
      success: state.success,
      error: state.error
    })
  );
  // Inside your component
  const {
    user, success, error
  } = useSelector(userprofileData);
  const [dob,setDob] = useState<string>("");
  const fetchUserProfile = async () => {
    try {
      // console.log(userInfo.email)
      const storedUser = await dispatch(getUserProfileByEmail(userInfo));
      // return storedUser;
      if (storedUser) {
        setUserInfoApi(storedUser);
      }
      console.log(storedUser);
    } catch (error) {
      console.error("Error:", error);
    }
  };
function dateFormatFrontend(dob:string):string {
  const formattedDob = dob ? dob.substring(0, 10) : ""; 

return formattedDob.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3-$2-$1"); 
}
useEffect(()=>{
  if(userInfoApi.dob){
    console.log(dob)
    setDob(dateFormatFrontend(userInfoApi.dob));
  }
},[userInfoApi]);
  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      fetchUserProfile();

    }
  }, [userInfo]);


  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      full_name: userInfoApi.full_name,
      username: userInfoApi.username,
      phone: userInfoApi.phone,
      address: userInfoApi.address,
      bio: userInfoApi.bio,

    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your User Name"),
      phone: Yup.string()
        .matches(/^[0-9]+$/, 'Phone number must contain only digits')
        .min(10, 'Phone number must be at least 10 characters')
        .max(15, 'Phone number must not exceed 15 characters'),
      email: Yup.string().email('Invalid email'),
    }),
    onSubmit: (values) => {
      var infoSubmit:UserInfo={
        profile_ava_url:"test",
        full_name: values.full_name,
        username: values.username,
        phone: values.phone,
        address: values.address,
        bio: values.bio,
        dob: selectedDate,
      }
      if (userInfoApi.id) {
        dispatch(editProfile(infoSubmit,userInfoApi.id));
      }

    }
  });

  function formatDateToApi(date:Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    const clearFlags = () => {
      dispatch(resetProfileFlag());
    };
  
    if (error || success) {
      const timeout = setTimeout(clearFlags, 3000);
      return () => clearTimeout(timeout);
    }
  }, [dispatch, error, success]);
  document.title = "My Profile";
  return (
    <React.Fragment>
      <div className="page-content mt-lg-5">
        <Container fluid>

          <h4 className="card-title mb-4">Change Your Profile</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                           {error && error ? (
                                                    <Alert color="danger"><div>
                                                        {error} </div></Alert>
                                                ) : null}
                           {success && success ? (
                                                    <Alert color="success"><div>
                                                        {success} </div></Alert>
                                                ) : null}
                <Row className="">
                  <Col md={6} xs={12}>
                    <div className="form-group">
                      <Label className="form-label">Full Name</Label>
                      <Input
                        name="full_name"
                        // value={name}
                        className="form-control"
                        placeholder="Enter your full name"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.full_name || ""}
                        invalid={
                          validation.touched.full_name && validation.errors.full_name ? true : false
                        }
                      />
                 
                      {/* <Input name="idx" value={idx} type="hidden" /> */}
                    </div>
                  </Col>
                  <Col md={6} xs={12} className="mb-3">
                <div className="form-group">
                  <Label className="form-label">userName</Label>
                  <Input
                    name="username"
                    // value={name}
                    className="form-control"
                    placeholder="Enter your username"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.username || ""}
                    invalid={
                      validation.touched.username && validation.errors.username ? true : false
                    }
                  />
                  {validation.touched.username && validation.errors.username ? (
                    <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                  ) : null}
                  {/* <Input name="idx" value={idx} type="hidden" /> */}
                </div>
                
                </Col>
                </Row>
               <Row>
                
                <Col md={6} xs={12} className="mb-3">
                <div className="form-group">
                  <Label className="form-label">Phone</Label>
                  <Input
                    name="phone"
                    // value={name}
                    className="form-control"
                    placeholder="Enter your phone"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.phone || ""}
                    invalid={
                      validation.touched.phone && validation.errors.phone ? true : false
                    }
                  />
                  {validation.touched.phone && validation.errors.phone ? (
                    <FormFeedback type="invalid">{validation.errors.phone}</FormFeedback>
                  ) : null}
                  {/* <Input name="idx" value={idx} type="hidden" /> */}
                </div>
                </Col>
                <Col md={6} xs={12} className="mb-3">
                  <Label>Date Of Birth</Label>
                <DatePicker
                    onChange={handleDateChange}
                    placeholder="Select Date of Birth"
                    className={`form-control `}
                    options={{
                      dateFormat: "d-m-Y", // Định dạng ngày tháng thành "dd-mm-yyyy"
                    }}
                    defaultValue={dob}
                  />
                </Col>
                <Col md={6} xs={12} className="mb-3">
                <div className="form-group">
                  <Label className="form-label">Address</Label>
                  <Input
                    name="address"
                    // value={name}
                    className="form-control"
                    placeholder="Enter your address"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.address || ""}
                    invalid={
                      validation.touched.address && validation.errors.address ? true : false
                    }
                  />
           
                  {/* <Input name="idx" value={idx} type="hidden" /> */}
                </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="form-group">
                  <Label className="form-label">BIO</Label>
                  <textarea
                    name="bio"
                    // value={name}
                    className="form-control"
                    placeholder="Enter your BIO"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.bio || ""}
                
                  />
               
                  {/* <Input name="idx" value={idx} type="hidden" /> */}
                </div>
                  </Col>
               </Row>
               
                
          
                <div className="text-center mt-4">
                  <Button type="submit" color="danger">
                    Update Your Profile
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
