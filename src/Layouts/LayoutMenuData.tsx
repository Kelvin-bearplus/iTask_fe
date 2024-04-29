import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  useDispatch,useSelector } from "react-redux";
import { createSelector } from 'reselect';
import {getSimpleProject} from "../slices/thunks"
import { useParams } from 'react-router-dom';
const Navdata = () => {
    const dispatch: any = useDispatch();
    const projectData = createSelector(
        (state : any) => state.Projects.projectLists,
        (project) => project
      );
      const [projects,setProjects]=useState([]);
      async function getProject(){
        let limit=100;
        const responseData=await dispatch(getSimpleProject(limit));
        console.log(responseData);
        if(responseData.payload){
            setProjects(responseData.payload);
        }
      }
    var project = useSelector(projectData);
      useEffect(()=>{
        getProject();
      },[project])
    // Inside your component
    const history = useNavigate();
    //state data
    const [isDashboard, setIsDashboard] = useState<boolean>(false);
    const [isApps, setIsApps] = useState<boolean>(false);
    const [isPages, setIsPages] = useState<boolean>(false);
    const [isBaseUi, setIsBaseUi] = useState<boolean>(false);
    const [isAdvanceUi, setIsAdvanceUi] = useState<boolean>(false);
    const [isForms, setIsForms] = useState<boolean>(false);
    const [isTables, setIsTables] = useState<boolean>(false);
    const [isCharts, setIsCharts] = useState<boolean>(false);
    const [isIcons, setIsIcons] = useState<boolean>(false);
    const [isMaps, setIsMaps] = useState<boolean>(false);
    const [isMultiLevel, setIsMultiLevel] = useState<boolean>(false);

    // Apps

    const [isProjects, setIsProjects] = useState<boolean>(false);
    const [isTasks, setIsTasks] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<number>(0);


    // Authentication


    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    function updateIconSidebar(e: any) {
        if (e && e.target && e.target.getAttribute("sub-items")) {
            const ul: any = document.getElementById("two-column-menu");
            const iconItems: any = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("sub-items");
                const getID = document.getElementById(id) as HTMLElement;
                if (getID)
                    getID.classList.remove("show");
            });
        }
    }

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Dashboard') {
            setIsDashboard(false);
        }
        if (iscurrentState !== 'Apps') {
            setIsApps(false);
        }
       
        if (iscurrentState !== 'Pages') {
            setIsPages(false);
        }
        if (iscurrentState !== 'BaseUi') {
            setIsBaseUi(false);
        }
        if (iscurrentState !== 'AdvanceUi') {
            setIsAdvanceUi(false);
        }
        if (iscurrentState !== 'Forms') {
            setIsForms(false);
        }
        if (iscurrentState !== 'Tables') {
            setIsTables(false);
        }
        if (iscurrentState !== 'Charts') {
            setIsCharts(false);
        }
        if (iscurrentState !== 'Icons') {
            setIsIcons(false);
        }
        if (iscurrentState !== 'Maps') {
            setIsMaps(false);
        }
        if (iscurrentState !== 'MuliLevel') {
            setIsMultiLevel(false);
        }
        if (iscurrentState === 'Widgets') {
            history("/widgets");
            document.body.classList.add('twocolumn-panel');
        }
 
    }, [
        history,
        iscurrentState,
        isDashboard,
        isApps,
        isPages,
        isBaseUi,
        isAdvanceUi,
        isForms,
        isTables,
        isCharts,
        isIcons,
        isMaps,
        isMultiLevel
    ]);

    const menuItems: any = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "Dashboards",
            icon: "ri-dashboard-2-line",
            link: "/#",
            stateVariables: isDashboard,
            click: function (e: any) {
                e.preventDefault();
                setIsDashboard(!isDashboard);
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            },
            subItems: [
             
                {
                    id: "projects",
                    label: "Projects",
                    link: "/dashboard-projects",
                    parentId: "dashboard",
                },
               
            ],
        },
        {
            id: "apps",
            label: "Projects",
            icon: "ri-apps-2-line",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsApps(!isApps);
                setIscurrentState('Apps');
                updateIconSidebar(e);
            },
            stateVariables: isApps,
            subItems: [ 
                ...projects.map((project:any) => ({
                    id: project.id,
                    label: project.name,
                    className:`menu-item_custom ${project.id === activeTab ? "active_tab" : ""}`,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsProjects(!isProjects);
                        setActiveTab(project.id)
                        console.log(activeTab)
                    },
                    link: `/apps-projects-overview/${project.id}`,
                    // parentId: "apps",
                })),
                {
                    id: "appsprojects",
                    label: "View All",
                    link: "/apps-projects-list",
                    className:`menu-item_custom ${activeTab===101 ? "active_tab" : ""}`,
                    click: function (e: any) {
                        e.preventDefault();
                        setIsProjects(!isProjects);
                        setActiveTab(101)

                    },
                    parentId: "apps",
                    stateVariables: isProjects,
                 
                },
                {
                    id: "addProject",
                    label: "Add New Project",
                    className:`menu-item_custom ${activeTab===102 ? "active_tab" : ""}`,
                    link: "/apps-projects-create",
                    click: function (e: any) {
                        e.preventDefault();
                        setIsProjects(!isProjects);
                        setActiveTab(102)

                    },
                    parentId: "apps",
                    stateVariables: isProjects,
                },
              
            ],
        },
        
       
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;