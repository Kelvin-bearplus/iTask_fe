import React from 'react'

import { Container } from 'reactstrap'
import BreadCrumb from 'Components/Common/BreadCrumb'
import TasksKanban from './MainPage'




const Kanbanboard = () => {


    return (
        <React.Fragment>
            <div className="page-content pt-0">
                <Container fluid>
                    {/* <BreadCrumb title="Kanban Board" pageTitle="Tasks" /> */}
                    <TasksKanban project_id={0}/>
                </Container>
            </div>
        </React.Fragment>


    )
}

export default Kanbanboard