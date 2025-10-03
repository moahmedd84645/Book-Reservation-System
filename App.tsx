
import React, { useState } from 'react';
import { Reservation } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { exportToExcel } from './services/xlsxService';
import ReservationForm from './components/ReservationForm';
import ReservationsTable from './components/ReservationsTable';
import { DownloadIcon } from './components/Icons';

function App() {
  const [reservations, setReservations] = useLocalStorage<Reservation[]>('bookReservations', []);
  const [error, setError] = useState<string | null>(null);

  const handleAddReservation = (newReservation: Omit<Reservation, 'timestamp'>) => {
    setError(null);
    const isDuplicate = reservations.some(res => res.studentId === newReservation.studentId);
    if (isDuplicate) {
      setError(`كود الطالب "${newReservation.studentId}" مسجل بالفعل.`);
      return;
    }

    const reservationWithTimestamp: Reservation = {
      ...newReservation,
      timestamp: new Date().toISOString(),
    };
    setReservations(prev => [reservationWithTimestamp, ...prev]);
  };

  const handleExport = () => {
    if(reservations.length === 0) {
        alert("لا توجد بيانات لتصديرها.");
        return;
    }
    exportToExcel(reservations, 'حجوزات_الكتب');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">نظام حجز الكتب</h1>
          <p className="mt-2 text-lg text-gray-600">أضف حجوزات الطلاب وقم بتصديرها بسهولة.</p>
        </header>

        <main className="flex flex-col items-center gap-8">
          <ReservationForm onAddReservation={handleAddReservation} error={error} />

          <section className="w-full max-w-5xl bg-white p-6 rounded-xl shadow-lg">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">قائمة الحجوزات</h2>
                <button
                    onClick={handleExport}
                    disabled={reservations.length === 0}
                    className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <DownloadIcon />
                    <span className="mr-2">تصدير إلى Excel</span>
                </button>
             </div>
             <ReservationsTable reservations={reservations} />
          </section>
        </main>

         <footer className="text-center mt-12 text-gray-500">
            <p>تم التطوير بواسطة مهندس React خبير.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
