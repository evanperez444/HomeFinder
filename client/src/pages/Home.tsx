import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Home, Building, Tag, Calendar } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyFilters from "@/components/property/PropertyFilters";
import AppointmentForm from "@/components/forms/AppointmentForm";
import { Property, PropertyFilter } from "@shared/schema";
import { StatCard, TestimonialCard, NeighborhoodCard } from "@/components/ui/data-display";

const HomePage = () => {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<PropertyFilter>({});
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  // Fetch featured properties
  const { data: featuredProperties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
  });

  // Fetch all properties instead of just featured ones
  const { data: properties = [], isLoading: isLoadingProperties } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const handleFilterSubmit = (newFilters: PropertyFilter) => {
    setFilters(newFilters);
    if (newFilters.listingType) {
      setLocation(`/${newFilters.listingType}`);
    }
  };

  const handleScheduleViewing = (propertyId: number) => {
    const property = featuredProperties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setAppointmentModalOpen(true);
    }
  };

  // Sample neighborhood data
  const neighborhoods = [
    { name: "Beverly Hills", listingsCount: 24 },
    { name: "Santa Monica", listingsCount: 32 },
    { name: "Pasadena", listingsCount: 18 },
    { name: "Downtown LA", listingsCount: 41 }
  ];

  // Sample testimonial data
  const testimonials = [
    {
      quote: "HomeFinder made our home buying process so much easier. The search filters were exactly what we needed, and our agent was incredible. We found our dream home in just three weeks!",
      author: "Jennifer P.",
      role: "First-time Homebuyer",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    },
    {
      quote: "As an investor, I appreciate how HomeFinder lets me filter for properties with good ROI potential. The neighborhood statistics and price history charts are invaluable for my decision making.",
      author: "Robert K.",
      role: "Property Investor",
      rating: 4.5,
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    },
    {
      quote: "Selling our home was stress-free with HomeFinder. The platform made it easy to list our property, and the professional photography service they recommended made our home look amazing in the photos!",
      author: "Maria T.",
      role: "Home Seller",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-dark text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1000')" }}
        ></div>
        <div className="container mx-auto px-4 relative z-10 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Home</h1>
            <p className="text-lg md:text-xl mb-8">Search through thousands of listings to find the perfect home for you and your family.</p>
            
            {/* Search Filters */}
            <PropertyFilters onFilter={handleFilterSubmit} />
          </div>
        </div>
      </section>

      {/* All Listings Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-dark">Property Listings</h2>
            <Link href="/buy" className="text-primary font-medium hover:underline">
              View All <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>
          
          {/* Property Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingProperties ? (
              // Loading skeleton
              Array(6).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-full mt-4 animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property}
                  onScheduleViewing={handleScheduleViewing}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No properties available at the moment.</p>
                <button 
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Neighborhoods Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-8">Explore Popular Neighborhoods</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Popular Neighborhoods</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {neighborhoods.map((neighborhood, index) => (
                <NeighborhoodCard 
                  key={index}
                  name={neighborhood.name}
                  listingsCount={neighborhood.listingsCount}
                  onClick={() => {
                    setFilters({ ...filters, city: neighborhood.name });
                    setLocation('/buy');
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-dark text-center mb-12">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard 
              icon={<Home className="text-primary text-2xl" />}
              title="Buy a Home"
              value="Find your place with an immersive photo experience and the most listings, including things you won't find anywhere else."
              color="bg-primary bg-opacity-10"
            />
            
            <StatCard 
              icon={<Building className="text-secondary text-2xl" />}
              title="Rent a Home"
              value="We're creating a seamless online experience from shopping on the largest rental network, to applying, to paying rent."
              color="bg-secondary bg-opacity-10"
            />
            
            <StatCard 
              icon={<Tag className="text-accent text-2xl" />}
              title="Sell a Home"
              value="No matter what path you take to sell your home, we can help you navigate a successful sale."
              color="bg-accent bg-opacity-10"
            />
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-dark text-center mb-12">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                rating={testimonial.rating}
                imageUrl={testimonial.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">Join thousands of satisfied customers who found their perfect property with HomeFinder.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/buy"
              className="bg-white text-primary font-medium px-8 py-3 rounded-md hover:bg-gray-100 transition duration-300"
            >
              Search Properties
            </Link>
            <Link
              href="/sell"
              className="bg-transparent text-white font-medium px-8 py-3 rounded-md border border-white hover:bg-white hover:text-primary transition duration-300"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* Appointment Modal */}
      {selectedProperty && (
        <AppointmentForm
          propertyId={selectedProperty.id}
          propertyTitle={selectedProperty.title}
          isOpen={appointmentModalOpen}
          onClose={() => {
            setAppointmentModalOpen(false);
            setSelectedProperty(null);
          }}
        />
      )}
    </>
  );
};

export default HomePage;
