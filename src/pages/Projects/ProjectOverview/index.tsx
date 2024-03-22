// import React from 'react';
import { Container } from 'reactstrap';
import Section from './Section';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {getProjectById  } from "../../../slices/thunks";

const ProjectOverview = () => {
    document.title="Project Overview ";
    const dispatch: any = useDispatch();
    const [dataProject,setDataProject]=useState<any>();
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    const getDataProject = async (id: number) => {
        const data = await dispatch(getProjectById(id));
        console.log(data);
        setDataProject(data.payload.data);
        return data;
    };
    console.log(id)
    useEffect(() => {
        console.log(id)
        if (id != undefined) {
            console.log(id);
            var id_parse = parseInt(id);
            getDataProject(id_parse);
        }
    }, []);
    console.log(dataProject)
    return (
        <React.Fragment>
        {dataProject &&    <div className="page-content">
                <Container fluid>                    
                <Section prop={dataProject}/>
                </Container>
            </div>}
        </React.Fragment>
    );
};

export default ProjectOverview;