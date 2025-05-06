
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
} from "@mui/material"; // Import useTheme
import { useTheme } from "@mui/material";
import { CalculatorIcon, RefreshCcw } from "lucide-react";
import { calculateEMI, generateAmortizationSchedule, formatCurrency } from "@/utils/financial";
import { useCurrency, availableCurrencies } from "@/context/CurrencyContext";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTerm, setLoanTerm] = useState<number>(5);
  const [emi, setEmi] = useState<number>(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState<Array<any>>([]);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const { currentCurrency, changeCurrency } = useCurrency();
  const theme = useTheme(); // Get the theme object

  const handleCalculate = () => {
    try {
      // Calculate EMI
      const calculatedEmi = calculateEMI(loanAmount, interestRate, loanTerm);
      setEmi(calculatedEmi);
      
      // Generate amortization schedule
      const schedule = generateAmortizationSchedule(loanAmount, interestRate, loanTerm);
      setAmortizationSchedule(schedule);
      
      setHasCalculated(true);
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  const handleReset = () => {
    setAmortizationSchedule([]);
    setHasCalculated(false);
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
      
      {hasCalculated && (
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
                        <TableCell>{formatCurrency(payment.principal, currentCurrency)}</TableCell>
                        <TableCell>{formatCurrency(payment.interest, currentCurrency)}</TableCell>
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
    </Container>
  );
};

export default LoanCalculator;
