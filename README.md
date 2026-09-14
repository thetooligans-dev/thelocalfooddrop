# The Local Food Drop — aesthetic prototype

A lightweight Next.js + Tailwind prototype for `thetownsquare.xyz/thelocalfooddrop`.

## What this version is for

This first pass focuses on **visual language, hierarchy and flow** rather than ordering infrastructure. The page is designed around the idea that the structure stays consistent while the visual “wrapping” can change from drop to drop.

### Current flow

1. Between-drops hero + WhatsApp notification CTA
2. Four chef / dish editorial stories
3. A simple Tuesday → Thursday → Friday calendar
4. Why the project exists
5. Current launch localities
6. WhatsApp CTA
7. Quiet Town Square Project attribution

## Run locally

```bash
npm install
npm run dev
```

Then visit:

`http://localhost:3001/thelocalfooddrop`

## WhatsApp number

Set the notification number in `.env.local`:

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
```

Use digits only, including country code. Until this is set, the CTA opens WhatsApp with the prefilled message but no fixed recipient.

## Switching the site to an open drop

Open `data/site.ts` and change:

```ts
dropStatus: "between"
```

to:

```ts
dropStatus: "live"
```

The hero CTA will automatically switch from the WhatsApp notification prompt to the live-order CTA.

## Replacing the placeholders

The first prototype deliberately keeps chef photography and dish details as placeholders. Once photography is available, the `FoodArt` block in each chef story can be replaced with `next/image` while keeping the surrounding editorial composition.

Chef names and content live in `data/site.ts`, so future drops can be swapped without changing the page layout.

## Suggested next pass after the aesthetic is approved

- Replace placeholder dish data with real ingredients, allergens, dietary labels and exact portion counts.
- Decide how “Step into the story” works: inline expansion, modal, or shareable chef/dish pages.
- Add actual photography and short chef video stories.
- Build the preorder flow separately.
- Connect the repo to GitHub/Vercel and route it under the main Town Square domain.
