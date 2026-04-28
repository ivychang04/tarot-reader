# Tarot Reader Web App

## Project Overview

A client-side React application that provides interactive Tarot readings powered locally by the Gemini Nano model via the Chrome Prompt API. The user inputs a question, selects 3 cards from a 78-card deck (Past, Present, Future spread), and receives an on-device generated reading. The app then transitions into a continuous chat interface, allowing the user to ask follow-up questions using an active AI session.

## Tech Stack and Prerequisites

- Frontend Framework: React 18+ initialized via Vite (TypeScript template).
- Styling: Tailwind CSS (configured for a dark, mystical aesthetic).
- Icons: lucide-react.
- State Management: React Hooks (useState, useEffect, useRef).
- AI Integration: Built-in Chrome Gemini Nano Prompt API (session = LanguageModel.create();).
- Data Source: Local tarotDeck.json containing 78 card objects (ID, Name, Arcana, Upright Meaning, Reversed Meaning, Image URL).

### Prerequisites (local environment and target browser)

- Node.js (v18+)
- Browser Requirement: Google Chrome (Dev or Canary build recommended) with the following flags enabled:
    - chrome://flags/#prompt-api-for-gemini-nano: Enabled
    - chrome://flags/#optimization-guide-on-device-model: Enabled BypassPrefRequirement
- Note: No API keys are required as inference runs locally.

## Implementation Phase

### Phase 1: Project Initialization & Environment Setup

**Objective**: Scaffold the React/TypeScript application and prepare the data layer.

1. Install Dependencies:
    - Install styling tools: npm install -D tailwindcss postcss autoprefixer.
    - Initialize Tailwind: npx tailwindcss init -p and configure tailwind.config.js to scan ./src/**/*.{js,jsx,ts,tsx}.
    - Install icons: npm install lucide-react.
2. Data Mocking:
    - `src/data/tarotDeck.json` has 78 items conforming to an interface: interface TarotCard { id: number; name: string; type: 'major' | 'minor'; meaningUpright: string; meaningReversed: string; description: string; imageUrl: string; }.
3. AI Feature Detection Helper
    - Create a utility src/utils/aiCheck.ts that checks if LanguageModel are available, returning a boolean to conditionally render the app or a fallback warning.
    ```javascript
    const availability = await LanguageModel.availability({});
    ```

### Phase 2: Welcome Screen and Question input

**Objective**: Build the landing interface.

1. UI Layout:
    - Implement a full-screen dark layout (bg-gray-950 text-gray-100).
    - Add a centered header ("Tarot Reading Online") and subtext establishing an enigmatic persona.
2. Input Component:
    - Create an input area limited to 300 characters for the user's focal question.
    - Add a primary action button ("Draw Cards").
3. State Management:
    - Maintain userQuestion (string) in the main app state.
    - Transition active screen state from WELCOME to SELECTION upon form submission.

### Phase 3: Card Selection Interface

**Objective**: Render the 78 cards, handle the selection logic (including random reversals), and immediately display drawn cards in their specific temporal slots.

1. Updated Data Structures (TypeScript): Your agent needs to expand the state to track the drawn status and orientation.
    ```Typescript
    // The base card from your JSON
    interface TarotCard { 
        id: number; 
        name: string; 
        type: 'major' | 'minor';
        suit: 'trumps' | 'pentacles' | 'wands' | 'cups' | 'swords';
        meaningUpright: string;
        meaningReversed: string;
        description: string;
        imageUrl: string;
    }

    // The card after it has been drawn by the user
    interface DrawnCard extends TarotCard {
        isReversed: boolean;
        positionName: 'Past' | 'Present' | 'Future';
    }
    ```

2. UI Layout - The "Spread" Slots:
    - Top Section (The Spread): Create three distinct, empty placeholder slots labeled "Past", "Present", and "Future".
    - Bottom Section (The Deck): Display the remaining face-down cards.

