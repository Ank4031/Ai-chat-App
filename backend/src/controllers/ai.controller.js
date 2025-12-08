import { GoogleGenAI } from "@google/genai";
import { AsyncHandler } from "../utilities/AsyncHandler.js";
import { ApiResponce } from "../utilities/ApiResponce.js";
import { ApiError } from "../utilities/ApiError.js";

// Create Gemini client. The client will read `GEMINI_API_KEY` from env if not provided explicitly.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const AiRespond = AsyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    throw new ApiError(400, "message is required");
  }

  const model = process.env.GENAI_MODEL || "gemini-2.5-flash";

  const response = await ai.models.generateContent({
    model,
    contents: message,
  });

  // `response.text` is the high-level helper containing generated text
  const text = response?.text || "";

  return res.status(200).json(new ApiResponce(200, { text }, "AI response generated"));
});

export { AiRespond };
