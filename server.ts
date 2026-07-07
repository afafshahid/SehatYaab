import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "SehatYaab API is running" });
  });

  // AI Health Copilot Endpoint
  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const { symptoms, history, age } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key not configured" });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are SehatYaab medical assistant. 
        Analyze the following symptoms for a ${age} year old.
        History: ${JSON.stringify(history)}
        Symptoms: ${JSON.stringify(symptoms)}
        
        Provide:
        1. Possible causes (disclaimer: not a definitive diagnosis).
        2. Severity (Low, Medium, High).
        3. Immediate precautions.
        4. Recommended specialists to consult.
        
        Respond in JSON format with keys: causes, severity, precautions, specialists.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      // Clean markdown if present
      const cleanedJson = responseText.replace(/```json|```/g, "").trim();
      res.json(JSON.parse(cleanedJson));
    } catch (error) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: "Failed to analyze symptoms" });
    }
  });

  // Medicine Stock & Price Proxy (Example)
  app.get("/api/medicines/search", async (req, res) => {
    // In a real app, this would query a medicine database or external API
    // For now, it returns dummy data that the frontend would supplement with Firestore
    res.json({ message: "Medicine search API endpoint ready" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
