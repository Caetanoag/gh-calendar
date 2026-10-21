import type { ContributionCalendarResponse, SingleCommitDay } from "./schema";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_USERNAME)
	throw new Error("You must define GITHUB_USERNAME in your .env file");
if (!GITHUB_TOKEN)
	throw new Error("You must define GITHUB_TOKEN in your .env file");

const query = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
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

export async function fetchContributions(
	days: number,
): Promise<SingleCommitDay[]> {
	const to = new Date();
	const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);

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
				from: from.toISOString(),
				to: to.toISOString(),
			},
		}),
	});

	if (!response.ok) {
		throw new Error(
			`GitHub API error (${response.status}): ${await response.text()}`,
		);
	}

	const json = (await response.json()) as ContributionCalendarResponse;

	if (json.errors?.length) {
		throw new Error(
			`GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`,
		);
	}

	const user = json.data.user;
	if (!user) throw new Error(`User "${GITHUB_USERNAME}" not found`);

	return user.contributionsCollection.contributionCalendar.weeks.flatMap(
		(week) => week.contributionDays,
	);
}
