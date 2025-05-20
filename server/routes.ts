import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertPropertySchema, 
  insertAppointmentSchema, 
  propertyFilterSchema,
  type PropertyFilter
} from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session
  const SessionStore = MemoryStore(session);
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'homefinder-secret',
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({
      checkPeriod: 86400000 // 24 hours
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up authentication
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      // In a real application, you would use bcrypt.compare or similar
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      
      // In a real application, hash the password
      // userData.password = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser(userData);
      
      // Exclude password from response
      const { password, ...userWithoutPassword } = user;
      
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Login failed after registration' });
        }
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      return res.status(500).json({ message: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
    if (req.user) {
      const { password, ...userWithoutPassword } = req.user as any;
      return res.json(userWithoutPassword);
    }
    return res.status(401).json({ message: 'Authentication failed' });
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      return res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/me', (req, res) => {
    if (req.isAuthenticated()) {
      const { password, ...userWithoutPassword } = req.user as any;
      return res.json(userWithoutPassword);
    }
    return res.status(401).json({ message: 'Not authenticated' });
  });

  // Property routes
  app.get('/api/properties', async (req: Request, res: Response) => {
    try {
      const parsedFilters = propertyFilterSchema.parse(req.query);
      const properties = await storage.getProperties(parsedFilters);
      return res.json(properties);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch properties' });
    }
  });

  app.get('/api/properties/featured', async (_req: Request, res: Response) => {
    try {
      const properties = await storage.getFeaturedProperties();
      return res.json(properties);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch featured properties' });
    }
  });

  app.get('/api/properties/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      return res.json(property);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch property' });
    }
  });
  
  // Rate a property
  app.post('/api/properties/:id/rate', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { rating } = req.body;
      
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Invalid rating. Must be between 1 and 5.' });
      }
      
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      // Calculate new average rating
      const newRatingCount = (property.ratingCount || 0) + 1;
      const currentTotalRating = (property.avgRating || 0) * (property.ratingCount || 0);
      const newAvgRating = (currentTotalRating + rating) / newRatingCount;
      
      // Update property
      const updatedProperty = await storage.updateProperty(id, {
        avgRating: newAvgRating,
        ratingCount: newRatingCount
      });
      
      return res.json(updatedProperty);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to rate property' });
    }
  });

  app.post('/api/properties', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const user = req.user as any;
      
      propertyData.userId = user.id;
      
      const property = await storage.createProperty(propertyData);
      return res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      return res.status(500).json({ message: 'Failed to create property' });
    }
  });

  app.put('/api/properties/:id', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      const user = req.user as any;
      
      if (property.userId !== user.id) {
        return res.status(403).json({ message: 'Not authorized to update this property' });
      }
      
      const updatedProperty = await storage.updateProperty(id, req.body);
      return res.json(updatedProperty);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update property' });
    }
  });

  app.delete('/api/properties/:id', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      const user = req.user as any;
      
      if (property.userId !== user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this property' });
      }
      
      await storage.deleteProperty(id);
      return res.json({ message: 'Property deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete property' });
    }
  });

  // Appointment routes
  app.get('/api/appointments', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    try {
      const user = req.user as any;
      const appointments = await storage.getAppointmentsByUser(user.id);
      return res.json(appointments);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch appointments' });
    }
  });

  app.post('/api/appointments', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const user = req.user as any;
      
      appointmentData.userId = user.id;
      
      const appointment = await storage.createAppointment(appointmentData);
      return res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      return res.status(500).json({ message: 'Failed to create appointment' });
    }
  });

  // Saved properties routes
  app.post('/api/saved-properties/:id', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    try {
      const propertyId = parseInt(req.params.id);
      const user = req.user as any;
      
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      const updatedUser = await storage.updateUserSavedProperties(user.id, propertyId, true);
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password, ...userWithoutPassword } = updatedUser;
      return res.json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to save property' });
    }
  });

  app.delete('/api/saved-properties/:id', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    try {
      const propertyId = parseInt(req.params.id);
      const user = req.user as any;
      
      const updatedUser = await storage.updateUserSavedProperties(user.id, propertyId, false);
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password, ...userWithoutPassword } = updatedUser;
      return res.json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to remove saved property' });
    }
  });

  // Agent routes
  app.get('/api/agents', async (_req: Request, res: Response) => {
    try {
      const agents = await storage.getAgents();
      return res.json(agents);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch agents' });
    }
  });

  app.get('/api/agents/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const agent = await storage.getAgent(id);
      
      if (!agent) {
        return res.status(404).json({ message: 'Agent not found' });
      }
      
      return res.json(agent);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch agent' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
