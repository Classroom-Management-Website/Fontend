"use client"
import { useEffect } from 'react';
import React, { ChangeEvent, useState } from 'react';
import useSWR, { Fetcher } from 'swr'
import { getCookie } from '@/getCookie/getCookie';
import AppStudents from '@/components/tableStudents';

interface ClassroomData {
  tenLopHoc: string;
  lichHoc: string;
}

const ViewClassrooms = ({ params }: { params: { id: string } }) => {

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
    <div>
      {error ? (
        <p>Đường dẫn không hợp lệ.</p>
      ) : (
        studentsData && classroomData && (
          <div>
            <div style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f0f0f0' }}>
              <h1>Lớp học: {classroomData.tenLopHoc}</h1>
              <h2>Thời gian: {classroomData.lichHoc}</h2>
            </div>
            <div style={{ overflowY: 'auto' }}>
              <AppStudents blogs={studentsData} maLop={maLop} customFunction={reloadStudents} />
            </div>
          </div>
        )

      )}
    </div>
  );
}

export default ViewClassrooms;
