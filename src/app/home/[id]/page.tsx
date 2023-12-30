"use client"
import { Breadcrumb, Layout, Menu, theme, Avatar, Space, Dropdown,message,Tooltip } from 'antd';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useState } from 'react';
import { Button, Container, Col, Row, Navbar, Nav } from 'react-bootstrap';
import { getCookie } from '@/getCookie/getCookie';
import { exportStudents } from '@/excel/exportStudents';
import { importStudent } from '@/excel/importStudents';
import AppStudents from '@/components/tableStudents';
import CreateStudents from '@/components/createStudents';
import deleteCookie from '@/getCookie/deleteCookie';
import type { MenuProps } from 'antd';
import { config } from '@/config/config';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  ExportOutlined,
  DownloadOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  TeamOutlined,
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  DownOutlined,
} from '@ant-design/icons';
const { Header, Content, Footer } = Layout;
interface ClassroomData {
  tenLopHoc: string;
  lichHoc: string;
  thongTinDiemDanh: string;
}
interface TeacherData {
  fullName: string;
  maGv: BigInteger;
  sdt: string;
  userName: string;
}
interface studentsData {
  maHs: number;
  tenHs: string;
  ngaySinh: string;
  soBuoiVang: number;
  thongTinBuoiVang: string,
}
const items2 = [
  { key: 6, label: 'Trang chủ', icon: <HomeOutlined /> },
  { key: 1, label: 'Thêm Học Sinh Mới', icon: <UserAddOutlined /> },
  { key: 2, label: 'Thêm Học Sinh Bằng Excel', icon: <UsergroupAddOutlined /> },
  { key: 3, label: 'File Excel Mẫu', icon: <DownloadOutlined /> },
  { key: 4, label: 'Xuất Danh Sách Học Sinh', icon: <ExportOutlined /> },
  { key: 5, label: 'Điểm Danh', icon: <TeamOutlined /> },
];



