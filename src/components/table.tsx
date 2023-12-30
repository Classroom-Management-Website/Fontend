import { message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPlus, faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import CreateClassrooms from './createClassrooms';
import EditClassrooms from './editClassrooms';
import { useState } from 'react';
import { getCookie } from '@/getCookie/getCookie';
import { useRouter } from 'next/navigation';
import { Button,Table, Container, Col, Row, Navbar, Nav } from 'react-bootstrap';
import { config } from '@/config/config';
import 'bootstrap/dist/css/bootstrap.min.css';
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
  const router = useRouter();
  const { blogs, customFunction } = props;
  const [showModelCreate, setShowModelCreate] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentClassroom, setCurrentClassroom] = useState<Classroom | null>(null);
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

      const response = await fetch(`${config.apiUrl}/classrooms/${maLop}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        customFunction();
        openMessageSuccess(`Xóa thành công lớp học: ${tenLopHoc}`);
      } else {
        openMessageError('Đã có lỗi xảy ra');
      }
    } catch (error) {
      // console.error('Error while deleting classroom:', error);
      openMessageError('Đã có lỗi xảy ra');
    }
  };
  const handleViewStudents =(maLop:number)=>{
    router.push(`/home/${maLop}`)
  };



  return (
    <>
    {contextHolder}
      <>
        <div>
          <Button variant="primary" className="mb-3" onClick={() => setShowModelCreate(true)}>
            <FontAwesomeIcon icon={faPlus} /> Thêm lớp học mới
          </Button>
        </div>
        <Container>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th><div style={{ display: 'flex', justifyContent: 'center' }}>STT</div></th>
                <th><div style={{ display: 'flex', justifyContent: 'center' }}>Tên Lớp</div></th>
                <th><div style={{ display: 'flex', justifyContent: 'center' }}>Thời gian</div></th>
                <th><div style={{ display: 'flex', justifyContent: 'center' }}>Hành Động</div></th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => (
                <tr key={index}>
                  <td><div style={{ display: 'flex', justifyContent: 'center' }}>{index + 1}</div></td>
                  <td><div style={{ display: 'flex', justifyContent: 'center' }}>{blog.tenLopHoc}</div></td>
                  <td><div style={{ display: 'flex', justifyContent: 'center' }}>{blog.lichHoc}</div></td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <Button variant="warning" size="sm" onClick={() => handleEditClassroom(blog)}>
                        <FontAwesomeIcon icon={faEdit} /> Chỉnh Sửa
                      </Button>
                      <Button variant="info" size="sm" onClick={() => handleViewStudents(blog.maLop)}>
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
        </Container>

      </>
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
    </>


  );
}

export default Apptable;
