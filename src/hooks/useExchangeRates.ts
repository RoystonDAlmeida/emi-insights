import { useQuery } from '@tanstack/react-query';

// The URL for your serverless function
const SERVERLESS_FUNCTION_URL = '/api/getExchangeRates'; 

const fetchExchangeRatesFromServerless = async (baseCurrency: string): Promise<Record<string, number>> => {
  // Call your serverless function
  const response = await fetch(`${SERVERLESS_FUNCTION_URL}?base=${baseCurrency}`); 
  if (!response.ok) {
    const errorData = await response.json();
    // Use the error message provided by your serverless function
    throw new Error(errorData.error || 'Failed to fetch exchange rates from serverless function');
  }
  // The serverless function is designed to return just the conversion_rates
  return response.json(); 
};

export const useExchangeRates = (baseCurrency: string = 'USD') => {
    return useQuery<Record<string, number>, Error>({
        queryKey: ['exchangeRates', baseCurrency],
        queryFn: () => fetchExchangeRatesFromServerless(baseCurrency),
        staleTime: 1000 * 60 * 60 * 4, // Cache data for 4 hours
    });
};