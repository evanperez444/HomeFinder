import { useMemo } from "react";
import { Property } from "@shared/schema";

interface UsePropertiesOptions {
  defaultSortField?: string;
  defaultSortOrder?: "asc" | "desc";
}

export function useProperties(options: UsePropertiesOptions = {}) {
  /**
   * Sort properties based on a sort order string
   */
  const sortProperties = useMemo(() => {
    return (properties: Property[], sortOrder: string) => {
      if (!properties.length) return [];
      
      const propertiesCopy = [...properties];
      
      switch (sortOrder) {
        case "price_low":
          return propertiesCopy.sort((a, b) => {
            const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
            const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
            return priceA - priceB;
          });
          
        case "price_high":
          return propertiesCopy.sort((a, b) => {
            const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
            const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
            return priceB - priceA;
          });
          
        case "newest":
          return propertiesCopy.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });
          
        case "oldest":
          return propertiesCopy.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateA - dateB;
          });
          
        case "beds_high":
          return propertiesCopy.sort((a, b) => b.bedrooms - a.bedrooms);
          
        case "beds_low":
          return propertiesCopy.sort((a, b) => a.bedrooms - b.bedrooms);
          
        case "baths_high":
          return propertiesCopy.sort((a, b) => b.bathrooms - a.bathrooms);
          
        case "baths_low":
          return propertiesCopy.sort((a, b) => a.bathrooms - b.bathrooms);
          
        case "sqft_high":
          return propertiesCopy.sort((a, b) => b.squareFeet - a.squareFeet);
          
        case "sqft_low":
          return propertiesCopy.sort((a, b) => a.squareFeet - b.squareFeet);
          
        default:
          return propertiesCopy;
      }
    };
  }, []);

  /**
   * Filter properties by search query across multiple fields
   */
  const searchProperties = useMemo(() => {
    return (properties: Property[], query: string) => {
      if (!query.trim()) return properties;
      
      const lowerQuery = query.toLowerCase().trim();
      
      return properties.filter(property => {
        // Search in multiple fields
        return (
          property.title.toLowerCase().includes(lowerQuery) ||
          property.description.toLowerCase().includes(lowerQuery) ||
          property.address.toLowerCase().includes(lowerQuery) ||
          property.city.toLowerCase().includes(lowerQuery) ||
          property.state.toLowerCase().includes(lowerQuery) ||
          property.zipCode.toLowerCase().includes(lowerQuery) ||
          property.propertyType.toLowerCase().includes(lowerQuery)
        );
      });
    };
  }, []);

  /**
   * Group properties by a field (e.g., city, propertyType)
   */
  const groupProperties = useMemo(() => {
    return <T extends keyof Property>(properties: Property[], field: T) => {
      return properties.reduce((acc, property) => {
        const key = String(property[field]);
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(property);
        return acc;
      }, {} as Record<string, Property[]>);
    };
  }, []);

  return {
    sortProperties,
    searchProperties,
    groupProperties
  };
}
