import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom"; // Import Outlet
import { AppLayout } from "./components/layout/AppLayout"; // Import AppLayout

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* AppLayout will wrap all protected routes */}
      <AppLayout>
        {/* Outlet renders the child routes defined in main.tsx */}
        <Outlet />
      </AppLayout>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;