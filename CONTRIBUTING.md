# Contributing to wc26-mcp

Thanks for your interest in contributing! This project is open source under the MIT license and welcomes issues and pull requests.

## Getting Started

```bash
git clone https://github.com/jordanlyall/wc26-mcp.git
cd wc26-mcp
npm install
npm run build
npm test
```

## Development

```bash
npm run dev    # Run with tsx (hot reload)
npm run build  # Compile TypeScript
npm test       # Run smoke tests
```

## How to Contribute

### Reporting Bugs

Open an [issue](https://github.com/jordanlyall/wc26-mcp/issues) with:
- What you expected to happen
- What actually happened
- Steps to reproduce

### Adding or Updating Data

All tournament data lives in `src/data/`. If you spot incorrect match times, missing venues, outdated injury info, or stale news, a PR fixing the data is always welcome.

### Adding Features

If you'd like to add a new tool or feature, please open an issue first to discuss the approach. This keeps everyone aligned before you invest time writing code.

## Pull Requests

1. Fork the repo and create your branch from `main`
2. Make your changes
3. Run `npm test` and ensure all tests pass
4. Run `npm run build` to verify the TypeScript compiles
5. Open a PR with a clear description of what changed and why

## Code Style

- TypeScript, strict mode
- Keep tools self-contained — each tool handler should be readable on its own
- Prefer simple, direct code over abstractions

## Questions?

Open an issue or reach out on [GitHub](https://github.com/jordanlyall/wc26-mcp).
