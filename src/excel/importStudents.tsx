import * as XLSX from 'xlsx';
import { getCookie } from '@/getCookie/getCookie';

interface Student {
    tenHs: string;
    ngaySinh: string;
    soBuoiVang: number;
}

export function importStudent(maLop: number, customFunction: () => void) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (!target.files) return;

        try {
            const file = target.files[0];
            if (!file) throw new Error("Không có file nào được chọn.");

            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(worksheet, { raw: false });

            const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

            const formattedJson: Student[] = json.map((item: any) => {
                const tenHs = item['Tên Học Sinh'];
                let ngaySinh = item['Ngày Sinh'];
                const soBuoiVang = item['Số Buổi Vắng'];

                if (!tenHs) {
                    throw new Error("Không tồn tại tên học sinh");
                }

                if (ngaySinh) {
                    if (!dateRegex.test(ngaySinh)) {
                        throw new Error("Ngày sinh không đúng định dạng (dd/mm/yyyy)");
                    }
                }

                return {
                    tenHs,
                    ngaySinh,
                    soBuoiVang: parseInt(soBuoiVang, 10) || 0,
                };
            });

            console.log("check: ", formattedJson);

            try {
                const token = getCookie('token');
                const apiUrl = 'http://localhost:8989/api/students/import/' + maLop;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(formattedJson),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                } else {
                    alert('Thêm học sinh thành công');
                    customFunction();
                }
            } catch (error) {
                console.error('Error fetching classrooms:', error);
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message); // Hiển thị thông báo lỗi cho người dùng
                console.error(error);
            }
        }
    };

    input.click();
};
