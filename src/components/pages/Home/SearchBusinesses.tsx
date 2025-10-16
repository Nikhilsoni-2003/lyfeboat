import BusinessCards from "@/components/cards/BusinessCards";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/useDebounce";
import {
  v1SearchBusinessSearchRetrieve,
  type BusinessSearchDetailsSchema,
} from "@/services/api/gen";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const SearchBusinesses = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<BusinessSearchDetailsSchema>>(
    []
  );
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 500);

  const goToBusiness = (id: string) => {
    navigate({ to: "/$businessPage", params: { businessPage: id } });
  };

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await v1SearchBusinessSearchRetrieve({
          query: {
            query: debouncedQuery,
          },
        });
        if (data?.data) setResults(data.data);
      } catch (err) {
        console.error("Failed to fetch:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <Input
        id="search"
        placeholder="Search for services..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 h-12 rounded-lg border-gray-300"
      />
      {loading && (
        <div className="flex justify-center absolute bg-white w-full py-2 rounded-b-md">
          <Spinner />
        </div>
      )}

      {!loading && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-md max-h-56 overflow-auto">
          {results.map((business, idx) => (
            <li
              key={idx}
              className={`px-2 py-1 cursor-pointer ${
                // idx === activeIndex ? "bg-gray-100" :
                "hover:bg-gray-50"
              }`}
              onClick={() => goToBusiness(business.id)}
            >
              <BusinessCards business={business} />
            </li>
          ))}
        </ul>
      )}

      {!loading && !results.length && debouncedQuery.trim() && (
        <p className=" text-accent-foreground text-center absolute mt-2 bg-background w-full py-2 rounded-b-md">
          No results found
        </p>
      )}
    </div>
  );
};

export default SearchBusinesses;
