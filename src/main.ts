const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_USERNAME) {
	throw new Error("You must define GITHUB_USERNAME in your .env file");
}
if (!GITHUB_TOKEN) {
	throw new Error("You must define GITHUB_TOKEN in your .env file");
}

const query = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

async function fetchContributions() {
	const response = await fetch("https://api.github.com/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${GITHUB_TOKEN}`,
		},
		body: JSON.stringify({
			query,
			variables: {
				login: GITHUB_USERNAME,
			},
		}),
	});

	if (!response.ok) {
		const errorBody = await response.text();
		throw new Error(`Github API error (${response.status}): ${errorBody}`);
	}
	const data = await response.json();
	return data;
}

try {
	const data = await fetchContributions();
	console.log(JSON.stringify(data, null, 2));
} catch (error) {
	console.error("Could not get data:", error);
	process.exit(1);
}
