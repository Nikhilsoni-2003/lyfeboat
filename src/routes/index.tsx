import { BusinessListings } from "@/components/BusinessListing";
import { CarouselDemo } from "@/components/Carousel";
import { ServiceCategories } from "@/components/CategoryGrid";
import { PromoBanner } from "@/components/PromoBanner";
import { SearchBar } from "@/components/SearchBar";
import { createFileRoute } from "@tanstack/react-router";

function HomePage() {
  return (
    <main className="py-8 space-y-8 px-2 md:px-10">
      <SearchBar />
      <PromoBanner />
      <div className="flex flex-col lg:grid grid-cols-2 gap-5">
        <ServiceCategories />
        <BusinessListings />
      </div>
      <CarouselDemo />
    </main>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});
