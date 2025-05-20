import { 
  users, 
  properties, 
  appointments, 
  agents,
  type User, 
  type InsertUser, 
  type Property, 
  type InsertProperty,
  type Appointment,
  type InsertAppointment,
  type Agent,
  type InsertAgent,
  type PropertyFilter
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSavedProperties(userId: number, propertyId: number, add: boolean): Promise<User | undefined>;
  
  // Property operations
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(filters?: PropertyFilter): Promise<Property[]>;
  getFeaturedProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Appointment operations
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByUser(userId: number): Promise<Appointment[]>;
  getAppointmentsByProperty(propertyId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<Appointment>): Promise<Appointment | undefined>;
  
  // Agent operations
  getAgent(id: number): Promise<Agent | undefined>;
  getAgents(): Promise<Agent[]>;
  createAgent(agent: InsertAgent): Promise<Agent>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private appointments: Map<number, Appointment>;
  private agents: Map<number, Agent>;
  
  private userId: number = 1;
  private propertyId: number = 1;
  private appointmentId: number = 1;
  private agentId: number = 1;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.appointments = new Map();
    this.agents = new Map();
    
    // Initialize with some sample data
    this.initializeData();
  }
  
  // Initialize with sample data
  private async initializeData() {
    // Create default admin user first
    const adminUser = await this.createUser({
      username: "admin",
      password: "password123",
      email: "admin@homefinder.com",
      fullName: "Admin User",
      savedProperties: "[]"
    });
    
    // Initialize with sample property listings
    this.seedProperties(adminUser.id);
    
    // Initialize with some sample agents
    this.seedAgents();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      console.log("Storage: Creating user with data:", insertUser);
      
      const id = this.userId++;
      const now = new Date();
      
      // Make sure savedProperties is initialized correctly
      let savedProperties = "[]";
      if (insertUser.savedProperties && typeof insertUser.savedProperties === 'string') {
        // If it's provided as a string, use it (should be a valid JSON string)
        savedProperties = insertUser.savedProperties;
      }
      
      const user: User = { 
        ...insertUser, 
        id, 
        savedProperties, 
        createdAt: now 
      };
      
      console.log("Storage: Created user object:", user);
      
      this.users.set(id, user);
      return user;
    } catch (error) {
      console.error("Error in createUser:", error);
      throw error;
    }
  }

  async updateUserSavedProperties(userId: number, propertyId: number, add: boolean): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    // Parse the savedProperties string to an array if it's a string
    let savedPropertiesArray: number[] = [];
    
    if (typeof user.savedProperties === 'string') {
      try {
        savedPropertiesArray = JSON.parse(user.savedProperties);
      } catch (error) {
        console.error("Error parsing savedProperties:", error);
        savedPropertiesArray = [];
      }
    } else if (Array.isArray(user.savedProperties)) {
      savedPropertiesArray = user.savedProperties;
    }

    // Update the array
    if (add) {
      if (!savedPropertiesArray.includes(propertyId)) {
        savedPropertiesArray.push(propertyId);
      }
    } else {
      savedPropertiesArray = savedPropertiesArray.filter(id => id !== propertyId);
    }

    // Update the user with the new array (as a string)
    const updatedUser = { 
      ...user, 
      savedProperties: JSON.stringify(savedPropertiesArray) 
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Property operations
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getProperties(filters?: PropertyFilter): Promise<Property[]> {
    let properties = Array.from(this.properties.values());
    
    if (filters) {
      if (filters.city) {
        properties = properties.filter(p => p.city.toLowerCase().includes(filters.city!.toLowerCase()));
      }
      
      if (filters.minPrice) {
        const minPrice = parseFloat(filters.minPrice);
        properties = properties.filter(p => parseFloat(p.price.toString()) >= minPrice);
      }
      
      if (filters.maxPrice) {
        const maxPrice = parseFloat(filters.maxPrice);
        properties = properties.filter(p => parseFloat(p.price.toString()) <= maxPrice);
      }
      
      if (filters.minBeds) {
        const minBeds = parseInt(filters.minBeds);
        properties = properties.filter(p => p.bedrooms >= minBeds);
      }
      
      if (filters.minBaths) {
        const minBaths = parseInt(filters.minBaths);
        properties = properties.filter(p => p.bathrooms >= minBaths);
      }
      
      if (filters.propertyType && filters.propertyType !== 'Any') {
        properties = properties.filter(p => p.propertyType === filters.propertyType);
      }
      
      if (filters.listingType) {
        properties = properties.filter(p => p.listingType === filters.listingType);
      }
      
      if (filters.minSqft) {
        const minSqft = parseInt(filters.minSqft);
        properties = properties.filter(p => p.squareFeet >= minSqft);
      }
      
      if (filters.maxSqft) {
        const maxSqft = parseInt(filters.maxSqft);
        properties = properties.filter(p => p.squareFeet <= maxSqft);
      }
      
      if (filters.minYear) {
        const minYear = parseInt(filters.minYear);
        properties = properties.filter(p => p.yearBuilt && p.yearBuilt >= minYear);
      }
      
      if (filters.maxYear) {
        const maxYear = parseInt(filters.maxYear);
        properties = properties.filter(p => p.yearBuilt && p.yearBuilt <= maxYear);
      }
    }
    
    return properties;
  }

  async getFeaturedProperties(): Promise<Property[]> {
    const properties = Array.from(this.properties.values());
    return properties.filter(p => p.featured);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyId++;
    const now = new Date();
    const property: Property = { ...insertProperty, id, createdAt: now };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined> {
    const existingProperty = await this.getProperty(id);
    if (!existingProperty) return undefined;

    const updatedProperty = { ...existingProperty, ...property };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Appointment operations
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointmentsByUser(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      appointment => appointment.userId === userId
    );
  }

  async getAppointmentsByProperty(propertyId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      appointment => appointment.propertyId === propertyId
    );
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    try {
      console.log("Creating appointment with data:", insertAppointment);
      
      const id = this.appointmentId++;
      const now = new Date();
      
      // Make sure date is a proper Date object
      let date = insertAppointment.date;
      if (typeof date === 'string') {
        date = new Date(date);
      }
      
      const appointment: Appointment = { 
        ...insertAppointment, 
        id, 
        date, // Ensure date is a Date object
        createdAt: now 
      };
      
      console.log("Created appointment object:", appointment);
      
      this.appointments.set(id, appointment);
      return appointment;
    } catch (error) {
      console.error("Error in createAppointment:", error);
      throw error;
    }
  }

  async updateAppointment(id: number, appointment: Partial<Appointment>): Promise<Appointment | undefined> {
    const existingAppointment = await this.getAppointment(id);
    if (!existingAppointment) return undefined;

    const updatedAppointment = { ...existingAppointment, ...appointment };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  // Agent operations
  async getAgent(id: number): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async getAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = this.agentId++;
    const agent: Agent = { ...insertAgent, id };
    this.agents.set(id, agent);
    return agent;
  }

  // Helper to seed some initial agents
  // Seed sample property data
  private seedProperties(userId: number) {
    const propertyData: InsertProperty[] = [
      {
        title: "Modern Luxury Villa",
        description: "Elegant modern villa with panoramic views, this stunning 4-bedroom home features high ceilings, floor-to-ceiling windows, and premium finishes throughout. The open-concept living space flows to a private backyard with a pool. Includes smart home technology, designer kitchen with high-end appliances, and a luxurious primary suite.",
        price: "1250000",
        address: "123 Highland Drive",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        lat: "34.0522",
        lng: "-118.2437",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 3200,
        yearBuilt: 2020,
        propertyType: "House",
        listingType: "buy",
        imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
        userId: 1,
        featured: true,
        status: "available",
        avgRating: "4.7",
        ratingCount: 12
      },
      {
        title: "Downtown Luxury Apartment",
        description: "Stunning luxury apartment in the heart of downtown with breathtaking city views. This 2-bedroom, 2-bath unit features high-end finishes, stainless steel appliances, and an open floor plan perfect for entertaining. Building amenities include a fitness center, rooftop pool, and 24-hour concierge.",
        price: "650000",
        address: "456 Main Street, Unit 1502",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        lat: "37.7749",
        lng: "-122.4194",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        yearBuilt: 2018,
        propertyType: "Apartment",
        listingType: "buy",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop",
        userId: 1,
        featured: false,
        status: "available",
        avgRating: "4.2",
        ratingCount: 8
      },
      {
        title: "Charming Suburban Home",
        description: "Beautiful family home in a peaceful suburban neighborhood. This well-maintained 3-bedroom house features hardwood floors, a renovated kitchen, and a spacious backyard perfect for families. Close to schools, parks, and shopping centers.",
        price: "480000",
        address: "789 Maple Avenue",
        city: "Portland",
        state: "OR",
        zipCode: "97205",
        lat: "45.5231",
        lng: "-122.6765",
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1800,
        yearBuilt: 2005,
        propertyType: "House",
        listingType: "buy",
        imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop",
        userId: 1,
        featured: true,
        status: "available",
        avgRating: "4.5",
        ratingCount: 15
      },
      {
        title: "Waterfront Condo",
        description: "Luxurious waterfront condo with panoramic ocean views. This stylish 2-bedroom unit offers modern design, premium finishes, and a private balcony overlooking the marina. Residents enjoy access to a fitness center, swimming pool, and secure parking.",
        price: "2500",
        address: "101 Harbor Drive, Unit 305",
        city: "Miami",
        state: "FL",
        zipCode: "33132",
        lat: "25.7617",
        lng: "-80.1918",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1100,
        yearBuilt: 2015,
        propertyType: "Condo",
        listingType: "rent",
        imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop",
        userId: 1,
        featured: true,
        status: "available",
        avgRating: "4.8",
        ratingCount: 9
      },
      {
        title: "Cozy Studio Apartment",
        description: "Modern and efficiently designed studio apartment in a vibrant neighborhood. This stylish unit features a sleek kitchen with stainless steel appliances, hardwood floors, and large windows offering plenty of natural light. Building amenities include laundry facilities and a rooftop lounge.",
        price: "1200",
        address: "222 Urban Street, Unit 15",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        lat: "30.2672",
        lng: "-97.7431",
        bedrooms: 0,
        bathrooms: 1,
        squareFeet: 550,
        yearBuilt: 2010,
        propertyType: "Apartment",
        listingType: "rent",
        imageUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop",
        userId: 1,
        featured: false,
        status: "available",
        avgRating: "4.0",
        ratingCount: 6
      },
      {
        title: "Historic Townhouse",
        description: "Beautifully restored historic townhouse combining classic architecture with modern amenities. This 3-story home features original hardwood floors, exposed brick walls, and a gourmet kitchen with high-end appliances. Includes a private backyard and rooftop deck with city views.",
        price: "870000",
        address: "555 Heritage Lane",
        city: "Boston",
        state: "MA",
        zipCode: "02108",
        lat: "42.3601",
        lng: "-71.0589",
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 2200,
        yearBuilt: 1890,
        propertyType: "Townhouse",
        listingType: "buy",
        imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop",
        userId: 1,
        featured: true,
        status: "available",
        avgRating: "4.6",
        ratingCount: 11
      }
    ];

    propertyData.forEach(property => {
      this.createProperty(property);
    });
  }

  private seedAgents() {
    const agentData: InsertAgent[] = [
      {
        name: "Sarah Johnson",
        specialization: "Luxury Home Specialist",
        rating: 4.8,
        propertiesSold: 200,
        imageUrl: "/agent1.jpg",
      },
      {
        name: "Michael Rodriguez",
        specialization: "First-time Buyer Expert",
        rating: 5.0,
        propertiesSold: 150,
        imageUrl: "/agent2.jpg",
      },
      {
        name: "Emily Chen",
        specialization: "Investment Property Specialist",
        rating: 4.2,
        propertiesSold: 120,
        imageUrl: "/agent3.jpg",
      },
      {
        name: "David Williams",
        specialization: "Commercial Real Estate",
        rating: 4.7,
        propertiesSold: 180,
        imageUrl: "/agent4.jpg",
      }
    ];

    agentData.forEach(agent => {
      this.createAgent(agent);
    });
  }
}

export const storage = new MemStorage();
