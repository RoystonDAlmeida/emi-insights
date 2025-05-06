
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { useCurrency } from "@/context/CurrencyContext";

const ITEMS_PER_PAGE = 10;

const ExchangeRates = () => {
  const { currentCurrency, exchangeRates, isLoading: ratesLoading } = useCurrency();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Use all keys from the fetched exchangeRates object if available, otherwise fall back to predefined availableCurrencies
  const allPossibleCurrencies = exchangeRates ? Object.keys(exchangeRates) : availableCurrencies;
  
  // Filter currencies based on search term
  const filteredCurrencies = allPossibleCurrencies.filter(currency => 
    currency.toLowerCase().includes(search.toLowerCase())
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredCurrencies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCurrencies = filteredCurrencies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Live Exchange Rates</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <p className="mb-6">
            View current exchange rates relative to {currentCurrency}. These rates are used for currency conversion throughout the application.
          </p>
          <div className="mb-6">
            <Label htmlFor="search" className="mb-2 block">Search Currency</Label>
            <Input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter currency code..."
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency</TableHead>
                  <TableHead>Exchange Rate (1 {currentCurrency} =)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ratesLoading && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">Loading exchange rates...</TableCell>
                  </TableRow>
                )}
                {!ratesLoading && paginatedCurrencies.map((targetCurrency) => {
                  let displayRate = "N/A";
                  if (exchangeRates) {
                    if (targetCurrency === currentCurrency) {
                      displayRate = "1.0000";
                    } else {
                      const rateOfCurrentToBase = exchangeRates[currentCurrency]; // e.g., EUR to USD
                      const rateOfTargetToBase = exchangeRates[targetCurrency]; // e.g., INR to USD
                      if (typeof rateOfCurrentToBase === 'number' && rateOfCurrentToBase !== 0 && typeof rateOfTargetToBase === 'number') {
                        displayRate = (rateOfTargetToBase / rateOfCurrentToBase).toFixed(4);
                      }
                    }
                  }
                  return (
                    <TableRow key={targetCurrency}>
                      <TableCell className="font-medium">{targetCurrency}</TableCell>
                      <TableCell>{displayRate}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Adjust the range of pages shown based on current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNum);
                        }}
                        isActive={pageNum === currentPage}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExchangeRates;
