'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, logout } from '@/utils/auth';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);



interface Quote {
    id: number;
    content: string;
    author: string;
    created_at: string;
    updated_at: string;
    voteCount: number;
}

// Add a function to fetch the user's voted quote ID
async function fetchUserVotedQuoteId(): Promise<number | null> {
    try {
        const token = getToken();
        if (!token) return null;
        // We'll check all quotes and find which one the user has voted for
        const res = await fetch('http://localhost:8080/quotes/', {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res);
        
        if (!res.ok) return null;
        const quotes = await res.json();
        for (const quote of quotes) {
            const checkRes = await fetch(`http://localhost:8080/quotes/${quote.id}/vote/check`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (checkRes.ok) {
                const { has_voted } = await checkRes.json();
                if (has_voted) return quote.id;
            }
        }
        return null;
    } catch {
        return null;
    }
}

export default function QuotesPage() {
    const router = useRouter();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        author: '',
        content: '',
        startDate: '',
        endDate: ''
    });
    const [userVotedQuoteId, setUserVotedQuoteId] = useState<number | null>(null);
    const [quotesWithVotes, setQuotesWithVotes] = useState<Quote[]>([]);
    const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
    const [showVoteConfirm, setShowVoteConfirm] = useState<number | null>(null);
    const [votingInProgress, setVotingInProgress] = useState<number | null>(null);
    const [voteMessage, setVoteMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    
    const handleVoteClick = (quoteId: number) => {
        setShowVoteConfirm(quoteId);
    };

    const cancelVote = () => {
        setShowVoteConfirm(null);
        setVotingInProgress(null);
    };

    const confirmVote = async (quoteId: number) => {
        if (votingInProgress) return;
        
        setVotingInProgress(quoteId);
        setVoteMessage(null);
        setShowVoteConfirm(null);
        
        try {
            const token = getToken();
            if (!token) {
                router.push('/login');
                return;
            }
            
            const response = await fetch(`http://localhost:8080/quotes/${quoteId}/vote`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                setUserVotedQuoteId(quoteId);
                setFilteredQuotes(prevQuotes => 
                    prevQuotes.map(quote => 
                        quote.id === quoteId 
                            ? { ...quote, voteCount: quote.voteCount + 1 } 
                            : quote
                    )
                );
                setVoteMessage({
                    type: 'success',
                    text: 'Your vote has been recorded successfully!'
                });
            } else {
                const errorData = await response.json();
                setVoteMessage({
                    type: 'error',
                    text: errorData.message || 'Failed to record your vote. Please try again.'
                });
            }
        } catch (err) {
            setVoteMessage({
                type: 'error',
                text: 'An error occurred while processing your vote'
            });
        } finally {
            setVotingInProgress(null);
        }
    };

    const fetchQuotesAndUserVote = async () => {
        setLoading(true);
        try {
            const token = getToken();
            if (!token) {
                router.push('/login');
                return;
            }
            const response = await fetch('http://localhost:8080/quotes/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                if (response.status === 401) {
                    logout();
                    router.push('/login');
                    return;
                }
                setError('Failed to fetch quotes');
                setQuotes([]);
                setFilteredQuotes([]);
                return;
            }
            const data = await response.json();
            const quotesArray = Array.isArray(data) ? data : [];
            // Fetch vote counts for each quote
            const quotesWithVoteCounts = await Promise.all(
                quotesArray.map(async (quote: Quote) => {
                    const res = await fetch(`http://localhost:8080/quotes/${quote.id}/vote/count`);
                    let count = 0;
                    if (res.ok) {
                        const json = await res.json();
                        count = json.count;
                    }
                    return { ...quote, voteCount: count };
                })
            );
            setQuotesWithVotes(quotesWithVoteCounts);
            setQuotes(quotesArray);
            setFilteredQuotes(quotesArray);
            // Fetch user's voted quote id
            const votedId = await fetchUserVotedQuoteId();
            setUserVotedQuoteId(votedId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setQuotes([]);
            setFilteredQuotes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotesAndUserVote();
    }, [router]);

    useEffect(() => {
        const handleFilter = () => {
            const filtered = quotes.filter(quote => {
                const matchesAuthor = !filters.author || 
                    quote.author.toLowerCase().includes(filters.author.toLowerCase());
                const matchesContent = !filters.content || 
                    quote.content.toLowerCase().includes(filters.content.toLowerCase());
                const matchesStartDate = !filters.startDate || 
                    new Date(quote.created_at) >= new Date(filters.startDate);
                const matchesEndDate = !filters.endDate || 
                    new Date(quote.created_at) <= new Date(filters.endDate + 'T23:59:59');
                
                return matchesAuthor && matchesContent && matchesStartDate && matchesEndDate;
            });
            setFilteredQuotes(filtered);
        };

        handleFilter();
    }, [quotes, filters]);

    const handleResetFilters = () => {
        setFilters({
            author: '',
            content: '',
            startDate: '',
            endDate: ''
        });
        setFilteredQuotes(quotes);
    };

    const handleVote = async (quoteId: number) => {
        try {
            const token = getToken();
            if (!token) {
                router.push('/login');
                return;
            }
            
            const response = await fetch(`http://localhost:8080/quotes/${quoteId}/vote`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                setUserVotedQuoteId(quoteId);
                setFilteredQuotes(prevQuotes => 
                    prevQuotes.map(quote => 
                        quote.id === quoteId 
                            ? { ...quote, voteCount: quote.voteCount + 1 } 
                            : quote
                    )
                );
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to vote');
            }
        } catch (err) {
            setError('An error occurred while processing your vote');
        }
    };

    // Prepare chart data
    const chartData = useMemo(() => {
        const authorCounts = filteredQuotes.reduce((acc, quote) => {
            acc[quote.author] = (acc[quote.author] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const labels = Object.keys(authorCounts);
        const data = Object.values(authorCounts);

        // Generate colors dynamically
        const backgroundColors = labels.map((_, index) => 
            `hsl(${(index * 360) / labels.length}, 70%, 60%)`
        );

        return {
            labels,
            datasets: [
                {
                    label: 'Number of Quotes',
                    data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
                    borderWidth: 1,
                },
            ],
        };
    }, [filteredQuotes]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Quotes Distribution by Author',
            },
        },
    };

    // Auto-hide success messages after 5 seconds
    useEffect(() => {
        if (voteMessage?.type === 'success') {
            const timer = setTimeout(() => {
                setVoteMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [voteMessage]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Quotes Dashboard</h1>
            
            {/* Vote Message Alert */}
            {voteMessage && (
                <div className={`mb-6 p-4 rounded-md ${
                    voteMessage.type === 'success' 
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                    <div className="flex justify-between items-center">
                        <span>{voteMessage.text}</span>
                        <button 
                            onClick={() => setVoteMessage(null)}
                            className="text-xl font-bold leading-none"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
            
            {/* Chart Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Quotes Analytics</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setChartType('bar')}
                            className={`px-3 py-1 rounded-md ${
                                chartType === 'bar' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Bar Chart
                        </button>
                        <button
                            onClick={() => setChartType('pie')}
                            className={`px-3 py-1 rounded-md ${
                                chartType === 'pie' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Pie Chart
                        </button>
                    </div>
                </div>
                
                <div className="h-80">
                    {filteredQuotes.length > 0 ? (
                        chartType === 'bar' ? (
                            <Bar data={chartData} options={chartOptions} />
                        ) : (
                            <Pie data={chartData} options={chartOptions} />
                        )
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">No data available for the selected filters</p>
                        </div>
                    )}
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                    <p>Total quotes: {filteredQuotes.length} | 
                       Unique authors: {Object.keys(chartData.labels).length} | 
                       Most quoted author: {Object.entries(chartData.datasets[0].data).length > 0 
                           ? `${chartData.labels[chartData.datasets[0].data.indexOf(Math.max(...chartData.datasets[0].data))]} ` +
                             `(${Math.max(...chartData.datasets[0].data)} quotes)`
                           : 'N/A'}
                    </p>
                </div>
            </div>
            
            {/* Filter Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Filter Quotes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                        <input
                            type="text"
                            value={filters.author}
                            onChange={(e) => setFilters({...filters, author: e.target.value})}
                            className="w-full p-2 border rounded-md"
                            placeholder="Filter by author"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <input
                            type="text"
                            value={filters.content}
                            onChange={(e) => setFilters({...filters, content: e.target.value})}
                            className="w-full p-2 border rounded-md"
                            placeholder="Filter by content"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>
                <button 
                    onClick={handleResetFilters} 
                    className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Reset
                </button>
            </div>

            {/* Loading and Error States */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading quotes...</p>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            ) : (
                /* Quotes Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuotes.map((quote) => (
                        <div key={quote.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="p-6">
                                <blockquote className="text-lg italic text-gray-700 mb-4">"{quote.content}"</blockquote>
                                <p className="text-right font-medium text-gray-600">— {quote.author}</p>
                                
                                <div className="mt-4 flex items-center justify-between border-t pt-4">
                                    <div className="flex items-center">
                                        <span className="text-gray-500 text-sm">
                                            {quote.voteCount} {quote.voteCount === 1 ? 'vote' : 'votes'}
                                        </span>
                                    </div>
                                    {userVotedQuoteId !== null ? (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Voted
                                        </div>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => handleVoteClick(quote.id)}
                                                className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                                                disabled={votingInProgress !== null}
                                            >
                                                {votingInProgress === quote.id ? 'Processing...' : 'Vote'}
                                            </button>
                                            
                                            {/* Vote Confirmation Modal */}
                                            {showVoteConfirm === quote.id && (
                                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                                                        <h3 className="text-lg font-medium mb-4">Confirm Your Vote</h3>
                                                        <p className="mb-6">You can only vote for one quote. Are you sure you want to vote for this quote?</p>
                                                        <div className="flex justify-end space-x-3">
                                                            <button
                                                                onClick={cancelVote}
                                                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                                                disabled={votingInProgress === quote.id}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => confirmVote(quote.id)}
                                                                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                                                                disabled={votingInProgress === quote.id}
                                                            >
                                                                {votingInProgress === quote.id ? (
                                                                    <>
                                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                        Processing...
                                                                    </>
                                                                ) : 'Yes, Vote'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                
                                <div className="mt-3 text-xs text-gray-500">
                                    Added on {new Date(quote.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {!loading && !error && filteredQuotes.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No quotes found matching your filters.</p>
                    <button 
                        onClick={handleResetFilters}
                        className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}