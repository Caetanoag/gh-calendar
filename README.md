# gh-calendar

[![npm version](https://img.shields.io/npm/v/gh-calendar.svg)](https://www.npmjs.com/package/gh-calendar)
[![License: GPL-3.0-only](https://img.shields.io/badge/license-GPL--3.0--only-blue.svg)](LICENSE)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)

Display your GitHub contribution calendar as a colored grid right in your terminal — just like the contribution graph on your GitHub profile.

```
⬜🟩🟩⬜🟩🟩🟩⬜⬜🟩🟩⬜🟩🟩🟩⬜🟩⬜🟩🟩⬜🟩🟩🟩⬜🟩
🟩🟩⬜🟩🟩⬜🟩🟩⬜🟩⬜🟩🟩⬜🟩🟩🟩⬜🟩🟩🟩⬜🟩🟩⬜🟩
🟩⬜🟩🟩🟩🟩⬜🟩🟩⬜🟩⬜🟩🟩⬜🟩🟩🟩⬜🟩⬜🟩🟩🟩🟩⬜
⬜🟩⬜🟩⬜🟩🟩🟩⬜🟩🟩🟩⬜🟩🟩⬜🟩⬜🟩🟩🟩⬜🟩⬜🟩🟩
🟩🟩🟩⬜🟩⬜🟩⬜🟩🟩⬜🟩🟩🟩⬜🟩🟩🟩⬜🟩🟩🟩⬜🟩⬜🟩
🟩⬜🟩🟩⬜🟩⬜🟩🟩⬜🟩🟩⬜🟩🟩⬜🟩🟩🟩⬜🟩🟩🟩🟩🟩⬜
⬜🟩⬜🟩🟩🟩🟩⬜🟩🟩🟩⬜🟩⬜🟩🟩⬜🟩🟩⬜🟩⬜🟩🟩⬜🟩
```

> Illustrative preview. In a real terminal, cells use GitHub's exact contribution colors.

## Features

- **Interactive first-run setup** — you are prompted for your username and token; the token input is hidden
- **Credentials stored locally** and reused on later runs, with restricted file permissions
- **Optional environment variables** to skip the prompts (handy for CI or dotfiles)
- **Automatic token reset** — an invalid token is discarded so the next run can reconfigure
- 7 × ~53 grid covering the **last 365 days** (Sunday to Saturday rows)
- Truecolor (24-bit) output using the same colors as GitHub's contribution graph
- Fetches data from the GitHub GraphQL API
- Small, readable TypeScript source

## Requirements

- Node.js **18 or newer** (or [Bun](https://bun.sh) for development)
- A terminal with **truecolor** support (most modern terminals)
- A GitHub **classic Personal Access Token** with the `read:user` scope

## Installation

Run it directly without installing:

```bash
npx gh-calendar
```

Or install it globally:

```bash
npm install -g gh-calendar
gh-calendar
```

As a project dependency:

```bash
npm install --save-dev gh-calendar
npx gh-calendar
```

## Setup

Configuration is interactive: on the first run you are asked for your GitHub username and a Personal Access Token, and the values are saved for next time. No manual `.env` setup is required.

### 1. Create a token

Create a classic PAT at **<https://github.com/settings/tokens/new>** and select the **`read:user`** scope.

### 2. Run the CLI

```bash
npx gh-calendar
```

You will be prompted for:

1. Your GitHub username (the login, e.g. `octocat`)
2. Your Personal Access Token (input is hidden)

After both values are provided, they are written to a local config file and the calendar is rendered immediately.

> The prompts are currently displayed in Portuguese.

### Stored configuration

Credentials are saved with the [`conf`](https://github.com/sindresorhus/conf) package in your operating system's config directory:

| OS      | Typical path                                          |
| ------- | ----------------------------------------------------- |
| Linux   | `~/.config/gh-calendar/config.json`                   |
| macOS   | `~/Library/Preferences/gh-calendar/config.json`       |
| Windows | `%APPDATA%\gh-calendar\Config\config.json`            |

The exact path is printed when the configuration is saved. The file is restricted to your user where the OS supports it (`chmod 600`).

The token is stored in plain text inside that file, so treat it like any other credential. It is only sent to `https://api.github.com`. If you prefer not to store it, use the environment variables below or delete the file after running.

### Environment variables (optional)

| Variable          | Description                              |
| ----------------- | ---------------------------------------- |
| `GITHUB_USERNAME` | Your GitHub username (login)             |
| `GITHUB_TOKEN`    | A classic PAT with the `read:user` scope |

If **both** are set, they take precedence and the prompts are skipped. If only one is set, the missing value is prompted and the pair is saved. If neither is set, the stored configuration is used.

```bash
export GITHUB_USERNAME="your-username"
export GITHUB_TOKEN="ghp_your_token_here"
npx gh-calendar
```

To persist them, add those lines to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.).

#### Using a `.env` file

```bash
cp .env.example .env
# then edit .env with your credentials
```

```env
GITHUB_USERNAME=your-username
GITHUB_TOKEN=ghp_your_token_here
```

> **Note:** `.env` is loaded automatically **only when running through Bun** (`bun run dev`).
> The published CLI runs on Node.js, which does not read `.env` by default. When using `npx` or a
> global install, export the variables in your shell, or load the file first:
>
> ```bash
> set -a; source .env; set +a
> npx gh-calendar
> ```

### Changing or resetting credentials

- If GitHub rejects the stored token with a **401**, the CLI deletes it and asks you to run again; the next run prompts for a new token.
- To change your username or token, either override them with the environment variables above or delete the config file (path shown after setup) and run the CLI again.
- To stop using a stored token entirely, delete the config file.

## Usage

```bash
gh-calendar
```

After the first run, the CLI reads the saved configuration and renders the calendar directly.

The output is a 7-row grid (Sunday at the top, Saturday at the bottom) where each column is a week. Each colored cell represents a day, with the color intensity matching that day's contribution count using GitHub's palette:

- ⬜ no contributions
- 🟩 light green → dark green for increasing contribution counts

The graph covers the 365 days preceding the moment you run the command, so the first and last weeks may be partial.

There are no command-line flags yet — configuration is handled by the interactive setup or environment variables.

## Troubleshooting

| Message / Symptom                              | Likely cause & fix                                                                 |
| ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| Setup prompt appears on every run              | The config file cannot be written, or `HOME`/config directory is not available. Check the path and permissions. |
| Prompt appears even though variables are set   | Only one of `GITHUB_USERNAME` / `GITHUB_TOKEN` is set. Set both.                   |
| `GitHub API error (401)`                       | Token is invalid or expired. It is removed automatically; run again to reconfigure. |
| `GitHub API error (403)`                       | Token lacks the `read:user` scope, or you hit the GitHub API rate limit.           |
| `User "..." not found`                         | `GITHUB_USERNAME` is misspelled. It must be your login, not your display name. Delete the config (or override the env vars) and reconfigure. |
| `(No data)` or an empty graph                 | The account has no public contributions in the period, or the credentials belong to a different user. Enable "Include private contributions on my profile" if you want them counted. |
| Colors look wrong or are missing               | Your terminal lacks truecolor support. Try a modern terminal (e.g. iTerm2, Kitty, WezTerm, Windows Terminal). |
| Prompts fail in CI or a non-interactive shell  | Set `GITHUB_USERNAME` and `GITHUB_TOKEN` to skip the prompts.                      |

## Development

Run from source with Bun:

```bash
git clone https://github.com/caetanoag/gh-calendar.git
cd gh-calendar
bun install
bun run dev
```

The first run prompts for credentials just like the published CLI. For non-interactive development, export `GITHUB_USERNAME` and `GITHUB_TOKEN`, or use a `.env` file (Bun loads it automatically).

### Scripts

| Command             | Description                                      |
| ------------------- | ------------------------------------------------ |
| `bun run dev`       | Run the CLI directly from `src/main.ts`          |
| `bun run build`     | Bundle the CLI into `dist/` for publishing       |
| `bun run typecheck` | Type-check the project with `tsc --noEmit`       |

### Project structure

| File            | Responsibility                                              |
| --------------- | ----------------------------------------------------------- |
| `src/main.ts`   | Entry point: loads config, fetches data and renders the grid |
| `src/setup.ts`  | Interactive credential setup and local config storage        |
| `src/api.ts`    | GitHub GraphQL request and response validation               |
| `src/render.ts` | Week grouping and ANSI truecolor rendering                   |
| `src/schema.ts` | Shared TypeScript types                                     |

## Contributing

Issues and pull requests are welcome at **<https://github.com/caetanoag/gh-calendar>**. For larger changes, please open an issue first to discuss the approach.

## License

[GPL-3.0-only](LICENSE)
