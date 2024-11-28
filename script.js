const axios = require("axios");
const GITHUB_TOKEN = require("key.js");

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

// Function to execute the query
async function fetchContributions(username) {
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

    // Parse the response
    const data = response.data.data.user.contributionsCollection;
    const result = data.commitContributionsByRepository.filter(
      (item) => !item.repository.nameWithOwner.includes("GeorgiosDrivas")
    ).length;
    console.log(
      "Total Contributions to other developers:",
      JSON.stringify(result, null, 2)
    );
    return data;
  } catch (error) {
    console.error(
      "Error fetching contributions:",
      error.response?.data || error.message
    );
  }
}

fetchContributions("GeorgiosDrivas");
