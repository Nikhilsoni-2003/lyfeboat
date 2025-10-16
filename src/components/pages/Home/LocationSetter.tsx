import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/useDebounce";
import { v1SearchNearbyRetrieve } from "@/services/api/gen";
import { Globe, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

const mockApiSearch = async (query: string): Promise<LocationData[]> => {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 600));

  // Mocked API data (you can replace with your backend later)
  return [
    {
      address: `${query} Main Street, City A`,
      latitude: 12.9716,
      longitude: 77.5946,
    },
    {
      address: `${query} Central Park, City B`,
      latitude: 19.076,
      longitude: 72.8777,
    },
    {
      address: `${query} Downtown Plaza, City C`,
      latitude: 28.6139,
      longitude: 77.209,
    },
  ];
};

const LocationSetter = () => {
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [results, setResults] = useState<LocationData[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const debouncedQuery = useDebounce(location, 500);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const mockResults = await mockApiSearch(debouncedQuery);
        setResults(mockResults);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  const handleSelect = (item: LocationData) => {
    setLocation(item.address);
    setResults([]);
    setLocationData(item);
    toast.success("Location selected", {
      description: item.address,
    });

    v1SearchNearbyRetrieve({
      query: {
        latitude: item.latitude,
        longitude: item.longitude,
      },
    }).then(() => console.log("Mock backend request sent:", item));
  };

  const handleManualSubmit = async () => {
    if (!location.trim()) return;
    setIsLoading(true);
    try {
      const mockResults = await mockApiSearch(location);
      setResults(mockResults);
      toast.info("Manual search triggered", {
        description: `Showing results for "${location}"`,
      });
    } catch (err) {
      toast.error("Failed to fetch location data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0) {
          handleSelect(results[activeIndex]);
        } else {
          handleManualSubmit();
        }
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleManualSubmit();
    }
  };

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.info("Geolocation not supported", {
        description: "Your browser doesn't support geolocation.",
      });
      return;
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation" as PermissionName,
      });

      if (permission.state === "denied") {
        toast.error("Location permission denied", {
          description:
            "Please enable location access in your browser settings.",
        });
        return;
      }

      // Only continue if granted or prompt (prompt will show native popup)
      setIsGeoLoading(true);

      const fetchLocation = () => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const { data } = await v1SearchNearbyRetrieve({
                query: { latitude, longitude },
              });

              setLocationData({
                address: "Your current location",
                latitude,
                longitude,
              });
              setLocation("Your current location");
              toast.success("Current location set!");
            } catch (error) {
              console.error(error);
              toast.error("Failed to fetch nearby data");
            } finally {
              setIsGeoLoading(false);
            }
          },
          (error) => {
            console.error(error);
            setIsGeoLoading(false);
            if (error.code === error.PERMISSION_DENIED) {
              toast.error("Permission denied", {
                description: "Please enable location access and try again.",
              });
            } else if (error.code === error.TIMEOUT) {
              toast.error("Location timeout", {
                description: "Couldn't get location in time, please retry.",
              });
            } else {
              toast.error("Failed to get your location");
            }
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      };

      if (permission.state === "granted") {
        // ✅ Already granted — fetch directly, no prompt
        fetchLocation();
      } else if (permission.state === "prompt") {
        // ⚙️ Not yet decided — browser will ask for permission once
        fetchLocation();
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error while checking location permission");
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Enter your location"
          className="pl-10 h-12 rounded-lg border-gray-300"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
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
            <Spinner className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Globe className="w-5 h-5 text-gray-400" />
          )}
        </Button>
      </div>

      {/* Dropdown */}
      {results.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-md max-h-56 overflow-auto">
          {results.map((item, idx) => (
            <li
              key={idx}
              className={`px-4 py-2 cursor-pointer ${
                idx === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
              onClick={() => handleSelect(item)}
            >
              {item.address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSetter;
