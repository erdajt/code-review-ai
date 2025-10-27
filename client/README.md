# Founding Engineer Technical Case (2 hours)

## Overview
Build a **Code Review Assistant** - an AI-powered tool that helps developers get instant feedback on their code snippets. Think ChatGPT, but specifically designed for code review.

## Why This Case?
We're looking for founding engineers who can:
- Ship quality products quickly
- Make smart architectural decisions
- Handle ambiguity and make product calls
- Debug and problem-solve independently
- Write clean, maintainable code

## Your Mission

### Part 1: Core Implementation (60-75 min)
Build a chat interface where users can:
1. **Paste code snippets** and ask for review/feedback
2. **Have a conversation** with an AI reviewer about their code
3. **See streaming responses** as the AI types (not all at once)

**UI/UX Requirements:**
- **Clone the ChatGPT interface** - we want to see your attention to detail and UI taste
- Match the look and feel: message bubbles, layout, spacing, typography
- Show streaming text character-by-character (like ChatGPT does)
- Clean, modern, polished interface
- Thoughtful micro-interactions and states
- Specifically think of how the scroll animation works (message is sent, goes perfectly to top -> make it easier for users to read)

**Technical Requirements:**
- Use the **Vercel AI SDK** for LLM integration
- Implement **proper TypeScript types** throughout
- Set up a **clean service layer** for AI interactions (don't put everything in components)
- Create an **API route** to handle the AI requests
- Handle **error states** gracefully

**What We're Looking For:**
- UI that looks and feels like a real product (not a prototype)
- Clean separation of concerns (components, services, API routes, types)
- Thoughtful architecture decisions
- Proper error handling
- Type safety
- **Your taste in UI/UX details**

### Part 2: Product Feature (20-30 min)
Add **ONE feature** that would make this tool significantly more useful for developers. This is intentionally open-ended - we want to see your product taste.

Some ideas to spark thinking (don't feel limited to these):
- Code syntax highlighting (with proper color schemes)
- Language detection
- Copy-to-clipboard for code blocks
- Conversation history/persistence
- Regenerate response button
- Multi-code-block support in responses
- Something else you think would be valuable?

**What We're Looking For:**
- Product intuition - what would actually be useful?
- Implementation quality of your chosen feature
- Polish and attention to detail
- How well it integrates with the overall UI

### Part 3: The Debugging Challenge (15-20 min)
⚠️ **There are intentional bugs in the starter code** (if provided) or issues you might encounter.

We want to see how you:
- Identify problems
- Debug systematically
- Handle API errors
- Manage edge cases

Common issues to watch for:
- Streaming might not work correctly
- Error handling might be missing
- Environment variables might be misconfigured
- Types might be incomplete

## Deliverables

### Must Have:
1. ✅ **UI that resembles ChatGPT** - clean, modern, polished
2. ✅ Working chat interface with streaming responses
3. ✅ Clean service layer (not all logic in components)
4. ✅ Proper TypeScript types (no `any` unless justified)
5. ✅ API route for AI interaction
6. ✅ Error handling (network errors, API failures, etc.)
7. ✅ One additional feature that shows product sense

### Nice to Have:
- Smooth animations and transitions
- Loading states and user feedback
- Responsive design
- Dark mode (if you have time)
- Code comments where helpful
- A brief note on what you'd do with more time

## Technical Stack
- **Next.js 14+** (App Router)
- **Vercel AI SDK** (`ai` package)
- **OpenAI** or **Anthropic** (your choice)
- **TypeScript**
- **Tailwind CSS** (already configured)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install ai openai
# or if using Anthropic: npm install ai @anthropic-ai/sdk
```

### 2. Configure Environment Variables
Create a `.env.local` file:
```bash
OPENAI_API_KEY=your_key_here
# or
ANTHROPIC_API_KEY=your_key_here
```

### 3. Run the Development Server
```bash
npm run dev
```

## Evaluation Criteria

We'll be looking at:

### 🎨 UI/UX & Product Sense (35%)
- How close is the UI to ChatGPT's polish?
- Attention to detail (spacing, typography, colors, animations)
- Feature choice and implementation
- Overall "product feel"
- Your design taste and decisions

### 🏗️ Architecture (25%)
- Clean separation of concerns
- Proper service layer
- Logical file structure
- Reusability

### 💻 Code Quality (20%)
- TypeScript usage
- Error handling
- Code clarity
- No obvious bugs

### 🐛 Problem Solving (20%)
- How you handle bugs/errors
- Debugging approach
- Edge case handling
- Technical decisions

## Tips for Success

### Do:
- ✅ Look at ChatGPT's interface for inspiration (spacing, colors, layout)
- ✅ Balance UI polish with technical implementation
- ✅ Make architectural decisions and stick with them
- ✅ Write types as you go (don't leave them for the end)
- ✅ Test your error states
- ✅ Make product decisions confidently
- ✅ Show your taste in the details (animations, hover states, etc.)
- ✅ Leave comments where your thinking isn't obvious

### Don't:
- ❌ Ignore the UI - it's important for this role!
- ❌ Build a prototype-looking interface
- ❌ Over-engineer (2 hours is tight!)
- ❌ Ignore errors or edge cases
- ❌ Use `any` everywhere
- ❌ Put all logic in components

## Time Management Suggestion
- **15 min**: Fix bugs in API route + service layer
- **45 min**: Chat interface with streaming (clone ChatGPT UI)
- **25 min**: Your product feature
- **20 min**: Testing, error handling, edge cases
- **15 min**: Polish UI details and final review

## What Happens After?

We'll review your code together and discuss:
- Your architectural decisions
- Your product feature choice
- Trade-offs you made
- What you'd do differently with more time

---

## Questions?
If anything is unclear or you hit a blocker, please ask your interviewer! We want to see how you work, not watch you struggle with ambiguous requirements.

## Starter Code Provided

We've provided some basic starter code to help you get going faster. **However, there are intentional bugs and issues** that you'll need to identify and fix. This is part of the test!

### Files Included:
- `src/app/page.tsx` - Basic chat interface (has issues!)
- `src/app/api/chat/route.ts` - API route for AI (incomplete)
- `src/services/ai-service.ts` - Service layer skeleton (needs work)

### Known Issues to Watch For:
We won't tell you exactly what's broken - that's for you to discover! But here are hints:

🐛 **Streaming** - The responses should stream in real-time, not all at once  
🐛 **Error Handling** - What happens when things go wrong?  
🐛 **Types** - Are the types strict enough?  
🐛 **State Management** - Does the UI update correctly?  
🐛 **Service Layer** - Is it actually being used properly?  
🐛 **API Implementation** - Is the streaming being handled correctly?

Part of being a founding engineer is debugging unclear issues - show us your process!

## Getting Started

### 1. First, install the AI SDK:
```bash
npm install ai openai
```

### 2. Set up your environment variables:
Create `.env.local`:
```bash
OPENAI_API_KEY=your_key_here
```

### 3. Try running the starter code:
```bash
npm run dev
```

### 4. Test it and find the bugs:
Try sending a message. What doesn't work? What could be better?

When you're ready, start fixing and building! Remember: we're looking for **clean code, solid architecture, AND good UI taste**. All three matter for this role.

Good luck! 🚀

