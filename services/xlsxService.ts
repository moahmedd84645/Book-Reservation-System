
import { Student } from '../types';

declare const XLSX: any;

export const exportToExcel = (students: Student[], fileName:string): void => {
  if (typeof XLSX === 'undefined') {
    console.error("XLSX library is not loaded. Make sure it's included in your HTML.");
    alert("حدث خطأ أثناء محاولة تصدير الملف. يرجى المحاولة مرة أخرى.");
    return;
  }

  // 1. Title Row
  const title = [[`تقرير بيانات الطلاب - تاريخ ${new Date().toLocaleDateString('ar-EG')}`]];
  
  // 2. Header Row
  const headers = [['اسم الطالب', 'رقم التليفون', 'كود الطالب', 'تاريخ/وقت التسجيل']];
  
  // 3. Data Rows
  const data = students.map(student => ([
    student.studentName,
    student.phoneNumber,
    student.studentCode,
    new Date(student.timestamp).toLocaleString('ar-EG'),
  ]));

  // Combine all parts
  const aoa = [...title, [], ...headers, ...data]; // Add an empty row for spacing

  const worksheet = XLSX.utils.aoa_to_sheet(aoa);

  // Merge the title cell across the width of the headers
  if (worksheet) {
    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];
  }

  // Set column widths for better readability
  worksheet['!cols'] = [
    { wch: 30 }, // اسم الطالب
    { wch: 20 }, // رقم التليفون
    { wch: 20 }, // كود الطالب
    { wch: 30 }, // تاريخ/وقت التسجيل
  ];
  
  // Apply RTL direction to the sheet
  if (!worksheet['!props']) worksheet['!props'] = {};
  worksheet['!props'].RTL = true;


  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'بيانات الطلاب');

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
