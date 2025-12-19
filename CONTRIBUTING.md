# Contributing to Journaler

Thank you for your interest in contributing to Journaler! This document provides guidelines and information for contributors.

## Code of Conduct

Please be respectful and constructive in all interactions. We're all here to make Journaler better.

## How to Contribute

### Reporting Bugs

If you find a bug, please [open an issue](https://github.com/davidglassman/journaler/issues/new) with:

- **Title**: A clear, descriptive title
- **Description**: Include the following:
  - Steps to reproduce the issue
  - Expected behavior vs. actual behavior
  - Your operating system and Journaler version
  - Screenshots if applicable
- **Label**: Select the `bug` label

### Suggesting Features

I'll be reviewing feature requests periodically when determining future "roadmap" work. If you have an idea for something new you'd like to see in the app, let me know!

Please [open an issue](https://github.com/davidglassman/journaler/issues/new) and include:

- **Title**: A clear description of the feature
- **Description**: Include the following:
  - Why it would be useful
  - Any implementation ideas you have
- **Label**: Select the `feature request` label

Before submitting, please check the [existing issues](https://github.com/davidglassman/journaler/issues) to avoid duplicates.

### Submitting Code

Before working on code, please check the [existing issues](https://github.com/davidglassman/journaler/issues) to make sure what you are about to work on is known and approved. The last thing we want is for anyone to spend time working on something that we have no intention of introducing into the application. We want to make sure everything added to Journaler is on the roadmap. This only pertains to new features or major changes. Bug fixes are always welcome!

#### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/davidglassman/journaler.git
   cd journaler
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b your-feature-name
   ```

#### Development Workflow

1. Make your changes
2. Run the checks to ensure code quality:
   ```bash
   pnpm check
   ```
   This runs formatting, linting, and type checking.
3. Test your changes locally:
   ```bash
   pnpm dev
   ```

#### Commit Guidelines

- Write clear, concise commit messages
- Use present tense ("Add feature" not "Added feature")
- Reference issue numbers when applicable (e.g., "Fix calendar bug #42")

#### Pull Request Process

1. Push your branch to your fork:
   ```bash
   git push origin your-feature-name
   ```
2. Open a pull request against the `main` branch
3. Fill out the PR template with:
   - A description of your changes
   - Any related issue numbers
   - Screenshots for UI changes
4. Wait for review. You may be asked to make changes.
5. Once approved, your PR will be merged.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) version 22 or higher
- [pnpm](https://pnpm.io/) version 10.18.2 or higher

### Project Structure

```
journaler/
├── electron/           # Electron main process code
│   ├── main.ts         # Main process entry point
│   ├── preload.ts      # Preload script
│   └── services/       # Backend services (file handling, etc.)
├── src/                # Vue frontend code
│   ├── components/     # Vue components
│   ├── composables/    # Vue composables
│   ├── store/          # Pinia stores
│   └── main.ts         # Renderer entry point
├── shared/             # Code shared between main and renderer
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
└── build/              # Build resources and scripts
```

### Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm check` | Run all checks (format, lint, typecheck) |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with auto-fix |
| `pnpm format` | Format code with Prettier |
| `pnpm typecheck` | Run TypeScript type checking |

## Style Guide

### Code Style

- Code is formatted with Prettier and linted with ESLint
- Run `pnpm check` before committing to catch issues
- Run `pnpm lint:fix` to auto-fix linting issues
- Run `pnpm format` to auto-format code

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types
- Define interfaces for data structures in `shared/types/`

### Vue Components

- Use `<script setup>` syntax
- Keep components focused and single-purpose
- Use shadcn for UI components

## Questions?

If you have questions about contributing, feel free to [open an issue](https://github.com/davidglassman/journaler/issues) and ask.

Thank you for contributing!
