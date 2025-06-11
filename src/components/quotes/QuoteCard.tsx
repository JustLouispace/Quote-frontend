'use client';

import { getToken } from '@/utils/auth';
import { Quote } from '@/api/quotes';

interface QuoteCardProps {
  quote: Quote;
  userVotedQuoteId: number | null;
  votingInProgress: number | null;
  onVoteClick: (quoteId: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  votingLocked?: boolean;
}

export default function QuoteCard({
  quote,
  userVotedQuoteId,
  votingInProgress,
  onVoteClick,
  onEdit,
  onDelete,
  votingLocked,
}: QuoteCardProps) {
  const handleEditAttempt = () => {
    if (quote.voteCount > 0) {
      alert('You can only edit quotes that have 0 votes.');
      return;
    }
    onEdit();
  };

  const handleDeleteAttempt = () => {
    if (quote.voteCount > 0) {
      alert('You can only delete quotes that have 0 votes.');
      return;
    }
    onDelete();
  };

  const canPerformActions = getToken();

  return (
    <div className="bg-white rounded-xl shadow border p-6 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start gap-4">
        <blockquote className="flex-grow text-gray-800 italic text-lg leading-relaxed">
          “{quote.content}”
        </blockquote>
        {canPerformActions && (
          <div className="flex-shrink-0">
            <div className="flex bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={handleEditAttempt}
                className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                title="Edit Quote"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="border-l border-gray-200"></div>
              <button
                onClick={handleDeleteAttempt}
                className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                title="Delete Quote"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-grow"></div>

      <div className="mt-4">
        <p className="text-gray-600 text-right font-medium">— {quote.author}</p>
        <div className="flex justify-between items-center mt-6">
          <p className="text-xs text-gray-400">
            {new Date(quote.created_at).toLocaleDateString()}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onVoteClick(quote.id)}
              disabled={votingInProgress === quote.id || votingLocked}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm border ${
                userVotedQuoteId === quote.id
                  ? 'bg-green-500 text-white border-transparent shadow-lg hover:bg-green-600'
                  : votingLocked
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
              }`}
            >
              {userVotedQuoteId === quote.id ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.383-.597 15.25 15.25 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.11-4.789 9.25a15.95 15.95 0 01-4.244 3.17 15.247 15.247 0 01-1.383.597l-.022.012-.007.004-.004.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              )}
              {userVotedQuoteId === quote.id ? 'Voted' : 'Vote'}
            </button>
            <span className={`text-sm font-semibold w-16 text-right transition-colors ${userVotedQuoteId === quote.id ? 'text-green-600' : quote.voteCount > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
              {quote.voteCount} Vote{quote.voteCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
