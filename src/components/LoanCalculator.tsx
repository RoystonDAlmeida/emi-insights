import { useState, useEffect } from "react";
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress 
} from "@mui/material";
import { useTheme } from "@mui/material/styles"; // Corrected import for useTheme
import { CalculatorIcon, RefreshCcw, Landmark } from "lucide-react"; // Added Landmark for currency icon
import { formatCurrency } from "@/utils/financial";
import { useCurrency } from "@/context/CurrencyContext"; // Removed availableCurrencies import
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useLoanDetails, AmortizationEntry } from "@/hooks/useLoanDetails"; // Import the custom hook and its types
import { toast } from "sonner"; // Assuming you use sonner for toasts
import { Alert } from "@mui/material"; // For displaying errors

const LoanCalculator = () => {
  // Local state for form inputs
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTerm, setLoanTerm] = useState<number>(5);
  // No longer need baseEmiCurrency state, as loan input is always USD, so EMI from hook is always USD.
  const [isCalculatingLoan, setIsCalculatingLoan] = useState<boolean>(false);

  // Use the custom hook for calculation logic and state
  const {
    emi,
    amortizationSchedule,
    calculationError,
    hasCalculated,
    calculateLoanDetails,
    resetLoanDetails
  } = useLoanDetails();

  const { 
    currentCurrency, 
    changeCurrency, 
    convertAmount,
    isLoading: ratesLoading, 
    allAvailableCurrencies // Use the new dynamic list from context
  } = useCurrency();
  const theme = useTheme(); // Get the theme object

  // This effect handles the aftermath of the calculation triggered by `calculateLoanDetails`
  useEffect(() => {
    // Only act if a calculation was started and the hook has finished processing
    if (isCalculatingLoan && hasCalculated) {
      if (emi !== null && !calculationError) {
        toast.success("EMI and Amortization Schedule Calculated!");
        // Set current display currency to USD after successful calculation
        if (currentCurrency !== 'USD') {
          changeCurrency('USD');
        }
      }
      // If there's a calculationError, the Alert component will display it.
      setIsCalculatingLoan(false); // Calculation process is complete (success or error)
    }
  }, [isCalculatingLoan, hasCalculated, emi, calculationError, toast, changeCurrency, currentCurrency]);

  const handleCalculate = () => {
    setIsCalculatingLoan(true);
    // Loan amount is USD, so emi from hook will be in USD.
    // Call the hook's calculation function.
    // The hook will update its `emi`, `amortizationSchedule`, `hasCalculated`, `calculationError`.
    // The useEffect above will react to these changes.
    calculateLoanDetails({
      principal: loanAmount,
      annualRate: interestRate,
      tenureYears: loanTerm,
    });
  };

  const handleReset = () => {
    resetLoanDetails(); // Use the hook's reset function
    // Reset form fields to initial or desired default values
    setLoanAmount(100000);
    setInterestRate(8.5);
    setLoanTerm(5);
    setIsCalculatingLoan(false); // Stop any loading indication
    toast.info("Inputs and calculations have been reset.");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom fontWeight="bold">
        EMI Insights Dashboard
      </Typography>
      
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <TextField
                id="loanAmount"
                label="Loan Amount (USD)"
                type="number"
                fullWidth
                variant="outlined"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid xs={12} md={4}>
              <TextField
                id="interestRate"
                label="Interest Rate (%)"
                type="number"
                fullWidth
                variant="outlined"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                InputProps={{ inputProps: { min: 0.01, step: 0.01 } }}
              />
            </Grid>
            
            <Grid xs={12} md={4}>
              <TextField
                id="loanTerm"
                label="Term (Years)"
                type="number"
                fullWidth
                variant="outlined"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleCalculate}
              disabled={isCalculatingLoan} // Disable button while calculating
              startIcon={<CalculatorIcon size={20} style={{ color: 'white' }} />} // Icon color white
              sx={{
                bgcolor: theme.palette.primary.dark, // Purple background (same as light mode nav)
                color: 'white', // Text color white
                fontWeight: 'bold', // Bold text
                '&:hover': {
                  bgcolor: !isCalculatingLoan ? theme.palette.primary.main : undefined, // Slightly lighter purple on hover, if not disabled
                },
                mr: isCalculatingLoan ? 2 : 0 // Add margin if loading indicator is present
              }}
            >
              CALCULATE
            </Button>
            {isCalculatingLoan && <CircularProgress size={24} />}
          </Box>
        </CardContent>
      </Card>
      
      {isCalculatingLoan && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 1 }}>Calculating your EMI...</Typography>
        </Box>
      )}

      {!isCalculatingLoan && hasCalculated && emi !== null && !calculationError && (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
              {/* EMI from hook is in USD, convert to current display currency */}
              Monthly EMI: {formatCurrency(convertAmount(emi, 'USD', currentCurrency), currentCurrency)}
            </Typography>
            {ratesLoading && <Typography variant="caption" sx={{ ml: 1 }}>(Updating rates...)</Typography>}
            
            <Box sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 2
            }}>
              <FormControl sx={{ mb: { xs: 2, sm: 0 }, minWidth: 120 }}>
                <InputLabel id="currency-select-label">Currency</InputLabel>
                <Select
                  labelId="currency-select-label"
                  id="currency-select"
                  value={currentCurrency}
                  label="Currency"
                  onChange={(e) => changeCurrency(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 250, // Adjust this value as needed (e.g., 5 items * 48px/item + padding)
                      },
                    },
                  }}
                >
                  {/* Populate dropdown with allAvailableCurrencies from context */}
                  {allAvailableCurrencies.map(currencyCode => (
                    <MenuItem key={currencyCode} value={currencyCode}>
                      {currencyCode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button
                variant="outlined"
                onClick={handleReset}
                startIcon={<RefreshCcw size={20} />}
              >
                RESET TABLE
              </Button>
            </Box>
          </Box>
          
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Amortization Schedule ({currentCurrency})
              </Typography>
              {ratesLoading && <Typography variant="caption" sx={{ ml: 1 }}>(Updating rates for schedule...)</Typography>}
              
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell>Principal ({currentCurrency})</TableCell>
                      <TableCell>Interest ({currentCurrency})</TableCell>
                      <TableCell>Remaining Balance ({currentCurrency})</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {amortizationSchedule.map((payment) => {
                      // payment.principalPayment, etc., from hook are in USD. Convert to current display currency.
                      const principalDisplay = convertAmount(payment.principalPayment, 'USD', currentCurrency);
                      const interestDisplay = convertAmount(payment.interestPayment, 'USD', currentCurrency);
                      const balanceDisplay = convertAmount(payment.remainingBalance, 'USD', currentCurrency);
                      return (
                      <TableRow key={payment.month}>
                        <TableCell>{payment.month}</TableCell>
                        <TableCell>{formatCurrency(principalDisplay, currentCurrency)}</TableCell>
                        <TableCell>{formatCurrency(interestDisplay, currentCurrency)}</TableCell>
                        <TableCell>{formatCurrency(balanceDisplay, currentCurrency)}</TableCell>
                      </TableRow>
                    );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
      {!isCalculatingLoan && hasCalculated && calculationError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {calculationError}
        </Alert>
      )}
    </Container>
  );
};

export default LoanCalculator;