3. Interaction Logic (handleCardClick): When the user clicks a face-down card:
    - Check Limit: Ensure selectedCards.length < 3.
    - Determine Orientation: Randomly decide if the card is reversed using a simple math function (e.g., const isReversed = Math.random() > 0.5;).
    - Assign Position:
        - If selectedCards.length === 0, positionName = 'Past'
        - If selectedCards.length === 1, positionName = 'Present'
        - If selectedCards.length === 2, positionName = 'Future'
    - Update State: Add the new DrawnCard object to the selectedCards array.

4. Immediate Display rendering:
    - As soon as the state updates, the card must appear in its respective slot in the Top Section.
    - Reversed Styling: If card.isReversed is true, apply a CSS rotation to the image. In Tailwind, this is simply adding the rotate-180 utility class to the <img> tag.
    - Card Labels: Below the immediately revealed card, render text indicating its name, orientation, and position (e.g., "The Fool (Reversed) - Past").

5. Transition: Once the 3rd card is clicked and occupies the "Future" slot, delay for 1-2 seconds (to let the user see their final card), then reveal the "Read my Fate" button to trigger Phase 4.

### On-Device Gemini Nano Integration (Initial Reading)

**Objective**: Initialize the Prompt API session, generate the reading, and render the UI.

1. UI Presentation:
    - At the top of the view, display the 3 drawn cards face up, clearly labeled with their spread positions (Past, Present, Future).
2. Session Initialization:
    - Create a useTarotAI custom hook.
    - Instantiate the session using the Prompt API:
        ```TypeScript
        const session = await LanguageModel.create({
            initialPrompts: [
                {
                    role: "system",
                    content:
                        "You are an enigmatic, insightful tarot artist named Lily. Interpret the cards drawn based on the user's question. Be conversational, mystical, but grounded in classic tarot meanings.",
                },
            ],
            expectedInputs: [
                { type: "text", languages: ["en"] }
            ],
            expectedOutputs: [
                { type: "text", languages: ["en"] }
            ],
        });
        ```
    - Store the active session object in a useRef or state so it persists for the chat phase.
3. Prompt Engineering & Execution:
    - Construct the initial prompt: 
        ```TypeScript
        // Example of how the agent should construct the prompt string:
        const generatePrompt = (question: string, cards: DrawnCard[]) => {
            const cardDetails = cards.map(c => {
                const orientation = c.isReversed ? 'Reversed' : 'Upright';
                const coreMeaning = c.isReversed ? c.meaningReversed : c.meaningUpright;
                
                return `[${c.positionName}] ${c.name} (${orientation}) - Key Theme: ${coreMeaning}. Description: ${c.description}`;
            }).join('\n');

            return `
                The user asked: "${question}".
                They drew the following cards:
                ${cardDetails}.
                
                Using the "Key Theme" provided for each card, provide a cohesive tarot reading explaining how these specific cards and their themes relate to the user's question. Weave the themes together naturally. Speak directly to the user as the enigmatic tarot artist, Lily.
            `;
        };
        ```
    - Call await session.promptStreaming(initialPrompt) and stream response.
    - Display a loading indicator during inference.
4. Render Output:
    - Render the AI's response in a chat interface below the cards.

## Phase 5: Continious Chat Interface

**Objective**: Maintain the context window and allow follow-up interactions.

1. Chat State:
    - Maintain a messages array: { role: 'user' | 'model', content: string }[]. Populate it with the initial prompt and response from Phase 4.
2. Chat UI Component:
    - Build a scrollable container for the message history. Style model responses with an avatar (e.g., a mystic icon) and user responses natively.
3. Interaction Loop:
    - Add a sticky text input bar at the bottom of the screen.
    - When the user submits a new question, append it to the messages array for UI rendering.
    - Because the LanguageModel session maintains its own context history automatically, simply pass the new string to the existing session: const reply = await session.prompt(newUserMessage).
    - Append reply to the messages array. Implement auto-scrolling to the bottom of the container upon new messages.
