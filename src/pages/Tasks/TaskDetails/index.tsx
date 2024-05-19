import React ,{useEffect,useState} from 'react';
import { Container, Col, Row } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import Comments from './Comments';
import Summary from './Summary';
import TimeTracking from "./TimeTracking";
import { useSelector, useDispatch } from "react-redux";

import {
    getTaskById
  } from "../../../slices/thunks";
  import { createSelector } from 'reselect';

const TaskDetails = (prop?:any) => {
    document.title="Tasks Details ";
  const dispatch: any = useDispatch();
  const [dataTask, setDataTask] =useState<any>({});
  const selectLayoutState = (state: any) => state.Tasks;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (state) => ({
      taskListData: state.taskList,
    })
  );
  const {
    taskListData
  } = useSelector(selectLayoutProperties);

  const searchParams = new URLSearchParams(window.location.search);
  var id = searchParams.get('id');
  const getDataTask = async (id: number) => {
      const data = await dispatch(getTaskById(id));
      console.log(data);
      setDataTask(data.payload);

  };
  console.log(dataTask)
  useEffect(() => {
      console.log(id)
      if (id != undefined) {
          console.log(id);
          var id_parse = parseInt(id);
          getDataTask(id_parse);
      }
      else{
        if(prop.idTask!=undefined && prop.idTask!=0){
            getDataTask(prop.idTask);
        }
      }
  }, [taskListData]);
  function isObjectEmpty(obj:any) {
    return Object.keys(obj).length === 0;
  }
    return (
        <React.Fragment>
           {
            !isObjectEmpty(dataTask) && (
                <div className="page-content">
                    <Container fluid>
                      {dataTask.type===3&& <BreadCrumb title="Tasks Details" pageTitle="Tasks" />}  
                      {dataTask.type===2&& <BreadCrumb title="Story Details" pageTitle="Storys" />}  
                      {dataTask.type===1&& <BreadCrumb title="Epic Details" pageTitle="Epics" />}  
                      {dataTask.type===2&& <BreadCrumb title="Bug Details" pageTitle="Bugs" />}  
                        <Row>
                            <Col lg={4}>
                                <TimeTracking prop={dataTask} />
                            </Col>
                            <Col lg={8}>
                                <Summary prop={dataTask} />
                                {id!=undefined && <Comments taskId={parseInt(id)} />}
                                {prop.idTask!=undefined && <Comments taskId={parseInt(prop.idTask)} />}

                            </Col>
                        </Row>
                    </Container>
                </div>
            )
           }
        </React.Fragment>
    );
};

export default TaskDetails;