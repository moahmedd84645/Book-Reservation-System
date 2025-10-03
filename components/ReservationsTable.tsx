import React from 'react';
import { Student } from '../types';

interface StudentsTableProps {
  students: Student[];
}

const StudentsTable: React.FC<StudentsTableProps> = ({ students }) => {
  if (students.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">لا يوجد طلاب مسجلون حتى الآن.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-6 text-right text-sm font-bold text-gray-600 uppercase tracking-wider">اسم الطالب</th>
            <th className="py-3 px-6 text-right text-sm font-bold text-gray-600 uppercase tracking-wider">رقم التليفون</th>
            <th className="py-3 px-6 text-right text-sm font-bold text-gray-600 uppercase tracking-wider">كود الطالب</th>
            <th className="py-3 px-6 text-right text-sm font-bold text-gray-600 uppercase tracking-wider">تاريخ/وقت التسجيل</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.studentCode} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-6 whitespace-nowrap">{student.studentName}</td>
              <td className="py-4 px-6 whitespace-nowrap">{student.phoneNumber}</td>
              <td className="py-4 px-6 whitespace-nowrap">{student.studentCode}</td>
              <td className="py-4 px-6 whitespace-nowrap">{new Date(student.timestamp).toLocaleString('ar-EG')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;