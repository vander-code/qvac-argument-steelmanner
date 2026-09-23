// server.js
//
// Argument Steelmanner
// --------------------
// You paste in an opinion or argument. This app asks a small AI model,
// running entirely on YOUR machine (no cloud, no API key), to write the
// strongest possible counter-argument against it.
//
// Powered by QVAC (https://github.com/tetherto/qvac), Tether's open-source
// on-device AI SDK.

import express from "express";
import {
  loadModel,
  completion,
  LLAMA_3_2_1B_INST_Q4_0,
} from "@qvac/sdk";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// We only want to load the model once, the first time it's needed,
// then reuse it for every request.
let modelId = null;
let modelLoadingPromise = null;

async function getModel() {
  if (modelId) return modelId;

  if (!modelLoadingPromise) {
    modelLoadingPromise = loadModel({
      modelSrc: LLAMA_3_2_1B_INST_Q4_0,
      modelType: "llm",
      onProgress: (progress) => {
        // The very first time you run this, QVAC downloads the model
        // file to your machine. This logs progress in your terminal.
        console.log("Downloading/loading model:", progress);
      },
    }).then((id) => {
      modelId = id;
      console.log("✅ Model loaded and ready.");
      return id;
    });
  }

  return modelLoadingPromise;
}

app.post("/api/steelman", async (req, res) => {
  try {
    const opinion = (req.body.opinion || "").trim();

    if (!opinion) {
      return res.status(400).json({ error: "Please enter an opinion or argument first." });
    }
    if (opinion.length > 2000) {
      return res.status(400).json({ error: "That's a bit long — please keep it under 2000 characters." });
    }

    const id = await getModel();

    const history = [
      {
        role: "system",
        content:
          "You are an expert debate coach. Given an opinion or argument, write the STRONGEST possible counter-argument against it — a genuine 'steelman', not a weak strawman. " +
          "Address the original argument's real weak points, use specific reasoning, and be persuasive and fair. " +
          "Reply with 3 to 5 short, punchy paragraphs or bullet points. Do not restate these instructions.",
      },
      {
        role: "user",
        content: `Here is the opinion/argument:\n\n"${opinion}"\n\nWrite the strongest possible counter-argument against it.`,
      },
    ];

    const result = completion({ modelId: id, history, stream: false });
    const text = await result.text;

    res.json({ steelman: text });
  } catch (err) {
    console.error("Error generating steelman:", err);
    res.status(500).json({ error: "Something went wrong while generating a response. Check the server terminal for details." });
  }
});

app.listen(PORT, () => {
  console.log(`\n🛡️  Argument Steelmanner running at http://localhost:${PORT}`);
  console.log("(The AI model loads on your very first request, which can take a minute or two.)\n");
});
