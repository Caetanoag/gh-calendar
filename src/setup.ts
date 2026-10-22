import { chmodSync } from "node:fs";
import { cancel, intro, isCancel, outro, password, text } from "@clack/prompts";
import Conf from "conf";

export type Config = {
	username: string;
	token: string;
};

export const store = new Conf<Partial<Config>>({
	projectName: "gh-calendar",
	projectVersion: "0.1.0",
	projectSuffix: "",
});

const secureFile = () => {
	try {
		chmodSync(store.path, 0o600);
	} catch {}
};

const readEnv = (): Partial<Config> => ({
	username: process.env.GITHUB_USERNAME || undefined,
	token: process.env.GITHUB_TOKEN || undefined,
});

async function promptMissing(partial: Partial<Config>): Promise<Config> {
	intro("gh-calendar — setup");

	let { username, token } = partial;

	if (!username) {
		const answer = await text({
			message: "GitHub username:",
			placeholder: "octocat",
			validate: (v) => (v && v.length > 0 ? undefined : "Required"),
		});
		if (isCancel(answer)) {
			cancel("Cancelado.");
			process.exit(1);
		}
		username = answer;
	}

	if (!token) {
		const answer = await password({
			message: "Personal Access Token (scope read:user):",
			validate: (v) => (v && v.length > 0 ? undefined : "Required"),
		});
		if (isCancel(answer)) {
			cancel("Cancelado.");
			process.exit(1);
		}
		token = answer;
	}

	const filled: Config = { username: username!, token: token! };
	store.set(filled);
	secureFile();
	outro(`Configuração salva em ${store.path}`);

	return filled;
}

export async function loadConfig(): Promise<Config> {
	const env = readEnv();
	const merged: Partial<Config> = {
		username: env.username ?? store.get("username"),
		token: env.token ?? store.get("token"),
	};
	if (merged.username && merged.token) return merged as Config;
	return promptMissing(merged);
}
