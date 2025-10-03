
import { Reservation } from '../types';

declare const XLSX: any;

export const exportToExcel = (reservations: Reservation[], fileName: string): void => {
  if (typeof XLSX === 'undefined') {
    console.error("XLSX library is not loaded. Make sure it's included in your HTML.");
    alert("حدث خطأ أثناء محاولة تصدير الملف. يرجى المحاولة مرة أخرى.");
    return;
  }
  
  const formattedData = reservations.map(res => ({
    'اسم الطالب': res.studentName,
    'رقم التليفون': res.phoneNumber,
    'كود الطالب': res.studentId,
    'تاريخ/وقت الحجز': new Date(res.timestamp).toLocaleString('ar-EG'),
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'الحجوزات');

  // Set column widths for better readability
  worksheet['!cols'] = [
    { wch: 25 }, // اسم الطالب
    { wch: 15 }, // رقم التليفون
    { wch: 15 }, // كود الطالب
    { wch: 25 }, // تاريخ/وقت الحجز
  ];

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
