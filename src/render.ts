import type {
	ContributionCalendarResponse,
	SingleCommitDay,
	Week,
} from "./schema";

type rgbColor = {
	r: number;
	g: number;
	b: number;
};
export const groupIntoWeeks = (days: SingleCommitDay[]): Week[] => {
	const map = new Map<string, (SingleCommitDay | undefined)[]>();

	for (const day of days) {
		const d = new Date(`${day.date}T00:00:00Z`);
		const dow = d.getUTCDay();
		const sunday = new Date(d);
		sunday.setUTCDate(d.getUTCDate() - dow);
		const key = sunday.toISOString().slice(0, 10);

		if (!map.has(key)) map.set(key, new Array(7).fill(undefined));
		map.get(key)![dow] = day;
	}

	return [...map.entries()]
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([, arr]) => ({ contributionDays: arr }));
};

const hexToRgb = (hex: string): rgbColor => {
	const n = parseInt(hex.slice(1), 16);
	return {
		r: (n >> 16) & 255,
		g: (n >> 8) & 255,
		b: n & 255,
	};
};

const cell = (day: SingleCommitDay | undefined): string => {
	if (!day) return "  ";
	const { r, g, b } = hexToRgb(day.color);
	return `\x1b[48;2;${r};${g};${b}m  \x1b[0m`;
};

export const renderCommits = (input: ContributionCalendarResponse) => {
	const weeks =
		input.data.user?.contributionsCollection.contributionCalendar.weeks ?? [];

	if (weeks.length === 0) {
		console.log("(No data)");
		return;
	}

	for (let dow = 0; dow < 7; dow++) {
		const line = weeks.map((w) => cell(w.contributionDays[dow])).join("");
		console.log(line);
	}
};
