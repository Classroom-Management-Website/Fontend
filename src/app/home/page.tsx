// home/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import {
  BankOutlined,
  YoutubeOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  SolutionOutlined,
  FontSizeOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useRouter } from 'next/navigation'
import { getCookie } from '@/getCookie/getCookie';
import deleteCookie from '@/getCookie/deleteCookie';
import Apptable from '@/components/table';
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];
interface TeacherData {
  fullName: string;
  maGv: BigInteger;
  sdt: string;
  userName: string;
}
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('HDSD', '1', <YoutubeOutlined />),
  getItem('Ủng hộ tác giả', '2', <BankOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Đăng xuất', '3', <LogoutOutlined />),
    getItem('Đổi mật khẩu', '4', <UserSwitchOutlined />),
  ]),
  getItem('Menu', 'sub2', <TeamOutlined />, [getItem('Lớp học', '5', <SolutionOutlined />)]),
];

const App: React.FC = () => {
  const router = useRouter();
  const [text, setText] = React.useState('https://ant.design/');
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [classroomsData, setClassroomsData] = useState(null);

  useEffect(() => {
    // Function to check the token
    const checkTokenValidity = async () => {
      try {
        const token = getCookie('token');
        const response = await fetch('http://localhost:8989/api/teachers/auth/me', {
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
  const reloadTableData = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch('http://localhost:8989/api/classrooms', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      else {
        const data = await response.json();
        // console.log('Classrooms data:', data);
        setClassroomsData(data);
      }


    } catch (error) {
      alert('Error fetching data');
    }
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleClick = ({ key }: { key: React.Key }) => {
    if (key == 3) {
      deleteCookie('token');
      router.push('/login');
    }
    else if (key == 5) {
      reloadTableData();
    }
    else if (key == 4) {
      router.push('/changePassword');
    }
    else if (key == 2) {
      window.location.href = 'https://me.momo.vn/unghotacgia';
    }

  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: '60px' }}>
          <h1>L&P</h1>
        </div>
        <Menu onClick={handleClick}
          theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: '10px 20px', background: colorBgContainer }}><h3>Chào mừng {teacherData?.fullName} đến với trang quản lý lớp học</h3></Header>

        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '10px 0' }}>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 60,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {classroomsData ? (
              <Apptable blogs={classroomsData} customFunction={reloadTableData} />
            ) : (
              <h3>Trang chủ</h3>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Bản quyền thuộc về (L&P)</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
