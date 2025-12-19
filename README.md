![Dark Mode Banner](resources/banner_dark.png#gh-dark-mode-only)
![Light Mode Banner](resources/banner_light.png#gh-light-mode-only)

<!-- TODO: Add video showing main features -->
![Journaler Demo](placeholder-demo.gif)

## What is Journaler?

Journaler is a free, open source, privacy-focused daily journaling app for your desktop. Your entries are stored as plain text markdown files on your own machine - no accounts, no cloud sync, no data collection. 

It's for anyone who wants to build a consistent daily writing habit without worrying about where their personal thoughts end up. If you value privacy, data ownership, and simplicity over feature bloat, this app is for you.

Simple, private and free. Not a bad combination!

## Why Did You Make This?

This year, I wanted to start a daily writing habit but couldn't find an existing app that fit my specific needs. I knew I wanted something simple, without a bunch of overwhelming dials and buttons everywhere distracting me from the actual writing. But I also wanted tight calendar integration so I could easily jump between days and see some motivating metrics (how much I'm writing, streak counts, that sort of thing).

Not finding what I needed and being a software developer by profession, I decided to build my ideal journaling app myself.

After using it for a while, I thought others might find it useful too. I've benefited a lot from the open source community in the past, so I figured I'd return the favor and release this for anyone to use, for free. I really hope you like it! It's pretty barebones right now, but I plan to keep adding features (when they make sense) going forward.

## Features

- **Plain Markdown Files** - Your entries are stored as standard `.md` files in a single folder on your own machine. Open them in any text editor, forever.

- **Completely Offline** - Everything stays on your computer. No internet connection required (except the initial download, of course).

- **No Accounts or Cloud** - No sign-ups, no data collection, no tracking. Ever. What you write is your business, not mine.

- **One Entry Per Day** - A simple constraint that encourages daily writing without overwhelm.

- **Calendar Navigation** - Jump to any date instantly. See your writing history at a glance.

- **Writing Metrics** - Track your streak, word counts, and writing activity over time.

- **Export Your Journal** - Export all entries as a zip file anytime.

- **Print Entries** - Print individual entries or your entire journal at once.

- **Focus Mode** - A distraction-free writing experience when you need it.

- **Light and Dark Modes** - Easy on the eyes, day or night.

- **Sync Your Way** - Store your journal folder in Dropbox, iCloud, Google Drive, or any sync service that you choose (if you choose to). Journaler doesn't care where the files live.

## Built With

Journaler is built with:

- **Electron** - Cross-platform desktop framework
- **Vue 3** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Styling

Available for **macOS**, **Windows**, and **Linux**.

> [!IMPORTANT]
> The macOS version has been signed and notarized by Apple so it should not show any warnings when you install and run it.
>
> However, I have not yet gotten a code-signing certificate for the Windows version. So you may see a warning after installation on Windows that says something like "Windows Protected Your PC". You can choose to "Run Anyway" or not. That's up to you. All I can do is assure you I haven't slipped in any malicious code in the download files. But hey, you don't know me so I understand if you're wary. I'll work on getting that certificate as soon as I can.

## Installation

### Download a Release (Recommended)

Download the latest release for your platform from the [Releases](https://github.com/davidglassman/journaler/releases/latest) page.

- **macOS**: Download the `.dmg` file, open it, and drag Journaler to your Applications folder.

- **Windows**: Download the `.exe` installer and run it. Follow the installation prompts.

- **Linux**: Download the `.AppImage` file, make it executable (`chmod +x Journaler-x.x.x.AppImage`), and run it.

### Build from Source

If you prefer to build Journaler yourself, follow these steps.

#### Prerequisites

- [Node.js](https://nodejs.org/) version 22 or higher
- [pnpm](https://pnpm.io/) package manager (version 10.18.2 or higher)

*Journaler was developed using `pnpm` but you should be able to use `npm` or `yarn` with minimal adjustments.*

#### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/davidglassman/journaler.git
   cd journaler
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run in development mode**

   ```bash
   pnpm dev
   ```

   This starts the Vite dev server and opens Journaler in development mode with hot reloading.

4. **Build for production**

   ```bash
   pnpm build
   ```

   This compiles the app and creates platform-specific installers in the `release/` directory.

#### Other Useful Commands

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `pnpm dev`       | Start the app in development mode        |
| `pnpm build`     | Build the app for production             |
| `pnpm check`     | Run formatting, linting, and type checks |
| `pnpm lint`      | Run ESLint                               |
| `pnpm lint:fix`  | Run ESLint and auto-fix issues           |
| `pnpm format`    | Format code with Prettier                |
| `pnpm typecheck` | Run TypeScript type checking             |

#### Environment Variables

TBD

#### Building for Mac (developer account)

TODO

#### Building for Windows (certificate)

TODO

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support the Project

Journaler is completely free. If you find it useful and want to support continued development, consider buying me a coffee.

[Buy Me a Coffee](https://ko-fi.com/davidglassman)

## Reporting Bugs

If you find a bug, please [open an issue](https://github.com/davidglassman/journaler/issues/new) with:

- **Title**: A clear, descriptive title
- **Description**: Include the following:
  - Steps to reproduce the issue
  - Expected behavior vs. actual behavior
  - Your operating system and Journaler version
  - Screenshots if applicable
- **Label**: Select the `bug` label

## Suggesting Features

I'll be reviewing feature requests periodically when determining future "roadmap" work. If you have an idea for something new you'd like to see in the app, let me know!

Please [open an issue](https://github.com/davidglassman/journaler/issues/new) and include:

- **Title**: A clear description of the feature
- **Description**: Include the following:
  - Why it would be useful
  - Any implementation ideas you have
- **Label**: Select the `feature request` label

Before submitting, please check the [existing issues](https://github.com/davidglassman/journaler/issues) to avoid duplicates.
