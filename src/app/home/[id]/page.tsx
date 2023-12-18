"use client"
import { useEffect } from 'react';
import React, { ChangeEvent, useState } from 'react';
import useSWR, { Fetcher } from 'swr'
import { getCookie } from '@/getCookie/getCookie';
import AppStudents from '@/components/tableStudents';
import CreateStudents from '@/components/createStudents';



const ViewClassrooms = ({params}:{params:{id:string}}) => {

  const maLop = params.id
  const [studentsData, setStudentsData] = useState(null);
  const [error, setError] = useState(null);

  const fetcher = (url: string) => {
    const token = getCookie('token');
    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Unauthorized'); // or handle other errors
      }
      return res.json();
    })
    .catch(error => {
      setError(error.message);
      throw error;
    });
  };

  const { data } = useSWR('http://localhost:8989/api/students/'+maLop, fetcher);

  useEffect(() => {
    if (data) {
      console.log("check: ",data)
      setStudentsData(data);
    }
    // Handle error here if needed
  }, [data]);
  return (
    <div>
      {error && error === 'Unauthorized' ? (
        <p>Đường dẫn không hợp lệ.</p>
      ) : (
        studentsData && 
        <AppStudents blogs={studentsData} maLop={maLop}/>
      )}
    </div>
  );
}

export default ViewClassrooms;
