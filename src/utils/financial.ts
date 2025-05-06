
/**
 * Calculate the EMI (Equated Monthly Installment)
 * Formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
 * Where:
 * P = Principal loan amount
 * R = Monthly interest rate (annual rate ÷ 12 ÷ 100)
 * N = Total number of monthly payments (tenure in months)
 */
export const calculateEMI = (principal: number, annualRate: number, tenureYears: number): number => {
  // Convert annual interest rate to monthly rate
  const monthlyRate = annualRate / 12 / 100;
  
  // Convert tenure from years to months
  const tenureMonths = tenureYears * 12;
  
  // Calculate EMI using the formula
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  
  return emi;
};

/**
 * Generate the amortization schedule
 * Returns an array of payment details for each month
 */
export const generateAmortizationSchedule = (
  principal: number, 
  annualRate: number, 
  tenureYears: number
): Array<{
  month: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}> => {
  const monthlyRate = annualRate / 12 / 100;
  const tenureMonths = tenureYears * 12;
  const emi = calculateEMI(principal, annualRate, tenureYears);
  
  let balance = principal;
  const schedule = [];
  
  for (let month = 1; month <= tenureMonths; month++) {
    const interestForMonth = balance * monthlyRate;
    const principalForMonth = emi - interestForMonth;
    
    balance -= principalForMonth;
    
    // Handle potential floating point errors in the final payment
    if (month === tenureMonths) {
      balance = Math.abs(balance) < 0.01 ? 0 : balance;
    }
    
    schedule.push({
      month,
      principal: principalForMonth,
      interest: interestForMonth,
      remainingBalance: balance
    });
  }
  
  return schedule;
};

/**
 * Format currency with appropriate symbol
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
