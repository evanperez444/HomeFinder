import { useState } from "react";
import { Property } from "@shared/schema";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { formatPrice } from "@/utils/formatters";

interface PropertyMapProps {
  properties: Property[];
  height?: string;
  center?: { lat: number, lng: number } | null;
  zoom?: number;
}

const PropertyMap = ({ 
  properties, 
  height = "500px"
}: PropertyMapProps) => {
  const [mapError] = useState(false);

  // Function to get Google Maps URL for a property
  const getGoogleMapsUrl = (property: Property) => {
    const address = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return (
    <div className="map-container rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      {!mapError && properties.length > 0 ? (
        <div className="bg-gray-100 p-6 w-full h-full flex flex-col">
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            <h3 className="font-semibold text-lg">Property Location</h3>
          </div>
          
          {properties.map((property) => (
            <div key={property.id} className="bg-white p-4 rounded-lg shadow mb-4">
              <div className="flex flex-col">
                <div className="flex items-start mb-2">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{property.address}</p>
                    <p className="text-gray-600">{property.city}, {property.state} {property.zipCode}</p>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center">
                  <a 
                    href={getGoogleMapsUrl(property)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline mr-4"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View on Google Maps
                  </a>
                  
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Get Directions
                  </a>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-lg font-semibold text-primary">{formatPrice(property.price)}</p>
                  <p className="text-gray-700 font-medium">{property.bedrooms} beds • {property.bathrooms} baths • {property.squareFeet.toLocaleString()} sq ft</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500 p-6">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Location Information</h3>
            <p>Property location details are unavailable at the moment.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;