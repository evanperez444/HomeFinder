import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Property, PropertyFilter } from "@shared/schema";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyFilters from "@/components/property/PropertyFilters";
import PropertyMap from "@/components/property/PropertyMap";
import AppointmentForm from "@/components/forms/AppointmentForm";
import { useProperties } from "@/hooks/useProperties";

interface BuyRentProps {
  listingType: "buy" | "rent";
}

const BuyRent = ({ listingType }: BuyRentProps) => {
  const [filters, setFilters] = useState<PropertyFilter>({ listingType });
  const [view, setView] = useState<"grid" | "map">("grid");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  
  // Update filter if listingType prop changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, listingType }));
  }, [listingType]);

  // Fetch properties with filters
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      // Add all filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/properties?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      return response.json();
    }
  });

  const { sortProperties } = useProperties();
  const [sortOrder, setSortOrder] = useState<string>("newest");
  
  // Apply sorting to properties
  const sortedProperties = sortProperties(properties, sortOrder);

  const handleFilterSubmit = (newFilters: PropertyFilter) => {
    // Keep the current listing type if not specified in the new filters
    setFilters({ 
      ...newFilters, 
      listingType: newFilters.listingType || listingType 
    });
  };

  const handleScheduleViewing = (propertyId: number) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setAppointmentModalOpen(true);
    }
  };

  return (
    <>
      <section className="pt-8 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Page Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-6">
            {listingType === "buy" ? "Homes For Sale" : "Homes For Rent"}
          </h1>
          
          {/* Filters Section */}
          <div className="mb-8">
            <PropertyFilters 
              onFilter={handleFilterSubmit} 
              initialFilters={filters}
              listingType={listingType} 
            />
          </div>
          
          {/* View Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              {isLoading ? (
                "Loading properties..."
              ) : (
                `${properties.length} Properties found`
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm font-medium">Sort by:</label>
                <select 
                  id="sort" 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">Newest</option>
                  <option value="price_low">Price (Low to High)</option>
                  <option value="price_high">Price (High to Low)</option>
                </select>
              </div>
              
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button 
                  onClick={() => setView("grid")}
                  className={`px-3 py-1 ${view === "grid" ? "bg-primary text-white" : "bg-white text-gray-700"}`}
                  aria-label="Grid view"
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button 
                  onClick={() => setView("map")}
                  className={`px-3 py-1 ${view === "map" ? "bg-primary text-white" : "bg-white text-gray-700"}`}
                  aria-label="Map view"
                >
                  <i className="fas fa-map-marked-alt"></i>
                </button>
              </div>
            </div>
          </div>
          
          {/* View Content */}
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
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
              ) : sortedProperties.length > 0 ? (
                sortedProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property}
                    onScheduleViewing={handleScheduleViewing}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <i className="fas fa-home text-gray-400 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search filters to find more properties.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
              <PropertyMap 
                properties={sortedProperties} 
                height="700px"
              />
              
              {!isLoading && sortedProperties.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No properties found in the current map view.</p>
                </div>
              )}
            </div>
          )}
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

export default BuyRent;
