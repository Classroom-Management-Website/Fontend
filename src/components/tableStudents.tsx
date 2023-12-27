import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faIdBadge, faEllipsisV, faPlus, faEdit, faEye, faTrash, faFilter, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './tableStyles.css'; // CSS file import
import { useState, useEffect } from 'react';
import CreateStudents from './createStudents';
import { getCookie } from '@/getCookie/getCookie';

interface TableStudents {
  blogs: {
    maHs: number;
    tenHs: string;
    ngaySinh: string;
    soBuoiVang: number;
    thongTinBuoiVang: string,
  }[];
  maLop: string;
  thongTinDiemDanh: string;
  customFunction: () => void;
}

const AppStudents = (props: TableStudents) => {
  let thoiGianVang = '';
  let danhSachMaHs = [];
  const [showModelCreate, setShowModelCreate] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedBlogs, setSortedBlogs] = useState(props.blogs);
  const { maLop, customFunction, thongTinDiemDanh } = props;
  const [currentTime, setCurrentTime] = useState<string>('');

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
      const attendanceArray = JSON.parse(thongTinBuoiVang) as string[];
      return attendanceArray.map(info => {
        const [date, count] = info.split('-');
        return { date, count };
      });
    } catch (error) {
      console.error("Error parsing attendance information", error);
      return [];
    }
  };


  // Sorting function
  const sortByName = () => {
    const sorted = [...sortedBlogs].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.tenHs.localeCompare(b.tenHs);
      } else {
        return b.tenHs.localeCompare(a.tenHs);
      }
    });

    setSortedBlogs(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  const handleAttendanceColumnClick = async () => {

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();



    danhSachMaHs = props.blogs.map(blog => blog.maHs);
    thoiGianVang = `${formattedDate} ${formattedTime}`;
    console.log(thoiGianVang)
    try {
      const token = getCookie('token');
      const apiUrl = `http://localhost:8989/api/classrooms/diemdanh/${maLop}`;

      // Tạo đối tượng formData
      const formData = {
        thoiGianDiemDanh: thoiGianVang,
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
      console.error('Error fetching students:', error);
    }
    try {
      const token = getCookie('token');
      const apiUrl = `http://localhost:8989/api/students/diemdanh/${maLop}`;

      // Tạo đối tượng formData
      const formData = {
        danhSachMaHs: danhSachMaHs,
        thoiGianVang: `${thoiGianVang}-0`,
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
      console.error('Error fetching students:', error);
    }
    setCurrentTime(`${formattedDate} ${formattedTime}`);
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
      const response = await fetch(`http://localhost:8989/api/students/${maLop}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        customFunction();
        alert(`Xóa thành công học sinh có tên ${tenHs}.`);
      } else {
        alert('Đã có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error while deleting classroom:', error);
      alert('Đã có lỗi xảy ra');
    }
  };
  return (
    <div className="container leduoi">
      <div className="content-container">
        <div className="header">
          <Button variant="primary" className="mb-3 custom-button" onClick={() => setShowModelCreate(true)}>
            <FontAwesomeIcon icon={faPlus} /> Thêm học sinh mới
          </Button>
          <Button variant="primary" className="mb-3 custom-button" onClick={handleAttendanceColumnClick}>
            <FontAwesomeIcon icon={faIdBadge} /> Điểm danh
          </Button>
        </div>
        <div className="table-container">
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>STT</th>
                <th style={{ cursor: 'pointer' }} onClick={sortByName}>
                  Tên Học Sinh <FontAwesomeIcon icon={faFilter} />
                </th>
                <th>Ngày Sinh</th>
                {parseAttendanceInfo(thongTinDiemDanh).map((info, index) => (
                  <th key={index}>{info}</th>
                ))}
                <th>Số Buổi Vắng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedBlogs.map((blog, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{blog.tenHs}</td>
                  <td>{blog.ngaySinh}</td>
                  {parseAttendanceInfo(thongTinDiemDanh).map((info, idx) => {
                    const matchingInfo: {
                      date: string;
                      count: string;
                    } | undefined = parseAttendanceInfo2(blog.thongTinBuoiVang).find(
                      (item) => item.date === info
                    );
                    return (
                      <td
                        key={idx}
                        onClick={() => {
                          if (matchingInfo) {
                            if(matchingInfo.count == '0'){
                              console.log(`Cell clicked with count: ${matchingInfo.date}-1 ${blog.thongTinBuoiVang} ${blog.maHs}`);
                            }
                            else if(matchingInfo.count == '1'){
                              console.log(`Cell clicked with count: ${matchingInfo.date}-0 ${blog.thongTinBuoiVang} ${blog.maHs}`);
                            }
                          }
                        }}
                      >
                        {matchingInfo ? matchingInfo.count : ''}
                      </td>
                    );
                  })}
                  <td>{blog.soBuoiVang}</td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <Button variant="warning" size="sm">
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
        </div>
        <CreateStudents
          showModelCreate={showModelCreate}
          setShowModelCreate={setShowModelCreate}
          maLop={maLop}
          customFunction={customFunction}
        />
      </div>
    </div>
  );
}

export default AppStudents;

