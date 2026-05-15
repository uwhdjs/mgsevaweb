import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

dotenv.config();

// Load Firebase Config for database ID
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8"));

// Initialize Firebase Admin
if (getApps().length === 0) {
  try {
    // In many environments, no args is best. 
    // We only pass projectId if it's explicitly needed or environment is not set.
    initializeApp();
    console.log("Firebase Admin initialized with default credentials");
  } catch (e: any) {
    console.warn("Default initialization failed, trying with config:", e.message);
    initializeApp({
      projectId: firebaseConfig.projectId,
    });
  }
}

const adminApp = getApps()[0];

// Access Firestore
// Note: In firebase-admin, getFirestore() picks up the databaseId from the default app config if set,
// or we can pass it explicitly.
const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';
const db = getFirestore(adminApp, databaseId);

// Test connection and log internal errors for debugging
async function testDBConnection() {
  try {
    const testColl = db.collection("health_check");
    // We try a simple get to verify connectivity and permissions
    await testColl.limit(1).get();
    console.log(`Firestore (Admin) connected successfully to project: ${firebaseConfig.projectId}, db: ${databaseId}`);
  } catch (err: any) {
    console.error("Firestore Admin Connection Error Details:", {
      message: err.message,
      code: err.code,
      projectId: firebaseConfig.projectId,
      databaseId: databaseId
    });
    // If we fail here, the server likely has connectivity or permission issues with Firestore
  }
}
testDBConnection();

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY) 
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Sessions expire after 24 hours
  const verifySession = async (sessionId: string) => {
    if (!sessionId) return false;
    
    // Check fallback in-memory first
    if (fallbackSessions.has(sessionId)) return true;

    try {
      const doc = await db.collection("admin_sessions").doc(sessionId).get();
      if (doc.exists) {
        const data = doc.data();
        let createdAtMillis = 0;
        
        if (data?.createdAt) {
          if (typeof data.createdAt.toMillis === 'function') {
            createdAtMillis = data.createdAt.toMillis();
          } else if (data.createdAt instanceof Date) {
            createdAtMillis = data.createdAt.getTime();
          } else if (typeof data.createdAt === 'number') {
            createdAtMillis = data.createdAt;
          }
        }

        // Sessions expire after 24 hours
        const isExpired = createdAtMillis > 0 && (Date.now() - createdAtMillis > 24 * 60 * 60 * 1000);
        return !isExpired;
      }
      return false;
    } catch (err) {
      console.error("Session verification error:", err);
      return false;
    }
  };

  const fallbackSessions = new Set<string>();

  const createSession = async () => {
    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    try {
      // Attempt Firestore write
      await db.collection("admin_sessions").doc(sessionId).set({
        createdAt: new Date(),
        id: sessionId,
        type: 'persistent'
      });
      console.log(`Successfully created persistent admin session: ${sessionId}`);
      return sessionId;
    } catch (err: any) {
      // Always fallback to in-memory to ensure login works even if Firestore is grumpy
      console.warn("Using in-memory session fallback:", err.message);
      fallbackSessions.add(sessionId);
      return sessionId;
    }
  };

  // Admin Login
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "sansthan@2024") {
      try {
        const sessionId = await createSession();
        res.json({ success: true, sessionId });
      } catch (err: any) {
        console.error("Login session creation error:", err);
        res.status(500).json({ success: false, error: `Failed to create session: ${err.message}` });
      }
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  });

  // Admin Login via Firebase (Google Auth)
  app.post("/api/admin/login-firebase", async (req, res) => {
    const { uid, email } = req.body;
    
    if (email === "uwhdjs152@gmail.com") {
      try {
        const sessionId = await createSession();
        res.json({ success: true, sessionId });
      } catch (err: any) {
        console.error("Firebase Login session creation error:", err);
        res.status(500).json({ success: false, error: `Failed to create session: ${err.message}` });
      }
    } else {
      res.status(401).json({ success: false, error: "Unauthorized email" });
    }
  });

  // Middleware to check admin session
  const checkAdmin = async (req: any, res: any, next: any) => {
    const sessionId = req.headers["x-admin-session"];
    if (sessionId && await verifySession(sessionId as string)) {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized or session expired. Please login again." });
    }
  };

  // Admin Data: Donations
  app.get("/api/admin/donations", checkAdmin, async (req, res) => {
    try {
      const snapshot = await db.collection("donations").get();
      const donations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      // Sort in-memory to avoid index requirement
      donations.sort((a, b) => {
        const getTime = (val: any) => {
          if (!val) return 0;
          if (typeof val.toMillis === 'function') return val.toMillis();
          if (val instanceof Date) return val.getTime();
          if (typeof val === 'number') return val;
          if (val._seconds) return val._seconds * 1000;
          return 0;
        };
        return getTime(b.createdAt) - getTime(a.createdAt);
      });
      res.json(donations);
    } catch (error: any) {
      console.error("Donations API error:", error);
      res.status(500).json({ error: `Server Firestore Error: ${error.message}. This often means the service account lacks permissions for the database '${databaseId}'.` });
    }
  });

  // Admin Data: Messages
  app.get("/api/admin/messages", checkAdmin, async (req, res) => {
    try {
      const snapshot = await db.collection("messages").get();
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      // Sort in-memory
      messages.sort((a, b) => {
        const getTime = (val: any) => {
          if (!val) return 0;
          if (typeof val.toMillis === 'function') return val.toMillis();
          if (val instanceof Date) return val.getTime();
          if (typeof val === 'number') return val;
          if (val._seconds) return val._seconds * 1000;
          return 0;
        };
        return getTime(b.createdAt) - getTime(a.createdAt);
      });
      res.json(messages);
    } catch (error: any) {
      console.error("Messages API error:", error);
      res.status(500).json({ error: `Server Firestore Error: ${error.message}` });
    }
  });

  app.delete("/api/admin/messages/:id", checkAdmin, async (req, res) => {
    try {
      await db.collection("messages").doc(req.params.id).delete();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/admin/donations/:id", checkAdmin, async (req, res) => {
    try {
      await db.collection("donations").doc(req.params.id).delete();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Create Stripe Checkout Session
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe is not configured. Please set STRIPE_SECRET_KEY in .env" });
      }

      const { amount, donorName, donorEmail } = req.body;

      if (!amount || amount < 50) {
        return res.status(400).json({ error: "Minimum donation amount is ₹50" });
      }

      // Convert INR to Paise (Stripe expects the smallest currency unit)
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "Donation to Mangla Gauri Seva Sansthaan",
                description: "Thank you for supporting our mission to serve humanity.",
                images: ["https://lh3.googleusercontent.com/d/1HW5ouARgO2-kRuawJOktm8afqhh_BdB1"],
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: donorEmail || undefined,
        success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}&donation_status=success&donation_id=${req.body.donationId}`,
        cancel_url: `${req.headers.origin}/?donation_status=cancel&donation_id=${req.body.donationId}`,
        metadata: {
          donorName,
          donorEmail,
          amount: amount.toString(),
          donationId: req.body.donationId
        },
      });

      res.status(200).json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Verify Session
  app.get("/api/verify-session/:sessionId", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }
      const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
      res.status(200).json({ status: session.payment_status });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API routes go ABOVE Vite middleware
  app.get("/api/health", async (req, res) => {
    try {
      const testDoc = await db.collection("health_check").doc("status").get();
      res.json({ 
        status: "ok", 
        firestore: "connected", 
        project: firebaseConfig.projectId,
        dbId: firebaseConfig.firestoreDatabaseId || '(default)'
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
