import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bike, Car, Truck, Key } from "lucide-react";
import RideBooking from "@/components/transport/RideBooking";
import VehicleRental from "@/components/transport/VehicleRental";
import MyRides from "@/components/transport/MyRides";
import DriverDashboard from "@/components/transport/DriverDashboard";
import { useAuth } from "@/contexts/AuthContext";

const TransportPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("book");

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              🚖 Transport & Location
            </h1>
            <p className="text-muted-foreground">
              Moto-taxi, taxi, utilitaire ou location de voiture
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
              <TabsTrigger 
                value="book" 
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="hidden sm:inline">Commander</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="rental"
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  <span className="hidden sm:inline">Location</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="my-rides"
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2">
                  <Bike className="h-4 w-4" />
                  <span className="hidden sm:inline">Mes trajets</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="driver"
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span className="hidden sm:inline">Chauffeur</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="book" className="mt-6">
              <RideBooking />
            </TabsContent>

            <TabsContent value="rental" className="mt-6">
              <VehicleRental />
            </TabsContent>

            <TabsContent value="my-rides" className="mt-6">
              <MyRides />
            </TabsContent>

            <TabsContent value="driver" className="mt-6">
              <DriverDashboard />
            </TabsContent>
        </Tabs>
        </div>
      </div>
    </>
  );
};

export default TransportPage;
