import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { Globe, Loader2, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ListBussinessFeat from "../features/listBussiness/index";

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

export function SearchBar() {
  const [location, setLocation] = useState("");
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeoLoading, setIsGeoLoading] = useState(false);

  const navigate = useNavigate();

  const geocodeAddress = async (
    address: string
  ): Promise<LocationData | null> => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=YOUR_API_KEY&limit=1`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          address: result.formatted,
          latitude: result.geometry.lat,
          longitude: result.geometry.lng,
        };
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=YOUR_API_KEY&limit=1`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        return data.results[0].formatted;
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setIsLoading(true);
    try {
      const result = await geocodeAddress(location.trim());
      if (result) {
        setLocationData(result);
        toast.success("Location found!", {
          description: `Found: ${result.address}`,
        });
      } else {
        toast.warning("Location not found", {
          description: "Please try a different address or location name.",
        });
      }
    } catch (error) {
      toast.error("Failed to find location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.info("Geolocation not supported", {
        description: "Your browser doesn't support geolocation.",
      });
      return;
    }

    setIsGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const address = await reverseGeocode(latitude, longitude);
          const locationData: LocationData = {
            address,
            latitude,
            longitude,
          };
          setLocationData(locationData);
          setLocation(address);
          toast.success("Current location found!", {
            description: `Location: ${address}`,
          });
        } catch (error) {
          toast.error("Failed to get address for your location.");
        } finally {
          setIsGeoLoading(false);
        }
      },
      (error) => {
        setIsGeoLoading(false);
        let errorMessage = "Failed to get your location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        toast.error("Location Error", {
          description: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const goToDashboard = () => {
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex justify-between flex-col md:flex-row gap-5 items-center">
      <div className="flex md:space-x-3 flex-col md:flex-row gap-5">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Enter your location"
            className="pl-10 h-12 rounded-lg border-gray-300"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isLoading || isGeoLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={handleCurrentLocation}
            disabled={isLoading || isGeoLoading}
          >
            {isGeoLoading ? (
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <Globe className="w-5 h-5 text-gray-400" />
            )}
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search for services..."
            className="pl-10 h-12 rounded-lg border-gray-300"
          />
        </div>
      </div>

      <div className="flex gap-5">
        <Button onClick={goToDashboard}>Go to Dashboard</Button>
        <ListBussinessFeat />
      </div>
    </div>
  );
}
