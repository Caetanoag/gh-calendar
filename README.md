# gh-calendar

A simple CLI tool to display your GitHub contribution calendar as a colored grid in your terminal, similar to the GitHub profile contribution graph.

## Installation

### Using npx
```bash
npx gh-calendar
```

### Global install
```bash
npm install -g gh-calendar
gh-calendar
```

### Local install
```bash
npm install --save-dev gh-calendar
npx gh-calendar
```

## Prerequisites

You need a GitHub Personal Access Token (PAT) with `read:user` permission.

## Setup

Set the following environment variables:

```bash
export GITHUB_USERNAME=YOUR_USERNAME
export GITHUB_TOKEN=YOUR_PAT_TOKEN_WITH_READ:USER_PERMISSION
```

Or create a `.env` file in your working directory:

```env
GITHUB_USERNAME=YOUR_USERNAME
GITHUB_TOKEN=YOUR_PAT_TOKEN_WITH_READ:USER_PERMISSION
```

## Usage

Once configured, just run:

```bash
gh-calendar
```

The output is a 7-row grid (Sunday to Saturday) where each colored square represents a day, using GitHub's contribution colors.

## Development

If you want to run from source:

```bash
git clone https://github.com/caetanoag/gh-calendar.git
cd gh-calendar
bun install
cp .env.example .env
# Edit .env with your credentials
bun run dev
```

## Scripts

- `bun run dev` - Run from source
- `bun run build` - Build for npm publishing
- `bun run typecheck` - Run TypeScript type checking

## License

[GPL-3.0-only](LICENSE)
