import { getToken } from '@/utils/auth';
import { config } from '@/config';

export interface Quote {
  id: number;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
  voteCount: number;
  isVotedByUser?: boolean;
}

const API_BASE = `${config.apiBaseUrl}/quotes/`;

export async function fetchQuotes(): Promise<Quote[]> {
  const token = getToken();
  const res = await fetch(API_BASE, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    if (res.status === 401) {
      try {
        const errorData = await res.json();
        throw new Error(`Unauthorized: ${errorData.error || errorData.detail || 'Please log in to view quotes.'}`);
      } catch (parseError) {
        throw new Error('Unauthorized: Please log in to view quotes.');
      }
    }
    try {
      const errorData = await res.json();
      throw new Error(`API Error: ${errorData.error || errorData.detail || `Failed to fetch quotes (status: ${res.status})`}`);
    } catch (parseError) {
      throw new Error(`Failed to fetch quotes (status: ${res.status})`);
    }
  }
  return await res.json();
}

export async function fetchUserVotedQuoteId(): Promise<number | null> {
  const token = getToken();
  if (!token) return null;
  const quotes = await fetchQuotes();
  for (const quote of quotes) {
    const checkRes = await fetch(`${API_BASE}${quote.id}/vote/check`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (checkRes.ok) {
      const { has_voted } = await checkRes.json();
      if (has_voted) return quote.id;
    }
  }
  return null;
}

export async function updateQuote(updatedQuote: Quote): Promise<Quote> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const response = await fetch(`${API_BASE}${updatedQuote.id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: updatedQuote.content, author: updatedQuote.author }),
  });
  if (!response.ok) {
    if (response.status === 401) {
      try {
        const errorData = await response.json();
        throw new Error(`Unauthorized: ${errorData.error || errorData.detail || 'Action requires login.'}`);
      } catch (parseError) {
        throw new Error('Unauthorized: Action requires login.');
      }
    }
    try {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error || errorData.detail || `Failed to update quote (status: ${response.status})`}`);
    } catch (parseError) {
      throw new Error(`Failed to update quote (status: ${response.status})`);
    }
  }
  return await response.json();
}

export async function deleteQuote(quoteId: number): Promise<void> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const response = await fetch(`${API_BASE}${quoteId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    if (response.status === 401) {
      try {
        const errorData = await response.json();
        throw new Error(`Unauthorized: ${errorData.error || errorData.detail || 'Action requires login.'}`);
      } catch (parseError) {
        throw new Error('Unauthorized: Action requires login.');
      }
    }
    try {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error || errorData.detail || `Failed to delete quote (status: ${response.status})`}`);
    } catch (parseError) {
      throw new Error(`Failed to delete quote (status: ${response.status})`);
    }
  }
}

export async function createQuote(newQuote: { content: string; author: string }): Promise<Quote> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newQuote),
  });

  if (!response.ok) {
    if (response.status === 401) {
      try {
        const errorData = await response.json();
        throw new Error(`Unauthorized: ${errorData.error || errorData.detail || 'Please log in to create a quote.'}`);
      } catch (parseError) {
        throw new Error('Unauthorized: Please log in to create a quote.');
      }
    }
    try {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error || errorData.detail || `Failed to create quote (status: ${response.status})`}`);
    } catch (parseError) {
      throw new Error(`Failed to create quote (status: ${response.status})`);
    }
  }

  return await response.json();
}

export async function voteQuote(quoteId: number): Promise<void> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const response = await fetch(`${API_BASE}${quoteId}/vote`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    if (response.status === 401) {
      try {
        const errorData = await response.json();
        throw new Error(`Unauthorized: ${errorData.error || errorData.detail || 'Action requires login.'}`);
      } catch (parseError) {
        throw new Error('Unauthorized: Action requires login.');
      }
    }
    try {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error || errorData.detail || `Failed to vote for quote (status: ${response.status})`}`);
    } catch (parseError) {
      throw new Error(`Failed to vote for quote (status: ${response.status})`);
    }
  }
}
