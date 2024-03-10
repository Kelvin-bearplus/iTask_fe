import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, Alert, Button, FormFeedback } from 'reactstrap';
import classnames from "classnames";
// import Flatpickr from "react-flatpickr";
import * as Yup from "yup";
import { useFormik } from "formik";
//import images
import progileBg from '../../assets/images/profile-bg.jpg';
import avatar1 from '../../assets/images/users/avatar-1.jpg';
import { editProfile, resetProfileFlag, getUserProfileByEmail } from "../../slices/thunks";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import internal from "stream";
import DatePicker from "react-flatpickr";
const Settings = () => {
    const [activeTab, setActiveTab] = useState("1");

    const tabChange = (tab: any) => {
        if (activeTab !== tab) setActiveTab(tab);
    };
    const dispatch: any = useDispatch();
    interface UserInfo {
        id?: internal,
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
    const [dob, setDob] = useState<string>("");
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
    function dateFormatFrontend(dob: string): string {
        const formattedDob = dob ? dob.substring(0, 10) : "";

        return formattedDob.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3-$2-$1");
    }
    useEffect(() => {
        if (userInfoApi.dob) {
            console.log(dob)
            setDob(dateFormatFrontend(userInfoApi.dob));
        }
    }, [userInfoApi]);
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
            var infoSubmit: UserInfo = {
                profile_ava_url: "test",
                full_name: values.full_name,
                username: values.username,
                phone: values.phone,
                address: values.address,
                bio: values.bio,
                dob: selectedDate,
            }
            if (userInfoApi.id) {
                dispatch(editProfile(infoSubmit, userInfoApi.id));
            }

        }
    });

    function formatDateToApi(date: Date): string {
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
    document.title = "Profile Settings | Velzon - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <div className="position-relative mx-n4 mt-n4">
                        <div className="profile-wid-bg profile-setting-img">
                            <img src={progileBg} className="profile-wid-img" alt="" />
                            <div className="overlay-content">
                                <div className="text-end p-3">
                                    <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                                        <Input id="profile-foreground-img-file-input" type="file"
                                            className="profile-foreground-img-file-input" />
                                        <Label htmlFor="profile-foreground-img-file-input"
                                            className="profile-photo-edit btn btn-light">
                                            <i className="ri-image-edit-line align-bottom me-1"></i> Change Cover
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Row>
                        <Col xxl={3}>
                            <Card className="mt-n5">
                                <CardBody className="p-4">
                                    <div className="text-center">
                                        <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                            <img src={avatar1}
                                                className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                alt="user-profile" />
                                            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                <Input id="profile-img-file-input" type="file"
                                                    className="profile-img-file-input" />
                                                <Label htmlFor="profile-img-file-input"
                                                    className="profile-photo-edit avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-light text-body">
                                                        <i className="ri-camera-fill"></i>
                                                    </span>
                                                </Label>
                                            </div>
                                        </div>
                                        <h5 className="fs-16 mb-1">Anna Adame</h5>
                                        <p className="text-muted mb-0">Lead Designer / Developer</p>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <div className="d-flex align-items-center mb-5">
                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-0">Complete Your Profile</h5>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Link to="#" className="badge bg-light text-primary fs-12"><i
                                                className="ri-edit-box-line align-bottom me-1"></i> Edit</Link>
                                        </div>
                                    </div>
                                    <div className="progress animated-progress custom-progress progress-label">
                                        <div className="progress-bar bg-danger" role="progressbar" style={{ "width": "30%" }}>
                                            <div className="label">30%</div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-0">Portfolio</h5>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Link to="#" className="badge bg-light text-primary fs-12"><i
                                                className="ri-add-fill align-bottom me-1"></i> Add</Link>
                                        </div>
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-dark text-light">
                                                <i className="ri-github-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="email" className="form-control" id="gitUsername" placeholder="Username"
                                            defaultValue="@daveadame" />
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-primary">
                                                <i className="ri-global-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="text" className="form-control" id="websiteInput"
                                            placeholder="www.example.com" defaultValue="www.velzon.com" />
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-success">
                                                <i className="ri-dribbble-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="text" className="form-control" id="dribbleName" placeholder="Username"
                                            defaultValue="@dave_adame" />
                                    </div>
                                    <div className="d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-danger">
                                                <i className="ri-pinterest-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="text" className="form-control" id="pinterestName"
                                            placeholder="Username" defaultValue="Advance Dave" />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xxl={9}>
                            <Card className="mt-xxl-n5">
                                <CardHeader>
                                    <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                        role="tablist">
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === "1" })}
                                                onClick={() => {
                                                    tabChange("1");
                                                }}>
                                                <i className="fas fa-home"></i>
                                                Personal Details
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "2" })}
                                                onClick={() => {
                                                    tabChange("2");
                                                }}
                                                type="button">
                                                <i className="far fa-user"></i>
                                                Change Password
                                            </NavLink>
                                        </NavItem>
                                        <NavItem >
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "3" })}
                                                onClick={() => {
                                                    tabChange("3");
                                                }}
                                                type="button">
                                                <i className="far fa-envelope"></i>
                                                Experience
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "4" })}
                                                onClick={() => {
                                                    tabChange("4");
                                                }}
                                                type="button">
                                                <i className="far fa-envelope"></i>
                                                Privacy Policy
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>
                                <CardBody className="p-4">
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
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
                                        </TabPane>

                                        <TabPane tabId="2">
                                            <Form>
                                                <Row className="g-2">
                                                    <Col lg={4}>
                                                        <div>
                                                            <Label htmlFor="oldpasswordInput" className="form-label">Old
                                                                Password*</Label>
                                                            <Input type="password" className="form-control"
                                                                id="oldpasswordInput"
                                                                placeholder="Enter current password" />
                                                        </div>
                                                    </Col>

                                                    <Col lg={4}>
                                                        <div>
                                                            <Label htmlFor="newpasswordInput" className="form-label">New
                                                                Password*</Label>
                                                            <Input type="password" className="form-control"
                                                                id="newpasswordInput" placeholder="Enter new password" />
                                                        </div>
                                                    </Col>

                                                    <Col lg={4}>
                                                        <div>
                                                            <Label htmlFor="confirmpasswordInput" className="form-label">Confirm
                                                                Password*</Label>
                                                            <Input type="password" className="form-control"
                                                                id="confirmpasswordInput"
                                                                placeholder="Confirm password" />
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Link to="#"
                                                                className="link-primary text-decoration-underline">Forgot
                                                                Password ?</Link>
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <div className="text-end">
                                                            <button type="button" className="btn btn-success">Change
                                                                Password</button>
                                                        </div>
                                                    </Col>

                                                </Row>

                                            </Form>
                                            <div className="mt-4 mb-3 border-bottom pb-2">
                                                <div className="float-end">
                                                    <Link to="#" className="link-primary">All Logout</Link>
                                                </div>
                                                <h5 className="card-title">Login History</h5>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-smartphone-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>iPhone 12 Pro</h6>
                                                    <p className="text-muted mb-0">Los Angeles, United States - March 16 at
                                                        2:47PM</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Logout</Link>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-tablet-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>Apple iPad Pro</h6>
                                                    <p className="text-muted mb-0">Washington, United States - November 06
                                                        at 10:43AM</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Logout</Link>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-smartphone-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>Galaxy S21 Ultra 5G</h6>
                                                    <p className="text-muted mb-0">Conneticut, United States - June 12 at
                                                        3:24PM</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Logout</Link>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-macbook-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>Dell Inspiron 14</h6>
                                                    <p className="text-muted mb-0">Phoenix, United States - July 26 at
                                                        8:10AM</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Logout</Link>
                                                </div>
                                            </div>
                                        </TabPane>

                                        <TabPane tabId="3">
                                            <form>
                                                <div id="newlink">
                                                    <div id="1">
                                                        <Row>
                                                            <Col lg={12}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor="jobTitle" className="form-label">Job
                                                                        Title</Label>
                                                                    <Input type="text" className="form-control"
                                                                        id="jobTitle" placeholder="Job title"
                                                                        defaultValue="Lead Designer / Developer" />
                                                                </div>
                                                            </Col>

                                                            <Col lg={6}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor="companyName" className="form-label">Company
                                                                        Name</Label>
                                                                    <Input type="text" className="form-control"
                                                                        id="companyName" placeholder="Company name"
                                                                        defaultValue="Themesbrand" />
                                                                </div>
                                                            </Col>

                                                            <Col lg={6}>
                                                                <div className="mb-3">
                                                                    <label htmlFor="experienceYear"
                                                                        className="form-label">Experience Years</label>
                                                                    <Row>
                                                                        <Col lg={5}>
                                                                            <select className="form-control" data-choices
                                                                                data-choices-search-false
                                                                                name="experienceYear"
                                                                                id="experienceYear">
                                                                                <option defaultValue="">Select years</option>
                                                                                <option value="Choice 1">2001</option>
                                                                                <option value="Choice 2">2002</option>
                                                                                <option value="Choice 3">2003</option>
                                                                                <option value="Choice 4">2004</option>
                                                                                <option value="Choice 5">2005</option>
                                                                                <option value="Choice 6">2006</option>
                                                                                <option value="Choice 7">2007</option>
                                                                                <option value="Choice 8">2008</option>
                                                                                <option value="Choice 9">2009</option>
                                                                                <option value="Choice 10">2010</option>
                                                                                <option value="Choice 11">2011</option>
                                                                                <option value="Choice 12">2012</option>
                                                                                <option value="Choice 13">2013</option>
                                                                                <option value="Choice 14">2014</option>
                                                                                <option value="Choice 15">2015</option>
                                                                                <option value="Choice 16">2016</option>
                                                                                <option value="Choice 17" >2017</option>
                                                                                <option value="Choice 18">2018</option>
                                                                                <option value="Choice 19">2019</option>
                                                                                <option value="Choice 20">2020</option>
                                                                                <option value="Choice 21">2021</option>
                                                                                <option value="Choice 22">2022</option>
                                                                            </select>
                                                                        </Col>

                                                                        <div className="col-auto align-self-center">
                                                                            to
                                                                        </div>

                                                                        <Col lg={5}>
                                                                            <select className="form-control" data-choices
                                                                                data-choices-search-false
                                                                                name="choices-single-default2">
                                                                                <option defaultValue="">Select years</option>
                                                                                <option value="Choice 1">2001</option>
                                                                                <option value="Choice 2">2002</option>
                                                                                <option value="Choice 3">2003</option>
                                                                                <option value="Choice 4">2004</option>
                                                                                <option value="Choice 5">2005</option>
                                                                                <option value="Choice 6">2006</option>
                                                                                <option value="Choice 7">2007</option>
                                                                                <option value="Choice 8">2008</option>
                                                                                <option value="Choice 9">2009</option>
                                                                                <option value="Choice 10">2010</option>
                                                                                <option value="Choice 11">2011</option>
                                                                                <option value="Choice 12">2012</option>
                                                                                <option value="Choice 13">2013</option>
                                                                                <option value="Choice 14">2014</option>
                                                                                <option value="Choice 15">2015</option>
                                                                                <option value="Choice 16">2016</option>
                                                                                <option value="Choice 17">2017</option>
                                                                                <option value="Choice 18">2018</option>
                                                                                <option value="Choice 19">2019</option>
                                                                                <option value="Choice 20">2020</option>
                                                                                <option value="Choice 21">2021</option>
                                                                                <option value="Choice 22">2022</option>
                                                                            </select>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </Col>

                                                            <Col lg={12}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor="jobDescription" className="form-label">Job
                                                                        Description</Label>
                                                                    <Input type='textarea'
                                                                        className="form-control" id="jobDescription"
                                                                        rows="3"
                                                                        placeholder='Enter description'
                                                                        defaultValue="You always want to make sure that your fonts work well together and try to limit the number of fonts you use to three or less. Experiment and play around with the fonts that you already have in the software you're working with reputable font websites."
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <div className="hstack gap-2 justify-content-end">
                                                                <Link className="btn btn-success"
                                                                    to="#">Delete</Link>
                                                            </div>
                                                        </Row>
                                                    </div>
                                                </div>
                                                <div id="newForm" style={{ "display": "none" }}>
                                                </div>

                                                <Col lg={12}>
                                                    <div className="hstack gap-2">
                                                        <button type="submit" className="btn btn-success">Update</button>
                                                        <Link to="#" className="btn btn-primary">Add
                                                            New</Link>
                                                    </div>
                                                </Col>
                                            </form>
                                        </TabPane>

                                        <TabPane tabId="4">
                                            <div className="mb-4 pb-2">
                                                <h5 className="card-title text-decoration-underline mb-3">Security:</h5>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">Two-factor Authentication</h6>
                                                        <p className="text-muted">Two-factor authentication is an enhanced
                                                            security meansur. Once enabled, you'll be required to give
                                                            two types of identification when you log into Google
                                                            Authentication and SMS are Supported.</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        <Link to="#"
                                                            className="btn btn-sm btn-primary">Enable Two-facor
                                                            Authentication</Link>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0 mt-2">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">Secondary Verification</h6>
                                                        <p className="text-muted">The first factor is a password and the
                                                            second commonly includes a text with a code sent to your
                                                            smartphone, or biometrics using your fingerprint, face, or
                                                            retina.</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        <Link to="#" className="btn btn-sm btn-primary">Set
                                                            up secondary method</Link>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0 mt-2">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">Backup Codes</h6>
                                                        <p className="text-muted mb-sm-0">A backup code is automatically
                                                            generated for you when you turn on two-factor authentication
                                                            through your iOS or Android Twitter app. You can also
                                                            generate a backup code on twitter.com.</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        <Link to="#"
                                                            className="btn btn-sm btn-primary">Generate backup codes</Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <h5 className="card-title text-decoration-underline mb-3">Application Notifications:</h5>
                                                <ul className="list-unstyled mb-0">
                                                    <li className="d-flex">
                                                        <div className="flex-grow-1">
                                                            <label htmlFor="directMessage"
                                                                className="form-check-label fs-14">Direct messages</label>
                                                            <p className="text-muted">Messages from people you follow</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="directMessage" defaultChecked />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="desktopNotification">
                                                                Show desktop notifications
                                                            </Label>
                                                            <p className="text-muted">Choose the option you want as your
                                                                default setting. Block a site: Next to "Not allowed to
                                                                send notifications," click Add.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="desktopNotification" defaultChecked />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="emailNotification">
                                                                Show email notifications
                                                            </Label>
                                                            <p className="text-muted"> Under Settings, choose Notifications.
                                                                Under Select an account, choose the account to enable
                                                                notifications for. </p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="emailNotification" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="chatNotification">
                                                                Show chat notifications
                                                            </Label>
                                                            <p className="text-muted">To prevent duplicate mobile
                                                                notifications from the Gmail and Chat apps, in settings,
                                                                turn off Chat notifications.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="chatNotification" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="purchaesNotification">
                                                                Show purchase notifications
                                                            </Label>
                                                            <p className="text-muted">Get real-time purchase alerts to
                                                                protect yourself from fraudulent charges.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="purchaesNotification" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="card-title text-decoration-underline mb-3">Delete This
                                                    Account:</h5>
                                                <p className="text-muted">Go to the Data & Privacy section of your profile
                                                    Account. Scroll to "Your data & privacy options." Delete your
                                                    Profile Account. Follow the instructions to delete your account :
                                                </p>
                                                <div>
                                                    <Input type="password" className="form-control" id="passwordInput"
                                                        placeholder="Enter your password" defaultValue="make@321654987"
                                                        style={{ maxWidth: "265px" }} />
                                                </div>
                                                <div className="hstack gap-2 mt-3">
                                                    <Link to="#" className="btn btn-soft-danger">Close &
                                                        Delete This Account</Link>
                                                    <Link to="#" className="btn btn-light">Cancel</Link>
                                                </div>
                                            </div>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Settings;