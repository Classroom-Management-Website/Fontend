import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DateTimePicker from './editDateTimePicker';
import { getCookie } from '@/getCookie/getCookie';

interface EditClassroomsProps {
  show: boolean;
  onHide: () => void;
  classroom: {
    maLop: number;
    tenLopHoc: string;
    lichHoc: string;
  };
  refreshData: () => void;
}

const EditClassrooms = ({ show, onHide, classroom, refreshData }: EditClassroomsProps) => {
  const [tenLopHoc, setTenLopHoc] = useState('');
  const [lichHoc, setLichHoc] = useState('');

  const [initialClassroom, setInitialClassroom] = useState({
    tenLopHoc: '',
    lichHoc: '',
  });

  useEffect(() => {
    if (classroom) {
      setTenLopHoc(classroom.tenLopHoc);
      setLichHoc(classroom.lichHoc);
      setInitialClassroom({
        tenLopHoc: classroom.tenLopHoc,
        lichHoc: classroom.lichHoc,
      });
    }
  }, [classroom]);

  const handleSubmit = async () => {
    // Validation code...
    if (!tenLopHoc || !lichHoc) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      const token = getCookie('token');
      const apiUrl = `http://localhost:8989/api/classrooms/${classroom.maLop}`;
      const formData = {
        tenLopHoc,
        lichHoc,
      };

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.log(response)
        alert('Đã có lỗi xảy ra');
      } else {
        onHide();
        refreshData();
        alert('Cập nhật lớp học thành công');
      }
    } catch (error) {
      console.error('Error updating classroom:', error);
      alert('Đã có lỗi xảy ra');
    }
  };
  const handleModalClose = () => {
    console.log("dong")
    setTenLopHoc(initialClassroom.tenLopHoc);
    setLichHoc(initialClassroom.lichHoc);
    onHide();
  };
  return (
    <Modal show={show} onHide={handleModalClose} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa lớp học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tên lớp học</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Tên lớp học" 
              value={tenLopHoc} 
              onChange={(e) => setTenLopHoc(e.target.value)} 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lịch học</Form.Label>
            <DateTimePicker 
              initialDateTime={lichHoc} 
              onDateTimeChange={setLichHoc} 
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary"  onClick={handleModalClose}>Đóng</Button>
        <Button variant="primary" onClick={handleSubmit}>Cập nhật</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditClassrooms;
