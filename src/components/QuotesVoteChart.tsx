// src/components/QuotesVoteChart.tsx
'use client';

import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

type Vote = {
    id: number;
    user_id: number;
    quote_id: number;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        username: string;
        created_at: string;
        updated_at: string;
    };
    quote: {
        id: number;
        content: string;
        author: string;
        created_at: string;
        updated_at: string;
    };
};

type Quote = {
    id: number;
    content: string;
    author: string;
    created_at: string;
    updated_at: string;
    votes: Vote[];
    voteCount: number;
};

interface QuotesVoteChartProps {
    quotes: Quote[];
}

export default function QuotesVoteChart({ quotes = [] }: QuotesVoteChartProps) {
    // Process and sort quotes data
    const { chartData, hasVotes } = useMemo(() => {
        // Filter out quotes with no votes for better visualization
        const quotesWithVotes = quotes.filter(quote => quote.voteCount > 0);
        
        // Sort by vote count in descending order
        const sortedQuotes = [...quotesWithVotes].sort((a, b) => b.voteCount - a.voteCount);

        return {
            chartData: {
                labels: sortedQuotes.map(quote => `#${quote.id}`),
                datasets: [
                    {
                        label: 'Votes',
                        data: sortedQuotes.map(quote => quote.voteCount),
                        backgroundColor: 'rgba(53, 162, 235, 0.7)',
                        borderColor: 'rgba(53, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
                // Store full quote data for tooltips
                quotes: sortedQuotes
            },
            hasVotes: sortedQuotes.length > 0
        };
    }, [quotes]);

    // Chart options
    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Vote Distribution',
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    title: (context) => {
                        const dataIndex = context[0].dataIndex;
                        const quote = chartData.quotes[dataIndex];
                        return `#${quote.id}: ${quote.content.substring(0, 30)}${quote.content.length > 30 ? '...' : ''}`;
                    },
                    label: (context) => {
                        const quote = chartData.quotes[context.dataIndex];
                        return [
                            `Author: ${quote.author}`,
                            `Votes: ${context.raw}`
                        ];
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    precision: 0
                },
                title: {
                    display: true,
                    text: 'Number of Votes'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Quote ID'
                }
            }
        }
    };

    // If no votes to display
    if (!hasVotes) {
        return (
            <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Vote Distribution</h2>
                <div className="h-64 flex items-center justify-center text-gray-500">
                    No votes have been cast yet.
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto mt-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Vote Distribution</h2>
                <div className="h-96">
                    <Bar 
                        data={chartData}
                        options={chartOptions} 
                    />
                </div>
                <div className="mt-4 text-sm text-gray-500">
                    <p>Total quotes: {quotes.length}</p>
                    <p>Total votes: {quotes.reduce((sum, item) => sum + (item.voteCount || 0), 0)}</p>
                </div>
            </div>
        </div>
    );
}