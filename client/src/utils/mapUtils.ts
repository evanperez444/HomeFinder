interface MapOptions {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

interface MarkerData {
  id: number;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  price: string;
  address: string;
  url: string;
}

// Initialize Google Maps
export function initMap(
  element: HTMLElement,
  options: MapOptions
): google.maps.Map {
  const map = new google.maps.Map(element, {
    center: options.center,
    zoom: options.zoom,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: true,
  });

  return map;
}

// Add markers to map
export function addMarkers(
  map: google.maps.Map,
  markers: MarkerData[]
): google.maps.Marker[] {
  // Create info window for displaying marker details
  const infoWindow = new google.maps.InfoWindow();
  const createdMarkers: google.maps.Marker[] = [];
  
  // Add each marker to the map
  markers.forEach((markerData) => {
    // Create marker
    const marker = new google.maps.Marker({
      position: markerData.position,
      map: map,
      title: markerData.title,
      animation: google.maps.Animation.DROP,
    });

    // Store the marker's ID as a property
    marker.set("id", markerData.id);
    createdMarkers.push(marker);

    // Create info window content
    const contentString = `
      <div class="p-2" style="min-width: 200px;">
        <h3 class="font-bold mb-1">${markerData.title}</h3>
        <p class="text-gray-600 text-sm mb-1">${markerData.address}</p>
        <p class="text-lg text-primary font-bold mb-2">${markerData.price}</p>
        <a 
          href="${markerData.url}" 
          class="text-primary text-sm font-medium hover:underline"
        >
          View Details
        </a>
      </div>
    `;

    // Add click listener to marker
    marker.addListener("click", () => {
      // Show info window
      infoWindow.setContent(contentString);
      infoWindow.open(map, marker);
    });
  });

  // If there are markers, fit the bounds to show all markers
  if (markers.length > 1) {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach((marker) => {
      bounds.extend(marker.position);
    });
    map.fitBounds(bounds);
  }
  
  return createdMarkers;
}

// Get bounds of current map view
export function getMapBounds(map: google.maps.Map): {
  north: number;
  south: number;
  east: number;
  west: number;
} {
  const bounds = map.getBounds();
  if (!bounds) {
    // If bounds are not available, return a default area
    const center = map.getCenter();
    if (!center) {
      return { north: 90, south: -90, east: 180, west: -180 };
    }
    const lat = center.lat();
    const lng = center.lng();
    return {
      north: lat + 0.1,
      south: lat - 0.1,
      east: lng + 0.1,
      west: lng - 0.1,
    };
  }
  
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  
  return {
    north: ne.lat(),
    south: sw.lat(),
    east: ne.lng(),
    west: sw.lng(),
  };
}

// Check if a marker is within the bounds
export function isMarkerInBounds(
  marker: { lat: number; lng: number },
  bounds: { north: number; south: number; east: number; west: number }
): boolean {
  return (
    marker.lat <= bounds.north &&
    marker.lat >= bounds.south &&
    marker.lng <= bounds.east &&
    marker.lng >= bounds.west
  );
}