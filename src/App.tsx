
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Studios from "./pages/Studios";
import AddStudio from "./pages/AddStudio";
import StudioDetails from "./pages/StudioDetails";
import StudioServices from "./pages/StudioServices";
import StudioRatings from "./pages/StudioRatings";
import StudioPayments from "./pages/StudioPayments";
import Services from "./pages/Services";
import Revenue from "./pages/Revenue";
import Users from "./pages/Users";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";
import OnboardRequests from "./pages/OnboardRequests";
import OrderDetails from "./pages/OrderDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/studios" element={<Studios />} />
          <Route path="/studios/add" element={<AddStudio />} />
          <Route path="/studios/:id" element={<StudioDetails />} />
          <Route path="/studios/:id/services" element={<StudioServices />} />
          <Route path="/studios/:id/ratings" element={<StudioRatings />} />
          <Route path="/studios/:id/payments" element={<StudioPayments />} />
          <Route path="/studios/onboard-requests" element={<OnboardRequests />} />
          <Route path="/services" element={<Services />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/orders/:orderId/details" element={<OrderDetails />} />
          <Route path="/users" element={<Users />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
