import React from 'react';
import withRouter from '../Components/Common/withRouter';

//redux


const NonAuthLayout = ({ children } : any) => {


    return (
        <div>
            {children}
        </div>
    );
};

export default withRouter(NonAuthLayout);