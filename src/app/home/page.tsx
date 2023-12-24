// home/page.tsx
"use client"
import "./page.css";
import { useEffect } from 'react';
import React, { ChangeEvent, useState } from 'react';
import Apptable from '@/components/table';
import { useRouter } from 'next/navigation'
import { getCookie } from '@/getCookie/getCookie';
import deleteCookie from '@/getCookie/deleteCookie';
interface TeacherData {
  fullName: string;
  maGv: BigInteger;
  sdt: string;
  userName: string;
}

interface ClassroomData {
  maLop: number;
  tenLopHoc: string;
  lichHoc: string;
}


export default function Page() {
  const router = useRouter();
  const [classroomsData, setClassroomsData] = useState(null);
  const [isCoursesExpanded, setIsCoursesExpanded] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);

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

        if (response.ok) {
          // Token is valid
          setIsValidToken(true);
          setTeacherData(data.teacher); // Set teacher data here
        } else {
          router.push('/login');
          // Token is invalid, redirect to login or handle accordingly
          setIsValidToken(false);
          // You can redirect to the login page or show a login modal here
        }
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    // Call the function to check token validity
    checkTokenValidity();
  }, []); // Empty dependency array to run only once on component mount

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

      const data = await response.json();

      if (data && data.classrooms) {
        const classrooms = data.classrooms.map((classroom: ClassroomData) => ({
          maLop: classroom.maLop,
          tenLopHoc: classroom.tenLopHoc,
          lichHoc: classroom.lichHoc,
        }));
        setClassroomsData(classrooms);
        console.log('Classrooms data:', data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error as needed
    }
  };


  async function handleLogout() {
    deleteCookie('token')
    router.push('/login')
  }
  async function handleChangePassword() {
    router.push('/changePassword')
  }

  async function handleShowClassrooms() {
    if (teacherData && teacherData.maGv) {
      reloadTableData();
    }
  }


  return (
    <div className="main-container">
      <div className="sidebar-container">
        {isValidToken ? (
          <div>
            <div className='logo-big'>L&P</div>
            <div className='logo-small'>Lucky and Power</div>
            {teacherData && ( // Check if teacherData is not null
              <div className='menu'>
                <div className='menu-item' onClick={() => setIsMenuExpanded(!isMenuExpanded)}>
                  Chào {teacherData.fullName}
                </div>
                {isMenuExpanded && (
                  <div className='menu-container'>
                    <div className='menu-item children' onClick={() => handleLogout()}>Đăng xuất</div>
                    <div className='menu-item children' onClick={() => handleChangePassword()}>Đổi mật khẩu</div>
                  </div>
                )}
                {/* Other menu items */}
              </div>
            )}
            <div className='menu'>
              <div className='menu-item' onClick={() => setIsCoursesExpanded(!isCoursesExpanded)}>Menu</div>
              {isCoursesExpanded && (
                <div className='menu-container'>
                  <div className='menu-item children' onClick={() => handleShowClassrooms()}>Danh sách lớp học</div>
                </div>
              )}
              {/* Other menu items */}
            </div>

          </div>

        ) : (
          // Redirect to login or show login message
          <div>
            <p>You are not logged in. Redirecting to login...</p>
            {/* You can use React Router or other methods for redirection */}
          </div>
        )}
      </div>
        {classroomsData && <Apptable blogs={classroomsData} customFunction={reloadTableData} />}
    </div>
  );
}