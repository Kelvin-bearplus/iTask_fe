import React, {useState, useEffect} from 'react';
import Flatpickr from "react-flatpickr";
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux"
import {
    getUpcomingTask as getUpcomingTaskAPI
  } from "../../slices/thunks"
const UpcomingSchedules = () => {
    const dispatch = useDispatch<any>();
    const [taskListComing,setTaskListComing]=useState<any>([]);
  
    async function getTaskComing(){
      const dataResponse=await dispatch(getUpcomingTaskAPI());
      console.log(dataResponse);
      if(dataResponse.payload){
        setTaskListComing(dataResponse.payload);
      }
      }
      useEffect(()=>{
        getTaskComing();
        },[])
        console.log(taskListComing)
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
          function getDay(inputDate:string) {
            // Tạo một đối tượng Date từ chuỗi đầu vào
            const date = new Date(inputDate);
            const day = date.getDate();
            return day;
          }
          const [selectedMonth, setSelectedMonth] = useState<number>(0);
        useEffect(() => {
            async function fetchData() {
                const monthDropdown = document.querySelector(".flatpickr-monthDropdown-months");
                if (monthDropdown) {
                    monthDropdown.addEventListener("change", async () => {
                        const selectedMonthIndex = parseInt((monthDropdown as HTMLSelectElement).value) + 1;
                        setSelectedMonth(selectedMonthIndex); // Tháng bắt đầu từ 0 nên cần +1
                        const dataResponse = await dispatch(getUpcomingTaskAPI(selectedMonthIndex));
                        console.log(dataResponse);
                        if (dataResponse.payload) {
                            setTaskListComing(dataResponse.payload);
                        }
                    });
                }
            }
            fetchData();
        }, []);
        const parseHTML = (htmlString: string) => {
            return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
          };
        console.log(selectedMonth);
    return (
        <React.Fragment>
            <div className="col-12">
                <div className="card">
                    <div className="card-header border-0">
                        <h4 className="card-title mb-0">Upcoming Schedules</h4>
                    </div>
                    <div className="card-body pt-0">
                        <div className="upcoming-scheduled">
                            <Flatpickr
                                className="form-control"
                                options={{
                                    dateFormat: "d M, Y",
                                    inline: true,
                                

                                }}
                              
                            />
                        </div>

                        <h6 className="text-uppercase fw-semibold mt-4 mb-3 text-muted">Events:</h6>
                       {taskListComing.length>0&& taskListComing.map((item:any,key:number)=>{
                            return(
                                <div className="mini-stats-wid d-flex align-items-center mt-3">
                                <div className="flex-shrink-0 avatar-sm">
                                    <span className="mini-stat-icon avatar-title rounded-circle text-success bg-success-subtle fs-4">
                                        {getDay(item.created_at)}
                                    </span>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h6 className="mb-1">{item.name}</h6>
                                    <p className="text-muted mb-0">
                                              {parseHTML(item.description)}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <p className="text-muted mb-0">{formatDate(item.created_at)} <span className="text-uppercase"></span></p>
                                </div>
                            </div>
                            
                            )
                       })}
        {
            taskListComing.length==0&&   <h6 className="mb-1">There are no tasks upcoming in the selected month</h6>
        }

                        <div className="mt-3 text-center">
                            <Link to="#" className="text-muted text-decoration-underline">View all Events</Link>
                        </div>

                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default UpcomingSchedules;