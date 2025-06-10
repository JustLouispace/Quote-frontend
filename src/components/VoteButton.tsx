import { useState, useEffect } from 'react';
import { getToken } from '@/utils/auth';
import { log } from 'console';

interface VoteButtonProps {
    quoteId: number;
    userVotedQuoteId: number | null;
    onVoteChange?: () => void;
}

export default function VoteButton({ quoteId, userVotedQuoteId, onVoteChange }: VoteButtonProps) {
    const [voteCount, setVoteCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const fetchVoteCount = async () => {
        try {
            const token = getToken();
            const res = await fetch(`http://localhost:8080/quotes/${quoteId}/vote/count?${Date.now()}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (res.ok) {
                const { count } = await res.json();
                setVoteCount(count);
                console.log(count)
            }
        } catch {
            setVoteCount(0);
        }
    };

    useEffect(() => {
        fetchVoteCount();
    }, [quoteId, userVotedQuoteId]);

    const handleVote = async () => {
        setIsLoading(true);
        const token = getToken();
        if (!token) return;
        if (userVotedQuoteId !== null) return;
        const response = await fetch(`http://localhost:8080/quotes/${quoteId}/vote`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });
        setIsLoading(false);
        if (response.ok) {
            await fetchVoteCount();
            onVoteChange?.();
        }
    };

    const hasVoted = userVotedQuoteId === quoteId;
    const hasVotedOther = userVotedQuoteId !== null && userVotedQuoteId !== quoteId;

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                disabled={isLoading || hasVotedOther || hasVoted}
                className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${hasVoted
                    ? 'bg-blue-500 text-white'
                    : hasVotedOther
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${hasVoted ? 'text-white' : hasVotedOther ? 'text-gray-400' : 'text-gray-500'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                    />
                </svg>
                <span className="font-medium">{voteCount}</span>
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
                        <h2 className="text-lg font-semibold mb-4">Confirm Vote</h2>
                        <p className="mb-6">Are you sure you want to vote for this quote? You can only vote once.</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    setShowModal(false);
                                    await handleVote();
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                disabled={isLoading}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 