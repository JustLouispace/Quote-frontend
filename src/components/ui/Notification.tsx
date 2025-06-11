'use client';

import { useEffect } from 'react';

interface NotificationProps {
  message: { type: 'success' | 'error'; text: string } | null;
  onClose: () => void;
}

export default function Notification({ message, onClose }: NotificationProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`p-4 mb-6 rounded-lg shadow-md text-center font-semibold transition-transform transform animate-slide-down ${
        message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      {message.text}
      <button onClick={onClose} className="ml-4 font-bold text-lg">&times;</button>
    </div>
  );
}
