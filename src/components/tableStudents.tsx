import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faIdBadge, faEllipsisV, faPlus, faEdit, faEye, faTrash, faFilter, faCheckCircle, faDownload, faArrowRightToBracket, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import CreateStudents from './createStudents';
import EditStudents from './editStudents';
import { getCookie } from '@/getCookie/getCookie';
import { exportStudents } from '@/excel/exportStudents';
import { importStudent } from '@/excel/importStudents';
import { Button, Container, Col, Row, Navbar, Nav } from 'react-bootstrap';
import { message } from 'antd';
import { config } from '@/config/config';
import 'bootstrap/dist/css/bootstrap.min.css';
interface TableStudents {
  blogs: {
    maHs: number;
    tenHs: string;
    ngaySinh: string;
    soBuoiVang: number;
    thongTinBuoiVang: string,
  }[];
  maLop: number;
  tenLopHoc: string;
  thongTinDiemDanh: string;
  lichHoc: string;
  customFunction: () => void;
}

const AppStudents = (props: TableStudents) => {

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [studentToEdit, setStudentToEdit] = useState<any>(null);  // Adjust the type as necessary
  const [showModelCreate, setShowModelCreate] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedBlogs, setSortedBlogs] = useState(props.blogs);
  const { maLop, tenLopHoc, lichHoc, customFunction, thongTinDiemDanh } = props;
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
    setSortedBlogs(props.blogs);
  }, [props.blogs]);


  const parseAttendanceInfo = (thongTinDiemDanh: string | null) => {
    if (!thongTinDiemDanh) return [];

    try {
      const attendanceArray = JSON.parse(thongTinDiemDanh) as string[];
      return attendanceArray.map(info => {
        const date = info;
        return date;
      });
    } catch (error) {
      console.error("Error parsing attendance information", error);
      return [];
    }
  };
  const parseAttendanceInfo2 = (thongTinBuoiVang: string | null) => {
    if (!thongTinBuoiVang) return [];

    try {
      const attendanceArray = JSON.parse(thongTinBuoiVang) as { date: string; count: string }[];

      return attendanceArray.map(({ date, count }) => ({ date, count }));
    } catch (error) {
      console.error("Error parsing attendance information", error);
      return [];
    }
  };




// Hàm lấy tên từ chuỗi tên đầy đủ
const getFirstName = (fullName: string) => {
  const parts = fullName.trim().split(' ');
  return parts.length > 0 ? parts[parts.length - 1] : '';
};

