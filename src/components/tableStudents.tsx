import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPlus, faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import './tableStyles.css'; // CSS file import
import { useState } from 'react';
import CreateStudents from './createStudents';

interface TableStudents {
  blogs:{
    maHs: number;
    tenHs: string;
    ngaySinh: string;
    soBuoiVang: number;
  }[];
  maLop: string;
}

const AppStudents = (props: TableStudents) => {
  const [showModelCreate,setShowModelCreate] = useState<boolean>(false)
  const { blogs,maLop } = props;
  return (
    <>
      <Button variant="primary" className="mb-3 custom-button" onClick={()=>setShowModelCreate(true)}>
        <FontAwesomeIcon icon={faPlus} /> Thêm học sinh mới
      </Button>
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên Học Sinh</th>
            <th>Ngày Sinh</th>
            <th>Số Buổi Vắng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{blog.tenHs}</td>
              <td>{blog.ngaySinh}</td>
              <td>{blog.soBuoiVang}</td>
              <td>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <Button variant="warning" size="sm">
                    <FontAwesomeIcon icon={faEdit} /> Chỉnh Sửa
                  </Button>
                  <Button variant="info" size="sm">
                    <FontAwesomeIcon icon={faEye} /> Xem
                  </Button>
                  <Button variant="danger" size="sm">
                    <FontAwesomeIcon icon={faTrash} /> Xóa
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <CreateStudents         
        showModelCreate={showModelCreate}
        setShowModelCreate={setShowModelCreate}
        maLop={maLop}/>
    </>
  );
}

export default AppStudents;
