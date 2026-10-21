import { fetchContributions } from "./api";
import { groupIntoWeeks, renderCommits } from "./render";
import type { ContributionCalendarResponse } from "./schema";

try {
	const days = await fetchContributions(365);
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
	console.error(
		"Could not get data:",
		error instanceof Error ? error.message : error,
	);
	process.exit(1);
}
