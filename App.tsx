
import React, { useState, useRef } from 'react';
import { Student } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { exportToExcel, importFromExcel } from './services/xlsxService';
import StudentForm from './components/ReservationForm';
import StudentsTable from './components/ReservationsTable';
import BulkAddModal from './components/BulkAddModal';
import { DownloadIcon, TagIcon, SearchIcon, UsersIcon, UploadIcon } from './components/Icons';

function App() {
  const [students, setStudents] = useLocalStorage<Student[]>('students', []);
  const [studentCounter, setStudentCounter] = useLocalStorage<number>('studentCounter', 0);
  const [prefix, setPrefix] = useLocalStorage<string>('studentCodePrefix', 'MTD25');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDuplicate = (name: string, phone: string, currentStudents: Student[]): boolean => {
    const existingStudents = [...students, ...currentStudents];
    return existingStudents.some(s => 
        s.studentName.trim().toLowerCase() === name.trim().toLowerCase() && 
        s.phoneNumber.trim() === phone.trim()
    );
  };

  const handleAddStudent = (newStudentData: Omit<Student, 'studentCode'>) => {
    if (isDuplicate(newStudentData.studentName, newStudentData.phoneNumber, [])) {
        alert("بيانات مكررة: هذا الطالب موجود بالفعل بنفس الاسم ورقم التليفون.");
        return;
    }
    
    const nextId = studentCounter + 1;
    const paddedId = String(nextId).padStart(2, '0');
    const newStudentCode = `${prefix.trim() || 'CODE'}-${paddedId}`;

    const newStudent: Student = {
      ...newStudentData,
      studentCode: newStudentCode,
    };
    
    setStudents(prev => [newStudent, ...prev]);
    setStudentCounter(nextId);
  };
  
  const processNewStudents = (studentsToAdd: {studentName: string, phoneNumber: string}[]) => {
    let addedCount = 0;
    let skippedCount = 0;
    let currentCounter = studentCounter;
    const newStudents: Student[] = [];

    studentsToAdd.forEach(studentData => {
        if (!studentData.studentName || !/^\d{7,15}$/.test(studentData.phoneNumber)) {
            skippedCount++;
            return;
        }
        if (isDuplicate(studentData.studentName, studentData.phoneNumber, newStudents)) {
            skippedCount++;
            return;
        }

        currentCounter++;
        const paddedId = String(currentCounter).padStart(2, '0');
        const newStudentCode = `${prefix.trim() || 'CODE'}-${paddedId}`;
        newStudents.push({
            ...studentData,
            studentCode: newStudentCode,
            timestamp: new Date().toISOString()
        });
        addedCount++;
    });

    if (newStudents.length > 0) {
        setStudents(prev => [...newStudents.reverse(), ...prev]);
        setStudentCounter(currentCounter);
    }
    
    alert(`اكتملت العملية.\n- تمت إضافة ${addedCount} طالبًا بنجاح.\n- تم تخطي ${skippedCount} طالبًا (بيانات غير مكتملة أو مكررة).`);
  };

  const handleBulkAdd = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const studentsToAdd = lines.map(line => {
        const parts = line.split(',');
        const name = parts[0]?.trim() || '';
        const phone = parts.slice(1).join(',').trim() || ''; // Handle commas in name
        return { studentName: name, phoneNumber: phone };
    });
    processNewStudents(studentsToAdd);
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        const studentsData = await importFromExcel(file);
        processNewStudents(studentsData);
    } catch (error) {
        console.error(error);
        alert((error as Error).message || "حدث خطأ أثناء معالجة الملف.");
    } finally {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
  };

  const triggerFileImport = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteStudent = (studentCodeToDelete: string) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا الطالب؟ لا يمكن التراجع عن هذا الإجراء.")) {
        setStudents(prev => prev.filter(student => student.studentCode !== studentCodeToDelete));
    }
  };

  const handleExport = () => {
    if(students.length === 0) {
        alert("لا توجد بيانات لتصديرها.");
        return;
    }
    const sortedForExport = [...students].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    exportToExcel(sortedForExport, 'بيانات_الطلاب');
  };

  const filteredStudents = students.filter(student => 
    student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentCode.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">نظام إدخال بيانات الطلاب</h1>
          <p className="mt-2 text-lg text-gray-600">أدخل بادئة الكود، ثم أضف بيانات الطلاب وقم بتصديرها بسهولة.</p>

          <div className="mt-6 max-w-sm mx-auto">
            <label htmlFor="prefix-input" className="block text-sm font-medium text-gray-700 mb-2">
              بادئة الكود (Prefix)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <TagIcon />
              </div>
              <input
                id="prefix-input"
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full pr-12 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-center"
                placeholder="مثال: MTD25"
                aria-label="بادئة كود الطالب"
              />
            </div>
          </div>
        </header>

        <main className="flex flex-col items-center gap-8">
          <StudentForm onAddStudent={handleAddStudent} />

          <section className="w-full max-w-5xl bg-white p-6 rounded-xl shadow-lg">
             <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">قائمة الطلاب</h2>
                <div className="flex flex-wrap gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".xlsx, .xls"
                        className="hidden"
                    />
                    <button
                        onClick={triggerFileImport}
                        className="flex items-center bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all"
                    >
                        <UploadIcon />
                        <span className="mr-2">استيراد من Excel</span>
                    </button>
                    <button
                        onClick={() => setIsBulkAddModalOpen(true)}
                        className="flex items-center bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all"
                    >
                        <UsersIcon />
                        <span className="mr-2">إضافة دفعة</span>
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={students.length === 0}
                        className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <DownloadIcon />
                        <span className="mr-2">تصدير إلى Excel</span>
                    </button>
                </div>
             </div>
             <div className="mb-4 relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="ابحث بالاسم أو الكود..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    aria-label="ابحث عن طالب"
                />
             </div>
             <StudentsTable students={filteredStudents} onDeleteStudent={handleDeleteStudent} />
          </section>
        </main>
         <BulkAddModal 
            isOpen={isBulkAddModalOpen} 
            onClose={() => setIsBulkAddModalOpen(false)} 
            onBulkAdd={handleBulkAdd}
         />
         <footer className="text-center mt-12 text-gray-500">
            <p>&copy; {new Date().getFullYear()} نظام إدخال بيانات الطلاب. جميع الحقوق محفوظة.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
