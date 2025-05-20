import { useState } from "react";
import { Link } from "wouter";
import { Property } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/utils/formatters";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

interface PropertyCardProps {
  property: Property;
  onScheduleViewing?: (propertyId: number) => void;
}

const PropertyCard = ({ property, onScheduleViewing }: PropertyCardProps) => {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(() => {
    return user?.savedProperties?.includes(property.id) || false;
  });

  const createdDate = new Date(property.createdAt);
  const daysAgo = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
  const listedText = daysAgo === 0 ? "Listed today" : `Listed ${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      
      if (isFavorite) {
        await apiRequest("DELETE", `/api/saved-properties/${property.id}`);
      } else {
        await apiRequest("POST", `/api/saved-properties/${property.id}`);
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
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleFavoriteClick = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to save properties",
      });
      return;
    }
    
    toggleFavoriteMutation.mutate();
  };

  const handleScheduleViewing = () => {
    if (onScheduleViewing) {
      onScheduleViewing(property.id);
    }
  };

  let statusBadge = null;
  if (property.featured) {
    statusBadge = <span className="absolute top-2 left-2 bg-primary text-white text-sm px-2 py-1 rounded">Featured</span>;
  } else if (property.status === "new") {
    statusBadge = <span className="absolute top-2 left-2 bg-accent text-white text-sm px-2 py-1 rounded">New</span>;
  } else if (property.status === "open_house") {
    statusBadge = <span className="absolute top-2 left-2 bg-secondary text-white text-sm px-2 py-1 rounded">Open House</span>;
  }

  return (
    <div className="property-card bg-white rounded-lg shadow-md overflow-hidden transition duration-300">
      <div className="relative">
        <img 
          src={property.imageUrl} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        {statusBadge}
        <button 
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:text-primary"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <i className={`${isFavorite ? 'fas text-red-500' : 'far'} fa-heart`}></i>
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between">
          <span className="text-lg font-bold text-primary">{formatPrice(property.price)}</span>
          <span className="text-sm text-gray-500">{listedText}</span>
        </div>
        <h3 className="text-lg font-semibold mt-2">{property.title}</h3>
        <p className="text-gray-600 text-sm">{property.city}, {property.state} {property.zipCode}</p>
        <div className="flex items-center mt-2">
          {property.avgRating && Number(property.avgRating) > 0 ? (
            <>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-sm text-gray-600">{Number(property.avgRating).toFixed(1)} ({property.ratingCount || 0})</span>
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-500">No ratings yet</span>
          )}
        </div>
        <div className="flex justify-between mt-3">
          <div className="flex items-center">
            <i className="fas fa-bed text-gray-400 mr-1"></i>
            <span className="text-sm text-gray-600">{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-bath text-gray-400 mr-1"></i>
            <span className="text-sm text-gray-600">{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-ruler-combined text-gray-400 mr-1"></i>
            <span className="text-sm text-gray-600">{property.squareFeet.toLocaleString()} sq ft</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
          <Link 
            href={`/properties/${property.id}`}
            className="text-primary font-medium text-sm hover:underline"
          >
            View Details
          </Link>
          <button 
            className="text-gray-600 text-sm hover:text-primary"
            onClick={handleScheduleViewing}
          >
            <i className="far fa-calendar-alt mr-1"></i> Schedule Viewing
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
