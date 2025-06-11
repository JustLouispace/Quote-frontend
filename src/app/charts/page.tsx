'use client';

import { useQuotes } from '@/hooks/useQuotes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ChartsPage() {
  const { quotes, loading, error } = useQuotes();

  const votesByAuthor = quotes.reduce((acc, quote) => {
    const author = quote.author || 'Unknown';
    acc[author] = (acc[author] || 0) + quote.voteCount;
    return acc;
  }, {} as Record<string, number>);

  const authorChartData = Object.keys(votesByAuthor).map(author => ({
    name: author,
    votes: votesByAuthor[author],
  }));

  const quoteChartData = quotes
    .filter(q => q.voteCount > 0)
    .map(quote => ({
      name: `"${quote.content.substring(0, 20)}..."`,
      votes: quote.voteCount,
    }));

  if (loading) return <p>Loading chart data...</p>;
  if (error) return <p>Error loading data: {error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Vote Statistics</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Votes by Author</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={authorChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="votes" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Votes by Quote</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={quoteChartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="votes" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
