import React, { useEffect, useState } from "react";
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback, Button, Spinner } from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// action
import { registerUser, resetRegisterFlag,checkEmail } from "../../slices/thunks";
import ParticlesAuth from "../Authentication/ParticlesAuth";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

//import images 
import { createSelector } from "reselect";

const Register = () => {
    const history = useNavigate();
    const dispatch: any = useDispatch();
    const [loader, setLoader] = useState<boolean>(false);
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            email: '',
            // first_name: '',
            password: '',
            confirm_password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email').required("Please Enter Your Email"),
            // first_name: Yup.string().required("Please Enter Your Username"),
            password: Yup.string().required("Please Enter Your Password"),
            confirm_password: Yup.string()
                .oneOf([Yup.ref('password'), ""],)
                .required('Confirm Password is required')
        }),
        onSubmit: (values) => {
            dispatch(registerUser(values));
            setLoader(true)
        }
    });

    const selectLayoutState = (state: any) => state.Account;
    const registerdatatype = createSelector(
        selectLayoutState,
        (account) => ({
            success: account.success,
            error: account.error
        })
    );
    // Inside your component
    const {
        error, success
    } = useSelector(registerdatatype);

    useEffect(() => {
        if (success) {
            setTimeout(() => history("/login"), 10000);
        }

        setTimeout(() => {
            dispatch(resetRegisterFlag());
        }, 3000);

    }, [dispatch, success, error, history]);
const [hasEmail, setHasEmail]= useState<boolean>(false);
const [hasSubmit, setHasSubmit]= useState<boolean>(true);
// useEffect(() => {
// if (validation.errors.email!==undefined && validation.errors.email!=="") {
    
// }

//   }, [validation.errors.email]);
// custom function handleChange in useFormik
const customHandleBlur = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Kiểm tra email
    const checkEmailResponse: boolean = await checkEmail(e.target.value);
    if (checkEmailResponse) {
        // Đặt trạng thái touched của trường email là true
        setHasEmail(true);
        validation.setFieldTouched('email', true);
        // Đặt thông báo lỗi cho trường email
        // validation.setFieldError('email', 'Email has been Register Before, Please Use Another Email Address...');
        setHasSubmit(false)

    } else {
        // Nếu email không tồn tại, xóa thông báo lỗi cho trường email
        validation.setFieldError('email', '');
        setHasEmail(false);
        setHasSubmit(true)

    }
    
    // Kích hoạt sự kiện onBlur của trường email
    validation.handleChange(e);
    // Log thông báo lỗi của trường email sau khi đã được cập nhật
}


    document.title = "SignUp Website";

    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content mt-lg-5">
                    <Container>
                      

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-5">

                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Create New Account</h5>
                                            <p className="text-muted">Get your free  account now</p>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                className="needs-validation" action="#">

                                                {success && success ? (
                                                    <>
                                                        {toast("Your Redirect To Login Page...", { position: "top-right", hideProgressBar: false, className: 'bg-success text-white', progress: undefined, toastId: "" })}
                                                        <ToastContainer autoClose={9000} limit={1} />
                                                        <Alert color="success">
                                                            Register User Successfully. Please check your email and complete the verification process to ensure accuracy and security. Thank you.
                                                        </Alert>
                                                    </>
                                                ) : null}

                                                {error && error ? (
                                                    <Alert color="danger"><div>
                                                        Email has been Register Before, Please Use Another Email Address... </div></Alert>
                                                ) : null}

                                                <div className="mb-3">
                                                    <Label htmlFor="useremail" className="form-label">Email <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Enter email address"
                                                        type="email"
                                                        onChange={customHandleBlur}
                                                        onBlur={validation.handleBlur}
                                                     
                                                        invalid={
                                                            validation.touched.email && validation.errors.email ? true : false
                                                        }
                                                    />
                                                 
                                                    {validation.touched.email && validation.errors.email ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                                                    ) : null}
                                                   {hasEmail && <div className="invalid-feedback" style={{display:'block'}}>Email has been Register Before, Please Use Another Email Address...</div>}

                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="userpassword" className="form-label">Password <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="password"
                                                        type="password"
                                                        placeholder="Enter Password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                      
                                                        invalid={
                                                            validation.touched.password && validation.errors.password ? true : false
                                                        }
                                                    />
                                                    {validation.touched.password && validation.errors.password ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.password}</div></FormFeedback>
                                                    ) : null}

                                                </div>

                                                <div className="mb-2">
                                                    <Label htmlFor="confirmPassword" className="form-label">Confirm Password <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="confirm_password"
                                                        type="password"
                                                        placeholder="Confirm Password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                       
                                                        invalid={
                                                            validation.touched.confirm_password && validation.errors.confirm_password ? true : false
                                                        }
                                                    />
                                                    {validation.touched.confirm_password && validation.errors.confirm_password ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.confirm_password}</div></FormFeedback>
                                                    ) : null}

                                                </div>

                                                <div className="mt-4">
                                                    <Button color="success" className="w-100" type="submit" disabled={loader || !hasSubmit}>
                                                        {loader && <Spinner size="sm" className='me-2'> Loading... </Spinner>}
                                                        Sign Up
                                                    </Button>
                                                </div>

                                                <div className="mt-4 text-center">
                                                    <div className="signin-other-title">
                                                        <h5 className="fs-13 mb-4 title text-muted">Create account with</h5>
                                                    </div>

                                                    <div>
                                                        <button type="button" className="btn btn-primary btn-icon waves-effect waves-light"><i className="ri-facebook-fill fs-16"></i></button>{" "}
                                                        <button type="button" className="btn btn-danger btn-icon waves-effect waves-light"><i className="ri-google-fill fs-16"></i></button>{" "}
                                                        <button type="button" className="btn btn-dark btn-icon waves-effect waves-light"><i className="ri-github-fill fs-16"></i></button>{" "}
                                                        <button type="button" className="btn btn-info btn-icon waves-effect waves-light"><i className="ri-twitter-fill fs-16"></i></button>
                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-4 text-center">
                                    <p className="mb-0">Already have an account ? <Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>

        </React.Fragment>
    );
};

export default Register;
