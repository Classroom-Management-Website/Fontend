"use client"
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getCookie } from '@/getCookie/getCookie';

interface IProps {
  showModelCreate: boolean;
  setShowModelCreate: (value: boolean) => void;
  customFunction: () => void;
  maLop: number;
}

function CreateStudents(props: IProps) {
  const [birthday, setBirthday] = useState<Date | null>(new Date());
  const { showModelCreate, setShowModelCreate, customFunction, maLop } = props;
  const [tenHs, setTenHs] = useState<string>('');
  const [ngaySinh, setNgaySinh] = useState<string>('')
  const [soBuoiVang, setSoBuoiVang] = useState<number | string>('');
  const handleCloseModal = () => {
    setTenHs('')
    setBirthday(null);
    setNgaySinh('')
    setSoBuoiVang('')
    setShowModelCreate(false)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Kiểm tra xem giá trị nhập vào có thể chuyển đổi thành số nguyên không
    const intValue = parseInt(inputValue, 10);
    if (!isNaN(intValue) || inputValue === '') {
      setSoBuoiVang(inputValue);
    }
  };
  const formatDate = (date: Date): string => {
    let day: string = date.getDate().toString().padStart(2, '0');
    let month: string = (date.getMonth() + 1).toString().padStart(2, '0'); // January is 0
    let year: string = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
  };


  const handleSubmit = async () => {
    if (tenHs) {
      try {
        const token = getCookie('token');
        const apiUrl = 'http://localhost:8989/api/students/' + maLop;

        // Tạo đối tượng formData
        const formData = {
          tenHs: tenHs,
          ngaySinh: ngaySinh,
          soBuoiVang: soBuoiVang
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
          throw new Error('Network response was not ok');
        } else {
          handleCloseModal();
          customFunction();
          alert('Thêm học sinh thành công');
        }
      } catch (error) {
        console.error('Error fetching classrooms:', error);
      }

    }
    else {
      throw new Error ("Vui lòng điền tên học sinh")
    }
  }

  return (

    <Modal
      show={showModelCreate}
      onHide={() => handleCloseModal}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Thêm học sinh vào lớp học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tên Học Sinh</Form.Label>
            <Form.Control type="tenHs" placeholder="...."
              value={tenHs}
              onChange={(e) => setTenHs(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ngày Sinh</Form.Label>
            <DatePicker
              selected={birthday}
              onChange={(date) => {
                if (date) {
                  setBirthday(date);
                  setNgaySinh(formatDate(date))
                } else {
                  alert("Vui lòng chọn đúng định dạng ngày sinh")
                }
              }}
              dateFormat="dd/MM/yyyy"
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Số Buổi Vắng</Form.Label>
            <Form.Control
              type="number"  // Sử dụng type="number"
              placeholder="...."
              value={soBuoiVang}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleCloseModal()}>
          Đóng
        </Button>
        <Button variant="primary" onClick={() => handleSubmit()}>Lưu</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateStudents;