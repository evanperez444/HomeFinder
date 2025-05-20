import { useState, useCallback } from "react";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PropertyFilter } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const propertyFilterValidationSchema = z.object({
  city: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minBeds: z.string().optional(),
  minBaths: z.string().optional(),
  propertyType: z.string().optional(),
  listingType: z.string().optional(),
  minSqft: z.string().optional(),
  maxSqft: z.string().optional(),
  minYear: z.string().optional(),
  maxYear: z.string().optional(),
});

interface PropertyFiltersProps {
  onFilter: (filters: PropertyFilter) => void;
  initialFilters?: PropertyFilter;
  listingType?: string;
}

const PropertyFilters = ({ onFilter, initialFilters = {}, listingType }: PropertyFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const defaultValues: PropertyFilter = {
    city: initialFilters.city || "",
    minPrice: initialFilters.minPrice || "",
    maxPrice: initialFilters.maxPrice || "",
    minBeds: initialFilters.minBeds || "",
    minBaths: initialFilters.minBaths || "",
    propertyType: initialFilters.propertyType || "",
    listingType: listingType || initialFilters.listingType || "",
    minSqft: initialFilters.minSqft || "",
    maxSqft: initialFilters.maxSqft || "",
    minYear: initialFilters.minYear || "",
    maxYear: initialFilters.maxYear || "",
  };

  const form = useForm<PropertyFilter>({
    resolver: zodResolver(propertyFilterValidationSchema),
    defaultValues
  });

  const onSubmit = useCallback((data: PropertyFilter) => {
    onFilter(data);
  }, [onFilter]);

  const handleReset = () => {
    form.reset(defaultValues);
    onFilter(defaultValues);
  };

  return (
    <div className="bg-white dark:bg-gray-950 p-4 md:p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filter Properties</h3>
        <Button 
          variant="ghost" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Basic filters always visible */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Any City" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Min Price" type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Max Price" type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minBeds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minBaths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="any">Any Type</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Advanced filters (only visible when expanded) */}
            {isExpanded && (
              <>
                <FormField
                  control={form.control}
                  name="minSqft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Sq. Ft.</FormLabel>
                      <FormControl>
                        <Input placeholder="Min Sq. Ft." type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxSqft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Sq. Ft.</FormLabel>
                      <FormControl>
                        <Input placeholder="Max Sq. Ft." type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Built (Min)</FormLabel>
                      <FormControl>
                        <Input placeholder="Min Year" type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Built (Max)</FormLabel>
                      <FormControl>
                        <Input placeholder="Max Year" type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button type="submit">
              Apply Filters
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PropertyFilters;