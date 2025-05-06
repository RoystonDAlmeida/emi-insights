import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

// The URL for your serverless function
const SERVERLESS_FUNCTION_URL = '/api/getExchangeRates'; 

const fetchExchangeRatesFromServerless = async (baseCurrency: string): Promise<Record<string, number>> => {
  try {
    // Call your serverless function using axios
    const response = await axios.get(SERVERLESS_FUNCTION_URL, {
      params: { base: baseCurrency },
    });
    // The serverless function is designed to return just the conversion_rates
    // Axios automatically parses JSON, so response.data contains the parsed body
    return response.data; 
  } catch (error) {
    const axiosError = error as AxiosError;
    // Try to get a specific error message from the serverless function's response
    // The serverless function might return an error object like { error: "message" }
    const serverErrorMessage = (axiosError.response?.data as { error?: string })?.error;
    // Fallback to axios's error message or a generic one
    throw new Error(serverErrorMessage || axiosError.message || 'Failed to fetch exchange rates from serverless function');
  }
};

export const useExchangeRates = (baseCurrency: string = 'USD') => {
    return useQuery<Record<string, number>, Error>({
        queryKey: ['exchangeRates', baseCurrency],
        queryFn: () => fetchExchangeRatesFromServerless(baseCurrency),
        staleTime: 1000 * 60 * 60 * 4, // Cache data for 4 hours
    });
};