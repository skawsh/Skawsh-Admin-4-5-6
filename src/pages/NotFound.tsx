
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-laundry-gray">
      <div className="text-center glass-card p-12 max-w-md animate-fade-in">
        <h1 className="text-5xl font-bold mb-4 text-laundry-blue">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="inline-flex items-center justify-center px-5 py-2.5 bg-laundry-blue text-white font-medium rounded-md hover:bg-laundry-blue-dark transition-colors">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
