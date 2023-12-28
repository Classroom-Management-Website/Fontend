import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Alert } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPlus, faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import './tableStyles.css'; // CSS file import
import CreateClassrooms from './createClassrooms';
import EditClassrooms from './editClassrooms';
import { useState } from 'react';
import { getCookie } from '@/getCookie/getCookie';
interface TableClassrooms {
  blogs: {
    maLop: number;
    tenLopHoc: string;
    lichHoc: string;
  }[];
  customFunction: () => void;
}
interface Classroom {
  maLop: number;
  tenLopHoc: string;
  lichHoc: string;
}

const Apptable = (props: TableClassrooms) => {
  const { blogs, customFunction } = props;
  const [showModelCreate, setShowModelCreate] = useState<boolean>(false)
  // Inside the Apptable component
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentClassroom, setCurrentClassroom] = useState<Classroom | null>(null);

  const handleEditClassroom = (classroom: Classroom) => {
    setCurrentClassroom(classroom);
    setShowEditModal(true);
  };
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
        throw new Error ('Đã có lỗi xảy ra');
      }
    } catch (error) {
      // console.error('Error while deleting classroom:', error);
      throw new Error ('Đã có lỗi xảy ra');
    }
  };




  return (

    <div className="container">
      <div className="content-container">
        <div className="header">
          <Button variant="primary" className="mb-3 custom-button" onClick={() => setShowModelCreate(true)}>
            <FontAwesomeIcon icon={faPlus} /> Thêm lớp học mới
          </Button>
        </div>
        <div className="table-container">
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
                      <Button variant="warning" size="sm" onClick={() => handleEditClassroom(blog)}>
                        <FontAwesomeIcon icon={faEdit} /> Chỉnh Sửa
                      </Button>
                      <Button variant="info" size="sm" href={`/home/${blog.maLop}`}>
                        <FontAwesomeIcon icon={faEye} /> Xem
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteClassrooms(blog.maLop, blog.tenLopHoc)}>
                        <FontAwesomeIcon icon={faTrash} /> Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

      </div>
      <CreateClassrooms
        showModelCreate={showModelCreate}
        setShowModelCreate={setShowModelCreate}
        customFunction={customFunction}
      />
      {
        currentClassroom && (
          <EditClassrooms
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            classroom={currentClassroom}
            refreshData={customFunction}
          />
        )
      }
    </div>


  );
}

export default Apptable;
