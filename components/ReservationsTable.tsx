
import React from 'react';
import { Student } from '../types';
import { TrashIcon, WhatsAppIcon } from './Icons';

interface StudentsTableProps {
  students: Student[];
  onDeleteStudent: (studentCode: string) => void;
}

const StudentsTable: React.FC<StudentsTableProps> = ({ students, onDeleteStudent }) => {
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
            <th className="py-3 px-6 text-center text-sm font-bold text-gray-600 uppercase tracking-wider">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.studentCode} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-6 whitespace-nowrap">{student.studentName}</td>
              <td className="py-4 px-6 whitespace-nowrap" dir="ltr">{student.phoneNumber}</td>
              <td className="py-4 px-6 whitespace-nowrap">{student.studentCode}</td>
              <td className="py-4 px-6 whitespace-nowrap">{new Date(student.timestamp).toLocaleString('ar-EG')}</td>
              <td className="py-4 px-6 whitespace-nowrap text-center">
                <div className="flex items-center justify-center gap-2">
                    <a
                        href={`https://wa.me/${student.phoneNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 transition-colors p-2 rounded-full hover:bg-green-100"
                        aria-label={`إرسال رسالة واتساب إلى ${student.studentName}`}
                        title="إرسال رسالة واتساب"
                    >
                        <WhatsAppIcon />
                    </a>
                    <button 
                        onClick={() => onDeleteStudent(student.studentCode)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-100"
                        aria-label={`حذف الطالب ${student.studentName}`}
                        title="حذف الطالب"
                    >
                        <TrashIcon />
                    </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;
