"use client"
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useEffect } from 'react';
import React, { ChangeEvent, useState } from 'react';
import { Button, Container, Col, Row, Navbar, Nav } from 'react-bootstrap';
import { getCookie } from '@/getCookie/getCookie';
import { exportStudents } from '@/excel/exportStudents';
import { importStudent } from '@/excel/importStudents';
import AppStudents from '@/components/tableStudents';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  ExportOutlined,
  DownloadOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  TeamOutlined,
} from '@ant-design/icons';
const { Header, Content, Footer } = Layout;
interface ClassroomData {
  tenLopHoc: string;
  lichHoc: string;
  thongTinDiemDanh: string;
}
const items = [
  { key: 1, label: 'Thêm Học Sinh Mới',icon: <UserAddOutlined />},
  { key: 2, label: 'Thêm Học Sinh Bằng Excel',icon:<UsergroupAddOutlined /> },
  { key: 3, label: 'File Excel Mẫu',icon:<DownloadOutlined /> },
  { key: 4, label: 'Xuất Danh Sách Học Sinh',icon:<ExportOutlined /> },
  { key: 5, label: 'Điểm Danh',icon:<TeamOutlined /> },
];

const ViewClassrooms = ({ params }: { params: { id: number } }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const maLop = params.id
  const [studentsData, setStudentsData] = useState(null);
  const [error, setError] = useState(false);
  const [classroomData, setClassroomData] = useState<ClassroomData | null>(null);
  const reloadStudents = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`http://localhost:8989/api/students/${maLop}`, {
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
        console.log("check: ",data);
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
  const handleClick = ({ key }: { key: React.Key }) => {
    if (key == 1) {

    }
    else if (key == 2) {
      importStudent(maLop,reloadStudents);
    }
    else if (key == 3){
      const filePath = '/form.xlsx';

      // Tạo một thẻ <a> để tải file
      const link = document.createElement('a');
      link.href = filePath;
      link.download = 'form.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    else if (key == 4){

    }
    else if (key == 5){

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
        <div className="demo-logo" />
        <Menu onClick={handleClick}
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['5']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb items={items} style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
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
