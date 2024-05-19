import React, {useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import { useDispatch } from "react-redux"
import {
    getProjectActiveDetail as getProjectActiveDetailAPI,
  } from "../../slices/thunks"
  import avt_default from "../../assets/images/users/anh_mac_dinh.jpg"
const ActiveProjects = () => {
  const dispatch = useDispatch<any>();
  const [projectActiveList,setProjectActiveList]=useState<any>([]);

  async function getProjectActiveDetail(){
    const dataResponse=await dispatch(getProjectActiveDetailAPI());
    if(dataResponse.payload){
        setProjectActiveList(dataResponse.payload);
    }
    }
    useEffect(()=>{
        getProjectActiveDetail();
      },[])
      function formatDate(inputDate:string) {
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
    return (
        <React.Fragment>
            <Col xl={6}>
                <Card>
                    <CardHeader className="d-flex align-items-center">
                        <h4 className="card-title flex-grow-1 mb-0">Active Projects</h4>
                        <div className="flex-shrink-0">
                            <Link to="#" className="btn btn-soft-info btn-sm">Export Report</Link>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="table-responsive table-card">
                            <table className="table table-nowrap table-centered align-middle">
                                <thead className="bg-light text-muted">
                                    <tr>
                                        <th scope="col">Project Name</th>
                                        <th scope="col">Project Lead</th>
                                        <th scope="col">Progress</th>
                                        <th scope="col">Assignee</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" style={{ width: "10%" }}>Due Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {(projectActiveList).map((item:any, key:number) => (<tr key={key}>
                                        <td className="fw-medium">{item.name}</td>
                                        <td>
                                        {item.owner&& <img src={item.owner.profile_ava_url!==''?item.owner.profile_ava_url:avt_default} className="avatar-xxs rounded-circle me-1" alt="" />}
                                            <Link to="#" className="text-reset">{item.owner.full_name!==''?item.owner.full_name:'member'}</Link>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 me-1 text-muted fs-13">{item.progress}%</div>
                                                <div className="progress progress-sm  flex-grow-1" style={{ width: "68%" }}>
                                                    <div className="progress-bar bg-primary rounded" role="progressbar" style={{ width: `${item.progress}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="avatar-group flex-nowrap">
                                                {item.members&&item.members.map((member:any, key:number) => (<div className="avatar-group-item" key={key}>
                                                    <Link to="#" className="d-inline-block">
                                                        <img src={member.account_info.profile_ava_url!==''?member.account_info.profile_ava_url:avt_default} alt="" title={member.account_info.full_name!==''?member.account_info.full_name:'Member'} className="rounded-circle avatar-xxs" />
                                                    </Link>
                                                </div>))}
                                            </div>
                                        </td>
                                        <td><span className={`badge bg-${item.status==='In Progress'?'warning':''}${item.status==='Pending'?'danger':''}${item.status==='Done'?'success':''}-subtle text-${item.status==='In Progress'?'warning':''}${item.status==='Pending'?'danger':''}${item.status==='Done'?'success':''}`}>{item.status}</span></td>
                                        <td className="text-muted">{formatDate(item.deadline)}</td>
                                    </tr>))}
                                </tbody>
                            </table>
                        </div>
                        {/* <div className="align-items-center mt-xl-3 mt-4 justify-content-between d-flex">
                            <div className="flex-shrink-0">
                                <div className="text-muted">Showing <span className="fw-semibold">5</span> of <span className="fw-semibold">25</span> Results
                                </div>
                            </div>
                            <ul className="pagination pagination-separated pagination-sm mb-0">
                                <li className="page-item disabled">
                                    <Link to="#" className="page-link">←</Link>
                                </li>
                                <li className="page-item">
                                    <Link to="#" className="page-link">1</Link>
                                </li>
                                <li className="page-item active">
                                    <Link to="#" className="page-link">2</Link>
                                </li>
                                <li className="page-item">
                                    <Link to="#" className="page-link">3</Link>
                                </li>
                                <li className="page-item">
                                    <Link to="#" className="page-link">→</Link>
                                </li>
                            </ul>
                        </div> */}
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default ActiveProjects;