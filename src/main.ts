import { fetchContributions } from "./api";
import { groupIntoWeeks, renderCommits } from "./render";
import type { ContributionCalendarResponse } from "./schema";
import { loadConfig, store } from "./setup";

const { username, token } = await loadConfig();
try {
	const days = await fetchContributions(username, token, 365);
	const weeks = groupIntoWeeks(days);

	const structure: ContributionCalendarResponse = {
		data: {
			user: {
				contributionsCollection: {
					contributionCalendar: {
						totalContributions: days.reduce(
							(s, d) => s + d.contributionCount,
							0,
						),
						weeks,
					},
				},
			},
		},
	};

	renderCommits(structure);
} catch (error) {
	if (error instanceof Error && error.message.includes("(401)")) {
		store.delete("token");
		console.error("Invalid Token, run again to reconfigure");
		process.exit(1);
	}
	console.error(
		"Could not get data:",
		error instanceof Error ? error.message : error,
	);
	process.exit(1);
}
