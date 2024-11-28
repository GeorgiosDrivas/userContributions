const express = require("express");
const axios = require("axios");
const app = express();

// Define the GraphQL query
const query = `
  query GetContributions($username: String!) {
    user(login: $username) {
      contributionsCollection {
        commitContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
          }
          contributions(first: 100) {
            totalCount
          }
        }
        pullRequestContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
          }
          contributions(first: 100) {
            totalCount
          }
        }
        issueContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
          }
          contributions(first: 100) {
            totalCount
          }
        }
        pullRequestReviewContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
          }
          contributions(first: 100) {
            totalCount
          }
        }
      }
    }
  }
`;

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

    // Send the data back as JSON
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
          #wrap {
            width: 150px;
            height: 25px;
            color: #fff;
            border-radius: 3px;
            display: flex;
            font-family: Arial, sans-serif;
            align-items: center;
            justify-content: center;
          }
          #name {
            background-color: #535353;
            padding: 2px 10px;
            border-bottom-left-radius: 5px;
            border-top-left-radius: 5px;
          }
          #number {
            background-color: #1379b2;
            padding: 2px 10px;
            border-bottom-right-radius: 5px;
            border-top-right-radius: 5px;
          }
          </style>
        </head>
        <body>
          <div id="wrap">
            <p id="name">Contributions</p>
            <p id="number">${result}</p>
          </div>
        </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error(
      "Error fetching contributions:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch contributions." });
  }
});

const PORT = 3000; // Choose your port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
