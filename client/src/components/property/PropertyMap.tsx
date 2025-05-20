import React, { useEffect, useRef } from "react";
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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Initialize map when component mounts
  useEffect(() => {
    // Don't proceed if no properties
    if (!properties.length || !mapRef.current) return;
    
    const initMap = () => {
      try {
        // Check if Google Maps API is available
        if (!window.google || !window.google.maps) {
          console.error("Google Maps API not loaded");
          return;
        }
        
        // Get property coordinates
        const property = properties[0];
        const lat = parseFloat(property.lat as string);
        const lng = parseFloat(property.lng as string);
        
        // Create map
        const mapOptions: google.maps.MapOptions = {
          center: { lat, lng },
          zoom: 15,
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: true,
          zoomControl: true,
        };
        
        // Initialize map
        const map = new google.maps.Map(mapRef.current, mapOptions);
        mapInstanceRef.current = map;
        
        // Add marker for the property
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: property.title,
          animation: google.maps.Animation.DROP,
        });
        
        markersRef.current.push(marker);
        
        // Create info window
        const infoWindow = new google.maps.InfoWindow({
          content: `<div class="p-2">
            <h4 class="font-bold">${property.title}</h4>
            <p>${property.address}, ${property.city}, ${property.state}</p>
            <p class="font-semibold text-primary">${formatPrice(property.price)}</p>
          </div>`
        });
        
        // Add click listener to marker
        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
        
        // Open info window by default
        infoWindow.open(map, marker);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };
    
    // Initialize map if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Otherwise, add event listener for when the API loads
      window.initMap = initMap;
      // The script should be loaded in the index.html with a callback to window.initMap
    }
    
    // Cleanup function
    return () => {
      // Clear markers on unmount
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [properties]);

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
          {/* Interactive Map */}
          <div className="relative w-full" style={{ height: "70%" }}>
            <div 
              ref={mapRef} 
              className="w-full h-full"
              id="property-map"
            />
            <div className="absolute top-3 left-3 bg-white p-2 rounded-md shadow-md z-10">
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