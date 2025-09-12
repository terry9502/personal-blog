# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog project built with Next.js 15, featuring a complete blog system with content management capabilities. The project is structured as a monorepo with the main blog application in the `my-blog/` directory.

## Development Commands

Navigate to the `my-blog/` directory first, then use these commands:

- **Development**: `npm run dev` - Start the development server on http://localhost:3000
- **Build**: `npm run build` - Create production build
- **Start**: `npm start` - Run production server
- **Lint**: `npm run lint` - Run ESLint (note: currently configured to ignore during builds)
- **Content Management**: 
  - `npm run download-yuque` - Download content from Yuque API
  - `npm run download-images` - Download and optimize images

## Architecture

### Core Structure
- **Framework**: Next.js 15 with App Router
- **Styling**: TailwindCSS with custom theming
- **Content**: MDX support with custom components and syntax highlighting
- **Analytics**: Vercel Analytics and Google Analytics integration
- **Themes**: Dark/light mode with system preference detection

### Directory Organization
```
my-blog/
├── src/
│   ├── app/          # Next.js App Router pages
│   │   ├── blog/     # Blog post pages with dynamic routing
│   │   ├── tags/     # Tag-based filtering
│   │   ├── archive/  # Archive timeline view
│   │   └── search/   # Search functionality
│   ├── components/   # Reusable React components
│   ├── content/      # Blog post content and metadata
│   └── lib/          # Utility functions and configurations
├── scripts/          # Content management scripts
└── public/           # Static assets
```

### Key Features
- **Content Management**: Automated content import from Yuque platform
- **Search & Filtering**: Client-side search with tag-based filtering
- **SEO Optimization**: Comprehensive metadata, structured data, and RSS feeds
- **Performance**: Image optimization, lazy loading, and efficient caching
- **Responsive Design**: Mobile-first approach with Tailwind utilities

### Component Architecture
- **Layout Components**: Header, Footer, ThemeProvider for consistent structure
- **Content Components**: Enhanced Markdown renderer, Table of Contents, Reading Progress
- **Interactive Features**: Image modals, copy buttons, social sharing, comments (Giscus)
- **List Views**: Blog cards, pagination, archive timeline, tag filtering

### Configuration Notes
- TypeScript and ESLint errors are ignored during builds (see next.config.ts)
- MDX processing with remark-gfm and rehype-highlight plugins
- Webpack configuration includes fallbacks for Node.js modules
- Custom domain configured as https://niutr.cn

### Content Format
Blog posts are stored as MDX files in `src/content/` with frontmatter metadata including title, date, tags, and description. Images are automatically downloaded and optimized through the content management scripts.