const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  // During build, this might be undefined. In the browser, it should always be set.
  // We can throw an error or have a fallback for server-side rendering if needed.
  console.warn("API base URL is not configured. Falling back to default. This should be set in your .env.local file for development.");
}

export const config = {
  // Provide a fallback for server-side processes where env var might not be available, 
  // though for client-side fetching it will be there.
  apiBaseUrl: apiBaseUrl || 'https://qoute-backend.onrender.com',
};
