import express from "express";
import fs from "fs/promises";
import path from "path";
import axios from "axios";
import query from "./query.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PORT = 3000;

app.use(express.static(__dirname));

// Landing page
app.get("/", async (req, res) => {
  const html = await fs.readFile(path.join(__dirname, "index.html"), "utf8");
  res.send(html);
});

// Results page
app.get("/contributions/:username", async (req, res) => {
  const username = req.params.username;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    const response = await axios.post(
      "https://api.github.com/graphql",
      {
        query,
        variables: { username },
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data.data.user.contributionsCollection;
    const result = data.commitContributionsByRepository.filter(
      (item) => !item.repository.nameWithOwner.includes(username)
    ).length;

    const html = await fs.readFile(
      path.join(__dirname, "results.html"),
      "utf8"
    );
    const renderedHtml = html.replace("{{contributions}}", result);
    res.send(renderedHtml);
  } catch (error) {
    console.error(
      "Error fetching contributions:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch contributions." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
