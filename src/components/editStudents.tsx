import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getCookie } from '@/getCookie/getCookie';
import { message } from 'antd';
import { config } from '@/config/config';
import 'bootstrap/dist/css/bootstrap.min.css';
interface EditStudentsProps {
  showEditModal: boolean;
  setShowEditModal: (value: boolean) => void;
  customFunction: () => void;
  maLop: number;
  studentToEdit: {
    maHs: number;
    tenHs: string;
    ngaySinh: string;
    soBuoiVang: number;
  } | null;
}

function EditStudents(props: EditStudentsProps) {
  const [tenHs, setTenHs] = useState<string>('');
  const [ngaySinh, setNgaySinh] = useState<string>('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const { showEditModal, setShowEditModal, customFunction, maLop, studentToEdit } = props;
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
  useEffect(() => {
    if (studentToEdit) {
      setTenHs(studentToEdit.tenHs);
      if(studentToEdit.ngaySinh){
        setNgaySinh(studentToEdit.ngaySinh);
      const dateParts = studentToEdit.ngaySinh.split('/').map(part => parseInt(part));
      setBirthday(new Date(dateParts[2], dateParts[1] - 1, dateParts[0]));
      }

    }
  }, [studentToEdit]);



  const formatDate = (date: Date): string => {
    let day: string = date.getDate().toString().padStart(2, '0');
    let month: string = (date.getMonth() + 1).toString().padStart(2, '0');
    let year: string = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleSubmit = async () => {
    if (tenHs) {
      try {
        const token = getCookie('token');
        const apiUrl = `${config.apiUrl}/students/${maLop}`;
        const formData = {
            maHs: studentToEdit?.maHs,
          tenHs: tenHs,
          ngaySinh: ngaySinh,
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
          openMessageError('Network response was not ok');
        } else {
          handleCloseModal();
          customFunction();
          openMessageSuccess('Cập nhật thông tin học sinh thành công');
        }
      } catch (error) {
        // console.error('Error updating student:', error);
        openMessageError("Đã xảy ra lỗi")
      }
    } else {
        openMessageError("Vui lòng điền tên học sinh");
    }
  };

  return (
    <>{contextHolder}
    <Modal
      show={showEditModal}
      onHide={handleCloseModal}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa thông tin học sinh</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tên Học Sinh</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tên học sinh"
              value={tenHs}
              onChange={(e) => setTenHs(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ngày Sinh:</Form.Label>
            <DatePicker
              selected={birthday}
              onChange={(date) => {
                if (date) {
                  setBirthday(date);
                  setNgaySinh(formatDate(date));
                }
              }}
              dateFormat="dd/MM/yyyy"
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default EditStudents;
