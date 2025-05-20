import { Property } from "@shared/schema";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { formatPrice } from "@/utils/formatters";

interface PropertyMapProps {
  properties: Property[];
  height?: string;
}

const PropertyMap = ({ 
  properties, 
  height = "500px"
}: PropertyMapProps) => {
  // Function to get static Google Maps image URL
  const getStaticMapUrl = (property: Property) => {
    const API_KEY = "AIzaSyD5jIwHOXztPMnJ2vSaeLtcvsDOaU9kIbc";
    const lat = parseFloat(property.lat);
    const lng = parseFloat(property.lng);
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x400&markers=color:red%7C${lat},${lng}&key=${API_KEY}`;
  };
  
  // Function to get Google Maps URL for directions
  const getGoogleMapsUrl = (property: Property) => {
    const address = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };
  
  // Function to get Google Maps directions URL
  const getDirectionsUrl = (property: Property) => {
    const address = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };
  
  return (
    <div className="map-container rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      {properties.length > 0 ? (
        <div className="bg-white w-full h-full flex flex-col">
          {/* Static Map Image */}
          <div className="relative w-full" style={{ height: "70%" }}>
            <img 
              src={getStaticMapUrl(properties[0])} 
              alt={`Map location of ${properties[0].address}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-white p-2 rounded-md shadow-md">
              <h3 className="text-sm font-medium text-gray-900">{properties[0].address}</h3>
              <p className="text-xs text-gray-500">{properties[0].city}, {properties[0].state}</p>
            </div>
          </div>
          
          {/* Location Details */}
          <div className="p-4 flex-grow">
            <div className="flex items-start mb-3">
              <MapPin className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">{properties[0].address}</p>
                <p className="text-gray-600 text-sm">{properties[0].city}, {properties[0].state} {properties[0].zipCode}</p>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-4">
              <a 
                href={getGoogleMapsUrl(properties[0])}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center text-sm hover:underline"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View on Google Maps
              </a>
              
              <a 
                href={getDirectionsUrl(properties[0])}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center text-sm hover:underline"
              >
                <Navigation className="h-4 w-4 mr-1" />
                Get Directions
              </a>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-primary font-semibold">{formatPrice(properties[0].price)}</p>
              <p className="text-gray-700 text-sm">{properties[0].bedrooms} beds • {properties[0].bathrooms} baths • {properties[0].squareFeet.toLocaleString()} sq ft</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500 p-6">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Location Information</h3>
            <p>Property location details not available.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;