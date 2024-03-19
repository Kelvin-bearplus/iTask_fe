import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userResetPassword,userForgetPasswordFlagNew } from "../../slices/thunks";
import { createSelector } from "reselect";

const ForgetPasswordPage = (props : any) => {
  const dispatch : any = useDispatch();
  const searchParams = new URLSearchParams(window.location.search);
  const email = searchParams.get('email');
  const validation : any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      password: '',
      password_confirmation: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Please Enter Your  password"),
      password_confirmation: Yup.string()
      .oneOf([Yup.ref('password'), ""],)
      .required('Confirm Password is required')
    }),

    onSubmit:async (values) => {
      const user={email:email,password:values.password}
    const data= await dispatch(userResetPassword(user, props.history));
   if(data=="Success"){
   setTimeout(()=>{
    window.location.href='/login';
   },2000)
   }
    }
  });


  const selectLayoutState = (state : any) => state.ForgetPassword;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (state) => ({
      forgetError: state.forgetError,
      forgetSuccessMsg: state.forgetSuccessMsg,
    })
  );

  // Inside your component
  const {
    forgetError, forgetSuccessMsg
  } = useSelector(selectLayoutProperties);
  useEffect(() => {
    if (forgetError) {
      setTimeout(() => {
          dispatch(userForgetPasswordFlagNew());
      }, 2000);
  }
  },[forgetSuccessMsg,forgetError])
  document.title = "Reset Password ";
  return (
      <div className="auth-page-content mt-lg-5">

        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">

                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Forgot Password?</h5>

                    <i className="ri-mail-send-line display-5 text-success mb-3"></i>

                  </div>

                  <Alert className="border-0 alert-warning text-center mb-2 mx-2" role="alert">
                    Enter your email and instructions will be sent to you!
                  </Alert>
                  <div className="p-2">
                    {forgetError && forgetError ? (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {forgetError}
                      </Alert>
                    ) : null}
                    {forgetSuccessMsg ? (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {forgetSuccessMsg}
                      </Alert>
                    ) : null}
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-4">
                        <Label className="form-label">Password </Label>
                        <Input
                          name="password"
                          className="form-control"
                          placeholder="Password email "
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password || ""}
                          invalid={
                            validation.touched.password && validation.errors.password ? true : false
                          }
                        />
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid"><div>{validation.errors.password}</div></FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-4">
                        <Label className="form-label">Password Confirm </Label>
                        <Input
                          name="password_confirmation"
                          className="form-control"
                          placeholder="Enter password confirm "
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password_confirmation || ""}
                          invalid={
                            validation.touched.password_confirmation && validation.errors.password_confirmation ? true : false
                          }
                        />
                        {validation.touched.password_confirmation && validation.errors.password_confirmation ? (
                          <FormFeedback type="invalid"><div>{validation.errors.password_confirmation}</div></FormFeedback>
                        ) : null}
                      </div>
                      <div className="text-center mt-4">
                        <button className="btn btn-success w-100" type="submit">Reset Password</button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              

            </Col>
          </Row>
        </Container>
      </div>
  );
};

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);
