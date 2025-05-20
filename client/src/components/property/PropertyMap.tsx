import { useEffect, useRef, useState } from "react";
import { Property } from "@shared/schema";
import { formatPrice } from "@/utils/formatters";
import { Loader } from "lucide-react";

// Define window with Google property for TypeScript
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

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
  zoom = 12
}: PropertyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Function to initialize map
  const initializeMap = () => {
    // Skip if map already initialized or element not available
    if (mapInitialized || !mapRef.current || !window.google || !window.google.maps) {
      return;
    }

    try {
      // Calculate center from properties or use default
      let mapCenter = center;
      if (!mapCenter && properties.length > 0) {
        mapCenter = {
          lat: parseFloat(properties[0].lat.toString()),
          lng: parseFloat(properties[0].lng.toString())
        };
      } else if (!mapCenter) {
        // Default to Los Angeles
        mapCenter = { lat: 34.0522, lng: -118.2437 };
      }

      // Create map
      const map = new window.google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: zoom,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: true,
      });

      // Add markers for each property
      if (properties.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        const infoWindow = new window.google.maps.InfoWindow();

        properties.forEach(property => {
          const position = {
            lat: parseFloat(property.lat.toString()),
            lng: parseFloat(property.lng.toString())
          };
          
          // Create marker
          const marker = new window.google.maps.Marker({
            position,
            map,
            title: property.title,
          });

          // Add to bounds
          bounds.extend(position);

          // Create info window content
          const contentString = `
            <div style="padding: 10px; min-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 5px;">${property.title}</h3>
              <p style="color: #666; font-size: 14px; margin-bottom: 5px;">${property.address}</p>
              <p style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #2563eb;">${formatPrice(property.price)}</p>
              <a 
                href="/property/${property.id}" 
                style="color: #2563eb; font-size: 14px; font-weight: 500;"
              >
                View Details
              </a>
            </div>
          `;

          // Add click listener
          marker.addListener("click", () => {
            infoWindow.setContent(contentString);
            infoWindow.open(map, marker);
          });
        });

        // Fit map to show all markers if there are multiple
        if (properties.length > 1) {
          map.fitBounds(bounds);
        }
      }

      setMapInitialized(true);
      setMapLoaded(true);
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapLoaded(false);
    }
  };

  // Check if Google Maps API is loaded
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps) {
        setMapLoaded(true);
        initializeMap();
      } else {
        setTimeout(checkGoogleMapsLoaded, 100);
      }
    };

    checkGoogleMapsLoaded();

    return () => {
      setMapInitialized(false);
      setMapLoaded(false);
    };
  }, []);

  // Re-initialize map when properties change
  useEffect(() => {
    if (mapLoaded && properties.length > 0 && !mapInitialized) {
      initializeMap();
    }
  }, [mapLoaded, properties, mapInitialized]);

  return (
    <div className="map-container rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      <div 
        ref={mapRef} 
        className="w-full h-full bg-gray-200 flex items-center justify-center"
      >
        {!mapLoaded && (
          <div className="text-center text-gray-500">
            <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p>Loading Map...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyMap;