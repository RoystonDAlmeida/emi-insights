
import { useState } from "react";
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
  MenuItem 
} from "@mui/material";
import { useTheme } from "@mui/material/styles"; // Corrected import for useTheme
import { CalculatorIcon, RefreshCcw } from "lucide-react";
import { formatCurrency } from "@/utils/financial"; // calculateEMI & generateAmortizationSchedule will be used by the hook
import { useCurrency, availableCurrencies } from "@/context/CurrencyContext";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useLoanDetails, AmortizationEntry } from "@/hooks/useLoanDetails"; // Import the custom hook and its types
import { toast } from "sonner"; // Assuming you use sonner for toasts
import { Alert } from "@mui/material"; // For displaying errors

const LoanCalculator = () => {
  // Local state for form inputs
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTerm, setLoanTerm] = useState<number>(5);

  // Use the custom hook for calculation logic and state
  const {
    emi,
    amortizationSchedule,
    calculationError,
    hasCalculated,
    calculateLoanDetails,
    resetLoanDetails
  } = useLoanDetails();

  const { currentCurrency, changeCurrency } = useCurrency();
  const theme = useTheme(); // Get the theme object

  const handleCalculate = () => {
    try {
      // Call the hook's calculation function
      calculateLoanDetails({
        principal: loanAmount,
        annualRate: interestRate,
        tenureYears: loanTerm,
      });
      // Toast notification can remain here or be moved into the hook if desired
      // For now, let's assume the hook doesn't handle toasts directly.
      if (!calculationError) { // Check if hook's calculation was successful before toasting success
        toast.success("EMI and Amortization Schedule Calculated!");
      }

    } catch (error) {
      console.error("Calculation error:", error);
      // This catch block might be redundant if the hook handles errors robustly
      // but can be kept for unexpected errors outside the hook's scope.
      toast.error("An unexpected error occurred. Please check console.");
    }
  };

  const handleReset = () => {
    resetLoanDetails(); // Use the hook's reset function
    // Reset form fields to initial or desired default values
    setLoanAmount(100000);
    setInterestRate(8.5);
    setLoanTerm(5);
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
            <Grid item xs={12} md={4}>
              <TextField
                id="loanAmount"
                label="Loan Amount"
                type="number"
                fullWidth
                variant="outlined"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
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
            
            <Grid item xs={12} md={4}>
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
          
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleCalculate}
              startIcon={<CalculatorIcon size={20} style={{ color: 'white' }} />} // Icon color white
              sx={{
                bgcolor: theme.palette.primary.dark, // Purple background (same as light mode nav)
                color: 'white', // Text color white
                fontWeight: 'bold', // Bold text
                '&:hover': {
                  bgcolor: theme.palette.primary.main, // Slightly lighter purple on hover
                }
              }}
            >
              CALCULATE
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {hasCalculated && !calculationError && emi !== null && (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Monthly EMI: {formatCurrency(emi, currentCurrency)}
            </Typography>
            
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
                >
                  {availableCurrencies.map(currency => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
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
              
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell>Principal</TableCell>
                      <TableCell>Interest</TableCell>
                      <TableCell>Remaining Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {amortizationSchedule.map((payment) => (
                      <TableRow key={payment.month}>
                        <TableCell>{payment.month}</TableCell>
                        <TableCell>{formatCurrency(payment.principalPayment, currentCurrency)}</TableCell>
                        <TableCell>{formatCurrency(payment.interestPayment, currentCurrency)}</TableCell>
                        <TableCell>{formatCurrency(payment.remainingBalance, currentCurrency)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
      {hasCalculated && calculationError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {calculationError}
        </Alert>
      )}
    </Container>
  );
};

export default LoanCalculator;
