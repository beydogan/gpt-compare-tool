import { XCircle } from 'lucide-react';

export const Alert = ({ message, onClose }) => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 flex justify-between items-center">
      <div className="flex items-center">
        <XCircle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-700">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-red-500 hover:text-red-700">
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );