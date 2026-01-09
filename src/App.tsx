import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AssortmentProvider } from "@/contexts/AssortmentContext";
import { FlyingThumbnail } from "@/components/assortment/FlyingThumbnail";
import { AssortmentTray } from "@/components/assortment/AssortmentTray";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import BrandStorefront from "./pages/BrandStorefront";
import CollectionDetail from "./pages/CollectionDetail";
import Experience from "./pages/Experience";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AssortmentProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/brands/:slug" element={<BrandStorefront />} />
            <Route path="/brands/:slug/collections/:collectionSlug" element={<CollectionDetail />} />
            <Route path="/experience" element={<Experience />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AssortmentTray />
          <FlyingThumbnail />
        </BrowserRouter>
      </AssortmentProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
