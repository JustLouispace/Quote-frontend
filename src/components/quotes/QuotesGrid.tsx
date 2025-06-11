'use client';

import QuoteCard from './QuoteCard';
import { Quote } from '@/api/quotes';

interface QuotesGridProps {
  quotes: Quote[];
  loading: boolean;
  error: string;
  userVotedQuoteId: number | null;
  votingInProgress: number | null;
  onVoteClick: (quoteId: number) => void;
  onEdit: (quote: Quote) => void;
  onDelete: (quote: Quote) => void;
}

export default function QuotesGrid({
  quotes,
  loading,
  error,
  userVotedQuoteId,
  votingInProgress,
  onVoteClick,
  onEdit,
  onDelete,
}: QuotesGridProps) {
  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-500">Loading quotes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-red-50 text-red-700 rounded-lg p-4">
        <p className="font-semibold">Error loading quotes</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-500">No quotes found. Try adjusting your filters or create a new one!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {quotes.map(quote => (
        <QuoteCard
          key={quote.id}
          quote={quote}
          userVotedQuoteId={userVotedQuoteId}
          votingInProgress={votingInProgress}
          onVoteClick={onVoteClick}
          onEdit={() => onEdit(quote)}
          onDelete={() => onDelete(quote)}
          votingLocked={userVotedQuoteId !== null}
        />
      ))}
    </div>
  );
}
