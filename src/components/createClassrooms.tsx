import { message } from 'antd';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DateTimePicker from './DateTimePicker';
import { getCookie } from '@/getCookie/getCookie';
import { useRouter } from 'next/navigation'
import 'bootstrap/dist/css/bootstrap.min.css';
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
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';
  
    const openMessageSuccess = (text:string) => {
      messageApi.open({
        key,
        type: 'loading',
        content: 'Loading...',
      });
      setTimeout(() => {
        messageApi.open({
          key,
          type:'success',
          content: text,
          duration: 2,
        });
      }, 500);
    };
    const openMessageError = (text:string) => {
      messageApi.open({
        key,
        type: 'loading',
        content: 'Loading...',
      });
      setTimeout(() => {
        messageApi.open({
          key,
          type:'error',
          content: text,
          duration: 2,
        });
      }, 500);
    };
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
            openMessageError("Thời gian lớp học đang bị trùng")
          } else {
            handleCloseModal()
            openMessageSuccess('Thêm lớp học thành công');
            customFunction();
          }
        } catch (error) {
          openMessageError('Error fetching classrooms');
        }
      }
      else{
        openMessageError('Vui lòng điền đầy đủ thông tin')
      }
    };
    
    const handleDateTimeChange = (selectedDateTimeString: string) => {
      setLichHoc(selectedDateTimeString);

    };
    const handleCloseModal = () =>{
      setTenLopHoc('');
      setLichHoc('');
      setShowModelCreate(false)
    }
  return (
    <>{contextHolder}
      <Modal
        show={showModelCreate}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
        size = 'lg'
      >
        <Modal.Header closeButton >
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
                <Form.Label>Thời gian</Form.Label>
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