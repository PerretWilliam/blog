# Blog

Professional, high-quality Next.js blog template with Tailwind CSS and TypeScript.

## Description

This repository contains a multilingual blog built with Next.js, Tailwind CSS and TypeScript. It includes utilities for rendering Markdown posts, syntax-highlighted code blocks, a newsletter system, and a responsive UI with dark mode.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn UI primitives
- rehype / remark for Markdown processing
- Shiki for code highlighting

## Prerequisites

- Node.js (recommended v18+)
- pnpm (preferred package manager)

## Installation

1. Clone the repository:

   git clone <https://github.com/PerretWilliam/blog>
   cd blog

2. Install dependencies:

   pnpm install

## Development

- Start the development server:

  pnpm dev

- Linting:

  pnpm run lint

## Build and Production

- Build the production bundle:

  pnpm build

- Start the production server (after build):

  pnpm start

## Environment Variables

Create a `.env.local` file in the project root for any required secrets. Typical variables used by this project may include API keys for newsletter or email providers. Example:

```env
# RESEND_API_KEY=your_resend_api_key
# NEXT_PUBLIC_SOME_KEY=public_value
```

Only add environment variables that your deployment or local setup requires.

## Project Structure

- `app/` — Next.js App Router pages and layouts
- `components/` — Reusable UI components
- `content/` — Markdown posts and email templates
- `lib/` — Utilities for metadata, posts and helpers
- `public/` — Static assets (images, icons)
- `constant/`, `dictionaries/` — Config and localized dictionaries

## Features

- Multilingual content structure (`en` / `fr` folders under `app` and `content`)
- Markdown-based posts with syntax-highlighted code blocks
- File title and language badges for code blocks
- Copy-to-clipboard button for code samples
- Newsletter signup and unsubscribe flow
- Light / dark themes using CSS variables and Tailwind utilities

## Usage Notes

- Markdown posts are located under `content/posts/{lang}`.
- Components are designed to be composable; follow existing patterns when adding new UI pieces.
- The global CSS file defines theme variables and code-block styles.

## Contributing

Contributions are welcome. To propose changes:

1. Open an issue describing the change or bug.
2. Create a branch for your work.
3. Submit a pull request with a clear description of changes.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

## Contact

For questions about this project, open an issue or contact the repository owner.
