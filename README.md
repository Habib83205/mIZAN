# Mess Avengers

A responsive hostel and mess management UI inspired by the supplied Humble style reference: Bricolage Grotesque headings, Geist interface text, paper surfaces, black pill actions, rounded cards, and safety-orange accents.

## Run

Use Node 22.13 or later. Run `npm install`, then `npm run dev`. On Windows PowerShell, use `npm.cmd` if PowerShell blocks npm.ps1. Build with `npm run build`; check types with `node node_modules/typescript/bin/tsc --noEmit`.

## Prototype scope

Overview, meal tracker, member balances, expenses, and rooms use fictional September 2026 demo records. Add expenses and members, update today's aggregate meal counts, select chart days, and download expense CSVs. Food costs determine the meal rate; utilities are excluded. Monthly member contribution dues are separate from actual consumption charges. Changes live only in React state and reset on reload. No authentication, database, real payments, or message sending is implemented.

## Validation

Production build and TypeScript checks passed; the development route returned HTTP 200. Browser visual and interaction testing was not performed because no browser was available. The optional WebMCP `start_meal_count_update` tool opens the meal form and feature-detects support. No supported WebMCP validation context was available, so its runtime contract is unverified.