// Hàm chuẩn hóa tên tiếng Việt
const normalizeVietnameseName = (name: string) => {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

// Hàm so sánh tên tiếng Việt
const compareVietnameseNames = (a: string, b: string, sortOrder: string) => {
  const nameA = normalizeVietnameseName(getFirstName(a));
  const nameB = normalizeVietnameseName(getFirstName(b));

  if (sortOrder === 'asc') {
    return nameA.localeCompare(nameB);
  } else {
    return nameB.localeCompare(nameA);
  }
};

// Hàm sắp xếp
const sortByName = () => {
  const sorted = [...sortedBlogs].sort((a, b) => 
    compareVietnameseNames(a.tenHs, b.tenHs, sortOrder)
  );

  setSortedBlogs(sorted);
  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
};

  const handleAttendanceClickForZero = (blog: any, info: any) => {
    handleAttendanceClick(blog, info, '1', 1);
  };

  const handleAttendanceClickForOne = (blog: any, info: any) => {
    handleAttendanceClick(blog, info, '0', -1);
  };

  const handleAttendanceClick = async (blog: any, info: any, newCount: string, newSoBuoiVang: number) => {
    const updatedBlogs = [...sortedBlogs];

    const index = updatedBlogs.findIndex((item) => item.maHs === blog.maHs);

    if (index !== -1) {
      const updatedThongTinBuoiVang = JSON.parse(JSON.stringify(parseAttendanceInfo2(blog.thongTinBuoiVang)));
      const matchingInfoIndex = updatedThongTinBuoiVang.findIndex((item: any) => item.date === info);

      if (matchingInfoIndex !== -1) {
        updatedThongTinBuoiVang[matchingInfoIndex].count = newCount;
        updatedBlogs[index].soBuoiVang += newSoBuoiVang;

        // Chuyển mảng thành chuỗi JSON
        updatedBlogs[index].thongTinBuoiVang = JSON.stringify(updatedThongTinBuoiVang);

        try {
          const token = getCookie('token');
          const apiUrl = `${config.apiUrl}/students/${maLop}`;

          // Tạo đối tượng formData
          const formData = {
            maHs: updatedBlogs.map(blog => blog.maHs)[index],
            tenHs: updatedBlogs.map(blog => blog.tenHs)[index],
            ngaySinh: updatedBlogs.map(blog => blog.ngaySinh)[index],
            soBuoiVang: updatedBlogs.map(blog => blog.soBuoiVang)[index],
            thongTinBuoiVang: updatedBlogs.map(blog => blog.thongTinBuoiVang)[index],
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
            throw new Error('Network response was not ok');
          } else {
            customFunction();
          }
        } catch (error) {
          console.error('Error fetching classrooms:', error);
        }
      }
    }
  };


  
  const handleDeleteStudent = async (maHs: number, tenHs: string) => {
    try {
      const token = getCookie('token');

      const userConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa học sinh có tên ${tenHs} không?`);

      if (!userConfirmed) {
        return; // User canceled the deletion
      }
      const formData = {
        maHs: maHs
      };
      const response = await fetch(`${config.apiUrl}/students/${maLop}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        customFunction();
        openMessageSuccess(`Xóa thành công học sinh có tên ${tenHs}.`);
      } else {
        openMessageError('Đã có lỗi xảy ra');
      }
    } catch (error) {
      // console.error('Error while deleting classroom:', error);
      openMessageError('Đã có lỗi xảy ra');
    }
  };


  const handleEditStudent = (student: any) => {
    setStudentToEdit(student);
    setShowEditModal(true);
  };


  return (
    <>{contextHolder}
        <>
          <Table striped bordered hover >
            <thead >
              <tr>
                <th>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>STT</div>
                  </th>
                <th onClick={sortByName}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>Tên Học Sinh <FontAwesomeIcon icon={faFilter} /></div>
                </th>
                <th>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>Ngày Sinh </div>
                  
                  </th>
                {parseAttendanceInfo(thongTinDiemDanh).map((info, index) => (
                  <th key={index}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>{info}</div>
                    
                    </th>
                ))}
                <th><div style={{ display: 'flex', justifyContent: 'center' }}>Số Buổi Vắng</div> </th>
                <th><div style={{ display: 'flex', justifyContent: 'center' }}>Hành động</div></th>
              </tr>
            </thead>
            <tbody>
              {sortedBlogs.map((blog, index) => (
                <tr key={index}>
                  <td><div style={{ display: 'flex', justifyContent: 'center' }}>{index + 1}</div></td>
                  <td><div style={{ display: 'flex', justifyContent: 'center' }}>{blog.tenHs}</div> </td>
                  <td><div style={{ display: 'flex', justifyContent: 'center' }}>{blog.ngaySinh}</div></td>
                  {parseAttendanceInfo(thongTinDiemDanh).map((info, idx) => {
                    const matchingInfo = parseAttendanceInfo2(blog.thongTinBuoiVang).find(
                      (item) => item.date === info
                    );
                    return (
                      <td
                        key={idx}
                        onClick={() => {
                          if (matchingInfo) {
                            if (matchingInfo.count == '0') {
                              handleAttendanceClickForZero(blog, info);
                            }
                            else if (matchingInfo.count == '1') {
                              handleAttendanceClickForOne(blog, info);
                            }
                          }
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'center' }}>{matchingInfo ? matchingInfo.count : ''}</div>
                        
                      </td>
                    );
                  })}
                  <td><div style={{ display: 'flex', justifyContent: 'center' }}>{blog.soBuoiVang}</div> </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <Button variant="warning" size="sm" onClick={() => handleEditStudent(blog)}>
                        <FontAwesomeIcon icon={faEdit} /> Chỉnh Sửa
                      </Button>

                      <Button variant="danger" size="sm" onClick={() => handleDeleteStudent(blog.maHs, blog.tenHs)}>
                        <FontAwesomeIcon icon={faTrash} /> Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
        <CreateStudents
          showModelCreate={showModelCreate}
          setShowModelCreate={setShowModelCreate}
          maLop={maLop}
          customFunction={customFunction}
        />
        <EditStudents
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          customFunction={customFunction}
          maLop={maLop}
          studentToEdit={studentToEdit}
        />
    </>
  );
}

export default AppStudents;

