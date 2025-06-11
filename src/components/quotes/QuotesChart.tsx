'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Quote } from '@/api/quotes';

interface QuotesChartProps {
  quotes: Quote[];
}

const QuotesChart: React.FC<QuotesChartProps> = ({ quotes }) => {
  const chartData = {
    labels: quotes.map(q => `"${q.content.substring(0, 20)}..." - ${q.author}`),
    datasets: [
      {
        label: 'Number of Votes',
        data: quotes.map(q => q.voteCount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Quote Vote Counts',
      },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1
            }
        }
    }
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default QuotesChart;
