import { useState } from "react";
import { Star } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PropertyRatingProps {
  propertyId: number;
  initialRating?: number;
  avgRating?: number;
  ratingCount?: number;
  className?: string;
}

export default function PropertyRating({
  propertyId,
  initialRating = 0,
  avgRating = 0,
  ratingCount = 0,
  className = ""
}: PropertyRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: submitRating, isPending } = useMutation({
    mutationFn: async (newRating: number) => {
      return apiRequest(`/api/properties/${propertyId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: newRating }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Thank you for your rating!",
        description: "Your feedback helps other users find great properties.",
        variant: "default",
      });
      setHasRated(true);
      // Invalidate properties queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}`] });
    },
    onError: (error) => {
      toast({
        title: "Error submitting rating",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleClick = (value: number) => {
    if (!hasRated) {
      setRating(value);
    }
  };

  const handleSubmit = () => {
    if (rating > 0 && !hasRated) {
      submitRating(rating);
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center mb-2">
        <span className="text-sm text-gray-600 mr-2">
          {avgRating > 0 ? `${avgRating.toFixed(1)} (${ratingCount} ratings)` : "No ratings yet"}
        </span>
        
        <div className="flex">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={`h-5 w-5 cursor-pointer ${
                (hoverRating || rating) >= value
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              } ${hasRated ? "cursor-default" : "cursor-pointer"}`}
              onClick={() => handleClick(value)}
              onMouseEnter={() => !hasRated && setHoverRating(value)}
              onMouseLeave={() => !hasRated && setHoverRating(0)}
            />
          ))}
        </div>
      </div>

      {!hasRated && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSubmit} 
          disabled={rating === 0 || isPending}
          className="mt-1"
        >
          {isPending ? "Submitting..." : "Rate This Property"}
        </Button>
      )}
    </div>
  );
}