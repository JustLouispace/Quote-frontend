'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Quote,
  fetchQuotes,
  fetchUserVotedQuoteId,
  createQuote as apiCreateQuote,
  updateQuote as apiUpdateQuote,
  deleteQuote as apiDeleteQuote,
  voteQuote as apiVoteQuote,
} from '@/api/quotes';

export function useQuotes() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userVotedQuoteId, setUserVotedQuoteId] = useState<number | null>(null);
  const [votingInProgress, setVotingInProgress] = useState<number | null>(null);
  const [voteMessage, setVoteMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [quotesData, votedId] = await Promise.all([
          fetchQuotes(),
          fetchUserVotedQuoteId(),
        ]);
        setQuotes(quotesData);
        setUserVotedQuoteId(votedId);
        setError('');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        if (errorMessage.toLowerCase().includes('unauthorized')) {
          router.push('/login');
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [router]);

  const handleApiCall = async <T,>(apiCall: () => Promise<T>, successMessage: string): Promise<T | null> => {
    try {
      const result = await apiCall();
      setVoteMessage({ type: 'success', text: successMessage });
      setTimeout(() => setVoteMessage(null), 3000);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      if (errorMessage.toLowerCase().includes('unauthorized')) {
        router.push('/login');
      }
      setVoteMessage({ type: 'error', text: errorMessage });
      setTimeout(() => setVoteMessage(null), 3000);
      throw err;
    }
  };

  const createQuote = async (newQuote: { content: string; author: string }) => {
    const createdQuote = await handleApiCall(() => apiCreateQuote(newQuote), 'Quote created successfully!');
    if (createdQuote) setQuotes(prev => [createdQuote, ...prev]);
    return createdQuote;
  };

  const updateQuote = async (updatedQuoteData: Quote) => {
    const updatedQuote = await handleApiCall(() => apiUpdateQuote(updatedQuoteData), 'Quote updated successfully!');
    if (updatedQuote) setQuotes(prev => prev.map(q => (q.id === updatedQuote.id ? updatedQuote : q)));
    return updatedQuote;
  };

  const deleteQuote = async (quoteId: number) => {
    await handleApiCall(() => apiDeleteQuote(quoteId), 'Quote deleted successfully!');
    setQuotes(prev => prev.filter(q => q.id !== quoteId));
  };

  const voteQuote = async (quoteId: number) => {
    if (votingInProgress) return;
    setVotingInProgress(quoteId);
    try {
      await handleApiCall(() => apiVoteQuote(quoteId), 'Your vote has been recorded!');
      setUserVotedQuoteId(quoteId);
      setQuotes(prev =>
        prev.map(quote =>
          quote.id === quoteId
            ? { ...quote, voteCount: quote.voteCount + 1, isVotedByUser: true }
            : { ...quote, isVotedByUser: false }
        )
      );
    } catch (error) {
      // Error message is already set by handleApiCall
    } finally {
      setVotingInProgress(null);
    }
  };

  return {
    quotes,
    loading,
    error,
    userVotedQuoteId,
    votingInProgress,
    voteMessage,
    setVoteMessage,
    actions: {
      createQuote,
      updateQuote,
      deleteQuote,
      voteQuote,
    },
    setQuotes,
  };
}
