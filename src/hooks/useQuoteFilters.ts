'use client';

import { useState, useEffect } from 'react';
import { Quote } from '@/api/quotes';

type FilterState = {
  author: string;
  content: string;
  startDate: string;
  endDate: string;
  sortBy: string;
};

export function useQuoteFilters(
  quotes: Quote[],
  setFilteredQuotes: (quotes: Quote[]) => void
) {
  const [filters, setFilters] = useState<FilterState>({
    author: '',
    content: '',
    startDate: '',
    endDate: '',
    sortBy: 'newest',
  });

  const resetFilters = () => {
    setFilters({
      author: '',
      content: '',
      startDate: '',
      endDate: '',
      sortBy: 'newest',
    });
  };

  useEffect(() => {
    let result = [...quotes];

    if (filters.author) {
      result = result.filter(q =>
        q.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }

    if (filters.content) {
      result = result.filter(q =>
        q.content.toLowerCase().includes(filters.content.toLowerCase())
      );
    }

    if (filters.startDate) {
      result = result.filter(
        q => new Date(q.created_at) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      result = result.filter(
        q => new Date(q.created_at) <= new Date(filters.endDate)
      );
    }

    switch (filters.sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'mostVotes':
        result.sort((a, b) => b.voteCount - a.voteCount);
        break;
      case 'leastVotes':
        result.sort((a, b) => a.voteCount - b.voteCount);
        break;
      case 'authorAZ':
        result.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case 'authorZA':
        result.sort((a, b) => b.author.localeCompare(a.author));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    setFilteredQuotes(result);
  }, [quotes, filters, setFilteredQuotes]);

  return {
    filters,
    setFilters,
    resetFilters,
  };
}
