
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PetProvider } from "@/context/PetContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Pages
import Home from "@/pages/Home";
import PetDetails from "@/pages/PetDetails";
import MyPets from "@/pages/MyPets";
import Wishlist from "@/pages/Wishlist";
import Profile from "@/pages/Profile";
import AddPet from "@/pages/AddPet";
import EditPet from "@/pages/EditPet";
import NotFound from "@/pages/NotFound";
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

interface AppProps {
  openLoginModal: () => void;
  openSignupModal: () => void;
}

const App = ({ openLoginModal, openSignupModal }: AppProps) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <PetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Header 
                isLoggedIn={isAuthenticated} 
                onLogin={openLoginModal}
                onSignup={openSignupModal}
                onLogout={logout}
              />
              
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/pet/:id" element={<PetDetails />} />
                  <Route path="/my-pets" element={<MyPets />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/add-pet" element={<AddPet />} />
                  <Route path="/edit-pet/:id" element={<EditPet />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </PetProvider>
    </QueryClientProvider>
  );
};

export default App;
