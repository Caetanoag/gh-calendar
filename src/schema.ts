export type SingleCommitDay = {
	date: string;
	contributionCount: number;
	color: string;
};

export type ContributionCalendarResponse = {
	data: {
		user: {
			contributionsCollection: {
				contributionCalendar: {
					totalContributions: number;
					weeks: Week[];
				};
			};
		} | null;
	};
	errors?: { message: string }[];
};

export type Week = { contributionDays: (SingleCommitDay | undefined)[] };
