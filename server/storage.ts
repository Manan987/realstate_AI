import { 
  users, properties, marketData, teamActivity, documents, comments,
  type User, type InsertUser, 
  type Property, type InsertProperty,
  type MarketData, type InsertMarketData,
  type TeamActivity, type InsertTeamActivity,
  type Document, type InsertDocument,
  type Comment, type InsertComment
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Property methods
  getAllProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Market data methods
  getAllMarketData(): Promise<MarketData[]>;
  createMarketData(data: InsertMarketData): Promise<MarketData>;
  
  // Team activity methods
  getAllTeamActivity(): Promise<Array<TeamActivity & { user: User }>>;
  createTeamActivity(activity: InsertTeamActivity): Promise<TeamActivity>;
  
  // Document methods
  getAllDocuments(): Promise<Array<Document & { sharedByUser: User }>>;
  createDocument(document: InsertDocument): Promise<Document>;
  
  // Comment methods
  getAllComments(): Promise<Array<Comment & { user: User }>>;
  createComment(comment: InsertComment): Promise<Comment>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private marketData: Map<number, MarketData>;
  private teamActivity: Map<number, TeamActivity>;
  private documents: Map<number, Document>;
  private comments: Map<number, Comment>;
  private currentUserId: number;
  private currentPropertyId: number;
  private currentMarketDataId: number;
  private currentTeamActivityId: number;
  private currentDocumentId: number;
  private currentCommentId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.marketData = new Map();
    this.teamActivity = new Map();
    this.documents = new Map();
    this.comments = new Map();
    this.currentUserId = 1;
    this.currentPropertyId = 1;
    this.currentMarketDataId = 1;
    this.currentTeamActivityId = 1;
    this.currentDocumentId = 1;
    this.currentCommentId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed users
    const defaultUsers = [
      { username: "john_doe", password: "password", name: "John Doe", role: "Senior Agent", initials: "JD" },
      { username: "sarah_johnson", password: "password", name: "Sarah Johnson", role: "Market Analyst", initials: "SJ" },
      { username: "mike_torres", password: "password", name: "Mike Torres", role: "Real Estate Agent", initials: "MT" },
      { username: "emma_rodriguez", password: "password", name: "Emma Rodriguez", role: "Team Lead", initials: "ER" }
    ];

    defaultUsers.forEach(user => {
      const id = this.currentUserId++;
      this.users.set(id, { ...user, id });
    });

    // Seed market data
    const marketDataEntries = [
      { month: "Jan", avgPrice: 420000, competitorAvgPrice: 415000, activeListings: 240, daysOnMarket: 25 },
      { month: "Feb", avgPrice: 435000, competitorAvgPrice: 428000, activeListings: 235, daysOnMarket: 23 },
      { month: "Mar", avgPrice: 445000, competitorAvgPrice: 440000, activeListings: 245, daysOnMarket: 22 },
      { month: "Apr", avgPrice: 458000, competitorAvgPrice: 452000, activeListings: 250, daysOnMarket: 20 },
      { month: "May", avgPrice: 470000, competitorAvgPrice: 465000, activeListings: 248, daysOnMarket: 19 },
      { month: "Jun", avgPrice: 485000, competitorAvgPrice: 478000, activeListings: 247, daysOnMarket: 18 },
    ];

    marketDataEntries.forEach(data => {
      const id = this.currentMarketDataId++;
      this.marketData.set(id, { ...data, id, createdAt: new Date() });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Property methods
  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const pricePerSqft = Math.round(insertProperty.price / insertProperty.sqft);
    const property: Property = { 
      ...insertProperty, 
      id, 
      pricePerSqft,
      createdAt: new Date() 
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty = { ...property, ...updates };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Market data methods
  async getAllMarketData(): Promise<MarketData[]> {
    return Array.from(this.marketData.values());
  }

  async createMarketData(insertData: InsertMarketData): Promise<MarketData> {
    const id = this.currentMarketDataId++;
    const data: MarketData = { ...insertData, id, createdAt: new Date() };
    this.marketData.set(id, data);
    return data;
  }

  // Team activity methods
  async getAllTeamActivity(): Promise<Array<TeamActivity & { user: User }>> {
    const activities = Array.from(this.teamActivity.values());
    return activities.map(activity => {
      const user = this.users.get(activity.userId);
      return { ...activity, user: user! };
    }).filter(activity => activity.user);
  }

  async createTeamActivity(insertActivity: InsertTeamActivity): Promise<TeamActivity> {
    const id = this.currentTeamActivityId++;
    const activity: TeamActivity = { ...insertActivity, id, createdAt: new Date() };
    this.teamActivity.set(id, activity);
    return activity;
  }

  // Document methods
  async getAllDocuments(): Promise<Array<Document & { sharedByUser: User }>> {
    const docs = Array.from(this.documents.values());
    return docs.map(doc => {
      const sharedByUser = this.users.get(doc.sharedBy);
      return { ...doc, sharedByUser: sharedByUser! };
    }).filter(doc => doc.sharedByUser);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const document: Document = { ...insertDocument, id, createdAt: new Date() };
    this.documents.set(id, document);
    return document;
  }

  // Comment methods
  async getAllComments(): Promise<Array<Comment & { user: User }>> {
    const comments = Array.from(this.comments.values());
    return comments.map(comment => {
      const user = this.users.get(comment.userId);
      return { ...comment, user: user! };
    }).filter(comment => comment.user);
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = { ...insertComment, id, createdAt: new Date() };
    this.comments.set(id, comment);
    return comment;
  }
}

export const storage = new MemStorage();
