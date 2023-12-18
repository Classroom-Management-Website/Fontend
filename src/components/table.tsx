import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPlus, faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import './tableStyles.css'; // CSS file import
import CreateClassrooms from './createClassrooms';
import { useState } from 'react';
import { getCookie } from '@/getCookie/getCookie';
import { useEffect } from 'react';
import useSWR, { Fetcher } from 'swr'
interface TableClassrooms {
  blogs:{
    maLop: number;
    tenLopHoc: string;
    lichHoc: string;
  }[];
  customFunction: () => void;
}

const Apptable = (props: TableClassrooms) => {
  const { blogs, customFunction } = props;
  const [showModelCreate,setShowModelCreate] = useState<boolean>(false)
  const handleDeleteClassrooms = async (maLop: number, tenLopHoc: string) => {
    try {
      const token = getCookie('token');
  
      const userConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa lớp học có tên ${tenLopHoc} không?`);
  
      if (!userConfirmed) {
        return; // User canceled the deletion
      }
  
      const response = await fetch(`http://localhost:8989/api/classrooms/${maLop}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        customFunction();
        alert(`Xóa thành công lớp học có tên ${tenLopHoc}.`);
      } else {
        alert('Đã có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error while deleting classroom:', error);
      alert('Đã có lỗi xảy ra');
    }
  };
  
  


  return (
    <>
      <Button variant="primary" className="mb-3 custom-button" onClick={()=>setShowModelCreate(true)}>
        <FontAwesomeIcon icon={faPlus} /> Thêm lớp học mới
      </Button>
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên Lớp</th>
            <th>Lịch Học</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{blog.tenLopHoc}</td>
              <td>{blog.lichHoc}</td>
              <td>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <Button variant="warning" size="sm">
                    <FontAwesomeIcon icon={faEdit} /> Chỉnh Sửa
                  </Button>
                  <Button variant="info" size="sm" href={`/home/${blog.maLop}`}>
                    <FontAwesomeIcon icon={faEye} /> Xem
                  </Button>
                  <Button variant="danger" size="sm" onClick={()=>handleDeleteClassrooms(blog.maLop, blog.tenLopHoc)}>
                    <FontAwesomeIcon icon={faTrash} /> Xóa
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <CreateClassrooms 
        showModelCreate={showModelCreate}
        setShowModelCreate={setShowModelCreate}
        customFunction={customFunction}
      />
    </>
  );
}

export default Apptable;
