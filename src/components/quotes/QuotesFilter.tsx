'use client';

import React from 'react';

interface FilterState {
  author: string;
  content: string;
  startDate: string;
  endDate: string;
  sortBy: string;
}

interface QuotesFilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
}

export default function QuotesFilter({ filters, setFilters, resetFilters }: QuotesFilterProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
        {/* Filter Inputs */}
        <div className="w-full">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <input type="text" name="content" id="content" value={filters.content} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search content..." />
        </div>
        <div className="w-full">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <input type="text" name="author" id="author" value={filters.author} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search authors..." />
        </div>
        <div className="w-full">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input type="date" name="startDate" id="startDate" value={filters.startDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="w-full">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input type="date" name="endDate" id="endDate" value={filters.endDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="w-full">
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select name="sortBy" id="sortBy" value={filters.sortBy} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostVotes">Most Votes</option>
            <option value="leastVotes">Least Votes</option>
            <option value="authorAZ">Author A-Z</option>
            <option value="authorZA">Author Z-A</option>
          </select>
        </div>
      </div>
      <div className="mt-4 text-right">
        <button onClick={resetFilters} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Reset Filters</button>
      </div>
    </div>
  );
}
