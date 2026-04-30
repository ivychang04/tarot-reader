# TarotTale

An AI-powered tarot reading web application that runs entirely in your browser. Ask a question, draw three cards, and receive a personalized reading from **Lily** — a mystical AI tarot reader powered by Chrome's built-in Gemini Nano model.

**No server. No cloud API. No data ever leaves your device.**

> **Live Demo:** [https://ivychang04.github.io/Tarot-reader/](https://ivychang04.github.io/Tarot-reader/)



## Features

- **Three-card spread** — Past, Present, and Future positions
- **78 illustrated cards** — Full Rider-Waite deck with upright/reversed orientations
- **Human Wisdom, AI Voice** — Authentic tarot interpretations dynamically streamed via on-device Gemini Nano for completely private, instant readings.
- **Follow-up chat** — Ask Lily clarifying questions within the same session
- **Fully client-side** — Zero network requests for AI inference; all processing is local
- **Model download tracking** — Shows download progress when the AI model needs to be installed



## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 6](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **AI Engine** | [Chrome Prompt API (Gemini Nano)](https://developer.chrome.com/docs/ai/prompt-api) |
| **Deployment** | [GitHub Pages](https://pages.github.com/) via GitHub Actions |



## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Google Chrome** ≥ 138 (Stable with origin trial, or Dev/Canary with flags)

### Installation

```bash
# Clone the repository
git clone https://github.com/IvyChang04/Tarot-reader.git
cd Tarot-reader

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/`.

### Chrome Setup for AI Features

If you want to setup your own version, the Prompt API requires either an **origin trial token** (for deployed sites) or **local Chrome flags** (for development).

#### Option A: Local Development (Chrome Dev/Canary)

1. Download [Chrome Dev](https://www.google.com/chrome/dev/) or [Chrome Canary](https://www.google.com/chrome/canary/)
2. Navigate to `chrome://flags` and enable:
   - `#prompt-api-for-gemini-nano` → **Enabled**
   - `#optimization-guide-on-device-model` → **Enabled BypassPerfRequirement**
3. Restart Chrome
4. Navigate to `chrome://components`, find **Optimization Guide On Device Model**, and click "Check for update" to download the model

#### Option B: Production Deployment (Origin Trial)

1. Register at [Chrome Origin Trials — Prompt API](https://developer.chrome.com/origintrials/#/view_trial/2533837740349325313)
2. Enter your deployed origin (e.g., `https://yourdomain.com`)
3. Add the token to `index.html`:
   ```html
   <meta http-equiv="origin-trial" content="YOUR_TOKEN_HERE" />
   ```

### Build & Preview

```bash
# Type-check and build for production
npm run build

# Preview the production build
npm run preview
```



## Architecture

### Application Flow

```
┌─────────────┐     ┌───────────────────┐     ┌────────────────┐
│  WELCOME    │────▶│   SELECTION       │────▶│   READING      │
│  Screen     │     │   Screen          │     │   Screen       │
│             │     │                   │     │                │
│ • Question  │     │ • 78 card grid    │     │ • Card header  │
│   input     │     │ • 3-card spread   │     │ • AI chat      │
│ • AI status │     │ • Flip animation  │     │ • Follow-up    │
│   badge     │     │ • "Read my Fate"  │     │ • New reading  │
└─────────────┘     └───────────────────┘     └────────────────┘
```

### Project Structure

```
src/
├── types/
│   └── tarot.ts              # TypeScript interfaces (TarotCard, DrawnCard, ChatMessage, AppScreen)
├── utils/
│   ├── aiCheck.ts            # LanguageModel availability check & model download trigger
│   ├── assetPath.ts          # Resolves public asset paths for GitHub Pages deployment
│   ├── cardUtils.ts          # Deck shuffling (Fisher-Yates), card drawing, reversal logic
│   ├── idGen.ts              # Unique ID generator for chat messages
│   └── promptBuilder.ts      # Lily's system prompt & reading/follow-up prompt construction
├── hooks/
│   └── useTarotAI.ts         # Custom hook: session lifecycle, streaming, abort, cleanup
├── components/
│   ├── StarField.tsx          # Canvas-animated twinkling star background
│   ├── QuestionInput.tsx      # Glassmorphism textarea with character counter
│   ├── SpreadSlot.tsx         # Single slot in the 3-card spread (empty/filled states)
│   ├── SpreadDisplay.tsx      # Horizontal row of 3 SpreadSlots
│   ├── TarotCard.tsx          # Face-down card with CSS 3D flip animation
│   ├── DeckGrid.tsx           # Scrollable grid of 78 face-down cards
│   ├── ChatBubble.tsx         # Chat message bubble (Lily vs. user styling)
│   ├── ChatInput.tsx          # Sticky bottom chat input bar
│   ├── LoadingIndicator.tsx   # Animated dots with rotating mystical phrases
│   └── ReadingHeader.tsx      # Collapsible header with card thumbnails
├── screens/
│   ├── WelcomeScreen.tsx      # Landing: title, question input, AI status badge
│   ├── SelectionScreen.tsx    # Card selection: deck grid + spread display
│   └── ReadingScreen.tsx      # Reading: AI chat + card header + follow-up input
├── data/
│   └── tarotDeck.json         # 78 card definitions (name, suit, meanings, image paths)
├── App.tsx                    # Root: screen state machine (WELCOME → SELECTION → READING)
├── index.css                  # Tailwind v4 entrypoint + custom animations
└── main.tsx                   # React DOM entry point
```

### Key Modules

#### `useTarotAI` Hook

The central AI integration hook manages the entire Gemini Nano lifecycle:

- **`generateReading(question, cards)`** — Creates a `LanguageModel` session with Lily's system prompt, builds the reading prompt, and streams the response via `promptStreaming()`.
- **`sendMessage(content)`** — Sends follow-up messages in the existing session context, also streamed.
- **`destroySession()`** — Aborts any in-progress generation and destroys the session.

The session is initialized with Lily's persona via `initialPrompts`:

```typescript
const session = await LanguageModel.create({
  initialPrompts: [
    { role: 'system', content: LILY_SYSTEM_PROMPT },
  ],
});
```

#### Prompt Construction

The `promptBuilder.ts` module constructs structured prompts that include:
- The user's question
- Each card's name, position (Past/Present/Future), orientation (Upright/Reversed), and meaning
- Instructions for Lily to weave a cohesive narrative

#### Card System

- **78 cards** defined in `tarotDeck.json` (22 Major Arcana + 56 Minor Arcana across 4 suits)
- **Fisher-Yates shuffle** ensures cryptographic-quality randomization
- **50/50 reversal chance** for each drawn card
- Cards are assigned to positions sequentially: Past → Present → Future

## Design System

- **Theme:** Dark mode only (`bg-gray-950` base)
- **Accent:** Purple gradient palette (`purple-400` through `violet-700`)
- **Typography:** Inter (Google Fonts) — weights 300–700
- **Effects:**
  - `animate-shimmer` — Title gradient animation
  - `animate-float` — Gentle floating motion
  - `animate-fade-in-up` — Entry animation for cards
  - `card-flip` — CSS 3D card flip with perspective
  - `glass-card` — Glassmorphism with backdrop blur
  - `custom-scrollbar` — Styled scrollbar for dark theme


## Acknowledgments

- **Rider-Waite Tarot Deck** — Card artwork
- **Google Chrome AI Team** — Gemini Nano & Prompt API
- **Lucide** — Icon library
