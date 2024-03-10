export const   formatDateToApi=(date: Date): string=> {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}
export const  dateFormatFrontend =(dob: string): string=> {
  const formattedDob = dob ? dob.substring(0, 10) : "";

  return formattedDob.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3-$2-$1");
}
export const formatDateCreateProject = (date: Date): string => {
  // Trích xuất thông tin về năm, tháng và ngày từ đối tượng Date
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  // Tạo chuỗi đầu ra theo định dạng mong muốn
  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;

  return formattedDateTime;
};
