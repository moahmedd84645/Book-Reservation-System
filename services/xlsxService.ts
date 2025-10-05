
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

export const importFromExcel = (file: File): Promise<{ studentName: string; phoneNumber: string; }[]> => {
  return new Promise((resolve, reject) => {
    if (typeof XLSX === 'undefined') {
      console.error("XLSX library is not loaded.");
      reject(new Error("XLSX library is not loaded."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (!json || json.length < 1) {
          reject(new Error("ملف Excel فارغ أو لا يحتوي على صفوف."));
          return;
        }

        const headerRow = (json[0] as any[]) || [];
        // Make header matching more robust by trimming whitespace and handling non-string values
        const nameIndex = headerRow.findIndex(h => h && h.toString().trim().includes('اسم الطالب'));
        const phoneIndex = headerRow.findIndex(h => h && h.toString().trim().includes('رقم التليفون'));

        if (nameIndex === -1 || phoneIndex === -1) {
          const missingColumns: string[] = [];
          if (nameIndex === -1) missingColumns.push("'اسم الطالب'");
          if (phoneIndex === -1) missingColumns.push("'رقم التليفون'");
          
          reject(new Error(`الملف يجب أن يحتوي على الأعمدة التالية: ${missingColumns.join(' و ')}.`));
          return;
        }

        const importedStudents = (json.slice(1) as (string|number)[][])
          .map(row => {
            // Ensure row is an array before trying to access by index
            if (!Array.isArray(row)) return null;
            return {
              studentName: (row[nameIndex] || '').toString().trim(),
              phoneNumber: (row[phoneIndex] || '').toString().trim(),
            }
          })
          .filter((student): student is { studentName: string; phoneNumber: string; } => 
            student !== null && !!student.studentName && !!student.phoneNumber
          );

        resolve(importedStudents);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        reject(new Error("حدث خطأ أثناء قراءة ملف Excel. تأكد من أن الملف غير تالف."));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsBinaryString(file);
  });
};
