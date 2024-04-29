// import React from 'react';
import { Container } from 'reactstrap';
import Section from './Section';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {getProjectById  } from "../../../slices/thunks";
import { useParams } from 'react-router-dom';
const ProjectOverview = () => {
    document.title="Project Overview ";
    const dispatch: any = useDispatch();
    const [dataProject,setDataProject]=useState<any>();
    // const searchParams = new URLSearchParams(window.location.search);
    // var id = searchParams.get('id');
    //     console.log(id)
    const [id, setId] = useState<number | null>(null);

    // Sử dụng useParams để lấy tham số từ URL và xác định kiểu cho nó
    const { id: idFromUrl } = useParams<{ id: string }>();
    console.log(idFromUrl);

    useEffect(() => {
        console.log(idFromUrl);
        // Chuyển đổi id từ string sang number và đặt vào state id
        setId(idFromUrl ? parseInt(idFromUrl, 10) : null);
    }, [idFromUrl]);
    useEffect(() => {
        const getDataProject = async (id: number) => {
            const data = await dispatch(getProjectById(id));
            if(data.payload){
                setDataProject(data.payload.data);

            }
        };
        
        if (id !== undefined && id !== null) {
            console.log(id);
            getDataProject(id);
        }
    }, [id]);
    
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