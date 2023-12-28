"use client"
import { useEffect } from 'react';
import React, { ChangeEvent, useState } from 'react';
import { Button, Container, Col, Row, Navbar, Nav } from 'react-bootstrap';
import { getCookie } from '@/getCookie/getCookie';
import AppStudents from '@/components/tableStudents';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ClassroomData {
  tenLopHoc: string;
  lichHoc: string;
  thongTinDiemDanh: string;
}

const ViewClassrooms = ({ params }: { params: { id: number } }) => {

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
  return (
    <>
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
    </>
  );
}

export default ViewClassrooms;
