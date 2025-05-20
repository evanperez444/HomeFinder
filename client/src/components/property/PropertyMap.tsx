import { useEffect, useRef, useState } from "react";
import { Property } from "@shared/schema";
import { Loader } from "lucide-react";
import { Loader as GoogleMapsLoader } from "@googlemaps/js-api-loader";

// Google Maps API Key
const API_KEY = "AIzaSyBV0FjCFAgeewu0CDChee_WrM6SJ69OGmE";

interface PropertyMapProps {
  properties: Property[];
  height?: string;
  center?: { lat: number, lng: number } | null;
  zoom?: number;
}

const PropertyMap = ({ 
  properties, 
  height = "500px",
  center = null,
  zoom = 15
}: PropertyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  
  // Clean up function to remove all markers
  const cleanupMarkers = () => {
    if (markersRef.current.length > 0) {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }
  };

  useEffect(() => {
    // Initialize Google Maps
    const initMap = async () => {
      if (!mapRef.current) return;
      
      try {
        setLoading(true);
        setError(false);
        
        // Load Google Maps API
        const loader = new GoogleMapsLoader({
          apiKey: API_KEY,
          version: "weekly"
        });
        
        await loader.load();
        
        // Create map instance
        if (!mapInstanceRef.current) {
          // Default coordinates (will be overridden if properties exist)
          let mapCenter = center || { lat: 34.0522, lng: -118.2437 }; // Los Angeles default
          
          // Override with property coordinates if available
          if (properties.length > 0) {
            const property = properties[0];
            mapCenter = {
              lat: parseFloat(property.lat),
              lng: parseFloat(property.lng)
            };
          }
          
          // Create the map
          mapInstanceRef.current = new google.maps.Map(mapRef.current, {
            center: mapCenter,
            zoom: zoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
          });
        }
        
        // Clean up existing markers before adding new ones
        cleanupMarkers();
        
        // Add markers for each property
        if (properties.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          const infoWindow = new google.maps.InfoWindow();
          
          properties.forEach(property => {
            const position = {
              lat: parseFloat(property.lat),
              lng: parseFloat(property.lng)
            };
            
            // Create marker
            const marker = new google.maps.Marker({
              position,
              map: mapInstanceRef.current,
              title: property.title,
              animation: google.maps.Animation.DROP
            });
            
            // Store marker reference for cleanup
            markersRef.current.push(marker);
            
            // Extend bounds to include this position
            bounds.extend(position);
            
            // Create info window content
            const contentString = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="font-weight: 600; margin-bottom: 4px; color: #1e3a8a;">${property.title}</h3>
                <p style="margin: 4px 0; color: #6b7280;">${property.address}, ${property.city}</p>
                <p style="font-weight: 600; margin: 8px 0; color: #2563eb;">$${parseInt(property.price).toLocaleString()}</p>
                <div style="margin-top: 8px; display: flex; gap: 12px;">
                  <span style="color: #4b5563;">${property.bedrooms} beds</span>
                  <span style="color: #4b5563;">${property.bathrooms} baths</span>
                  <span style="color: #4b5563;">${property.squareFeet.toLocaleString()} sq ft</span>
                </div>
              </div>
            `;
            
            // Add click listener to open info window
            marker.addListener("click", () => {
              infoWindow.setContent(contentString);
              infoWindow.open(mapInstanceRef.current, marker);
            });
          });
          
          // Fit map to show all markers if multiple properties
          if (properties.length > 1 && mapInstanceRef.current) {
            mapInstanceRef.current.fitBounds(bounds);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading Google Maps:", err);
        setError(true);
        setLoading(false);
      }
    };
    
    initMap();
    
    // Cleanup function
    return () => {
      cleanupMarkers();
    };
  }, [properties, center, zoom]);
  
  return (
    <div className="map-container rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
          <div className="text-center p-6">
            <p className="text-red-500 font-medium mb-2">Unable to load the map</p>
            <p className="text-gray-600">Please try again later</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="w-full h-full"
        aria-label="Google Map showing property location"
      />
    </div>
  );
};

export default PropertyMap;