import { useState, useCallback } from 'react';
import { calculateEMI, generateAmortizationSchedule } from '@/utils/financial';

interface LoanParams {
  principal: number;
  annualRate: number;
  tenureYears: number;
}

export interface AmortizationEntry {
  month: number;
  principalPayment: number; 
  interestPayment: number;  
  remainingBalance: number;
}

interface UseLoanDetailsReturn {
  emi: number | null;
  amortizationSchedule: AmortizationEntry[];
  calculationError: string | null;
  hasCalculated: boolean;
  calculateLoanDetails: (params: LoanParams) => void;
  resetLoanDetails: () => void;
}

export const useLoanDetails = (): UseLoanDetailsReturn => {
  const [emi, setEmi] = useState<number | null>(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationEntry[]>([]);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  const calculateLoanDetails = useCallback((params: LoanParams) => {
    const { principal, annualRate, tenureYears } = params;

    if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
      setCalculationError('Principal, annual rate, and tenure must be positive values.');
      setEmi(null);
      setAmortizationSchedule([]);
      setHasCalculated(true); 
      return;
    }

    try {
      const calculatedEmi = calculateEMI(principal, annualRate, tenureYears);
      const scheduleFromUtil = generateAmortizationSchedule(principal, annualRate, tenureYears);
      
      const formattedSchedule = scheduleFromUtil.map(entry => ({
        ...entry,
        principalPayment: entry.principal, 
        interestPayment: entry.interest,   
      }));

      setEmi(calculatedEmi);
      setAmortizationSchedule(formattedSchedule);
      setCalculationError(null);
      setHasCalculated(true);
    } catch (error) {
      setCalculationError('An unexpected error occurred during calculation.');
      setEmi(null);
      setAmortizationSchedule([]);
      setHasCalculated(true);
    }
  }, []);

  const resetLoanDetails = useCallback(() => {
    setEmi(null);
    setAmortizationSchedule([]);
    setCalculationError(null);
    setHasCalculated(false);
  }, []);

  return { emi, amortizationSchedule, calculationError, hasCalculated, calculateLoanDetails, resetLoanDetails };
};