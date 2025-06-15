import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertTeamActivitySchema, insertDocumentSchema, insertCommentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Properties routes
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid property data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create property" });
      }
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const property = await storage.updateProperty(id, updates);
      if (!property) {
        res.status(404).json({ message: "Property not found" });
        return;
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProperty(id);
      if (!success) {
        res.status(404).json({ message: "Property not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Market data routes
  app.get("/api/market-data", async (req, res) => {
    try {
      const marketData = await storage.getAllMarketData();
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  // Team activity routes
  app.get("/api/team-activity", async (req, res) => {
    try {
      const activities = await storage.getAllTeamActivity();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team activity" });
    }
  });

  app.post("/api/team-activity", async (req, res) => {
    try {
      const activityData = insertTeamActivitySchema.parse(req.body);
      const activity = await storage.createTeamActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid activity data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create activity" });
      }
    }
  });

  // Documents routes
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getAllDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid document data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create document" });
      }
    }
  });

  // Comments routes
  app.get("/api/comments", async (req, res) => {
    try {
      const comments = await storage.getAllComments();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create comment" });
      }
    }
  });

  // Users routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Dashboard stats route
  app.get("/api/dashboard-stats", async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      const marketData = await storage.getAllMarketData();
      
      const activeListings = properties.filter(p => p.status === "active").length;
      const avgPrice = properties.length > 0 
        ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length)
        : 0;
      const avgDaysOnMarket = properties.length > 0
        ? Math.round(properties.reduce((sum, p) => sum + (p.daysOnMarket || 0), 0) / properties.length)
        : 0;

      const stats = {
        activeListings,
        activeListingsChange: "+12.5%",
        avgPrice: `$${Math.round(avgPrice / 1000)}K`,
        avgPriceChange: "-2.1%",
        daysOnMarket: avgDaysOnMarket,
        daysOnMarketChange: "-5 days",
        teamPerformance: "94%",
        teamPerformanceChange: "+7.2%"
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
