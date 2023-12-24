"use client"
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DateTimePicker from './DateTimePicker';
import { getCookie } from '@/getCookie/getCookie';
import { useRouter } from 'next/navigation'
interface IProps{
    showModelCreate: boolean;
    setShowModelCreate: (value: boolean) => void;
    customFunction: () => void;
}

function CreateClassrooms(props: IProps) {
  const router = useRouter();
    const {showModelCreate,setShowModelCreate,customFunction} = props;
    const [tenLopHoc,setTenLopHoc] = useState<string>('');
    const [lichHoc,setLichHoc] = useState<string>('');

    const handleSubmit = async () => {
      if(tenLopHoc && lichHoc){
        try {
          const token = getCookie('token');
          const apiUrl = 'http://localhost:8989/api/classrooms';
      
          // Tạo đối tượng formData
          const formData = {
            tenLopHoc: tenLopHoc,
            lichHoc: lichHoc,
            // Bạn có thể thêm thêm các trường dữ liệu khác vào đây nếu cần
          };
      
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          });
      
          if (!response.ok) {
            alert("Thời gian lớp học đang bị trùng")
          } else {
            handleCloseModal()
            alert('Thêm lớp học thành công');
            customFunction();
          }
        } catch (error) {
          console.error('Error fetching classrooms:', error);
        }
      }
      else{
        alert('Vui lòng điền đầy đủ thông tin')
      }
    };
    
    const handleDateTimeChange = (selectedDateTimeString: string) => {
      setLichHoc(selectedDateTimeString);
      // Xử lý giá trị đã chọn ở đây, ví dụ: log ra console
      // console.log('Selected Day:', selectedDateTimeString);
    };
    const handleCloseModal = () =>{
      setTenLopHoc('');
      setLichHoc('');
      setShowModelCreate(false)
    }
  return (
    <>
      <Modal
        show={showModelCreate}
        onHide={()=>handleCloseModal}
        backdrop="static"
        keyboard={false}
        size = 'lg'
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm lớp học mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group className="mb-3">
                <Form.Label>Tên lớp học</Form.Label>
                <Form.Control type="tenLopHoc" placeholder="....." 
                    value = {tenLopHoc}
                    onChange={(e)=> setTenLopHoc(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Lịch học</Form.Label>
                <DateTimePicker onDateTimeChange={handleDateTimeChange}/>
            </Form.Group>
            
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>handleCloseModal()}>
            Đóng
          </Button>
          <Button variant="primary" onClick={()=>handleSubmit()}>Lưu</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateClassrooms;