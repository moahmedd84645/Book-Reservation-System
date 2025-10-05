
import React, { useState } from 'react';
import { XIcon } from './Icons';

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkAdd: (text: string) => void;
}

const BulkAddModal: React.FC<BulkAddModalProps> = ({ isOpen, onClose, onBulkAdd }) => {
  const [text, setText] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    onBulkAdd(text);
    setText('');
    onClose();
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
            onClick={onClose} 
            className="absolute top-3 left-3 text-gray-500 hover:text-gray-800"
            aria-label="إغلاق"
        >
          <XIcon />
        </button>
        <h3 className="text-2xl font-bold mb-4 text-center">إضافة دفعة من الطلاب</h3>
        <p className="text-gray-600 mb-4 text-center">
          أدخل كل طالب في سطر جديد بالصيغة: <code className="bg-gray-200 p-1 rounded">اسم الطالب, رقم التليفون</code>
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder={`مثال:\nأحمد محمد, 01012345678\nفاطمة علي, 01187654321`}
          dir="rtl"
        ></textarea>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="py-2 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            إضافة
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkAddModal;
