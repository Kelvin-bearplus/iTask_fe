 import React from 'react';
import withRouter from '../../Components/Common/withRouter';
import logoSm from "../../assets/images/logo-sm.png";

const ParticlesAuth = ({ children }: any) => {
    return (
        <React.Fragment>
            <div className="auth-page-wrapper pt-5">
                <div className="auth-one-bg-position auth-one-bg" id="auth-particles">

                    <div className="bg-overlay"></div>

                    <div className="shape">
                    <span className="logo-lg">
                                        <img src={logoSm} alt="" height="17" />
                                    </span>
                    </div>

                    {/* pass the children */}
                    {children}

                </div>

                <footer className="footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-center">
                                    <p className="mb-0 text-muted"> {new Date().getFullYear()} Thank you for coming to us</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </React.Fragment>
    );
};

export default withRouter(ParticlesAuth);