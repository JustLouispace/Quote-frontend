'use client';

interface QuotesHeaderProps {
  openCreateModal: () => void;
}

export default function QuotesHeader({ openCreateModal }: QuotesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 sm:mb-0">Quotes Dashboard</h1>
      <button
        onClick={openCreateModal}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
      >
        Create New Quote
      </button>
    </div>
  );
}
