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
    const id = this.userId++;
    const now = new Date();
    const user: User = { ...insertUser, id, savedProperties: '[]', createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUserSavedProperties(userId: number, propertyId: number, add: boolean): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    let savedProperties = [...user.savedProperties];
    
    if (add) {
      if (!savedProperties.includes(propertyId)) {
        savedProperties.push(propertyId);
      }
    } else {
      savedProperties = savedProperties.filter(id => id !== propertyId);
    }

    const updatedUser = { ...user, savedProperties };
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
    const id = this.appointmentId++;
    const now = new Date();
    const appointment: Appointment = { ...insertAppointment, id, createdAt: now };
    this.appointments.set(id, appointment);
    return appointment;
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
