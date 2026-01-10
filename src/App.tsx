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
import SampleCrate from "./pages/experience/SampleCrate";
import SampleCrateCheckout from "./pages/experience/SampleCrateCheckout";
import B2BOrder from "./pages/experience/B2BOrder";
import PrivateShowcase from "./pages/experience/PrivateShowcase";
import TradeShow from "./pages/experience/TradeShow";
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
            <Route path="/experience/sample-crate" element={<SampleCrate />} />
            <Route path="/experience/sample-crate/checkout" element={<SampleCrateCheckout />} />
            <Route path="/experience/b2b-order" element={<B2BOrder />} />
            <Route path="/experience/private-showcase" element={<PrivateShowcase />} />
            <Route path="/experience/trade-show" element={<TradeShow />} />
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
