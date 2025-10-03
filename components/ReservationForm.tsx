
import React, { useState } from 'react';
import { Student } from '../types';
import { UserIcon, PhoneIcon, PlusCircleIcon, AlertTriangleIcon, CalendarIcon } from './Icons';

interface StudentFormProps {
  onAddStudent: (student: Omit<Student, 'studentCode'>) => void;
}

// Helper to format date for datetime-local input
const toDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


const StudentForm: React.FC<StudentFormProps> = ({ onAddStudent }) => {
  const [studentName, setStudentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timestamp, setTimestamp] = useState(toDateTimeLocal(new Date()));
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const resetForm = () => {
    setStudentName('');
    setPhoneNumber('');
    setTimestamp(toDateTimeLocal(new Date()));
    setValidationError(null);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      setValidationError('اسم الطالب لا يمكن أن يكون فارغاً.');
      return;
    }
    if (!/^\d{7,15}$/.test(phoneNumber)) {
      setValidationError('رقم التليفون يجب أن يتكون من 7 إلى 15 رقماً.');
      return;
    }
    if (!timestamp) {
        setValidationError('يرجى تحديد تاريخ ووقت التسجيل.');
        return;
    }

    onAddStudent({ studentName, phoneNumber, timestamp: new Date(timestamp).toISOString() });
    resetForm();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">إضافة طالب جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label htmlFor="student-name" className="block text-sm font-medium text-gray-700 mb-1">اسم الطالب</label>
          <div className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center pointer-events-none text-gray-400">
            <UserIcon />
          </div>
          <input
            id="student-name"
            type="text"
            placeholder="اسم الطالب"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full pr-12 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="relative">
          <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">رقم التليفون</label>
          <div className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center pointer-events-none text-gray-400">
            <PhoneIcon />
          </div>
          <input
            id="phone-number"
            type="tel"
            placeholder="رقم التليفون"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full pr-12 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="relative">
          <label htmlFor="registration-date" className="block text-sm font-medium text-gray-700 mb-1">تاريخ ووقت التسجيل</label>
          <div className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center pointer-events-none text-gray-400">
            <CalendarIcon />
          </div>
          <input
            id="registration-date"
            type="datetime-local"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="w-full pr-12 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {validationError && (
            <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center" role="alert">
                <AlertTriangleIcon />
                <p className="mr-3">{validationError}</p>
            </div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105"
        >
          <PlusCircleIcon />
          <span className="mr-2">إضافة الطالب</span>
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
