
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">About This App</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <p className="mb-4">
            This Loan Calculator App is a modern, single-page web application built using <strong>React JS</strong> and <strong>Material UI</strong>. 
            It allows users to calculate loan EMIs (Equated Monthly Installments), view a detailed amortization schedule, 
            and see real-time currency conversions of their EMI using live exchange rates.
          </p>
        </CardContent>
      </Card> 
      
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span className="inline-block mr-2">🛠️</span> Features
      </h2>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <ul className="list-disc pl-6 space-y-2">
            <li>Loan EMI calculation using standard financial formulas</li>
            <li>Dynamic amortization schedule table with monthly breakdown</li>
            <li>Real-time currency conversion of EMI using a live exchange rate API</li>
            <li>Paginated exchange rate table for 160+ currencies</li>
            <li>Dark/Light mode toggle for a customizable experience</li>
            <li>Collapsible header navigation on mobile screens</li>
            <li>Fully responsive UI built with Material UI</li>
          </ul>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span className="inline-block mr-2">📦</span> Technologies Used
      </h2>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>React</strong> (Hooks, Routing, Context API)</li>
            <li><strong>Material UI</strong> for styling and responsive components</li>
            <li><strong>Axios</strong> for API calls</li>
            <li><strong>Exchange Rate API</strong> for real-time currency conversion</li>
          </ul>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span className="inline-block mr-2">🧮</span> EMI Formula Used
      </h2>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <p className="mb-4">The EMI (Equated Monthly Installment) is calculated using the standard formula:</p>
          
          <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4">
            EMI = [P × R × (1+R)<sup>N</sup>] / [(1+R)<sup>N</sup> − 1]
          </div>
          
          <p className="mb-2">Where:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>P = Principal loan amount</li>
            <li>R = Monthly interest rate (annual rate / 12 / 100)</li>
            <li>N = Loan duration in months</li>
          </ul>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span className="inline-block mr-2">🌐</span> Currency Conversion API
      </h2>
      
      <Card>
        <CardContent className="pt-6">
          <p className="mb-4">This app integrates with the free tier of the <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ExchangeRate-API</a> to fetch live exchange rates.</p>
          
          <p className="font-mono text-sm bg-muted p-3 rounded mb-4">
            API Endpoint Example:<br />
            https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD
          </p>
          
          <p className="mb-4">You must register and obtain a free API key to use this endpoint. Then, add the api key EXCHANGE_RATE_API_KEY in the .env file with your actual key.</p>
          
          <p className="mb-4">
            <span className="inline-block mr-2">⚠️</span>
            For any currency conversion feature to work, make sure the API key is valid and the network allows external API calls.
          </p>
        </CardContent>
      </Card>

    </div>
  );
};

export default About;
