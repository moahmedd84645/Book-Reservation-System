import React, { useState } from 'react';
import { Student } from '../types';
import { UserIcon, PhoneIcon, PlusCircleIcon, AlertTriangleIcon } from './Icons';

interface StudentFormProps {
  onAddStudent: (student: Omit<Student, 'timestamp' | 'studentCode'>) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onAddStudent }) => {
  const [studentName, setStudentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

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

    setValidationError(null);
    onAddStudent({ studentName, phoneNumber });
    setStudentName('');
    setPhoneNumber('');
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">إضافة طالب جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            <UserIcon />
          </div>
          <input
            type="text"
            placeholder="اسم الطالب"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full pr-12 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            <PhoneIcon />
          </div>
          <input
            type="tel"
            placeholder="رقم التليفون"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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