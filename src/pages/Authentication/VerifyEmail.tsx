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
import { userVerifyCode ,userForgetPasswordFlagNew} from "../../slices/thunks";

// import images
// import profile from "../../assets/images/bg.png";
import logoLight from "../../assets/images/logo-light.png";
import { createSelector } from "reselect";

const ForgetPasswordPage = (props : any) => {
  const dispatch : any = useDispatch();
  const searchParams = new URLSearchParams(window.location.search);
  const email = searchParams.get('email');
  const validation : any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email_code: '',
    },
    validationSchema: Yup.object({
      email_code: Yup.string().required("Please Enter Your Email"),
    }),
    onSubmit: async(values) => {
      const user={email:email,code:values.email_code}
     const data=await dispatch(userVerifyCode(user, props.history));
      if(data=="Success"){
        window.location.href='/change-password?email='+email;
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
  useEffect(() => {
    if (forgetError) {
      setTimeout(() => {
          dispatch(userForgetPasswordFlagNew());
      }, 2000);
  }
})
  // Inside your component
  const {
    forgetError, forgetSuccessMsg
  } = useSelector(selectLayoutProperties);
  useEffect(() => {
    if(forgetSuccessMsg !== null){
setTimeout(()=>{
  // window.location.href='/verify-email'
},2000)  
  }
  },[forgetSuccessMsg])
  document.title = "Reset Password ";
  return (
      <div className="auth-page-content mt-lg-5">

        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">

                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Verify Code in your email</h5>

                    <i className="ri-mail-send-line display-5 text-success mb-3"></i>

                  </div>

                  <Alert className="border-0 alert-warning text-center mb-2 mx-2" role="alert">
                    Enter your code and you will be set new password!
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
                        <Label className="form-label">Code</Label>
                        <Input
                          name="email_code"
                          className="form-control"
                          placeholder="Enter code"
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email_code || ""}
                          invalid={
                            validation.touched.email_code && validation.errors.email_code ? true : false
                          }
                        />
                        {validation.touched.email_code && validation.errors.email_code ? (
                          <FormFeedback type="invalid"><div>{validation.errors.email_code}</div></FormFeedback>
                        ) : null}
                      </div>

                      <div className="text-center mt-4">
                        <button className="btn btn-success w-100" type="submit">Send Code</button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">Wait, I remember my password... <Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Click here </Link> </p>
              </div>

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
