import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-950 p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-2">
          Произошла ошибка
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          {message}
        </p>
      </div>
    </div>
  );
}