import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { projectTasks } from '../../common/data';
import {
    getMyTaskDashboard as getMyTaskDashboardAPI
} from "../../slices/thunks"
import { useDispatch } from "react-redux"
import avt_default from "../../assets/images/users/anh_mac_dinh.jpg"

const MyTasks = () => {
    const dispatch = useDispatch<any>();
    const [myTaskList, setMyTaskList] = useState([]);
    async function getTaskComing(status?:number) {
        if(status){
            const dataResponse = await dispatch(getMyTaskDashboardAPI(status));
            console.log(dataResponse);
            if (dataResponse.payload) {
                setMyTaskList(dataResponse.payload);
            }
        }
        else{
        const dataResponse = await dispatch(getMyTaskDashboardAPI());
        console.log(dataResponse);
        if (dataResponse.payload) {
            setMyTaskList(dataResponse.payload);
        }
        }
       
    }
    useEffect(() => {

        getTaskComing();
    }, [])
    console.log(myTaskList)
    function formatDate(inputDate: string) {
        // Tạo một đối tượng Date từ chuỗi đầu vào
        const date = new Date(inputDate);

        // Mảng các tháng
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Lấy ngày, tháng và năm từ đối tượng Date
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        // Tạo định dạng ngày mới
        const formattedDate = `${day} ${months[monthIndex]}, ${year}`;

        return formattedDate;
    }
    function convertStatus(status: number) {
        switch (status) {
            case 1:
                return "Pending";
            case 2:
                return "In-progress";
            case 3:
                return "Done";
            case 4:
                return "Delete";
            default:
                return "Pending";
        }
    }
    const [selectedItem, setSelectedItem] = useState<number>(0);
    const [selectedItemString, setSelectedItemString] = useState<string>('All Task');
    const handleItemClick = (item: number) => {
        if(item>0){
            getTaskComing(item)
        }
        else{
        getTaskComing()
        }
        switch (item) {
            case 0:
                setSelectedItemString('All Task');
                break
            case 1:
                setSelectedItemString('Pending');
                break
            case 2:
                setSelectedItemString('In-Progress')
                break
            case 3:
                setSelectedItemString('Complete')
                break
            default:
                setSelectedItemString('All Task')
        }
        setSelectedItem(item);
        
        console.log(`Selected item: ${item}`);
      };
    return (
        <React.Fragment>
            <Col xl={6}>
                <Card>
                    <CardHeader className="card-header align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1 py-1">My Tasks</h4>
                        <div className="flex-shrink-0">
                            <UncontrolledDropdown className="card-header-dropdown">
                                <DropdownToggle className="text-reset dropdown-btn" tag="a" role="button">
                                    <span className="text-muted">{selectedItemString}<i className="mdi mdi-chevron-down ms-1"></i></span>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-end">
                                    <DropdownItem onClick={() => handleItemClick(0)}>All Tasks</DropdownItem>
                                    <DropdownItem onClick={() => handleItemClick(3)}>Completed</DropdownItem>
                                    <DropdownItem onClick={() => handleItemClick(2)}>In-Progress</DropdownItem>
                                    <DropdownItem onClick={() => handleItemClick(1)}>Pending</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="table-responsive table-card">
                            <table className="table table-borderless table-nowrap table-centered align-middle mb-0">
                                <thead className="table-light text-muted">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Dedline</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Assignee</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myTaskList.length > 0 && (myTaskList).map((item: any, key: number) => (<tr key={key}>
                                        <td>
                                            <div className="form-check">
                                                <label className="form-check-label ms-1" >{item.name} </label>
                                            </div>
                                        </td>
                                        <td className="text-muted">{formatDate(item.due_date)}</td>
                                        <td><span className={`badge bg-${item.status === 2 ? 'warning' : ''}${item.status === 1 ? 'danger' : ''}${item.status === 3 ? 'success' : ''}-subtle text-${item.status === 2 ? 'warning' : ''}${item.status === 1 ? 'danger' : ''}${item.status === 3 ? 'success' : ''}`}>{convertStatus(item.status)}</span></td>
                                        <td>
                                            <Link to="#" className="d-inline-block" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Mary Stoner">
                                                {item.assignees !== null && item.assignees.length > 0 && item.assignees.map((assignee: any, key: number) => {
                                                    return <img key={key} src={assignee.user_info.profile_ava_url ? assignee.user_info.profile_ava_url : avt_default} className="rounded-circle avatar-xs me-2" alt="friend" title={assignee.user_info.full_name ? assignee.user_info.full_name : 'Member'} />

                                                })}
                                            </Link>
                                        </td>
                                    </tr>))}
                                </tbody>
                            </table>
                        </div>

                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default MyTasks;