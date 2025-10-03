import React from 'react';
import { Student } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { exportToExcel } from './services/xlsxService';
import StudentForm from './components/ReservationForm';
import StudentsTable from './components/ReservationsTable';
import { DownloadIcon } from './components/Icons';

// يمكنك تغيير هذا البادئة حسب حاجتك
const STUDENT_CODE_PREFIX = 'MTD25';

function App() {
  const [students, setStudents] = useLocalStorage<Student[]>('students', []);
  const [studentCounter, setStudentCounter] = useLocalStorage<number>('studentCounter', 0);

  const handleAddStudent = (newStudent: Omit<Student, 'timestamp' | 'studentCode'>) => {
    const nextId = studentCounter + 1;
    const paddedId = String(nextId).padStart(2, '0');
    const newStudentCode = `${STUDENT_CODE_PREFIX}-${paddedId}`;

    const studentWithTimestamp: Student = {
      ...newStudent,
      studentCode: newStudentCode,
      timestamp: new Date().toISOString(),
    };
    
    setStudents(prev => [...prev, studentWithTimestamp]);
    setStudentCounter(nextId);
  };

  const handleExport = () => {
    if(students.length === 0) {
        alert("لا توجد بيانات لتصديرها.");
        return;
    }
    // Sort a copy of the array by timestamp in descending order (newest first) for the export
    const sortedForExport = [...students].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    exportToExcel(sortedForExport, 'بيانات_الطلاب');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">نظام إدخال بيانات الطلاب</h1>
          <p className="mt-2 text-lg text-gray-600">أضف بيانات الطلاب وقم بتصديرها بسهولة.</p>
        </header>

        <main className="flex flex-col items-center gap-8">
          <StudentForm onAddStudent={handleAddStudent} />

          <section className="w-full max-w-5xl bg-white p-6 rounded-xl shadow-lg">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">قائمة الطلاب</h2>
                <button
                    onClick={handleExport}
                    disabled={students.length === 0}
                    className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <DownloadIcon />
                    <span className="mr-2">تصدير إلى Excel</span>
                </button>
             </div>
             <StudentsTable students={students} />
          </section>
        </main>

         <footer className="text-center mt-12 text-gray-500">
            <p>&copy; {new Date().getFullYear()} نظام إدخال بيانات الطلاب. جميع الحقوق محفوظة.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;