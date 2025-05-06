// Serverless function - Vercel will add this file since it is under /api directory
import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = process.env.EXCHANGE_RATE_API_KEY; // Server-side environment variable
const API_BASE_URL = process.env.EXCHANGE_RATE_API_BASE_URL;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (!API_KEY) {
    return response.status(500).json({ error: 'ExchangeRate-API key is not configured on the server.' });
  }

  // Get baseCurrency from query parameter, default to USD
  const baseCurrency = typeof request.query.base === 'string' ? request.query.base.toUpperCase() : 'USD';

  try {
    const apiResponse = await fetch(`${API_BASE_URL}/${API_KEY}/latest/${baseCurrency}`);
    
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error('ExchangeRate-API Error:', errorData);
      return response.status(apiResponse.status).json({ error: errorData.error_type || 'Failed to fetch exchange rates from external API' });
    }

    const data = await apiResponse.json();
    return response.status(200).json(data.conversion_rates); // Send only the rates
  } catch (error) {
    console.error('Error in serverless function:', error);
    return response.status(500).json({ error: 'Internal server error while fetching exchange rates.' });
  }
}