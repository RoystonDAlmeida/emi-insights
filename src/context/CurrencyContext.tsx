
import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { toast } from 'sonner';
import { useExchangeRates } from '@/hooks/useExchangeRates'; // Import the custom hook

// Define the shape of your context data
interface CurrencyContextType {
  currentCurrency: string;
  changeCurrency: (newCurrency: string) => void;
  convertAmount: (amount: number, sourceCurrency: string, targetCurrency: string) => number;
  exchangeRates: Record<string, number> | undefined; // Data from react-query can be undefined
  isLoading: boolean;
  allAvailableCurrencies: string[]; // To hold all currencies derived from exchangeRates
}

// Create the context with a default value
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

// Create a provider component
export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currentCurrency, setCurrentCurrency] = useState<string>('USD');
  
  // Use the custom hook to fetch exchange rates.
  // The hook defaults to 'USD' as base, which is fine as ExchangeRate-API free tier
  // usually provides all rates against a single chosen base.
  const { data: exchangeRates, isLoading, error } = useExchangeRates('USD');

  // Derive all available currencies from the fetched rates
  const allAvailableCurrencies = useMemo(() => {
    if (exchangeRates && Object.keys(exchangeRates).length > 0) {
      return Object.keys(exchangeRates).sort();
    }
    return ['USD']; // Fallback to USD if rates aren't loaded or are empty
  }, [exchangeRates]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching rates in CurrencyContext:', error);
      toast.error(`Failed to load exchange rates: ${error.message}. Conversions may not be accurate.`);
    }
    // The API key is now server-side, so no client-side check for VITE_EXCHANGE_RATE_API_KEY is needed here.
    // The serverless function will handle API key errors.
  }, [error]);

  const changeCurrency = (newCurrency: string) => {
    // Validate against the dynamically generated list of all available currencies
    if (allAvailableCurrencies.includes(newCurrency)) {
      setCurrentCurrency(newCurrency);
    } else {
      console.warn(`Attempted to change to an unavailable currency: ${newCurrency}. Available currencies: ${allAvailableCurrencies.join(', ')}`);
      // Optionally, inform the user with a toast, though the UI should prevent this.
    }
  };

  const convertAmount = (amount: number, sourceCurrency: string, targetCurrency: string): number => {
    if (!exchangeRates || isLoading) {
      // console.warn('Exchange rates not available for conversion, returning original amount.');
      return amount;
    }

    // If source and target are the same, no conversion needed
    if (sourceCurrency === targetCurrency) {
      return amount;
    }

    const rateForSource = exchangeRates[sourceCurrency]; // Rate of sourceCurrency relative to USD
    const rateForTarget = exchangeRates[targetCurrency]; // Rate of targetCurrency relative to USD

    if (typeof rateForSource !== 'number' || rateForSource === 0) {
      console.warn(`Exchange rate for source currency ${sourceCurrency} not found or is zero. Returning original amount.`);
      return amount; 
    }
    if (typeof rateForTarget !== 'number') {
      console.warn(`Exchange rate for target currency ${targetCurrency} not found. Returning original amount.`);
      return amount; 
    }

    // Convert amount from sourceCurrency to USD
    const amountInUSD = amount / rateForSource;

    // Convert amountInUSD to targetCurrency
    const convertedAmount = amountInUSD * rateForTarget;
    return convertedAmount;
  };
  return (
    <CurrencyContext.Provider value={{
      currentCurrency,
      changeCurrency,
      convertAmount,
      exchangeRates,
      isLoading,
      allAvailableCurrencies // Provide the derived list of all currencies
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Create a custom hook for easy consupmtion
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
