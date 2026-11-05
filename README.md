# MindBridge (Demo)

> **Prototype for Demo Purposes Only — Not a Licensed Clinical Diagnostic Tool.**

Next.js 14 + Tailwind + Lucide (client, :3000) and Express + Socket.io (server, :4000, in-memory store).

## Run
```
npm run setup   # run once: installs root, server and client (do NOT use a postinstall hook, it recurses)
npm run dev     # starts both
```
Open http://localhost:3000, then open **/user** and **/provider** in two separate browser windows (side by side). Book as the user; the appointment appears live in the provider window; press Start session to chat both ways in a private per-booking room.

**Chat moderation** (client + server): masks links, UPI IDs, emails and phone numbers (including spelled-out digits); blocks off-platform contact (WhatsApp, Telegram, Instagram, Snapchat, GPay, etc.), threats and sexual solicitation; masks profanity. Self-harm language is never blocked: it opens the Tele-MANAS card for the user and alerts the provider.

## Demo walkthrough
1. User View: OTP (any value) -> 5-question screener -> routed tier -> directory -> slot -> sandbox payment -> chat.
2. Provider View: Today list, profile/availability, Live session (crisis toggle, Tier 3 transfer + voucher).
3. Red "Need Emergency Help?" button is on every screen.

## Routing (my proposal, not a validated protocol)
PHQ-4 (Q1-4, 0-12): 0-2 Tier 1 | 3-5 Tier 2 | 6-8 Tier 3 | 9-12 Tier 3 + crisis card. Q5 (self-harm) > 0: Tier 3 + crisis card.

## Notes
- Masking (phone, UPI, URL) runs client-side and again in Express before storing/broadcasting. It is a deterrent, not a guarantee.
- OTP, Razorpay, video, and chat audit are simulated. RCI numbers are fake sample data.
- Verify Tele-MANAS (14416 / 1800-891-4416) and 112 before any real use.
- **DPDP Act 2023 (before real use):** explicit, purpose-specific consent; verifiable parental consent for under-18s; data minimisation; encryption at rest/in transit; retention and erasure policy; breach notification; grievance officer. Also: telemedicine and RCI verification workflows, and clinical governance.

## Structure
```
server/  index.js (API + sockets) mask.js data.js
client/  app/{layout,page,globals.css}  components/{Triage,Chat,Crisis,Directory,Provider}.js  lib/{mask,socket}.js
```
