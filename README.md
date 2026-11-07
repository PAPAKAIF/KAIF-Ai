# Kaif AI — Starter Website

A responsive first-version website for a personal AI assistant. The frontend is included, and the backend calls the OpenAI Responses API. The API key stays on the server.

## Requirements
- Node.js 18+
- An OpenAI API key with API billing enabled

## Run locally
1. Extract this ZIP.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Put your secret key in `.env` as `OPENAI_API_KEY=...`.
6. Run `npm start`.
7. Open `http://localhost:3000`.

## Important
- Never put your API key in `public/app.js`, HTML, or any browser code.
- Do not commit `.env` to GitHub.
- This is an MVP starter, not yet production-ready for a large public launch.
- Before public launch, add user authentication, database-backed chat history, per-user quotas, billing, moderation/abuse controls, privacy policy, terms, monitoring, backups, and security review.
- The current chat is guest-only and conversation history lives only in the browser tab.
- Image, PDF, voice, web search, payments, and mobile apps are planned features, not active in this starter.
