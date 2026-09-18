# Design notes

## Direction

Community-first rather than commerce-first. The food and the chef relationship should feel like the centre of gravity; ordering is downstream of that.

## Visual system

- Warm cream paper background
- Deep leafy green as the main structural accent
- Watermelon red for stamps, notes and moments of energy
- Muted lemon yellow for small highlights
- Controlled hand-written annotations, used sparingly
- Editorial line drawings and produce-inspired fields rather than cartoon characters
- Square-ish borders and imperfect offsets instead of generic SaaS rounded cards
- Photography can later sit inside the same frames without changing the layout

## Important principle

The **structure stays fixed** while the visual wrapper can change for a festival, season, locality or themed drop.

## September 2026 mobile app revision

- Main route now uses Wabi-inspired cream cards, fine outlines, editorial Newsreader headings, and restrained red actions.
- Order dish opens a native modal sheet from the bottom. Pickup/delivery, quantities, time slots, addresses, fees, and WhatsApp handoff stay per dish; there is no shared cart.
- Native dialog supplies focus containment; Escape, Close and browser Back dismiss it. In-progress orders remain in memory while navigating profiles and sheets, and reset on reload. Addresses are not persisted on the device.
- Food/chef images and existing data remain in `data/site.ts`. No new spice values or personal biographies were invented. Optional `specialty`, `background`, `interests`, and `spice` fields can be supplied on chef records when approved.
- Existing long-form content and illustrations remain under Our story in `components/mini/ProjectInfo.tsx`.
- Pincode input validates format only, matching the existing implementation. Serviceability and payment confirmation remain with the WhatsApp operator. Existing placeholder ingredient, allergen and dietary data still need owner review before launch.
- Mobile (320/390px), desktop (1440px), pickup/delivery totals, invalid pincode, pickup-only kitchens, profiles and Back dismissal verified in browser. Production build and TypeScript checks passed.