const items: MenuProps['items'] = [
  {
    label: 'Đăng xuất',
    key: '1',
    icon: <LogoutOutlined />,
  },
  {
    label: 'Đổi mật khẩu',
    key: '2',
    icon: <UserSwitchOutlined />,
  },
];
const ViewClassrooms = ({ params }: { params: { id: number } }) => {
  let thoiGianVang = '';
  let danhSachMaHs = [];
  const router = useRouter();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const maLop = params.id

  const [studentsData, setStudentsData] = useState<studentsData[] | null>(null);
  const [error, setError] = useState(false);
  const [classroomData, setClassroomData] = useState<ClassroomData | null>(null);
  const [showModelCreate, setShowModelCreate] = useState<boolean>(false);
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  useEffect(() => {
    // Function to check the token
    const checkTokenValidity = async () => {
      try {
        const token = getCookie('token');
        const response = await fetch(`${config.apiUrl}/teachers/auth/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        // console.log(data)
        if (response.ok) {
          // Token is valid
          // setIsValidToken(true);
          setTeacherData(data.teacher); // Set teacher data here
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    // Call the function to check token validity
    checkTokenValidity();
  }, []);
  const reloadStudents = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${config.apiUrl}/students/${maLop}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        setError(true);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data) {
        // console.log("check: ", data);
        setStudentsData(data.students);
        setClassroomData(data.classroom);
      }
    }
    catch (error) {
      console.error('Error fetching data:', error);
      setError(true);
    }

  };
  useEffect(() => {
    reloadStudents();
  }, []);
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if(key == '1'){
      deleteCookie('token');
      router.push('/login');
    }
    else if(key == '2'){
      router.push('/changePassword');
    }
  };
  const handleAttendanceColumnClick = async () => {

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    // console.log("check::", studentsData)
    if (studentsData) {
      if (studentsData?.length > 0) {
        danhSachMaHs = studentsData.map(blog => blog.maHs);
        thoiGianVang = `${formattedDate} ${formattedTime}`;
        // console.log(thoiGianVang, danhSachMaHs)
        try {
          const token = getCookie('token');
          const apiUrl = `${config.apiUrl}/classrooms/diemdanh/${maLop}`;

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
            reloadStudents();
          }
        } catch (error) {
          console.error('Error fetching students:', error);
        }
        try {
          const token = getCookie('token');
          const apiUrl = `${config.apiUrl}/students/diemdanh/${maLop}`;

          // Tạo đối tượng formData
          const formData = {
            danhSachMaHs: danhSachMaHs,
            thoiGianVang:
              { date: thoiGianVang, count: '0' },
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
            reloadStudents();
          }
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      } else {
        alert("Không có học sinh nào để điểm danh")
      }
    } else {
      alert("Đã xảy ra lỗi không xác định")
    }
  };
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

  const handleExport = () => {
    if (classroomData && studentsData) {
      if (studentsData.length > 0) {
        const sorted = [...studentsData].sort((a, b) => 
        compareVietnameseNames(a.tenHs, b.tenHs, 'asc')
      );
        const tenFile = `${classroomData.tenLopHoc} ${classroomData.lichHoc}`;
        const exportData = sorted.map((student, index) => {
          const studentData: any = {
            'STT': index + 1,
            'Tên Học Sinh': student.tenHs,
            'Ngày Sinh': student.ngaySinh,
            'Số Buổi Vắng': student.soBuoiVang,
          };

          // Add attendance information for each date
          parseAttendanceInfo(classroomData.thongTinDiemDanh).forEach((info) => {
            const matchingInfo = parseAttendanceInfo2(student.thongTinBuoiVang).find(item => item.date === info);
            studentData[`${info}`] = matchingInfo ? matchingInfo.count : '';
          });

          return studentData;
        });

        exportStudents(exportData, tenFile);
      } else {
        alert('Không có học sinh nào')
      }

    } else {
      alert('Đã xảy ra lỗi không xác định')
    }

  };
  const handleClick = ({ key }: { key: React.Key }) => {
    if (key == 1) {
      setShowModelCreate(true);
      // console.log(key)
    }
    else if (key == 2) {
      importStudent(maLop, reloadStudents);
    }
    else if (key == 3) {
      const filePath = '/form.xlsx';

      // Tạo một thẻ <a> để tải file
      const link = document.createElement('a');
      link.href = filePath;
      link.download = 'form.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    else if (key == 4) {
      handleExport();
    }
    else if (key == 5) {
      handleAttendanceColumnClick();
    }
    else if (key == 6) {
      router.push("/home")
    };

  };
  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '60px' }}>Logo</div>
        <Menu onClick={handleClick}
          theme="dark"
          mode="horizontal"
          items={items2}
          style={{ flex: 1, minWidth: 0 }}
        />
  <Dropdown menu={{ items, onClick }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        {teacherData?.fullName}
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
          

      </Header>
      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>

        </Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 430,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >

          {error ? (
            <p>Đường dẫn không hợp lệ.</p>
          ) : (
            studentsData && classroomData && (
              <>
                <Container>
                  <h1>Lớp học: {classroomData.tenLopHoc}</h1>
                  <h2>Thời gian: {classroomData.lichHoc}</h2>

                </Container>
                <Container>
                  <AppStudents blogs={studentsData} maLop={maLop} tenLopHoc={classroomData.tenLopHoc} lichHoc={classroomData.lichHoc} thongTinDiemDanh={classroomData.thongTinDiemDanh} customFunction={reloadStudents} />
                </Container>
                <Container>
                  <CreateStudents
                    showModelCreate={showModelCreate}
                    setShowModelCreate={setShowModelCreate}
                    maLop={maLop}
                    customFunction={reloadStudents}
                  /></Container>
              </>
            )
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Bản quyền thuộc về (L&P)</Footer>
    </Layout>
  );
};

export default ViewClassrooms;
