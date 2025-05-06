
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-primary-purple mb-4">Page Not Found</h1>
        <div className="text-9xl font-bold mb-8 text-gray-300 dark:text-gray-700">404</div>
        <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
        <p className="text-muted-foreground mb-8">
          The URL <code className="bg-muted px-1 py-0.5 rounded">{location.pathname}</code> could not be found.
        </p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
