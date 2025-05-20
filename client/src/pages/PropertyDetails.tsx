import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { formatPrice } from "@/utils/formatters";
import PropertyMap from "@/components/property/PropertyMap";
import AppointmentForm from "@/components/forms/AppointmentForm";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AuthModals from "@/components/auth/AuthModals";

const PropertyDetails = () => {
  const [, params] = useRoute("/properties/:id");
  const propertyId = params ? parseInt(params.id) : 0;
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Fetch property details
  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: propertyId > 0,
  });

  // Check if property is in favorites
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    if (user && property) {
      setIsFavorite(user.savedProperties.includes(property.id));
    }
  }, [user, property]);

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      
      if (isFavorite) {
        await apiRequest("DELETE", `/api/saved-properties/${propertyId}`);
      } else {
        await apiRequest("POST", `/api/saved-properties/${propertyId}`);
      }
    },
    onSuccess: () => {
      setIsFavorite(!isFavorite);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      toast({
        title: isFavorite ? "Property removed from favorites" : "Property added to favorites",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  const handleFavoriteClick = () => {
    if (!user) {
      setLoginModalOpen(true);
      return;
    }
    
    toggleFavoriteMutation.mutate();
  };

  const handleScheduleViewing = () => {
    if (!user) {
      setLoginModalOpen(true);
      return;
    }
    
    setAppointmentModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Property</h1>
        <p className="text-gray-600 mb-6">
          We couldn't load the property details. Please try again later.
        </p>
        <button 
          onClick={() => window.history.back()}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Property Images */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="relative">
                <img 
                  src={property.imageUrl} 
                  alt={property.title} 
                  className="w-full h-96 object-cover"
                />
                <button 
                  onClick={handleFavoriteClick}
                  className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md hover:text-primary"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <i className={`${isFavorite ? 'fas text-red-500' : 'far'} fa-heart text-lg`}></i>
                </button>
              </div>
            </div>
            
            {/* Property Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-dark">{property.title}</h1>
                      <p className="text-gray-600 text-lg">{property.address}, {property.city}, {property.state} {property.zipCode}</p>
                    </div>
                    <div className="text-2xl font-bold text-primary mt-2 lg:mt-0">
                      {formatPrice(property.price)}
                      {property.listingType === 'rent' && <span className="text-gray-500 text-lg font-normal">/month</span>}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 mb-6 border-b border-gray-200 pb-6">
                    <div className="flex items-center">
                      <i className="fas fa-bed text-gray-400 mr-2 text-lg"></i>
                      <div>
                        <p className="text-sm text-gray-500">Bedrooms</p>
                        <p className="font-semibold">{property.bedrooms}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <i className="fas fa-bath text-gray-400 mr-2 text-lg"></i>
                      <div>
                        <p className="text-sm text-gray-500">Bathrooms</p>
                        <p className="font-semibold">{property.bathrooms}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <i className="fas fa-ruler-combined text-gray-400 mr-2 text-lg"></i>
                      <div>
                        <p className="text-sm text-gray-500">Square Feet</p>
                        <p className="font-semibold">{property.squareFeet.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <i className="fas fa-home text-gray-400 mr-2 text-lg"></i>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-semibold">{property.propertyType}</p>
                      </div>
                    </div>
                    
                    {property.yearBuilt && (
                      <div className="flex items-center">
                        <i className="fas fa-calendar-alt text-gray-400 mr-2 text-lg"></i>
                        <div>
                          <p className="text-sm text-gray-500">Year Built</p>
                          <p className="font-semibold">{property.yearBuilt}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Description</h2>
                    <p className="text-gray-600 mb-6 whitespace-pre-line">{property.description}</p>
                  </div>
                </div>
                
                {/* Map Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Location</h2>
                  <PropertyMap 
                    properties={[property]} 
                    center={{
                      lat: parseFloat(property.lat.toString()),
                      lng: parseFloat(property.lng.toString())
                    }}
                    zoom={15}
                  />
                  <p className="mt-4 text-gray-600">
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </p>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Contact/Schedule Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Interested in this property?</h2>
                  <button 
                    onClick={handleScheduleViewing}
                    className="w-full bg-primary text-white py-3 rounded-md hover:bg-blue-600 transition mb-4"
                  >
                    <i className="far fa-calendar-alt mr-2"></i> Schedule a Viewing
                  </button>
                  
                  <a 
                    href={`tel:123-456-7890`} 
                    className="w-full block text-center border border-primary text-primary py-3 rounded-md hover:bg-primary hover:text-white transition"
                  >
                    <i className="fas fa-phone-alt mr-2"></i> Call Agent
                  </a>
                </div>
                
                {/* Property Details */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Property ID:</span>
                      <span className="font-medium">{property.id}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">{formatPrice(property.price)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium">{property.propertyType}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Listing Type:</span>
                      <span className="font-medium">{property.listingType === 'buy' ? 'For Sale' : 'For Rent'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Bathrooms:</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Square Feet:</span>
                      <span className="font-medium">{property.squareFeet.toLocaleString()}</span>
                    </li>
                    {property.yearBuilt && (
                      <li className="flex justify-between">
                        <span className="text-gray-600">Year Built:</span>
                        <span className="font-medium">{property.yearBuilt}</span>
                      </li>
                    )}
                    <li className="flex justify-between">
                      <span className="text-gray-600">Listed:</span>
                      <span className="font-medium">{new Date(property.createdAt).toLocaleDateString()}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Appointment Modal */}
      {property && (
        <AppointmentForm
          propertyId={property.id}
          propertyTitle={property.title}
          isOpen={appointmentModalOpen}
          onClose={() => setAppointmentModalOpen(false)}
        />
      )}
      
      {/* Auth Modal */}
      <AuthModals 
        loginOpen={loginModalOpen}
        signupOpen={false}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToSignup={() => {
          setLoginModalOpen(false);
        }}
        onSwitchToLogin={() => {}}
      />
    </>
  );
};

export default PropertyDetails;
